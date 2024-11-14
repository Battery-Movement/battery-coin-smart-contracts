import { useEffect, useState } from "react";
import ConnectWalletButtonStyleWrapper from "./ConnectWalletButton.style";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { FiChevronDown } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import IconImg1 from "../../assets/images/icons/wallet.svg";

const ConnectWalletButton = ({ variant }) => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  const [walletAddress, setWalletAddress] = useState("");
  const [shortWalletAddress, setShortWalletAddress] = useState("");

  const { address: addressData, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      let first = addressData.slice(0, 4);
      let last = addressData.slice(-4);
      setWalletAddress(first + "..." + last);

      let first2 = addressData.slice(0, 2);
      let last2 = addressData.slice(-2);
      setShortWalletAddress(first2 + "..." + last2);
    }
  }, [isConnected, addressData]);

  return (
    <ConnectWalletButtonStyleWrapper variant={variant}>
      {openConnectModal && variant != "v7" && (
        <button className="connect-wallet-btn" onClick={openConnectModal}>
          Connect <span>Wallet</span>
        </button>
      )}

      {openConnectModal && variant === "v7" && (
        <button className="custom-btn" onClick={openConnectModal}>
          <img src={IconImg1} alt="icon" className="icon" />
          <span className="name">Wallet</span>
          <span className="icon-text">
            <FaPlus />
          </span>
          <span className="url">Connect</span>
        </button>
      )}

      {openAccountModal && variant != "v7" && (
        <button
          // walletAddress
          className="connect-wallet-btn"
          onClick={openAccountModal}
        >
          <span>{walletAddress}</span>
          <span className="short-address">{shortWalletAddress}</span>
          <FiChevronDown />
        </button>
      )}

      {openAccountModal && variant === "v7" && (
        <button className="custom-btn" onClick={openAccountModal}>
          <img src={IconImg1} alt="icon" className="icon" />
          <span className="name">Wallet</span>
          <span className="icon-text">
            <FaPlus />
          </span>
          <span className="url">
            {shortWalletAddress} <FiChevronDown />
          </span>
        </button>
      )}
    </ConnectWalletButtonStyleWrapper>
  );
};

export default ConnectWalletButton;
