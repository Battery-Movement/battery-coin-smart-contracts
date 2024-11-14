import React, { useEffect, useState } from "react";
import { PresaleContext } from "./PresaleContext";
import * as configModule1 from "../contracts/config";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import EthIcon from "../assets/images/token/eth.png";
import Notification from "../components/notification/Notification";

const PresaleContextProvider = ({ children }) => {
  const [configModule, setConfigModule] = useState(configModule1);
  const [selectedImg, setSelectedImg] = useState(EthIcon);

  const { address: addressData, isConnected } = useAccount();

  const [userBalance, setUserBalance] = useState("0");

  const [currentStage, setCurrentStage] = useState(0);
  const [currentPrice, setCurrentPrice] = useState("");
  const [stageEnd, setStageEnd] = useState(1729066440);
  const [tokenName, setTokenName] = useState("Battery Coin TOKEN");
  const [tokenSymbol, setTokenSymbol] = useState("Batt Coin");
  const [presaleToken, setPresaleToken] = useState(0);
  const [tokenRemain, setTokenRemain] = useState(0);
  const [tokenPercent, setTokenPercent] = useState(0);
  const [paymentToken, setPaymentToken] = useState("eth");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [buyAmount, setBuyAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [hashValue, setHashValue] = useState(null);
  const [ethPrice, setETHPrice] = useState(0);

  // buy token notification
  const [isActiveNotification, setIsActiveNotification] = useState(false);
  const [notificationDone, setNotificationDone] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  const [presaleStatus, setPresaleStatus] = useState(null);

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

  const { data: presaleTokenAmountData } = useReadContract({
    ...configModule.presaleTokenAmountCall,
  });

  const { data: pauseStatus } = useReadContract({
    ...configModule.pauseStatus,
  });

  const { data: userLastHashValue } = useReadContract({
    ...configModule.lastHashValue,
    args: [addressData],
  });

  const { data: getHashValuesByAddress } = useReadContract({
    ...configModule.getHashValuesByAddress,
    args: [addressData],
  });

  const {
    data: buyTokenData,
    writeContract,
    isPending: buyTokenIsLoading,
    isSuccess: buyTokenIsSuccess,
    error: buyTokenError,
  } = useWriteContract();

  const makeEmptyInputs = () => {
    setPaymentAmount(0);
    setBuyAmount(0);
    setTotalAmount(0);
  };

  useEffect(() => {
    if (isApproved) {
      refetchUSDTAllowance();
      refetchUSDCallowance();
    }
  }, [isApproved]);

  useEffect(() => {
    if (paymentToken === "eth") {
      const value = getEthPrice();
      if (value != null) {
        setETHPrice(value);
      } else {
        setETHPrice(0);
      }
    }
  }, [paymentToken]);

  useEffect(() => {
    if (buyTokenIsLoading) {
      buyTokenLoadingMsg("Transaction Processing. Click “Confirm”.");
    }

    if (buyTokenError) {
      setIsActiveNotification(false);
      setHashValue(null);
      setPresaleStatus(buyTokenError?.shortMessage);
    }

    if (buyTokenIsSuccess) {
      buyTokenSuccessMsg();
      const timeoutId = setTimeout(() => {
        window.location.reload();
      }, 10000);
      return () => clearTimeout(timeoutId);
    }
  }, [
    isActiveNotification,
    notificationDone,
    notificationMsg,
    buyTokenData,
    buyTokenIsLoading,
    buyTokenError,
    buyTokenIsSuccess,
  ]);

  useEffect(() => {
    if (balanceData) {
      let tmp = parseFloat(balanceData?.formatted).toFixed(2);
      setUserBalance(`${tmp} ${balanceData?.symbol}`);
    }

    if (presaleTokenAmountData) {
      const roundedPrice =
        (
          Math.round(parseFloat(presaleTokenAmountData.roundPrice) / 0.25) *
          0.25
        ).toFixed(2) / 100;

      const stage = parseFloat(presaleTokenAmountData.roundNo);
      setCurrentPrice(roundedPrice.toString());
      setCurrentStage(stage);
      setPresaleToken(
        Math.round(
          new BigNumber(presaleTokenAmountData.totalTokenAmount) /
            Math.pow(10, configModule.battDecimal)
        )
      );
      setTokenRemain(
        Math.round(
          new BigNumber(presaleTokenAmountData.remainAmount) /
            Math.pow(10, configModule.battDecimal)
        )
      );
      setTotalAmount(presaleToken);
      setStageEnd(parseFloat(presaleTokenAmountData.startDate));
    }

    let _tokenPercent = parseInt(
      ((presaleToken - tokenRemain) * 100) / presaleToken
    );
    setTokenPercent(_tokenPercent);

    if (_tokenPercent > 100) {
      setTokenPercent(100);
    }
  }, [
    configModule,
    presaleTokenAmountData,
    tokenRemain,
    presaleToken,
    paymentToken,
    balanceData,
  ]);

  const getEthPrice = async () => {
    try {
      const response = await fetch(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (data && data["USD"]) {
        setETHPrice(data["USD"]);
      } else {
        console.error("Failed to fetch ETH price:", data.error);
      }
    } catch (error) {
      console.error("Error fetching ETH price:", error);
    }
  };

  //handle payment input
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

    if (_inputValue == "") {
      setPresaleStatus(null);

      setTotalAmount(0);
    } else if (parseFloat(userBalance) < parseFloat(_inputValue)) {
      setHashValue(null);
      setPresaleStatus("Insufficient funds in your wallet");
    } else {
      if (_inputValue > 0) {
        setPresaleStatus(null);
      } else {
        setHashValue(null);
        setPresaleStatus("Please buy at least 1 token!");

        setTotalAmount(0);
      }
    }
  };

  //handle payment input
  const handleBATTTokenInput = (e) => {
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

    if (_inputValue == "") {
      setPresaleStatus(null);

      setTotalAmount(0);
    } else if (parseFloat(userBalance) < parseFloat(_calcValue)) {
      setHashValue(null);
      setPresaleStatus("Insufficient funds in your wallet");
    } else {
      if (_inputValue > 0) {
        setPresaleStatus(null);
      } else {
        setHashValue(null);
        setPresaleStatus("Please buy at least 1 token!");

        setTotalAmount(0);
      }
    }
  };

  // buy token
  const amountUSDToPay = new BigNumber(
    paymentAmount * 10 ** configModule.usdtDecimal
  ).toString();

  const { data: USDTallowance, refetch: refetchUSDTAllowance } =
    useReadContract({
      ...configModule.USDTTokenAllowance,
      args: [addressData, configModule.presaleContractConfig.address],
    });

  const { data: USDCallowance, refetch: refetchUSDCallowance } =
    useReadContract({
      ...configModule.USDCTokenAllowance,
      args: [addressData, configModule.presaleContractConfig.address],
    });

  const approveUsdt = () => {
    writeContract({
      ...configModule.USDTTokenApprove,
      args: [
        configModule.presaleContractConfig.address,
        amountUSDToPay.toString(),
      ],
    });
  };

  const approveUsdc = () => {
    writeContract({
      ...configModule.USDCTokenApprove,
      args: [
        configModule.presaleContractConfig.address,
        amountUSDToPay.toString(),
      ],
    });
  };

  const buyToken = async () => {
    if (paymentAmount != "") {
      const tokenAddress =
        paymentToken === "usdt"
          ? configModule.usdtAddress
          : configModule.usdcAddress;

      setPresaleStatus(null);
      writeContract({
        ...configModule.buyTokenCall,
        args: [
          Number(
            new BigNumber(buyAmount * Math.pow(10, configModule.battDecimal))
          ).toLocaleString("en-US", {
            style: "decimal",
            useGrouping: false, //Flip to true if you want to include commas
          }),
          tokenAddress,
        ],
      });

      makeEmptyInputs();
    } else {
      setHashValue(null);
      setPresaleStatus("Please enter pay amount!");
    }
  };

  const buyTokenWithETH = async () => {
    if (paymentAmount != "") {
      setPresaleStatus(null);
      try {
        writeContract({
          ...configModule.buyTokenWithETHCall,
          args: [
            Number(
              new BigNumber(buyAmount * Math.pow(10, configModule.battDecimal))
            ).toLocaleString("en-US", {
              style: "decimal",
              useGrouping: false, //Flip to true if you want to include commas
            }),
          ],
          value: ethers.parseEther(paymentAmount.toString() || "0"),
        });

        makeEmptyInputs();
      } catch (error) {
        console.error("Error during transaction:", error);
        setPresaleStatus("Transaction failed. Please try again.");
        setHashValue(null);
        return;
      }
    } else {
      setHashValue(null);
      setPresaleStatus("Please enter pay amount!");
    }
  };

  const buyTokenLoadingMsg = (textMsg) => {
    setIsActiveNotification(true);
    setNotificationMsg(textMsg);
  };

  const buyTokenSuccessMsg = () => {
    setNotificationDone(true);
    setNotificationMsg("Your transaction has been successfully completed");
    setIsApproved(true);
  };

  return (
    <PresaleContext.Provider
      value={{
        configModule,
        selectedImg,
        setSelectedImg,
        userBalance,
        currentStage,
        currentPrice,
        stageEnd,
        tokenName,
        tokenSymbol,
        presaleToken,
        tokenRemain,
        tokenPercent,
        paymentAmount,
        buyAmount,
        totalAmount,
        presaleStatus,
        setPresaleStatus,
        makeEmptyInputs,
        handlePaymentInput,
        handleBATTTokenInput,
        buyToken,
        buyTokenWithETH,
        buyTokenData,
        buyTokenIsLoading,
        buyTokenIsSuccess,
        buyTokenError,
        setPaymentToken,
        paymentToken,
        USDCallowance,
        USDTallowance,
        approveUsdt,
        approveUsdc,
        amountUSDToPay,
        isApproved,
        hashValue,
        userLastHashValue,
        getHashValuesByAddress,
        pauseStatus,
      }}
    >
      {children}

      {/* notification modal */}
      {isActiveNotification && (
        <Notification
          notificationDone={notificationDone}
          textMessage={notificationMsg}
        />
      )}
    </PresaleContext.Provider>
  );
};

export default PresaleContextProvider;
