import React, { useEffect, useState } from "react";
import { PresaleContext } from "./PresaleContext";
import * as configModule1 from "../contracts/config";
import {
  useAccount,
  useBalance,
  useReadContract,
  useWriteContract,
  useBlockNumber,
} from "wagmi";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import EthIcon from "../assets/images/token/eth.png";
import Notification from "../components/notification/Notification";
import PresaleContractAbi from "../contracts/BatteryCoinPresaleAbi.json";

const PresaleContextProvider = ({ children }) => {
  const BLOCK_INDEXING_COUNT = 3;

  const [configModule, setConfigModule] = useState(configModule1);
  const [selectedImg, setSelectedImg] = useState(EthIcon);
  const { address: addressData, isConnected } = useAccount();

  const [userBalance, setUserBalance] = useState("0");
  const [userBATRBalance, setUserBATRBalance] = useState("0.00");
  const [userWalletAddress, setUserWalletAddress] = useState("");
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
  const [isPayPangea, setIsPayPangea] = useState(false);

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

  const { data: userWalletData, error: balanceError } = useBalance({
    address: userWalletAddress,
    token: configModule.batrAddress,
    enabled: userWalletAddress !== "",
  });

  useEffect(() => {
    if (userWalletData) {
      let tmp = parseFloat(userWalletData?.formatted).toFixed(2);
      setUserBATRBalance(`${tmp} ${userWalletData?.symbol}`);
    }

    if (balanceError) {
      console.error("Error fetching user balance:", balanceError);
    }
  }, [userWalletData, balanceError, userWalletAddress]);

  // TODO: get user email address from user ID
  const getEmailAddressFromUserID = () => {
    const url = new URL(window.location.href);
    const userID = url.searchParams.get("userID");
    console.log({ userID });
    let email = "victorcastro9218@gmail.com";
    // let email = "";
    // fetch(
    //   "https://store.batterycoin.org/wp-json/userlookup/v1/email/" + userID,
    //   {
    //     method: "GET",
    //     headers: {
    //       "X-Secret-Key": configModule.secretKey,
    //     },
    //   }
    // )
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     if (data.email) {
    //       console.log("Email found:", data.email);
    //       email = data.mail;
    //     } else {
    //       console.log("Error:", data.message || "No email found");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(
    //       "There has been a problem with your fetch operation:",
    //       error
    //     );
    //   });

    return email;
  };

  useEffect(() => {
    if (isPayPangea) {
      let email = getEmailAddressFromUserID();
      if (email !== "") {
        getPayPangeaWalletAddress(email);
      }
    } else {
      if (isConnected) {
        setUserWalletAddress(addressData);
      } else {
        setUserWalletAddress("");
      }
    }
  }, [isPayPangea, isConnected]);

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
      let tmp = parseFloat(balanceData?.formatted).toFixed(4);
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

  //handle payment input
  const handlePaymentInputFiat = (e) => {
    let _inputValue = e.target.value;
    let _calcValue = 0;

    _calcValue = _inputValue / currentPrice;

    setPaymentAmount(_inputValue);
    setBuyAmount(_calcValue);
    setTotalAmount(_inputValue);

    if (_inputValue == "") {
      setPresaleStatus(null);
      setTotalAmount(0);
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
  const handleBATRTokenInputFiat = (e) => {
    let _inputValue = e.target.value;
    let _calcValue = 0;

    _calcValue = _inputValue * currentPrice;

    setPaymentAmount(_calcValue);
    setBuyAmount(_inputValue);
    setTotalAmount(_calcValue);

    if (_inputValue == "") {
      setPresaleStatus(null);
      setTotalAmount(0);
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
    if (paymentAmount != "") {
      try {
        // Load and initialize PayPangea
        const PayPangea = await loadPayPangea();

        // Initialize PayPangea with your merchant key
        const payPangeaInstance = new PayPangea({
          apiKey: "18215897-KlurDUUP-J1PdOyMJ-BgByRRtD",
          // apiKey: "96639389-wsyCjEq2-RCJj0XrT-PmxrChvt",
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

        // for TEST
        payPangeaInstance.initContractCallFIAT({
          amount: 0, // The payment amount
          token: "USDC",
          currency: "USD", // Replace with your preferred currency
          contractaddress: configModule.presaleContractAddress,
          chain: "sepolia",
          contractfunction: "reserve",
          contractabi: JSON.stringify([
            {
              inputs: [
                { internalType: "uint256", name: "_amount", type: "uint256" },
                { internalType: "address", name: "_token", type: "address" },
              ],
              name: "reserve",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ]),
          contractargs: JSON.stringify([
            (buyAmount * 10 ** 18).toString(),
            configModule.usdcAddress,
          ]),
          text: `Purchase ${buyAmount} BATR tokens`,
          emailonly: true,
          topup_external: false,
          fixed_chain: true,
          amountcurrency: paymentAmount,
          needs_spending_approval: true,
          spending_approval_address: configModule.usdcAddress,
          spending_approval_amount: (paymentAmount * 10 ** 6).toString(),
          contracttokenaddress: configModule.batrAddress,
        });

      //   payPangeaInstance.initContractCallFIAT({
      //     amount: 0, // The payment amount, 0 if function is nonpayable
      //     token: "USDC",
      //     // currency: "USD", // Replace with your preferred currency
      //     contractaddress: "0x95c53A43AD220ADd8882B9197DE99a4732050f18",
      //     chain: "sepolia",
      //     contractfunction: "reserve",
      //     contractabi: JSON.stringify([
      //       {
      //         inputs: [
      //           { internalType: "uint256", name: "_amount", type: "uint256" },
      //           { internalType: "address", name: "_token", type: "address" },
      //         ],
      //         name: "reserve",
      //         outputs: [],
      //         stateMutability: "nonpayable",
      //         type: "function",
      //       },
      //     ]),
      //     contractargs: JSON.stringify([
      //       (buyAmount * 10 ** 18).toString(),
      //       "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
      //     ]),
      //     text: `Purchase ${buyAmount} BATR tokens`,
      //     emailonly: true,
      //     topup_external: false,
      //     fixed_chain: true,
      //     needs_spending_approval: true,
      //     spending_approval_address:
      //       "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8",
      //     spending_approval_amount: (paymentAmount * 10 ** 6).toString(),
      //     amountcurrency: paymentAmount,
      //     currency: "USD",
      //     contracttokenaddress: "0xE1b6d67dBd4Cfe38C71DC05edBE664Fd51D0bec2",
      //   });
      // } catch (error) {
      //   console.error(error);
      //   console.error("Error during payment with PayPangea:", error);
      //   alert(
      //     "An error occurred while processing your payment. Please try again."
      //   );
      // }
    } else {
      setHashValue(null);
      setPresaleStatus("Please enter pay amount!");
    }
  };

  const getPayPangeaWalletAddress = (email) => {
    const data = {
      email: email,
    };
    fetch("https://api.paypangea.com/v1/auth/request-wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 18215897-KlurDUUP-J1PdOyMJ-BgByRRtD",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit reservation data");
        }
        return response.json();
      })
      .then((result) => {
        if (result && result["wallet"]) {
          setUserWalletAddress(result["wallet"]);
        }
      })
      .catch((error) => {
        console.error("Error submitting reservation data:", error);
      });
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
        handlePaymentInputFiat,
        handleBATRTokenInputFiat,
        buyToken,
        buyTokenWithETH,
        buyTokenData,
        buyTokenWithPaypangea,
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
        userBATRBalance,
        isPayPangea,
        setIsPayPangea,
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
