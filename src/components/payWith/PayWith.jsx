import React, { useState } from "react";
import PayWithStyleWrapper from "./PayWith.style";
import StatusIcon from "../../assets/images/icons/status.png";
import StatusApproveIcon from "../../assets/images/icons/status_approve.png";
import Dropdown from "./Dropdown/Dropdown";
import { usePresaleData } from "../../utils/PresaleContext";
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
    buyToken,
    buyTokenWithETH,
    buyTokenWithPaypangea,
    buyTokenWithCoinbase,
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

  const renderButton = (onClick, text) => {
    return (
      <button
        className={`presale-item-btn ${
          isPresalePaused ? "disabled-style" : ""
        }`}
        onClick={onClick}
        disabled={isPresalePaused}
      >
        {text}
      </button>
    );
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
              ((paymentToken === "usdt" &&
                parseFloat(USDTallowance) < parseFloat(amountUSDToPay)) ||
                (paymentToken === "usdc" &&
                  parseFloat(USDCallowance) < parseFloat(amountUSDToPay))) && (
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
          ) : paymentToken === "eth" ? (
            renderButton(buyTokenWithETH, buttonText)
          ) : paymentToken === "usdt" ? (
            parseFloat(USDTallowance) >= parseFloat(amountUSDToPay) ? (
              renderButton(buyToken, buttonText)
            ) : (
              renderButton(
                approveUsdt,
                isPresalePaused ? "Presale Paused" : "Approve"
              )
            )
          ) : parseFloat(USDCallowance) >= parseFloat(amountUSDToPay) ? (
            renderButton(buyToken, buttonText)
          ) : (
            renderButton(
              approveUsdc,
              isPresalePaused ? "Presale Paused" : "Approve"
            )
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
          ) : purchaseMethod == 2 ? (
            renderButton(buyTokenWithPaypangea, buttonText)
          ) : (
            renderButton(buyTokenWithCoinbase, buttonText)
          )}
        </>
      )}
    </PayWithStyleWrapper>
  );
};

export default PayWith;
