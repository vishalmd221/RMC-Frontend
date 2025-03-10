import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import contractABI from '../../utils/rmcABI (1).json'; // Adjust the path to your ABI file

const Rmc = () => {
  const [signedTokens, setSignedTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dummy application data for the RMC to review
    const contractAddress = '0x6011B598CAb43005e3684469C64436DA0d417111'; // Replace with your contract address

    // Initialize the provider with the `resolveNames` option set to false
    const provider = new ethers.providers.JsonRpcProvider(
      'https://polygon-amoy.infura.io/v3/6dd18219c5be4037b6b52b335a8562f9',
      {
        chainId: 80002, // Polygon Mumbai Testnet Chain ID
        name: 'matic-amoy', // Polygon Mumbai network name
        resolveNames: false, // Disable ENS resolution
      },
    );

    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const getSignedTokenDetails = async () => {
      try {
        // Step 1: Fetch all token IDs
        const allTokenIds = await contract.getAllTokenIds();
        console.log({ allTokenIds });
        const signedTokens = [];
        for (let i = 0; i < allTokenIds.length; i++) {
          const tokenId = allTokenIds[i];
          const tokenDetails = await contract.tokenIdDetails(tokenId.toString());
          const tokenDetailsPlainObject = Object.fromEntries(Object.entries(tokenDetails));
          // Step 3: Check if `isSignedByOwner` is true
          if (tokenDetailsPlainObject[8]) {
            const image = await contract.tokenURI(tokenId.toString());
            const getimage = await fetchImage(image);
            signedTokens.push({
              id: tokenId,
              ownerName: tokenDetails[0],
              userAddress: tokenDetails[1],
              houseAddress: tokenDetails[2],
              // number: tokenDetails[3],
              gender: tokenDetails[4],
              landArea: tokenDetails[5],
              pancard: tokenDetails[6],
              mobileNumber: '9876543210',
              imageUrl: getimage,
              status: 'Pending', // Initially status is 'Pending'
            });
          }
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

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Handle clicking on an application
  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
  };

  // Handle clicking on the image to show the modal
  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  // Handle closing the image modal
  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  // Handle going back to the application list
  const handleBackToList = () => {
    setSelectedApplication(null);
  };
  // Handle application approval
  const handleApprove = () => {
    const response = contract.verifyDoc();
    if (selectedApplication) {
      setSelectedApplication({
        ...selectedApplication,
        status: 'Approved', // Set the status to 'Approved'
      });
      alert(`Application for ${selectedApplication.ownerName} has been approved.`);
    }
  };

  // Handle application decline
  const handleDecline = () => {
    if (selectedApplication) {
      setSelectedApplication({
        ...selectedApplication,
        status: 'Declined', // Set the status to 'Declined'
      });
      alert(`Application for ${selectedApplication.ownerName} has been declined.`);
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
        <p className="text-gray-500">Loading applications...</p>
      </div>
    );
  }
  return (
    <div className="h-screen p-8 bg-gray-100">
      {/* If no application is selected, show the list of applications */}
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
        // If an application is selected, show the details
        <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <button onClick={handleBackToList} className="text-blue-500 underline mb-4">
            Back to Application List
          </button>
          <h2 className="text-2xl font-semibold">Application Details</h2>
          <div className="mt-4">
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
              <strong>Land Area:</strong> {selectedApplication.landArea}
            </p>
            <p>
              <strong>PAN Card:</strong> {selectedApplication.pancard}
            </p>
            <p>
              <strong>House Address:</strong> {selectedApplication.houseAddress}
            </p>
            <p>
              <strong>Mobile Number:</strong> {selectedApplication.mobileNumber}
            </p>

            {/* Image with click to enlarge */}
            <div className="mt-5 flex justify-center">
              <img
                src={selectedApplication.imageUrl}
                alt="Application Image"
                className="w-50 h-50 object-cover rounded-md cursor-pointer"
                onClick={handleImageClick}
              />
            </div>

            {/* Approve and Decline buttons */}
            <div className="mt-6 flex justify-center gap-x-4">
              <button
                onClick={handleApprove}
                className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={handleDecline}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Decline
              </button>
            </div>
            <p className="mt-2 text-sm text-gray-500">Status: {selectedApplication.status}</p>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-4xl">
            <button
              onClick={handleCloseImageModal}
              className="absolute top-2 right-2 bg-gray-700 text-white rounded-full p-2"
            >
              &times;
            </button>
            <img
              src={selectedApplication.imageUrl}
              alt="Application Image"
              className="max-w-full max-h-96 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Rmc;
