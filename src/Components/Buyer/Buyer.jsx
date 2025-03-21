'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Card, Button, Input, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { getContractInstance } from '@/utils/contract';
import { getContract } from '../Seller/Seller';
const { TextArea } = Input;
import { useAccount } from 'wagmi';

const fieldToFunctionMapping = {
  ownerName: 'updateName',
  // userAddress: 'updateAddress',
  houseAddress: 'updateAddress',
  gender: 'updateGender',
  landArea: 'updateSqFoot',
  pancard: 'updatePanCardNumber',
  mobileNumber: 'updateNumber',
  imageUrl:
    'https://brown-leading-scallop-142.mypinata.cloud/ipfs/Qmc1W1hCoEfuZw7MVaR1djRde9oTNXpiEx3ChmWekxcABk',
  // status: 'Pending',
};

export default function UserVerification() {
  const [verification, setVerification] = useState({});
  const [signedTokens, setSignedTokens] = useState([]);
  const [finalDecision, setFinalDecision] = useState(null);
  const [isLoadingField, setIsLoadingField] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();
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
        setLoading(true);
        const allTokenIds = await contract.getAllTokenIds();
        // console.log({ allTokenIds });
        const signedTokens = [];
        for (let i = 0; i < allTokenIds.length; i++) {
          const tokenId = allTokenIds[i];
          const tokenDetails = await contract.tokenIdDetails(tokenId.toString());
          // console.log({ tokenDetails });
          // const tokenDetailsPlainObject = Object.fromEntries(Object.entries(tokenDetails));
          // console.log(tokenDetails[2].toString() === address.toString());
          // console.log({ address });
          // console.log(tokenDetails[2].toString().toLowerCase());
          if (tokenDetails[2]?.toString().toLowerCase() === address?.toString().toLowerCase()) {
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
              mobileNumber: parseInt(tokenDetails[3], 10),
              imageUrl: getimage,
              status: tokenDetails[7] === true ? 'Signed' : 'Pending', // Initially status is 'Pending'
            });
          }
        }
        // console.log({signedTokens});
        // Step 4: Set the filtered signed tokens in the state
        setSignedTokens(signedTokens);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching signed token details:', error);
        setLoading(false);
      }
    };

    getSignedTokenDetails();
  }, [address]);

  const handleVerify = async (field) => {
    setIsLoadingField(true);
    try {
      // setVerification((prev) => ({ ...prev, [field]: status }));
      const contract = await getContract();
      // console.log({ contract });

      const functionName = fieldToFunctionMapping[field];
      if (!functionName) return;

      await contract[functionName](selectedApplication.id, selectedApplication[field]);
      // console.log({ contract, field });
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
    setLoading(true);
    // const tx = await contract.userSigned(selectedApplication.id); // old 
    const tx = await contract.buyerSigned(selectedApplication.id); // new
    await tx.wait();
    message.success(`You have accepted the details.`);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }
  // console.log({ selectedApplication, signedTokens });

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-8">Sign and Verify Property details</h2>
      {selectedApplication && (
        <button className="text-white" onClick={() => setSelectedApplication(null)}>
          Back
        </button>
      )}
      {!selectedApplication ? (
        <div
          className={
            signedTokens.length === 0
              ? 'space-y-4'
              : 'flex gap-x-[20px] gap-y-[20px] content-center justify-start flex-wrap'
          }
        >
          {signedTokens.length === 0 ? (
            <p className="text-center text-lg text-gray-500">No applications</p>
          ) : (
            signedTokens.map((application) => {
              return (
                <div
                  key={application.id.toString()}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer text-start max-w-fit"
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
            })
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen p-4 text-white">
          <Card className="w-full max-w-lg shadow-lg bg-gray-900 p-6 rounded-2xl">
            <h2 className="text-2xl font-semibold text-center mb-6">Verify Property Details</h2>
            {Object.entries(selectedApplication).map(([key, value]) => {
              if (key === 'id' || key === 'userAddress' || key === 'status') return;

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
                          if (key === 'mobileNumber' && !/^\d*$/.test(e.target.value)) {
                            return; // Prevent non-numeric input
                          }
                          setSelectedApplication((prev) => {
                            return { ...prev, [key]: e.target.value };
                          });
                        }}
                        className="mt-2"
                        rows={2}
                        disabled={key === 'landArea' || selectedApplication?.status === 'Signed'}
                      />
                    </>
                  )}
                  <div className="flex gap-4 mt-2">
                    <Button
                      icon={<CheckCircleOutlined />}
                      onClick={() => handleVerify(key)}
                      disabled={
                        isLoadingField ||
                        key === 'landArea' ||
                        key === 'imageUrl' ||
                        selectedApplication?.status === 'Signed'
                      }
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
                disabled={isLoadingField || selectedApplication?.status === 'Signed'}
              >
                Accept All & Sign
              </Button>
            </div>
            {selectedApplication?.status === 'Signed' && (
              <p> Document is already Verified by Buyer {address} </p>
            )}

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
