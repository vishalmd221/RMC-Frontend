// @ts-nocheck
import React from 'react';
import { useState } from 'react';
import { Form, Input, Upload, Button, DatePicker, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { ethers } from 'ethers';
// @ts-ignore
import CONTRACT_ABI from '../../utils/latestRmcAbi';

// Contract address
const CONTRACT_ADDRESS = '0x13697f35172Ec534315Cb8c7DA65E4f075262bD9';

// Function to get the contract instance
export const getContract = async () => {
  try {
    if (!window.ethereum) throw new Error('No crypto wallet found.');

    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const network = await provider.getNetwork();
    console.log('Connected Network:', network);

    const signer = provider.getSigner();

    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI).connect(signer);
  } catch (error) {
    console.error('Contract Connection Error:', error);
    message.error('Failed to connect to contract. Ensure you are on Polygon Amoy Testnet.');
  }
};

export default function CertificateIssuer() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [transactionHash, setTransactionHash] = useState('');

  // Handle file upload
  const handleUpload = (e) => {
    console.log({ e });
    setFileList(e.target.files[0]);
    // if (info.file.status === 'done') {
    //   message.success(`${info.file.name} uploaded successfully`);
    //   setFileList([info.file]);
    // } else if (info.file.status === 'error') {
    //   message.error(`${info.file.name} upload failed.`);
    // }
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      console.log(fileList, ' fileList');
      formData.append('file', fileList);
      const response = await fetch('https://rmc-backend-rabl.onrender.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) return;
      const data = await response.json();
      // setIpfsData(data);
      // setUploadStatus(`File uploaded successfully!`);

      const metadata = {
        description: 'WELCOME TO MY HOUSE',
        external_url: 'https://openseacreatures.io/3',
        image: `https://brown-leading-scallop-142.mypinata.cloud/ipfs/${data.IpfsHash}`,
        name: values.ownerName,
        attributes: [
          {
            trait_type: 'IMAGE',
            value: '100',
          },
        ],
      };

      const jsonResponse = await fetch('https://rmc-backend-rabl.onrender.com/uploadJson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      const jsonData = await jsonResponse.json();
      console.log('JSON Metadata uploaded:', jsonData);
      console.log('IpfsHash', jsonData.IpfsHash);

      const metadatanft = `https://ipfs.io/ipfs/${jsonData.IpfsHash}`; // link of pinata where we are storing hash
      console.log(metadatanft, 'metadatanft');
      console.log({ metadatanft });

      const contract = await getContract();
      if (!contract) return;
      console.log('Form Data:', values);

      // Convert form data into Solidity `propertyDetails` struct
      const propertyDetails = {
        Name: values.ownerName,
        Address: values.landAddress,
        ownerAddress: values.ownerAddress,
        Number: parseInt(values.mobileNumber, 10),
        Gender: values.gender,
        SqFoot: parseInt(values.landArea, 10),
        PanCardNumber: values.panNumber,
        isSignedByOwner: false,
        isVerifiedByRMC: false,
      };

      // Call smart contract function
      const tx = await contract.createByBuilder(propertyDetails, metadatanft);
      await tx.wait();

      setTransactionHash(tx.hash);
      message.success('Certificate Issued on Blockchain!');
    } catch (error) {
      console.error('Blockchain Transaction Error:', error);
      message.error('Transaction failed! Make sure you are connected to the right network.');
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-8">RMC Blockchain Certificate Issuer</h2>
      <div className="flex justify-center items-center min-h-screen text-white p-4">
        <Card className="w-full max-w-lg shadow-lg bg-gray-800 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold text-center mb-6">Issue Land Certificate</h2>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Owner Name"
              name="ownerName"
              rules={[{ required: true, message: 'Enter owner name' }]}
            >
              <Input placeholder="Enter owner name" />
            </Form.Item>
            <Form.Item
              label="Mobile Number"
              name="mobileNumber"
              rules={[{ required: true, message: 'Enter Mobile Number' }]}
            >
              <Input placeholder="Enter Mobile Number" />
            </Form.Item>
            <Form.Item
              label="Owner Address"
              name="ownerAddress"
              rules={[{ required: true, message: 'Enter Owner Address' }]}
            >
              <Input placeholder="Enter Owner Address" />
            </Form.Item>
            <Form.Item
              label="Gender"
              name="gender"
              rules={[{ required: true, message: 'Enter Gender' }]}
            >
              <Input placeholder="Enter Gender" />
            </Form.Item>
            <Form.Item
              label="Land Area (Sq Foot)"
              name="landArea"
              rules={[{ required: true, message: 'Enter Land Area' }]}
            >
              <Input placeholder="Enter Land Area" />
            </Form.Item>
            <Form.Item
              label="Land Address"
              name="landAddress"
              rules={[{ required: true, message: 'Enter Property Address.' }]}
            >
              <TextArea
                placeholder="Enter details about Property address."
                className="min-h-[100px]"
                rows={4}
              />
            </Form.Item>
            <Form.Item
              label="PAN Number"
              name="panNumber"
              rules={[{ required: true, message: 'Enter PAN Number' }]}
            >
              <Input placeholder="Enter PAN Number" />
            </Form.Item>
            {/* <Form.Item
              label="IPFS Metadata Hash"
              name="ipfsHash"
              rules={[{ required: true, message: 'Enter IPFS Metadata Hash' }]}
            >
              <Input placeholder="Enter Metadata Hash" />
            </Form.Item> */}

            <Form.Item label="Upload Certificate">
              {/* <Upload beforeUpload={() => false} fileList={fileList} onChange={handleUpload}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload> */}
              <input type="file" onChange={handleUpload} />
            </Form.Item>
            <Button type="primary" htmlType="submit" className="w-full mt-4">
              Mint Certificate
            </Button>
          </Form>

          {transactionHash && (
            <div className="mt-6 p-4 bg-white-700 rounded-lg text-center">
              <p className="text-green-400">Certificate Issued on Blockchain!</p>
              <p className="text-sm break-all">{transactionHash}</p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
