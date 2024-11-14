import DropdownWrapper from "./Dropdown.style";
import { useState } from "react";
import Icon1 from "../../../assets/images/token/USDT.jpg";
import Icon2 from "../../../assets/images/token/USDC.jpg";

const Dropdown = ({ options, onChange, variant }) => {
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const dropdownHandle = () => {
    setIsDropdownActive(!isDropdownActive);
  };

  const handleDropdownData = (option) => {
    setSelectedOption(option);
    setIsDropdownActive(false);
    onChange(option);
  };

  return (
    <DropdownWrapper variant={variant}>
      <button
        className={`dropdown-toggle ${isDropdownActive ? "active" : ""}`}
        onClick={dropdownHandle}
      >
        <img src={selectedOption.icon} alt={selectedOption.label} />
        <span>{selectedOption.label}</span>
      </button>
      {isDropdownActive && (
        <ul className="dropdown-list">
          {options.map((option, i) => (
            <li key={i}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleDropdownData(option);
                }}
              >
                <img src={option.icon} alt={option.label} />
                <span>{option.label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </DropdownWrapper>
  );
};

export default Dropdown;
