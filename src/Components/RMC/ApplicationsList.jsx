import React, { useState } from 'react';

const ApplicationsList = () => {
  // Dummy application data for the RMC to review
  const applications = [
    {
      id: 1,
      ownerName: 'John Doe',
      userAddress: '123 Main St',
      ipfsHash: 'QmT1m3FVYbFsd77d8Wz5p8DSu8tjhsJrXr7RVA9rp6sfuN',
      gender: 'Male',
      landArea: '1200 sq ft',
      pancard: 'ABCD1234E',
      houseAddress: '456 Elm St',
      mobileNumber: '9876543210',
      imageUrl:
        'https://media.istockphoto.com/id/474917902/photo/modern-architecture-design-100-for-house-bungalow.jpg?s=612x612&w=0&k=20&c=w5sBVyE-1ZmGmLdtK0F808826hMOyeVOiGYN2H17bOg=',
      status: 'Pending', // Initially status is 'Pending'
    },
    {
      id: 2,
      ownerName: 'Jane Smith',
      userAddress: '456 Oak Rd',
      ipfsHash: 'QmV3F6Tx5VVkt6bYkK4erA5a5TTqsaTHg2hn3XwvDjmzaG',
      gender: 'Female',
      landArea: '1500 sq ft',
      pancard: 'EFGH5678F',
      houseAddress: '789 Pine Ave',
      mobileNumber: '9988776655',
      imageUrl:
        'https://media.istockphoto.com/id/474917902/photo/modern-architecture-design-100-for-house-bungalow.jpg?s=612x612&w=0&k=20&c=w5sBVyE-1ZmGmLdtK0F808826hMOyeVOiGYN2H17bOg=',
      status: 'Pending', // Initially status is 'Pending'
    },
    // More applications can be added
  ];

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

  return (
    <div className="h-screen p-8 bg-gray-100">
      {/* If no application is selected, show the list of applications */}
      {!selectedApplication ? (
        <div className="space-y-4">
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
              onClick={() => handleApplicationClick(application)}
            >
              <h3 className="text-xl font-semibold">{application.ownerName}</h3>
              <p className="text-gray-600">{application.userAddress}</p>
              <p className="text-sm text-gray-500">Land Area: {application.landArea}</p>
              <p className="text-sm text-gray-500">Status: {application.status}</p>
            </div>
          ))}
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
            <p>
              <strong>IPFS Hash:</strong>{' '}
              <a
                href={`https://ipfs.io/ipfs/${selectedApplication.ipfsHash}`}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                {selectedApplication.ipfsHash}
              </a>
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

export default ApplicationsList;
