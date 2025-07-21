import React, { useEffect, useState } from "react";
import BannerWrapper from "./Banner.style";
import Countdown from "../../../components/countdown/Countdown";
import Progressbar from "../../../components/progressbar/Progressbar";
import PayWith from "../../../components/payWith/PayWith";
import BannerData from "../../../assets/data/bannerV3";

import { useAccount, useBalance } from 'wagmi';
import { usePresaleData } from "../../../contexts/PresaleContext";
import { payment } from '../../../services/api';


const Banner = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const { address } = useAccount();


  useEffect(() => {
    const fetchHistory = async () => {
      if (address) {
        setIsLoadingHistory(true);
        try {
          const history = await payment.getPurchaseHistory(address);
          setPurchaseHistory(history);
        } catch (error) {
          console.error("Failed to fetch purchase history", error);
          setPurchaseHistory([]); // Clear history on error
        }
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [address]);
  const {
    currentStage,
    stageEnd,
    presaleToken,
    tokenRemain,
    tokenPercent,

    pauseStatus,

    purchaseMethod,
  } = usePresaleData();



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

            </div>
          </div>
        </div>
        <div className="row">
          <div
            className={
              isLoadingHistory ? "Loading..." : (purchaseHistory.length > 0 ? "Connected" : "Connect")
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
          {purchaseMethod == 1 && (
            isLoadingHistory ? (
              <p>Loading purchase history...</p>
            ) : purchaseHistory.length > 0 ? (
              <div className="col-lg-4">
                <div
                  className="row justify-content-center"
                  style={{ maxHeight: "508px", overflowY: "auto" }}
                >
                  {purchaseHistory.map((item, index) => {
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
              <div className="col-lg-4"><p>No purchase history found.</p></div>
            )
          )}
        </div>
      </div>
    </BannerWrapper>
  );
};

export default Banner;
