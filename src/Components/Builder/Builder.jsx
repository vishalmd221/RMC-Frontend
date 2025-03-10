import React from 'react';
import { useState } from 'react';
import { Form, Input, Upload, Button, DatePicker, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';

export default function CertificateIssuer() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [transactionHash, setTransactionHash] = useState('');

  // Handle file upload
  const handleUpload = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} uploaded successfully`);
      setFileList([info.file]);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  // Handle form submission
  const onFinish = async (values) => {
    console.log('Form Data:', values);

    // Mock Blockchain transaction hash
    const mockTxHash = '0x' + Math.random().toString(36).substring(2, 42);
    setTransactionHash(mockTxHash);

    message.success('Certificate Issued Successfully on Blockchain!');
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-8">RMC Blockchain Certificate Issuer</h2>
      <div className="flex justify-center items-center min-h-screen text-white p-4">
        <Card className="w-full max-w-lg shadow-lg bg-gray-800 p-6 rounded-2xl">
          <h2 className="text-2xl font-semibold text-center mb-6">Issue Land Certificate</h2>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Owner name"
              name="recipient"
              rules={[{ required: true, message: 'Enter owner name' }]}
            >
              <Input placeholder="Enter owner name" />
            </Form.Item>
            <Form.Item
              label="Mobile Number"
              name="Enter Mobile Number"
              rules={[{ required: true, message: 'Enter Mobile Number' }]}
            >
              <Input placeholder="Enter Mobile Number" />
            </Form.Item>
            <Form.Item
              label="Owner Address"
              name="title"
              rules={[{ required: true, message: 'Enter Owner Address' }]}
            >
              <Input placeholder="Enter Owner Address" />
            </Form.Item>
            {/* <Form.Item
            label="Date of Issuance"
            name="date"
            rules={[{ required: true, message: 'Select issuance date' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item> */}
            <Form.Item
              label="Gender"
              name="Enter Gender"
              rules={[{ required: true, message: 'Enter Gender' }]}
            >
              <Input placeholder="Enter Gender" />
            </Form.Item>
            <Form.Item
              label="Land Area"
              name="Enter Land Area"
              rules={[{ required: true, message: 'Enter Land Area' }]}
            >
              <Input placeholder="Enter Gender" />
            </Form.Item>
            <Form.Item
              label="Land Address"
              name="landAddress"
              rules={[{ required: true, message: 'Enter details about the property address.' }]}
            >
              <TextArea
                placeholder="Enter details about Property address."
                className="min-h-[100px]"
                rows={4}
                // value={formData.landAddress} // Uncomment if using state
                // onChange={handleInputChange}  // Uncomment if using state
              />
            </Form.Item>

            <Form.Item
              label="PAN Number"
              name="Enter PAN Number"
              rules={[{ required: true, message: 'Enter PAN Number' }]}
            >
              <Input placeholder="Enter PAN Number" />
            </Form.Item>

            <Form.Item label="Certificate ID" name="certificateId">
              <Input
                placeholder="Auto-generated ID"
                disabled
                value={'CERT-' + Math.floor(Math.random() * 10000)}
              />
            </Form.Item>
            <Form.Item
              label="IPFS Metadata Hash"
              name="IPFS Metadata Hash"
              rules={[{ required: true, message: 'Enter IPFS Metadata Hash' }]}
            >
              <Input placeholder="Enter Metadata Hash" />
            </Form.Item>
            <Form.Item label="Upload Certificate">
              <Upload beforeUpload={() => false} fileList={fileList} onChange={handleUpload}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
            <Button type="primary" htmlType="submit" className="w-full mt-4">
              Mint Certificate
            </Button>
          </Form>

          {transactionHash && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg text-center">
              <p className="text-green-400">Certificate Issued on Blockchain!</p>
              <p className="text-sm break-all">{transactionHash}</p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
