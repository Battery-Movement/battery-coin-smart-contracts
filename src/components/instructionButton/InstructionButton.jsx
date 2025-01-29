import InstructionButtonWrapper from "./InstructionButton.style";
import PropTypes from "prop-types"; 
import { FaCircleQuestion } from "react-icons/fa6";
import InstructionModal from "./InstructionModal";
import { useState } from "react";

const InstructionButton = ({ variant }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleInstructionModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <InstructionButtonWrapper variant={variant}>
      <button className="instruction-btn" onClick={toggleInstructionModal}>
        <FaCircleQuestion style={{ fontSize: 24 }} />
      </button>
      {isModalVisible && (
        <InstructionModal setIsModalVisible={setIsModalVisible} variant={variant} />
      )}
    </InstructionButtonWrapper>
  );
};

InstructionButton.propTypes = {
  variant: PropTypes.string, 
};

export default InstructionButton;
