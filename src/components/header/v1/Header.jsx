import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import HeaderWrapper from "./Header.style";
import ConnectWalletButton from "../../connectWalletButton/ConnectWalletButton";
import Logo from "../../../assets/images/logo-3.png";

const Header = () => {
  const [logoImg, setLogoImg] = useState(Logo);

  return (
    <>
      <HeaderWrapper className="header-section">
        <div className="container">
          <div className="gittu-header-content">
            <div className="gittu-header-left">
              <NavLink className="gittu-header-logo" to="/" end>
                <img src={logoImg} alt="Logo" style={{ width: "15vw" }} />
              </NavLink>
            </div>
            <div className="gittu-header-right">
              <div className="gittu-header-menu-toggle"></div>
              <div className="gittu-header-right-menu">
                <ConnectWalletButton variant="blue" />
              </div>
            </div>
          </div>
        </div>
      </HeaderWrapper>
    </>
  );
};

export default Header;
