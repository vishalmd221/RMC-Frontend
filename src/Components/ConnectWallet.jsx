import React from "react";
import { Button, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useWallet } from "./WalletContext";

const ConnectWallet = () => {
  const { account, connectMetaMask, disconnectMetaMask, error } = useWallet();

  // Function to copy the address to the clipboard
  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      alert("Address copied to clipboard");
    }
  };

  // Function to display shortened address
  const shortenAddress = (address) => {
    if (address) {
      return `${address.slice(0, 5)}...${address.slice(-5)}`;
    }
    return "";
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={copyToClipboard}>
        Copy Address
      </Menu.Item>
      <Menu.Item key="2" onClick={disconnectMetaMask}>
        Disconnect
      </Menu.Item>
    </Menu>
  );
  return (
    <div>
      {!account ? (
        <Button onClick={connectMetaMask}>Connect Wallet</Button>
      ) : (
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button>
            {shortenAddress(account)} <DownOutlined />
          </Button>
        </Dropdown>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ConnectWallet;
