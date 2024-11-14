import DropdownWrapper from "./Dropdown.style";
import { useEffect, useState } from "react";
import EthIcon from "../../assets/images/token/eth.png";
import BnbIcon from "../../assets/images/token/bnb.png";
import { payWith } from "../../contracts/config";

const Dropdown = ({
  variant,
  userChainId,
  ethChainId,
  bnbChainId,
}) => {
  const [titleText, setTitleText] = useState(payWith);
  const [selectedImg, setSelectedImg] = useState(EthIcon);

  useEffect(() => {
    if (userChainId == ethChainId) {
      setSelectedImg(EthIcon);
      setTitleText("ETH");
    }
    if (userChainId == bnbChainId) {
      setSelectedImg(BnbIcon);
      setTitleText("BNB");
    }
  }, [userChainId, ethChainId, bnbChainId]);

  return (
    <DropdownWrapper variant={variant}>
      <button className="dropdown-toggle">
        <img src={selectedImg} alt="icon" />
        <span>{titleText}</span>
      </button>
    </DropdownWrapper>
  );
};

export default Dropdown;
