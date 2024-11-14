import PayWithStyleWrapper from "./PayWith.style";
import StatusIcon from "../../assets/images/icons/status.png";
import Dropdown from "./Dropdown/Dropdown";
import { usePresaleData } from "../../utils/PresaleContext";
import IconETH from "../../assets/images/token/ETH.jpg";
import Icon1 from "../../assets/images/token/USDT.jpg";
import Icon2 from "../../assets/images/token/USDC.jpg";
import { useNavigate } from "react-router-dom";

const PayWith = ({ variant }) => {
  const {
    stageEnd,
    currentPrice,
    tokenSymbol,
    paymentAmount,
    presaleStatus,
    handlePaymentInput,
    handleBATTTokenInput,
    buyAmount,
    buyToken,
    buyTokenWithETH,
    setPaymentToken,
    USDTallowance,
    USDCallowance,
    approveUsdt,
    approveUsdc,
    paymentToken,
    amountUSDToPay,
    isApproved,
    pauseStatus,
  } = usePresaleData();

  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    navigate("/address");
  };
  return (
    <PayWithStyleWrapper variant={variant}>
      {variant === "v1" && (
        <div className="mb-20 text-center">
          <h4 className="ff-title fw-600 text-white text-uppercase">
            1 {tokenSymbol} = {currentPrice} USDT
          </h4>
        </div>
      )}

      <form action="/" method="post">
        <div className="presale-item mb-30">
          <div className="presale-item-inner">
            <label>Get Token ({tokenSymbol})</label>
            <input
              type="number"
              placeholder="0"
              value={isNaN(buyAmount) ? "0" : buyAmount}
              onChange={handleBATTTokenInput}
            />
          </div>
          <div className="presale-item-inner">
            <label>Pay token</label>
            <input
              type="number"
              placeholder="0"
              value={isNaN(paymentAmount) ? "0" : paymentAmount}
              onChange={handlePaymentInput}
            />
          </div>
        </div>
      </form>
      <div className="presale-item mb-30">
        <div className="presale-item-inner">
          <label>Choose Payment Token</label>
          <Dropdown
            options={[
              { value: "eth", label: "ETH", icon: IconETH },
              { value: "usdt", label: "USDT", icon: Icon1 },
              { value: "usdc", label: "USDC", icon: Icon2 },
            ]}
            onChange={(selectedOption) => {
              if (selectedOption.value === "usdt") {
                // Call function for USDT
                setPaymentToken("usdt");
              } else if (selectedOption.value === "usdc") {
                // Call function for USDC
                setPaymentToken("usdc");
              } else if (selectedOption.value === "eth") {
                // Call function for ETH
                setPaymentToken("eth");
              }
            }}
          />
        </div>
      </div>
      <div className="presale-item-msg">
        {presaleStatus && (
          <div className="presale-item-msg__content">
            <img src={StatusIcon} alt="icon" />
            <p>{presaleStatus}</p>
          </div>
        )}
      </div>
      {paymentToken === "eth" ? (
        <button
          className={`presale-item-btn ${
            Date.now() < stageEnd * 1000 || pauseStatus ? "disabled-style" : ""
          }`}
          onClick={buyTokenWithETH}
          disabled={Date.now() < stageEnd * 1000 || pauseStatus}
        >
          {Date.now() < stageEnd * 1000 || pauseStatus
            ? "Presale Paused"
            : "Buy Battery Coin"}
        </button>
      ) : parseFloat(paymentToken === "usdt" ? USDTallowance : USDCallowance) >=
        parseFloat(amountUSDToPay) ? (
        <button
          className={`presale-item-btn ${
            Date.now() < stageEnd * 1000 || pauseStatus ? "disabled-style" : ""
          }`}
          onClick={buyToken}
          disabled={Date.now() < stageEnd * 1000 || pauseStatus}
        >
          {Date.now() < stageEnd * 1000 || pauseStatus
            ? "Presale Paused"
            : "Buy Battery Coin"}
        </button>
      ) : !isApproved ? (
        <button
          className={`presale-item-btn ${
            Date.now() < stageEnd * 1000 || pauseStatus ? "disabled-style" : ""
          }`}
          onClick={paymentToken === "usdt" ? approveUsdt : approveUsdc}
          disabled={Date.now() < stageEnd * 1000 || pauseStatus}
        >
          {Date.now() < stageEnd * 1000 || pauseStatus
            ? "Presale Paused"
            : "Approve"}
        </button>
      ) : (
        <button
          className={`presale-item-btn ${
            Date.now() < stageEnd * 1000 || pauseStatus ? "disabled-style" : ""
          }`}
          onClick={buyToken}
          disabled={Date.now() < stageEnd * 1000 || pauseStatus}
        >
          {Date.now() < stageEnd * 1000 || pauseStatus
            ? "Presale Paused"
            : "Buy Battery Coin"}
        </button>
      )}
      {/* <button onClick={handleFormSubmit}>Register</button> */}
    </PayWithStyleWrapper>
  );
};

export default PayWith;
