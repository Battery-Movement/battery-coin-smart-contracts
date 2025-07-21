import InstructionModalWrapper from "./InstructionModal.style";
import { CgClose } from "react-icons/cg";
import { usePresaleModal } from "../../contexts/ModalContext";

const InstructionModal = ({ setIsModalVisible }) => {
  const { modalHandle } = usePresaleModal();

  const handleClose = () => {
    setIsModalVisible(false);
    modalHandle();
  };

  return (
    <InstructionModalWrapper className="modal">
      <div className="modal-dialog modal-dialog-centered gittu-modal-dialog">
        <div className="modal-content gittu-modal-content">
          <div className="gittu-modal-header">
            <h4 className="ff-orbitron fw-700 text-white text-uppercase">
              Be an early buyer
            </h4>
            <button onClick={handleClose}>
              <CgClose />
            </button>
            <div className="gittu-modal-body">
              <div className="mb-20">
                <h5 className="ff-outfit fw-600 text-white">
                  Instructions for Token Buyers using $USDT and $USDC to buy
                  $BATR.
                </h5>
              </div>
              <div className="mb-20">
                <h5 className="ff-outfit fw-600 text-white">
                  1. To purchase, install MetaMask or Trust Wallet on mobile
                  first.
                </h5>
              </div>
              <div className="mb-20">
                <h5 className="ff-outfit fw-600 text-white">
                  2. Ensure your wallet has sufficient $ETH for gas fees.
                </h5>
              </div>
              <div className="mb-20">
                <h5 className="ff-outfit fw-600 text-white">
                  3. Approve $USDT and $USDC transfers from your wallet to the
                  smart contract before purchasing $BATR. Approval needs a gas
                  fee.
                </h5>
              </div>
              <div>
                <h5 className="ff-outfit fw-600 text-white">
                  4. Once approve you have to go back to purchase. Purchasing
                  needs a second gas fee.
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InstructionModalWrapper>
  );
};

export default InstructionModal;
