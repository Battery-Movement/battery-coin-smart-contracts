import PayWithStyleWrapper from "./PayWith.style";
import StatusIcon from "../../assets/images/icons/status.png";
import StatusApproveIcon from "../../assets/images/icons/status_approve.png";
import Dropdown from "./Dropdown/Dropdown";
import { usePresaleData } from "../../utils/PresaleContext";
import IconETH from "../../assets/images/token/ETH.jpg";
import Icon1 from "../../assets/images/token/USDT.jpg";
import Icon2 from "../../assets/images/token/USDC.jpg";

const PayWithPaypangea = ({ variant }) => {
  const {
    stageEnd,
    currentPrice,
    tokenSymbol,
    paymentAmount,
    presaleStatus,
    handlePaymentInputFiat,
    handleBATRTokenInputFiat,
    buyAmount,
    buyToken,
    setPaymentToken,
    USDTallowance,
    USDCallowance,
    approveUsdt,
    approveUsdc,
    paymentToken,
    amountUSDToPay,
    pauseStatus,
    isEnableBuy,
  } = usePresaleData();

  const isPresalePaused = Date.now() < stageEnd * 1000 || pauseStatus;
  const buttonText = isPresalePaused ? "Presale Paused" : "Buy Battery Coin";

  const loadPayPangea = async () => {
    return new Promise((resolve, reject) => {
      // Check if the PayPangea object is already available
      if (typeof PayPangea !== "undefined") {
        resolve(PayPangea);
        return;
      }

      // Dynamically load the script
      const script = document.createElement("script");
      script.id = "paypangea-sdk";
      script.src = "https://sdk.paypangea.com/sdk.js?ver=4"; // Load PayPangea SDK
      script.async = true;

      script.onload = () => {
        if (typeof PayPangea !== "undefined") {
          resolve(PayPangea);
        } else {
          reject(new Error("PayPangea SDK failed to initialize."));
        }
      };

      script.onerror = () =>
        reject(new Error("Failed to load PayPangea SDK script."));

      document.body.appendChild(script);
    });
  };

  const buyTokenWithPaypangea = async () => {
    try {
      // Load and initialize PayPangea
      const PayPangea = await loadPayPangea();

      // Initialize PayPangea with your merchant key
      const payPangeaInstance = new PayPangea({
        apiKey: "18215897-KlurDUUP-J1PdOyMJ-BgByRRtD",
        environment: "STAGING",
      });

      // Add event handlers
      payPangeaInstance.on("success", () => {
        console.log("Payment successful!");
      });

      payPangeaInstance.on("error", (error) => {
        console.error("Payment error:", error);
      });

      payPangeaInstance.on("cancel", () => {
        console.log("Payment cancelled.");
      });

      // Create a payment request
      payPangeaInstance.initContractCallFIAT({
        amount: paymentAmount, // The payment amount
        token: "USDC",
        currency: "USD", // Replace with your preferred currency
        contractaddress: "0x95c53A43AD220ADd8882B9197DE99a4732050f18",
        chain: "sepolia",
        contractfunction: "reserve",
        contractabi: JSON.stringify({
          inputs: [
            { internalType: "uint256", name: "_amount", type: "uint256" },
            { internalType: "address", name: "_token", type: "address" },
          ],
          name: "reserve",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        }),
        contractargs: JSON.stringify([
          paymentAmount,
          "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
        ]),
        text: `Purchase ${buyAmount} BATR tokens`,
      });
    } catch (error) {
      console.error(error);
      console.error("Error during payment with PayPangea:", error);
      alert(
        "An error occurred while processing your payment. Please try again."
      );
    }
  };

  const renderButton = (text) => (
    <button
      className={`presale-item-btn ${isPresalePaused ? "disabled-style" : ""}`}
      onClick={buyTokenWithPaypangea}
      disabled={isPresalePaused}
    >
      {text}
    </button>
  );

  return (
    <PayWithStyleWrapper variant={variant}>
      <div className="mb-20 text-center">
        <h4 className="ff-title fw-600 text-white text-uppercase">
          1 {tokenSymbol} = {currentPrice} USD
        </h4>
      </div>

      <form action="/" method="post">
        <div className="presale-item mb-30">
          <div className="presale-item-inner">
            <label>Get Token ({tokenSymbol})</label>
            <input
              type="number"
              placeholder="0"
              value={isNaN(buyAmount) ? "0" : buyAmount}
              onChange={handleBATRTokenInputFiat}
            />
          </div>
          <div className="presale-item-inner">
            <label>Pay USD</label>
            <input
              type="number"
              placeholder="0"
              value={isNaN(paymentAmount) ? "0" : paymentAmount}
              onChange={handlePaymentInputFiat}
            />
          </div>
        </div>
      </form>
      <div className="presale-item-msg">
        {presaleStatus && (
          <div className="presale-item-msg__content">
            <img src={StatusIcon} alt="icon" />
            <p>{presaleStatus}</p>
          </div>
        )}
      </div>
      {!isEnableBuy ? (
        <button className="presale-item-btn disabled-style" disabled>
          Processing...
        </button>
      ) : (
        renderButton(buttonText)
      )}
    </PayWithStyleWrapper>
  );
};

export default PayWithPaypangea;
