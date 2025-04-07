import React, { useEffect, useState } from "react";
import BannerWrapper from "./Banner.style";
import Countdown from "../../../components/countdown/Countdown";
import Progressbar from "../../../components/progressbar/Progressbar";
import PayWith from "../../../components/payWith/PayWith";
import BannerData from "../../../assets/data/bannerV3";
import { usePresaleData } from "../../../utils/PresaleContext";
import * as configModule1 from "../../../contracts/config";

const Banner = () => {
  const {
    currentStage,
    stageEnd,
    presaleToken,
    tokenRemain,
    tokenPercent,
    getHashValuesByAddress,
    pauseStatus,
    userBATRBalance,
    purchaseMethod,
  } = usePresaleData();

  const [configModule, setConfigModule] = useState(configModule1);

  return (
    <BannerWrapper>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="mb-40 text-center">
              <div className="mb-20 d-flex justify-content-center">
                <Countdown
                  endDate={stageEnd}
                  round={currentStage}
                  pauseStatus={pauseStatus}
                  font="title"
                />
              </div>
              {/* <h1 className="banner-title">
                {BannerData.title} <span>{BannerData.title2}</span>{" "}
                {BannerData.title3}
              </h1> */}
              <h5 className="ff-outfit text-white">{BannerData.subtitle}</h5>
              <h4>Your BATR balance : {userBATRBalance}</h4>
            </div>
          </div>
        </div>
        <div className="row">
          <div
            className={
              Array.isArray(getHashValuesByAddress)
                ? getHashValuesByAddress.length > 0
                  ? "col-lg-8"
                  : "col-lg-12"
                : ""
            }
          >
            <div className="mb-20 d-flex align-items-center justify-content-between gap-1 flex-wrap">
              <h5 className="ff-outfit fs-15 fw-600 text-white text-uppercase">
                Stage {currentStage + 1}
              </h5>
              <h5 className="ff-outfit fs-15 fw-600 text-white text-uppercase">
                {tokenRemain} / {presaleToken}
              </h5>
            </div>

            <div className="mb-50">
              <Progressbar done={tokenPercent} variant="dashed3" />
            </div>

            <PayWith variant="v1" purchaseMethod={purchaseMethod} />
          </div>
          {purchaseMethod == 1 &&
            (Array.isArray(getHashValuesByAddress) ? (
              <div className="col-lg-4">
                <div
                  className="row justify-content-center"
                  style={{ maxHeight: "508px", overflowY: "auto" }}
                >
                  {getHashValuesByAddress.map((item, index) => {
                    const isUSDT =
                      item.tokenSymbol === configModule.usdtAddress;
                    const isUSDC =
                      item.tokenSymbol === configModule.usdcAddress;
                    const tokenImage = isUSDT
                      ? "https://cryptologos.cc/logos/tether-usdt-logo.png"
                      : isUSDC
                      ? "https://cryptologos.cc/logos/usd-coin-usdc-logo.png"
                      : "https://cryptologos.cc/logos/ethereum-eth-logo.png";
                    const tokenAlt = isUSDT
                      ? "USDT Icon"
                      : isUSDC
                      ? "USDC Icon"
                      : "ETH Icon";
                    const tokenDecimal = isUSDT
                      ? configModule.usdtDecimal
                      : isUSDC
                      ? configModule.usdcDecimal
                      : configModule.ethDecimal;
                    const tokenCurrency = isUSDT
                      ? "USDT"
                      : isUSDC
                      ? "USDC"
                      : "ETH";

                    return (
                      <div key={index} className="col-md-12">
                        <div
                          className="token-details mb-3"
                          style={{
                            border: "1px solid #444",
                            borderRadius: "12px",
                            padding: "15px",
                            backgroundColor: "#00000099",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.7)",
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <img
                              src={tokenImage}
                              alt={tokenAlt}
                              className="token-icon me-3"
                              style={{ width: "40px", height: "40px" }}
                            />
                            <div
                              className="token-info"
                              style={{ color: "#ffffff" }}
                            >
                              <p className="mb-1">
                                <strong>Reserve Date:</strong>{" "}
                                {new Date(
                                  Number(item.reserveDate) * 1000
                                ).toLocaleString(undefined, {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </p>
                              <p className="mb-1">
                                <strong>Round Number:</strong>{" "}
                                {parseFloat(item.roundNo) + 1}
                              </p>
                              <p className="mb-1">
                                <strong>BATR Token Price:</strong> $
                                {parseFloat(item.tokenPrice) / 100}
                              </p>
                              <p className="mb-1">
                                <strong>Total BATR Amount:</strong>{" "}
                                {parseFloat(item.totalBATRAmount) /
                                  Math.pow(10, configModule.battDecimal)}
                              </p>
                              {/* <p className="mb-1">
                              <strong>Remain BATR Amount:</strong>{" "}
                              {parseFloat(item.releasedBATRAmount) /
                                Math.pow(10, configModule.battDecimal)}
                            </p> */}
                              <p className="mb-0">
                                <strong>Total Paid Amount:</strong>{" "}
                                {parseFloat(item.totalPaidAmount) /
                                  Math.pow(10, tokenDecimal)}{" "}
                                {tokenCurrency}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <></>
            ))}
        </div>
      </div>
    </BannerWrapper>
  );
};

export default Banner;
