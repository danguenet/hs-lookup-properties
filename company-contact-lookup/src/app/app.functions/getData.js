// For HubSpot API calls
const hubspot = require('@hubspot/api-client');

exports.main = async (context = {}) => {
  try {
    const companyId = context.propertiesToSend.hs_object_id;

    if (!companyId) {
      throw new Error('Company ID is missing.');
    }

    const lookupData = await getLookupData(companyId);
    return { status: 'SUCCESS', data: lookupData };
  } catch (error) {
    console.error('Error in getData function:', error.message);
    return { status: 'ERROR', message: error.message };
  }
};

// Function to fetch lookup properties and their values
async function getLookupData(companyId) {
  const hubSpotClient = new hubspot.Client({
    accessToken: process.env.PRIVATE_APP_ACCESS_TOKEN,
  });

  const OBJECT_TYPE = 'companies';
  const GROUP_NAME = 'lookup';

  try {
    // Step 1: Fetch all properties of the 'companies' object
    const allPropertiesResponse =
      await hubSpotClient.crm.properties.coreApi.getAll(OBJECT_TYPE);

    if (!allPropertiesResponse || !allPropertiesResponse.results) {
      console.error('No properties found for the object type.');
      return [];
    }

    // Step 2: Filter properties that belong to the 'lookup' group and collect name and label
    const lookupPropertiesInfo = allPropertiesResponse.results
      .filter(
        (property) =>
          property.groupName &&
          property.groupName.toLowerCase() === GROUP_NAME.toLowerCase() &&
          property.fieldType === 'text',
      )
      .map((property) => ({
        name: property.name,
        label: property.label,
      }));

    const lookupPropertyNames = lookupPropertiesInfo.map(
      (property) => property.name,
    );

    if (lookupPropertyNames.length === 0) {
      console.error('No lookup properties found.');
      return [];
    }

    // Step 3: Fetch the company record including the lookup properties
    const companyResponse = await hubSpotClient.crm.companies.basicApi.getById(
      companyId,
      lookupPropertyNames,
    );

    if (!companyResponse || !companyResponse.properties) {
      console.error('No company properties found.');
      return [];
    }

    // Step 4: Prepare the lookup data with propertyLabel
    const lookupData = lookupPropertiesInfo.map((property) => {
      const propertyValue = companyResponse.properties[property.name];
      return {
        propertyName: property.name,
        propertyLabel: property.label,
        propertyValue,
      };
    });

    console.log(lookupData);
    return lookupData;
  } catch (error) {
    console.error('Error fetching lookup data:', error.message);
    throw error;
  }
}
