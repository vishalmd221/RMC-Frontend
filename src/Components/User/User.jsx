'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Card, Button, Input, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { getContractInstance } from '@/utils/contract';
import { getContract } from '../Builder/Builder';
const { TextArea } = Input;

const fieldToFunctionMapping = {
  ownerName: 'updateName',
  // userAddress: 'updateAddress',
  houseAddress: 'updateAddress',
  gender: 'updateGender',
  landArea: 'updateSqFoot',
  pancard: 'updatePanCardNumber',
  mobileNumber: 'updateNumber',
  // imageUrl:
  //   'https://brown-leading-scallop-142.mypinata.cloud/ipfs/Qmc1W1hCoEfuZw7MVaR1djRde9oTNXpiEx3ChmWekxcABk',
  // status: 'Pending',
};

export default function UserVerification() {
  const [verification, setVerification] = useState({});
  const [signedTokens, setSignedTokens] = useState([]);
  const [finalDecision, setFinalDecision] = useState(null);
  const [isLoadingField, setIsLoadingField] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
  };

  const fetchImage = async (tokenURI) => {
    try {
      const response = await fetch(tokenURI);
      const metadata = await response.json();
      return metadata.image;
    } catch (error) {
      console.log({ error });
      return error;
    }
  };
  useEffect(() => {
    // Dummy application data for the RMC to review

    const contract = getContractInstance();
    const getSignedTokenDetails = async () => {
      try {
        // Step 1: Fetch all token IDs
        const allTokenIds = await contract.getAllTokenIds();
        console.log({ allTokenIds });
        const signedTokens = [];
        for (let i = 0; i < allTokenIds.length; i++) {
          const tokenId = allTokenIds[i];
          const tokenDetails = await contract.tokenIdDetails(tokenId.toString());
          console.log({ tokenDetails });
          // const tokenDetailsPlainObject = Object.fromEntries(Object.entries(tokenDetails));
          // Step 3: Check if `isSignedByOwner` is true
          // if (tokenDetailsPlainObject[0]) {
          const image = await contract.tokenURI(tokenId.toString());
          const getimage = await fetchImage(image);
          signedTokens.push({
            id: tokenId,
            ownerName: tokenDetails[0],
            userAddress: tokenDetails[2],
            houseAddress: tokenDetails[1],
            // number: tokenDetails[3],
            gender: tokenDetails[4],
            landArea: tokenDetails[5],
            pancard: tokenDetails[6],
            mobileNumber: '9876543210',
            imageUrl: getimage,
            status: 'Pending', // Initially status is 'Pending'
          });
          // }
        }

        // Step 4: Set the filtered signed tokens in the state
        setSignedTokens(signedTokens);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching signed token details:', error);
        setLoading(false);
      }
    };

    getSignedTokenDetails();
  }, []);

  const handleVerify = async (field) => {
    setIsLoadingField(true);
    try {
      // setVerification((prev) => ({ ...prev, [field]: status }));
      const contract = await getContract();
      console.log({ contract });

      const functionName = fieldToFunctionMapping[field];
      if (!functionName) return;

      await contract[functionName](selectedApplication.id, selectedApplication[field]);
      console.log({ contract, field });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingField(false);
    }
  };

  const handleFinalDecision = async () => {
    const contract = await getContract();
    // const functionName = fieldToFunctionMapping[field];
    // if (!functionName) return;

    await contract.userSigned(selectedApplication.id);
    message.success(`You have accepted the details.`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }
  console.log({ selectedApplication, signedTokens });

  return (
    <>
      {selectedApplication && (
        <button className="text-white" onClick={() => setSelectedApplication(null)}>
          Back
        </button>
      )}
      {!selectedApplication ? (
        <div className="space-y-4">
          {signedTokens.map((application) => {
            return (
              <div
                key={application.id.toString()}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                onClick={() => handleApplicationClick(application)}
              >
                <h3 className="text-xl font-semibold">{application.ownerName}</h3>
                <p className="text-gray-600">{application.userAddress}</p>
                <p className="text-sm text-gray-500">
                  Land Area: {application.landArea.toString()}
                </p>
                <p className="text-sm text-gray-500">Status: {application.status}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen p-4 text-white">
          <Card className="w-full max-w-lg shadow-lg bg-gray-900 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold text-center mb-6">Verify Property Details</h2>

            {Object.entries(selectedApplication).map(([key, value]) => {
              if (key === 'id' || key === 'userAddress' || key === 'imageUrl' || key === 'status')
                return;
              return (
                <div key={key} className="mb-4 p-3 bg-[#f8f8f8] rounded-lg">
                  {key === 'imageUrl' ? (
                    <>
                      <div>
                        <p className="font-semibold capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </p>
                        <img
                          src={value}
                          alt="Property Document"
                          className="w-full rounded-lg shadow-md"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</p>
                      <TextArea
                        value={value}
                        onChange={(e) => {
                          setSelectedApplication((prev) => {
                            return { ...prev, [key]: e.target.value };
                          });
                        }}
                        className="mt-2"
                        rows={2}
                      />
                    </>
                  )}
                  <div className="flex gap-4 mt-2">
                    <Button
                      icon={<CheckCircleOutlined />}
                      onClick={() => handleVerify(key)}
                      disabled={isLoadingField}
                    >
                      Accept
                    </Button>
                  </div>
                </div>
              );
            })}

            <div className="mt-6 flex gap-4">
              <Button
                type="primary"
                className="w-full"
                onClick={() => handleFinalDecision()}
                disabled={isLoadingField}
              >
                Approve All
              </Button>
            </div>

            {finalDecision && (
              <div className="mt-6 p-4 bg-[#f8f8f8] rounded-lg text-center">
                <p
                  className={`${finalDecision === 'accepted' ? 'text-green-400' : 'text-red-600'}`}
                >
                  You have {finalDecision === 'accepted' ? 'approved' : 'declined'} all details.
                </p>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
