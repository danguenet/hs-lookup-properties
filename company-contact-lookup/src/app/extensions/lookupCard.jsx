import React, { useState, useEffect } from 'react';
import {
  Alert,
  LoadingSpinner,
  Text,
  Flex,
  Button,
  Input,
  Tile,
  Modal,
  ModalBody,
  ModalFooter,
  EmptyState,
} from '@hubspot/ui-extensions';
import { CrmPropertyList, CrmActionButton } from '@hubspot/ui-extensions/crm';
import { hubspot } from '@hubspot/ui-extensions';

// Define the extensions to be run within the HubSpot CRM
hubspot.extend(({ runServerlessFunction, actions }) => (
  <LookupCards runServerless={runServerlessFunction} actions={actions} />
));

// Define the Extension component, taking in runServerless prop
const LookupCards = ({ runServerless, actions }) => {
  const [loading, setLoading] = useState(true);
  const [lookupData, setLookupData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    runServerless({
      name: 'getData',
      propertiesToSend: ['hs_object_id'],
    })
      .then((serverlessResponse) => {
        if (serverlessResponse.status === 'SUCCESS') {
          setLookupData(serverlessResponse.response.data);
          console.log(
            'Received serverlessResponse:',
            serverlessResponse.response.data,
          );
        } else {
          setErrorMessage(serverlessResponse.message);
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to handle adding or updating a lookup property
  const handleSave = (propertyName, newValue) => {
    setLoading(true);
    runServerless({
      name: 'updateProperty',
      propertiesToSend: ['hs_object_id'],
      payload: {
        propertyName,
        propertyValue: newValue,
      },
    })
      .then((response) => {
        if (response.status === 'SUCCESS') {
          fetchData(); // Refresh data after update
        } else {
          setErrorMessage(response.message);
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to handle deleting a lookup property value
  const handleDelete = (propertyName) => {
    setLoading(true);
    runServerless({
      name: 'updateProperty',
      propertiesToSend: ['hs_object_id'],
      payload: {
        propertyName,
        propertyValue: '', // Setting value to empty string to delete it
      },
    })
      .then((response) => {
        if (response.status === 'SUCCESS') {
          fetchData(); // Refresh data after deletion
        } else {
          setErrorMessage(response.message);
        }
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (errorMessage) {
    return (
      <Alert title="Unable to get lookup fields" variant="error">
        {errorMessage}
      </Alert>
    );
  }

  return (
    <Flex direction={'row'} gap={'large'} wrap={'wrap'}>
      {lookupData.length === 0 ? (
        <>
          <EmptyState
            title="No lookup properties found."
            layout="vertical"
            reverseOrder={true}
          >
            <Text>1. Make sure you have a property group called "Lookup".</Text>
            <Text>
              2. Create a single-line text property under the Lookup Group.
            </Text>
          </EmptyState>
        </>
      ) : (
        lookupData.map((item) => (
          <LookupTiles
            propertyName={item.propertyName}
            propertyLabel={item.propertyLabel}
            propertyID={item.propertyValue}
            actions={actions}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        ))
      )}
    </Flex>
  );
};

// Component to display each lookup property
const LookupTiles = ({
  propertyName,
  propertyLabel,
  propertyID,
  actions,
  onSave,
  onDelete,
}) => {
  const [newValue, setNewValue] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isValid, setIsValid] = useState(true);

  return (
    <Tile>
      <Flex direction={'column'} gap={'small'}>
        <Text format={{ fontWeight: 'bold' }}>{propertyLabel}</Text>
        {propertyID ? (
          <>
            <CrmPropertyList
              properties={[
                'firstname',
                'lastname',
                'jobtitle',
                'company',
                'email',
              ]}
              objectId={propertyID}
              objectTypeId="0-1"
            />
            <CrmActionButton
              actionType="PREVIEW_OBJECT"
              actionContext={{
                objectTypeId: '0-1',
                objectId: propertyID,
              }}
              variant="secondary"
            >
              Preview Contact
            </CrmActionButton>
            <Button
              variant="destructive"
              overlay={
                <DeleteConfirmationModal
                  propertyName={propertyName}
                  actions={actions}
                  onDelete={onDelete}
                />
              }
            >
              Delete Lookup
            </Button>
          </>
        ) : (
          <>
            <Input
              label="Contact ID"
              placeholder="Enter Contact ID"
              description="Must only contain numbers"
              value={newValue}
              required={true}
              error={!isValid}
              validationMessage={validationMessage}
              onChange={(value) => setNewValue(value)}
              onInput={(value) => {
                if (!/^\d+$/.test(value)) {
                  setIsValid(false);
                } else if (value === '') {
                  setIsValid(false);
                } else {
                  setIsValid(true);
                }
              }}
            />
            <Button
              variant="primary"
              onClick={() => {
                if (isValid) {
                  onSave(propertyName, newValue);
                  setNewValue('');
                } else {
                  setValidationMessage(
                    'Please only use numbers for record ID.',
                  );
                }
              }}
            >
              Add Lookup
            </Button>
          </>
        )}
      </Flex>
    </Tile>
  );
};

const DeleteConfirmationModal = ({ propertyName, actions, onDelete }) => {
  return (
    <Modal id="delete-modal" title="Delete Lookup" variant="danger">
      <ModalBody>
        <Flex direction="column">
          <Text>Deleting the lookup does not delete the contact.</Text>
          <Text>Instead we clear the lookup field on this company.</Text>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => actions.closeOverlay('delete-modal')}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          type="submit"
          onClick={() => {
            onDelete(propertyName);
            actions.closeOverlay('delete-modal');
          }}
        >
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};
