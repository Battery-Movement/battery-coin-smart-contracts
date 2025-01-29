import React, { useEffect, useState } from "react";
import BannerWrapper from "./Banner.style";
import Countdown from "../../../components/countdown/Countdown";
import Progressbar from "../../../components/progressbar/Progressbar";
import PayWithPaypangea from "../../../components/payWith/PayWithPaypangea";
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

            <PayWithPaypangea />
          </div>
        </div>
      </div>
    </BannerWrapper>
  );
};

export default Banner;
