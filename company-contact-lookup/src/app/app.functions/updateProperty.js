// For HubSpot API calls
const hubspot = require('@hubspot/api-client');

exports.main = async (context = {}) => {
  try {
    const companyId = context.propertiesToSend.hs_object_id;

    if (!companyId) {
      throw new Error('Company ID is missing.');
    }

    const { propertyName, propertyValue } = context.event.payload;

    if (!propertyName) {
      throw new Error('Property name is missing.');
    }

    await updateCompanyProperty(companyId, propertyName, propertyValue);

    return { status: 'SUCCESS', message: 'Property updated successfully.' };
  } catch (error) {
    console.error('Error in updateProperty function:', error.message);
    return { status: 'ERROR', message: error.message };
  }
};

// Function to update the company property
async function updateCompanyProperty(companyId, propertyName, propertyValue) {
  const hubSpotClient = new hubspot.Client({
    accessToken: process.env.PRIVATE_APP_ACCESS_TOKEN,
  });

  const properties = {
    [propertyName]: propertyValue,
  };

  await hubSpotClient.crm.companies.basicApi.update(companyId, { properties });
}
