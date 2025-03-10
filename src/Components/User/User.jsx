'use client';
import React from 'react';
import { useState } from 'react';
import { Card, Button, Input, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
const { TextArea } = Input;

export default function UserVerification() {
  const [verification, setVerification] = useState({});
  const [finalDecision, setFinalDecision] = useState(null);

  const houseDetails = {
    ownerName: 'John Doe',
    Gender: 'Male/Female',
    MobileNumber: '9876543210',
    panNumber: 'QWERT5678Y',
    landArea: '500 sq ft',
    landAddress: '123 Blockchain St, Crypto City',
    LandImage: 'QmXyz123456...',
    ownerWalletAddress: '0x00',
  };

  const handleVerify = (field, status) => {
    setVerification((prev) => ({ ...prev, [field]: status }));
  };

  const handleFinalDecision = (decision) => {
    setFinalDecision(decision);
    message.success(`You have ${decision === 'accepted' ? 'accepted' : 'declined'} the details.`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 text-white">
      <Card className="w-full max-w-lg shadow-lg bg-gray-900 p-6 rounded-2xl">
        <h2 className="text-2xl font-semibold text-center mb-6">Verify Property Details</h2>

        {Object.entries(houseDetails).map(([key, value]) => (
          <div key={key} className="mb-4 p-3 bg-[#f8f8f8] rounded-lg">
            {key === 'LandImage' ? (
              <>
                <div>
                  <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</p>
                  <img
                    src="https://media.istockphoto.com/id/474917902/photo/modern-architecture-design-100-for-house-bungalow.jpg?s=612x612&w=0&k=20&c=w5sBVyE-1ZmGmLdtK0F808826hMOyeVOiGYN2H17bOg="
                    alt="Property Document"
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</p>
                <TextArea value={value} disabled className="mt-2" rows={2} />
              </>
            )}
            <div className="flex gap-4 mt-2">
              <Button
                type={verification[key] === 'accepted' ? 'primary' : 'default'}
                icon={<CheckCircleOutlined />}
                onClick={() => handleVerify(key, 'accepted')}
              >
                Accept
              </Button>
              <Button
                danger={verification[key] === 'declined'}
                icon={<CloseCircleOutlined />}
                onClick={() => handleVerify(key, 'declined')}
              >
                Decline
              </Button>
            </div>
          </div>
        ))}

        <div className="mt-6 flex gap-4">
          <Button
            type="primary"
            className="w-full"
            onClick={() => handleFinalDecision('accepted')}
            disabled={Object.values(verification).includes('declined')}
          >
            Approve All
          </Button>
          <Button type="default" className="w-full" onClick={() => handleFinalDecision('declined')}>
            Decline All
          </Button>
        </div>

        {finalDecision && (
          <div className="mt-6 p-4 bg-[#f8f8f8] rounded-lg text-center">
            <p className={`${finalDecision === 'accepted' ? 'text-green-400' : 'text-red-600'}`}>
              You have {finalDecision === 'accepted' ? 'approved' : 'declined'} all details.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
