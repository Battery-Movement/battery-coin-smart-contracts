import { useState } from "react";
import { NavLink } from "react-router-dom";
import HeaderWrapper from "./Header.style";
import ConnectWalletButton from "../../connectWalletButton/ConnectWalletButton";
import Logo from "../../../assets/images/logo-3.png";
import Ethereum from "../../../assets/images/ethereum.png";
import Debit from "../../../assets/images/debit.png";
import Coinbase from "../../../assets/images/coinbase.png";
import InstructionButton from "../../instructionButton/InstructionButton";
import { usePresaleData } from "../../../utils/PresaleContext";

const Header = () => {
  const { purchaseMethod, setPurchaseMethod } = usePresaleData();
  const [logoImg, setLogoImg] = useState(Logo);
  const [ethImg, setETHImg] = useState(Ethereum);
  const [debitImg, setDebitImg] = useState(Debit);
  const [coinbaseImg, setCoinbaseImg] = useState(Coinbase);

  return (
    <>
      <HeaderWrapper className="header-section">
        <div className="container">
          <div className="gittu-header-content">
            <div className="gittu-header-left">
              <NavLink
                className="gittu-header-logo"
                to="https://store.batterycoin.org"
                end
              >
                <img
                  src={logoImg}
                  alt="Logo"
                  style={{ width: "15vw", minWidth: 150 }}
                />
              </NavLink>
            </div>
            <div className="gittu-header-right">
              <div className="gittu-header-menu-toggle"></div>
              {purchaseMethod == 1 && (
                <div className="gittu-header-right-menu">
                  <ConnectWalletButton variant="blue" />
                </div>
              )}
              <div className="gittu-header-right-menu toggle-container">
                <div className="toggle-button">
                  <div
                    className={`toggle-slider ${
                      purchaseMethod == 1
                        ? "left"
                        : purchaseMethod == 2
                        ? "center"
                        : "right"
                    }`}
                  ></div>

                  <div className="toggle-icons">
                    <img
                      src={ethImg}
                      alt="Ethereum"
                      className="bitcoin-icon"
                      onClick={() => setPurchaseMethod(1)}
                    />
                    <img
                      src={debitImg}
                      alt="Visa"
                      className="visa-icon"
                      onClick={() => setPurchaseMethod(2)}
                    />
                    <img
                      src={coinbaseImg}
                      alt="Visa"
                      className="visa-icon"
                      onClick={() => setPurchaseMethod(3)}
                    />
                  </div>
                </div>
              </div>
              <div className="gittu-header-right-menu">
                <InstructionButton variant="blue" />
              </div>
            </div>
          </div>
        </div>
      </HeaderWrapper>
    </>
  );
};

export default Header;
