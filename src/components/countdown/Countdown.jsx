import { useEffect } from "react";
import { useState } from "react";
import CountdownWrapper from "./Countdown.style";
import BannerData from "../../assets/data/bannerV3";

const Countdown = ({ pauseStatus, endDate, round, ...props }) => {
  const [remainingTime, setRemainingTime] = useState({
    seconds: "00",
    minutes: "00",
    hours: "00",
    days: "00",
  });
  const [isTimeEnded, setIsTimeEnded] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = endDate * 1000 - now;

      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(
            2,
            "0"
          ),
          hours: String(
            Math.floor((difference / (1000 * 60 * 60)) % 24)
          ).padStart(2, "0"),
          minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(
            2,
            "0"
          ),
          seconds: String(Math.floor((difference / 1000) % 60)).padStart(
            2,
            "0"
          ),
        };
      } else {
        timeLeft = null;
        setIsTimeEnded(true);
      }

      return timeLeft;
    };

    setRemainingTime(calculateTimeLeft());

    const timer = setInterval(() => {
      setRemainingTime(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <CountdownWrapper {...props}>
      {isTimeEnded ? (
        <div className="count-item">
          <span className="count">
            {pauseStatus
              ? `Current Presale Round ${round + 1} paused`
              : `Current Presale Round ${round + 1} is running`}
          </span>
        </div>
      ) : (
        <>
          <div className="countdown-header">
            <h5 className="ff-outfit fw-600 text-white text-uppercase">
              {BannerData.presaleStatus}
            </h5>
          </div>
          <div className="countdown-timer">
            <div className="count-item">
              <span className="count">{remainingTime?.days}</span>
              <span className="label">d</span>
            </div>
            <div className="count-item">
              <span className="count">{remainingTime?.hours}</span>
              <span className="label">h</span>
            </div>
            <div className="count-item">
              <span className="count">{remainingTime?.minutes}</span>
              <span className="label">m</span>
            </div>
            <div className="count-item">
              <span className="count">{remainingTime?.seconds}</span>
              <span className="label">s</span>
            </div>
          </div>
        </>
      )}
    </CountdownWrapper>
  );
};

export default Countdown;
