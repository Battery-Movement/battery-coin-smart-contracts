import React, { useState } from "react";
import PayWithStyleWrapper from "./PayWith.style";
import StatusIcon from "../../assets/images/icons/status.png";
import StatusApproveIcon from "../../assets/images/icons/status_approve.png";
import Dropdown from "./Dropdown/Dropdown";
import { usePresaleData } from "../../contexts/PresaleContext";
import IconETH from "../../assets/images/token/ETH.jpg";
import Icon1 from "../../assets/images/token/USDT.jpg";
import Icon2 from "../../assets/images/token/USDC.jpg";

const PayWith = ({ variant, purchaseMethod }) => {
  const {
    stageEnd,
    currentPrice,
    tokenSymbol,
    paymentAmount,
    presaleStatus,
    handlePaymentInput,
    handleBATRTokenInput,
    handlePaymentInputFiat,
    handleBATRTokenInputFiat,
    buyAmount,



    setPaymentToken,


    paymentToken,

    pauseStatus,
    isEnableBuy,
  } = usePresaleData();

  const isPresalePaused = Date.now() < stageEnd * 1000 || pauseStatus;
  const buttonText = isPresalePaused ? "Presale Paused" : "Buy Battery Coin";


  return (
    <PayWithStyleWrapper variant={variant}>
      {variant === "v1" && (
        <div className="mb-20 text-center">
          <h4 className="ff-title fw-600 text-white text-uppercase">
            1 {tokenSymbol} = {currentPrice} USDT
          </h4>
        </div>
      )}

      {purchaseMethod == 1 ? (
        <>
          <div className="presale-item mb-30">
            <div className="presale-item-inner">
              <label>Choose Payment Token</label>
              <Dropdown
                options={[
                  { value: "eth", label: "ETH", icon: IconETH },
                  { value: "usdt", label: "USDT", icon: Icon1 },
                  { value: "usdc", label: "USDC", icon: Icon2 },
                ]}
                onChange={(selectedOption) =>
                  setPaymentToken(selectedOption.value)
                }
              />
            </div>
          </div>
          <form action="/" method="post">
            <div className="presale-item mb-30">
              <div className="presale-item-inner">
                <label>Get Token ({tokenSymbol})</label>
                <input
                  type="number"
                  placeholder="0"
                  value={isNaN(buyAmount) ? "0" : buyAmount}
                  onChange={handleBATRTokenInput}
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
          <div className="presale-item-msg">
            {presaleStatus && (
              <div className="presale-item-msg__content">
                <img src={StatusIcon} alt="icon" />
                <p>{presaleStatus}</p>
              </div>
            )}
            {isEnableBuy &&
              (paymentToken === "usdt" || paymentToken === "usdc") &&
              !isApproved && (
                <div className="presale-item-msg__approve">
                  <img src={StatusApproveIcon} alt="icon" />
                  <p>Please approve before purchase $BATR</p>
                </div>
              )}
          </div>
          {!isEnableBuy ? (
            <button className="presale-item-btn disabled-style" disabled>
              Processing...
            </button>
          ) : paymentToken === "eth" || isApproved ? (
            <button className="presale-item-btn" onClick={handleBuyToken}>
              {isPresalePaused ? "Presale Paused" : "Buy Now"}
            </button>
          ) : (
            <button className="presale-item-btn" onClick={handleApprove}>
              {isPresalePaused ? "Presale Paused" : "Approve"}
            </button>
          )}
        </>
      ) : (
        <>
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
          ) : purchaseMethod === 1 ? (
            renderButton(buyTokenWithETH, buttonText)
          ) : (
            renderButton(buyToken, buttonText)
          )}
        </>
      )}
    </PayWithStyleWrapper>
  );
};

export default PayWith;
