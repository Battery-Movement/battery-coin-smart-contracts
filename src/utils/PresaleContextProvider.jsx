import React, { useEffect, useState } from "react";
import { PresaleContext } from "./PresaleContext";
import * as configModule1 from "../contracts/config";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBlockNumber,
} from "wagmi";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import EthIcon from "../assets/images/token/eth.png";
import Notification from "../components/notification/Notification";

const PresaleContextProvider = ({ children }) => {
  const BLOCK_INDEXING_COUNT = 3;

  const [configModule, setConfigModule] = useState(configModule1);
  const [selectedImg, setSelectedImg] = useState(EthIcon);
  const { address: addressData, isConnected } = useAccount();

  const [userBalance, setUserBalance] = useState("0");
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

  // buy token notification
  const [isActiveNotification, setIsActiveNotification] = useState(false);
  const [notificationDone, setNotificationDone] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [presaleStatus, setPresaleStatus] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);
  const [txBlockNumber, setTxBlockNumber] = useState(null);
  const [isEnableBuy, setIsEnableBuy] = useState(true);

  const {
    data: buyTokenData,
    writeContract,
    isPending: buyTokenIsLoading,
    isSuccess: buyTokenIsSuccess,
    error: buyTokenError,
  } = useWriteContract();

  // const {
  //   isLoading: isConfirming,
  //   isSuccess: isConfirmed,
  //   isError,
  //   error,
  //   data: dataConfirmed,
  //   refetch: waitingTransactionReceipt,
  // } = useWaitForTransactionReceipt({
  //   hash: transactionHash,
  // });

  const { data: blockNumber } = useBlockNumber({
    watch: true,
  });

  const { data: presaleTokenAmountData } = useReadContract({
    ...configModule.presaleTokenAmountCall,
  });

  const { data: pauseStatus } = useReadContract({
    ...configModule.pauseStatus,
  });

  const { data: getHashValuesByAddress } = useReadContract({
    ...configModule.getHashValuesByAddress,
    args: [addressData],
  });

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

  const { data: userLastHashValueData, refetch: refetchLastHashValue } =
    useReadContract({
      ...configModule.lastHashValue,
      args: [addressData],
    });

  const { data: presaleInfoData, refetch: refetchPresaleInfo } =
    useReadContract({
      ...configModule.presaleInfo,
      args: [userLastHashValueData],
    });

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
    if (
      txBlockNumber !== null &&
      BigInt(txBlockNumber) + BigInt(BLOCK_INDEXING_COUNT) < BigInt(blockNumber)
    ) {
      // console.log({ txBlockNumber });
      // console.log({ blockNumber });
      setTxBlockNumber(null);
      if (isApproved) {
        buyTokenSuccessMsg();
        setIsApproved(false);

        if (paymentToken === "usdt") {
          refetchUSDTAllowance();
        }
        if (paymentToken === "usdc") {
          refetchUSDCallowance();
        }
      } else {
        fetchPresaleInfo();
      }
    }
  }, [blockNumber]);

  // TODO: fix in the future
  // useEffect(() => {
  //   if (transactionHash) {
  //     waitingTransactionReceipt();
  //   }
  // }, [transactionHash]);

  // useEffect(() => {
  //   if (isError) {
  //     console.error("Transaction failed:", error);
  //     if (error) {
  //       console.error("Error message:", error.message);
  //       console.error("Error stack:", error.stack);
  //     }
  //   }

  //   if (isConfirmed) {
  //     if (dataConfirmed && dataConfirmed["status"] === "success") {
  //       setTxBlockNumber(dataConfirmed.blockNumber);
  //     }
  //   }
  // }, [isConfirmed, isConfirming, dataConfirmed, isError, error]);

  useEffect(() => {
    if (!isInit) {
      refetchUSDTAllowance();
      refetchUSDCallowance();

      setIsInit(true);
    }
  }, [isInit]);

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

  useEffect(() => {
    if (buyTokenIsLoading) {
      buyTokenLoadingMsg("Processing transaction... Please wait one minute.");
    }

    if (buyTokenError) {
      setIsEnableBuy(true);
      setIsActiveNotification(false);
      setHashValue(null);
      setPresaleStatus(buyTokenError?.shortMessage);
    }

    if (buyTokenIsSuccess) {
      setTxBlockNumber(blockNumber);
      // handleTransaction(buyTokenData);
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
        ) - Math.round(presaleToken * 0.143)
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

  const makeEmptyInputs = () => {
    setPaymentAmount(0);
    setBuyAmount(0);
    setTotalAmount(0);
  };

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
        return data["USD"];
      } else {
        console.error("Failed to fetch ETH price:", data.error);
        return null;
      }
    } catch (error) {
      console.error("Error fetching ETH price:", error);
      return null;
    }
  };

  const fetchPresaleInfo = async () => {
    try {
      refetchLastHashValue();
      // console.log({ userLastHashValueData });
      refetchPresaleInfo();
      submitReservationData(presaleInfoData);
    } catch (error) {
      console.error("Error fetching block number:", error);
    }
  };

  const submitReservationData = (presaleInfoData) => {
    const url = new URL(window.location.href);
    const reservationData = {
      user_id: url.searchParams.get("userID"),
      round_id: presaleInfoData.roundNo?.toString() || null,
      reserve_type: "crypto",
      wallet_address: presaleInfoData.userAddress || null,
      blockchain_net: "Ethereum", // Assuming Ethereum as the blockchain network
      asset_type: presaleInfoData.tokenSymbol || null,
      hash_value: presaleInfoData.hashValue || null,
      total_batt_amount: presaleInfoData.totalBATRAmount?.toString() || null,
      total_paid_amount: presaleInfoData.totalPaidAmount?.toString() || null,
      is_released: presaleInfoData.isReleased || false,
      is_refunded: presaleInfoData.isRefunded || false,
    };

    fetch("https://api2.batterycoin.org/api/accounts/reserve/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservationData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit reservation data");
        }
        return response.json();
      })
      .then((result) => {
        buyTokenSuccessMsg();
        makeEmptyInputs();
      })
      .catch((error) => {
        console.error("Error submitting reservation data:", error);
      });
  };

  // const handleTransaction = (newHash) => {
  //   setTransactionHash(newHash);
  // };

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

  const approveUsdt = () => {
    setIsEnableBuy(false);
    setIsApproved(true);
    writeContract({
      ...configModule.USDTTokenApprove,
      args: [
        configModule.presaleContractConfig.address,
        amountUSDToPay.toString(),
      ],
    });
  };

  const approveUsdc = () => {
    setIsEnableBuy(false);
    setIsApproved(true);
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
      setIsEnableBuy(false);
      const tokenAddress =
        paymentToken === "usdt"
          ? configModule.usdtAddress
          : configModule.usdcAddress;

      setPresaleStatus(null);

      const value = Number(
        new BigNumber(buyAmount * Math.pow(10, configModule.battDecimal))
      ).toLocaleString("en-US", {
        style: "decimal",
        useGrouping: false, //Flip to true if you want to include commas
      });

      writeContract({
        ...configModule.buyTokenCall,
        args: [value, tokenAddress],
      });
    } else {
      setHashValue(null);
      setPresaleStatus("Please enter pay amount!");
    }
  };

  const buyTokenWithETH = async () => {
    if (paymentAmount != "") {
      setPresaleStatus(null);
      try {
        setIsEnableBuy(false);
        const formattedPaymentAmount = ethers.parseEther(
          parseFloat(paymentAmount).toFixed(18)
        );
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
          value: formattedPaymentAmount,
        });
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
    setIsEnableBuy(true);
    setTimeout(() => {
      setIsActiveNotification(false);
      setNotificationDone(false);
    }, 3000);
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
        handleBATRTokenInput,
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
        hashValue,
        getHashValuesByAddress,
        pauseStatus,
        isEnableBuy,
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
