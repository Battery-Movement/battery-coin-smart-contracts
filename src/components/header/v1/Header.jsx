import { useEffect, useState } from "react";
import PropTypes from "prop-types"; 
import { NavLink } from "react-router-dom";
import HeaderWrapper from "./Header.style";
import ConnectWalletButton from "../../connectWalletButton/ConnectWalletButton";
import Logo from "../../../assets/images/logo-3.png";
import InstructionButton from "../../instructionButton/InstructionButton";

const Header = ({ variant }) => {
  const [logoImg, setLogoImg] = useState(Logo);

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
            {variant === "v2" && (
            <div className="gittu-header-right">
              <div className="gittu-header-menu-toggle"></div>
              <div className="gittu-header-right-menu">
                <ConnectWalletButton variant="blue" />
              </div>
              <div className="gittu-header-right-menu">
                <InstructionButton variant={variant} />
              </div>
            </div>
            )}
            {variant === "paypangea" && (
            <div className="gittu-header-right">
              <div className="gittu-header-right-menu">
                <InstructionButton variant={variant} />
              </div>
            </div>
            )}
          </div>
        </div>
      </HeaderWrapper>
    </>
  );
};

Header.propTypes = {
  variant: PropTypes.string, 
};

export default Header;
