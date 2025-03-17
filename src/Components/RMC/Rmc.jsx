import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getContractInstance, getSignerContract } from '@/utils/contract';

const Rmc = () => {
  const [signedTokens, setSignedTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { address } = useAccount();

  const contract = getContractInstance(); 
  useEffect(() => {
    const fetchSignedTokens = async () => {
      try {
        const allTokenIds = await contract.getAllTokenIds();
        const signedTokensData = await Promise.all(
          allTokenIds.map(async (tokenId) => {
            const tokenDetails = await contract.tokenIdDetails(tokenId.toString());

            const tokenObject = Object.fromEntries(Object.entries(tokenDetails));

            if (
              tokenObject[7] === true &&
              address?.toString().toLowerCase() === '0x5969ad5abb6d9f1a0336579ad094828d4c3d3140'
            ) {
              const imageUrl = await fetchImage(await contract.tokenURI(tokenId.toString()));
              return {
                id: tokenId,
                ownerName: tokenDetails[0],
                userAddress: tokenDetails[1],
                houseAddress: tokenDetails[2],
                gender: tokenDetails[4],
                landArea: tokenDetails[5],
                pancard: tokenDetails[6],
                mobileNumber: '9876543210', // Add real mobile number if available
                imageUrl,
                isVerifiedByRMC: tokenDetails[8],
              };
            }
            return null; // Don't include verified tokens
          }),
        );
        setSignedTokens(signedTokensData.filter(Boolean)); // Remove null entries
      } catch (error) {
        console.error('Error fetching signed tokens:', error);
      }
      setLoading(false);
    };
    fetchSignedTokens();
  }, []);

  const fetchImage = async (tokenURI) => {
    try {
      const response = await fetch(tokenURI);
      const metadata = await response.json();
      return metadata.image;
    } catch (error) {
      console.error('Error fetching image:', error);
      return '';
    }
  };

  const handleApprove = async (tokenId) => {
    setApproving(true);
    try {
      const signerContract = await getSignerContract();
      const tx = await signerContract.rmcApproved(tokenId);
      await tx.wait();
      alert(`Application for ${selectedApplication.ownerName} has been approved.`);
      setSelectedApplication((prev) => ({ ...prev, status: 'Approved' }));
      setApproving(false);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert(error.data.message);
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }
  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-8">Approve User Property details</h2>
      <div className="h-screen p-8 bg-gray-100">
        {!selectedApplication ? (
          <div className="space-y-4 ">
            {signedTokens.length === 0 ? (
              <p className="text-center text-lg text-gray-500">No applications</p>
            ) : (
              signedTokens.map((app) => (
                <div
                  key={app.id.toString()}
                  className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer ${app.isVerifiedByRMC ? 'bg-green-500' : 'bg-white'}`}
                  onClick={() => setSelectedApplication(app)}
                >
                  <h3 className="text-xl font-semibold">{app.ownerName}</h3>
                  <p className="text-gray-600">{app.userAddress}</p>
                  <p className="text-sm text-gray-500">Land Area: {app.landArea.toString()}</p>
                  <p className="text-sm text-gray-500">
                    Status: {app.isVerifiedByRMC ? 'Verified' : 'Pending'}
                  </p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
            <button onClick={() => setSelectedApplication(null)} className="text-blue-50 mb-4">
              Back to Application List
            </button>
            <h2 className="text-2xl font-semibold">Application Details</h2>
            <div className="mt-4 flex justify-around items-center">
              <div className="flex flex-col items-start">
                <p>
                  <strong>Owner Name:</strong> {selectedApplication.ownerName}
                </p>
                <p>
                  <strong>User Address:</strong> {selectedApplication.userAddress}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedApplication.gender}
                </p>
                <p>
                  <strong>Land Area:</strong> {selectedApplication.landArea.toString()}
                </p>
                <p>
                  <strong>PAN Card:</strong> {selectedApplication.pancard}
                </p>
                <p>
                  <strong>House Address:</strong> {selectedApplication.userAddress}
                </p>
                <p>
                  <strong>Mobile Number :</strong> {selectedApplication.mobileNumber}
                </p>
              </div>
              <div className="mt-5 flex flex-col justify-center">
                <strong>Land Image:</strong>
                <img
                  src={selectedApplication.imageUrl}
                  alt="Application"
                  className="w-50 h-50 object-cover rounded-md cursor-pointer"
                  onClick={() => setIsImageModalOpen(true)}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => handleApprove(selectedApplication.id)}
                className={`px-6 py-2 rounded-md ${selectedApplication.isVerifiedByRMC || approving ? '!bg-gray-500 !cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 '} text-white`}
                disabled={selectedApplication.isVerifiedByRMC && approving}
              >
                {selectedApplication.isVerifiedByRMC
                  ? 'Already Verified'
                  : approving
                    ? 'Approving...'
                    : 'Approve'}
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Status: {selectedApplication.isVerifiedByRMC ? 'Verified' : 'Pending'}
            </p>
          </div>
        )}

        {isImageModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white p-4 rounded-lg max-w-4xl">
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-2"
              >
                &times;
              </button>
              <img
                src={selectedApplication.imageUrl}
                alt="Application"
                className="max-w-full max-h-96 object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Rmc;
