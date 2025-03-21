import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
// import contractABI from '../../utils/latestRmcAbi.json'; //old
import contractABI from '../../utils/RmcABI.json'; // new

const Rmc = () => {
  const [signedTokens, setSignedTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { address } = useAccount();

  // const CONTRACT_ADDRESS = '0x13697f35172Ec534315Cb8c7DA65E4f075262bD9'; // OLD
  const CONTRACT_ADDRESS = '0xb25580A1eF44EC72a0F20880BAE87399e90E12Aa'; // NEW

  const provider = new ethers.providers.JsonRpcProvider(
    'https://alfajores-forno.celo-testnet.org',
    // 'https://celo-alfajores.infura.io/v3/6dd18219c5be4037b6b52b335a8562f9',
  );
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
  useEffect(() => {
    const fetchSignedTokens = async () => {
      try {
        setLoading(true);
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
                mobileNumber: parseInt(tokenDetails[3], 10),
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
  }, [address]);

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
      const newProvider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await newProvider.getSigner();
      const contractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, contractABI).connect(signer);
      const tx = await contractWithSigner.rmcApproved(tokenId);

      // const signerContract = await getSignerContract();
      // const tx = await contractWithSigner.rmcApproved(tokenId);
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
      <h2 className="text-3xl font-bold text-center mb-8">Approve Buyer Property details</h2>
      <div className="h-screen p-8 bg-gray-100">
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
              signedTokens.map((app) => (
                <div
                  key={app.id.toString()}
                  className={`bg-white p-4 rounded-lg flex min-h-[150px] min-w-[200px] flex-col justify-center shadow-md hover:shadow-lg cursor-pointer ${app.isVerifiedByRMC ? 'bg-green-500' : 'bg-white'}`}
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
                  <strong>Buyer Address:</strong> {selectedApplication.userAddress}
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
