import React, { useEffect, useState } from "react";
import { PresaleContext } from "./PresaleContext";

import { useAccount, useBalance, useWaitForTransactionReceipt, useBlockNumber } from "wagmi";
import { getEthPrice, presale } from "../services/api";


import EthIcon from "../assets/images/token/eth.png";
import Notification from "../components/notification/Notification";
import PresaleContractAbi from "../contracts/BatteryCoinPresaleAbi.json";

const PresaleContextProvider = ({ children }) => {



  const [selectedImg, setSelectedImg] = useState(EthIcon);
  const { address: addressData, isConnected } = useAccount();

  const [currentStage, setCurrentStage] = useState(0);
  const [currentPrice, setCurrentPrice] = useState("");
  const [stageEnd, setStageEnd] = useState(1729066440);
  const [tokenName, setTokenName] = useState("Battery Coin TOKEN");
  const [tokenSymbol, setTokenSymbol] = useState("Batr Coin");
  const [presaleToken, setPresaleToken] = useState(0);
  const [tokenRemain, setTokenRemain] = useState(0);
  const [tokenPercent, setTokenPercent] = useState(0);
  const [paymentToken, setPaymentToken] = useState("eth");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [buyAmount, setBuyAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [isInit, setIsInit] = useState(false);
  const [hashValue, setHashValue] = useState(null);
  const [ethPrice, setETHPrice] = useState(0);
  const [userBalance, setUserBalance] = useState("0 ETH");
  const [isEnableBuy, setIsEnableBuy] = useState(true);

  // buy token notification
  const [isActiveNotification, setIsActiveNotification] = useState(false);
  const [notificationDone, setNotificationDone] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [presaleStatus, setPresaleStatus] = useState(null);
  const [txBlockNumber, setTxBlockNumber] = useState(null);
  const [pauseStatus, setPauseStatus] = useState(null);
  const [isPresaleInfoLoading, setIsPresaleInfoLoading] = useState(true);


  const { data: blockNumber } = useBlockNumber({
    watch: true,
  });







  useEffect(() => {
    makeEmptyInputs();

    if (paymentToken === "eth") {
      getEthPrice().then((value) => {
        if (value != null) {
          setETHPrice(value);
        } else {
          setETHPrice(0);
        }
      });
    }
  }, [paymentToken]);

  let balanceData;
  if (paymentToken === "usdt") {
    const { data } = useBalance({
      address: addressData,
      token: configModule.usdtAddress,
    });
    balanceData = data;
  } else if (paymentToken === "usdc") {
    const { data } = useBalance({
      address: addressData,
      token: configModule.usdcAddress,
    });
    balanceData = data;
  } else if (paymentToken === "eth") {
    const { data } = useBalance({
      address: addressData,
    });
    balanceData = data;
  }




  useEffect(() => {
    if (!isInit) {
      setIsInit(true);
    }
  }, [isInit]);

  useEffect(() => {
    if (balanceData) {
      let tmp = parseFloat(balanceData?.formatted).toFixed(4);
      setUserBalance(`${tmp} ${balanceData?.symbol}`);
    }
  }, [balanceData]);

  useEffect(() => {
    const fetchPresaleInfo = async () => {
      setIsPresaleInfoLoading(true);
      try {
        const { data } = await presale.getPresaleInfo();
        setCurrentStage(data.currentStage);
        setCurrentPrice(data.currentPrice);
        setStageEnd(data.stageEnd);
        setPresaleToken(data.presaleToken);
        setTokenRemain(data.tokenRemain);
        setTokenPercent(data.tokenPercent);
        setPauseStatus(data.isPaused);
      } catch (error) {
        console.error("Failed to fetch presale info", error);
        // Optionally set an error state here
      } finally {
        setIsPresaleInfoLoading(false);
      }
    };

    fetchPresaleInfo();
  }, []);



  const makeEmptyInputs = () => {
    setPaymentAmount(0);
    setBuyAmount(0);
    setTotalAmount(0);
  };



  const handlePaymentInput = (e) => {
    let _inputValue = e.target.value;
    let _calcValue = 0;

    if (paymentToken === "eth") {
      _calcValue = (_inputValue * ethPrice) / currentPrice;
    } else {
      _calcValue = _inputValue / currentPrice;
    }

    setPaymentAmount(_inputValue);
    setBuyAmount(_calcValue);
    setTotalAmount(_inputValue);
  };

  const handleBATRTokenInput = (e) => {
    let _inputValue = e.target.value;
    let _calcValue = 0;

    if (paymentToken === "eth") {
      _calcValue = (_inputValue * currentPrice) / ethPrice;
    } else {
      _calcValue = _inputValue * currentPrice;
    }

    setPaymentAmount(_calcValue);
    setBuyAmount(_inputValue);
    setTotalAmount(_calcValue);
  };

  const handlePaymentInputFiat = (e) => {
    let _inputValue = e.target.value;
    let _calcValue = 0;

    _calcValue = _inputValue / currentPrice;

    setPaymentAmount(_inputValue);
    setBuyAmount(_calcValue);
    setTotalAmount(_inputValue);
  };

  const handleBATRTokenInputFiat = (e) => {
    let _inputValue = e.target.value;
    let _calcValue = 0;

    _calcValue = _inputValue * currentPrice;

    setPaymentAmount(_calcValue);
    setBuyAmount(_inputValue);
    setTotalAmount(_calcValue);
  };

  const handleApprove = async () => {
    buyTokenLoadingMsg("Approving token... Please wait.");
    try {
      const { data } = await presale.approveToken({ 
        token: paymentToken, 
        amount: paymentAmount, 
        address: addressData 
      });
      setTransactionHash(data.hash);
      // The backend now handles the approval, we can assume it's approved on success
      setIsApproved(true);
      buyTokenSuccessMsg("Approval successful! You can now proceed with your purchase.");
    } catch (error) {
      console.error("Failed to approve token", error);
      setPresaleStatus(error.response?.data?.message || "Approval failed.");
      setIsActiveNotification(false);
    }
  };

  const handleBuyToken = async () => {
    buyTokenLoadingMsg("Processing transaction... Please wait.");
    try {
      const { data } = await presale.buyToken({ 
        token: paymentToken, 
        amount: paymentAmount, 
        address: addressData 
      });
      setTransactionHash(data.hash);
      buyTokenSuccessMsg();
      makeEmptyInputs();
    } catch (error) {
      console.error("Failed to buy token", error);
      setPresaleStatus(error.response?.data?.message || "Purchase failed.");
      setIsActiveNotification(false);
    }
  };

  const buyTokenLoadingMsg = (msg) => {
    setIsActiveNotification(true);
    setNotificationDone(false);
    setNotificationMsg(msg);
  };

  const buyTokenSuccessMsg = () => {
    setNotificationDone(true);
    setNotificationMsg("Transaction successful!");

    setTimeout(() => {
      setIsActiveNotification(false);
    }, 3000);
  };

  return (
    <PresaleContext.Provider
      value={{
        selectedImg,
        setSelectedImg,

        currentStage: presaleInfo.currentStage,
        currentPrice: presaleInfo.currentPrice,
        stageEnd: presaleInfo.stageEnd,
        tokenSold: presaleInfo.tokenSold,
        tokenRemain: presaleInfo.tokenRemain,
        tokenPercent: presaleInfo.tokenPercent,

        paymentAmount,
        buyAmount,
        totalAmount,
        presaleStatus,
        setPresaleStatus,
        makeEmptyInputs,
        handlePaymentInput,
        handleBATRTokenInput,
        handlePaymentInputFiat,
        handleBATRTokenInputFiat,
        handleApprove,
        handleBuyToken,
        hashValue,
        pauseStatus,
        isEnableBuy,
        setIsEnableBuy
      }}
    >
      {isActiveNotification && (
        <Notification done={notificationDone} msg={notificationMsg} />
      )}
      {children}
    </PresaleContext.Provider>
  );
};

export default PresaleContextProvider;
