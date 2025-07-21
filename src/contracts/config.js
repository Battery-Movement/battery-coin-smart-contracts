// ---- For Mainnet ----
import PresaleContractAbi from "./BatteryCoinPresaleAbi.json";
import USDT_ABI from "./USDT_ABI.json";
import USDC_ABI from "./USDC_ABI.json";

// network link
// export const networkLink = "https://etherscan.io/tx";

// token presale contract address
export const presaleContractAddress =
  "0x03e830b71b728C12e066441b9d38efa610800BeF";

//contract chainid
const contractChainId = 1;

// TODO: USDT & USDC address on Ethereum network
export const usdtAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
export const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
export const batrAddress = "0x7ae1ced8fc0ef32828ee12522029b8f3f38b9b2c";

// // ---- FOR TEST ----
// import PresaleContractAbi from "./BatteryCoinPresaleAbi_test.json";
// import USDT_ABI from "../contracts/USDT_ABI_test.json";
// import USDC_ABI from "../contracts/USDC_ABI_test.json";

// //network link
// // export const networkLink = "https://sepolia.etherscan.io/tx";

// //token presale contract address
// export const presaleContractAddress =
//   "0x95c53A43AD220ADd8882B9197DE99a4732050f18";

// //contract chainid
// const contractChainId = 11155111;

// // TODO: USDT & USDC address on Sepolia network
// export const usdtAddress = "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0";
// export const usdcAddress = "0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8";
// export const batrAddress = "0xE1b6d67dBd4Cfe38C71DC05edBE664Fd51D0bec2";

export const usdtDecimal = 6;
export const usdcDecimal = 6;
export const ethDecimal = 18;
export const battDecimal = 18;

//payment with (eg. ETH, BNB, MATIC etc.)
export const payWith = "ETH";

export const secretKey = "BATT_HOME_API_KEY_0001";

export const coinbaseProductID = "ccf3cafe-8278-4877-8362-99fe0514fa8e";
export const coinbaseOAuthClientID = "82fd5491-58a6-4710-8af8-11ef3f4b6b76";
export const coinbaseSecretAPIKey = "9c0ac587-ebb2-4e8c-87c3-c04fae1e5ff3";
export const coinbaseClientAPIKey = "tv9PyA5xBolN18mxXXfMH1MUaVAPm8CY";



//token Presale contract configuration
export const presaleContractConfig = {
  address: presaleContractAddress,
  abi: PresaleContractAbi,
  chainId: contractChainId,
};

//presale token amount read
export const presaleTokenAmountCall = {
  ...presaleContractConfig,
  functionName: "getLatestRound",
  watch: true,
};

export const pauseStatus = {
  ...presaleContractConfig,
  functionName: "paused",
  watch: true,
};

export const lastHashValue = {
  ...presaleContractConfig,
  functionName: "getLastHashValueByAddress",
  watch: true,
};

export const presaleInfo = {
  ...presaleContractConfig,
  functionName: "getPresaleInfo",
  watch: true,
};

//token total sold read
export const totalSoldCall = {
  ...presaleContractConfig,
  functionName: "totalSold",
  watch: true,
};

//maximum stage read
export const maxStageCall = {
  ...presaleContractConfig,
  functionName: "maxStage",
  watch: true,
};

//current stage id read
export const currentStageIdCall = {
  ...presaleContractConfig,
  functionName: "getCurrentStageIdActive",
  watch: true,
};

//stage info read
export const currentStageInfoCall = {
  ...presaleContractConfig,
  functionName: "stages",
  watch: true,
};

//buy token write
export const buyTokenCall = {
  ...presaleContractConfig,
  functionName: "reserve",
  watch: true,
};

//buy token write
export const buyTokenWithETHCall = {
  ...presaleContractConfig,
  functionName: "reserveWithETH",
  watch: true,
};

//ETH to USD exchange rate
// export const GetUSDExchangeRate = async () => {
//   var requestOptions = { method: "GET", redirect: "follow" };
//   return fetch(
//     "https://api.coinbase.com/v2/exchange-rates?currency=ETH",
//     requestOptions
//   )
//     .then((response) => response.json())
//     .then((result) => {
//       return result.data.rates.USD;
//     })
//     .catch((error) => {
//       return "error", error;
//     });
// };

// token USDT contract configuration
export const USDTContractConfig = {
  address: usdtAddress,
  abi: USDT_ABI,
};

// USDT token allowance
export const USDTTokenAllowance = {
  ...USDTContractConfig,
  functionName: "allowance",
  watch: true,
};

// USDT token approve
export const USDTTokenApprove = {
  ...USDTContractConfig,
  functionName: "approve",
  watch: true,
};

// token USDC contract configuration
export const USDCContractConfig = {
  address: usdcAddress,
  abi: USDC_ABI,
};

// USDC token allowance
export const USDCTokenAllowance = {
  ...USDCContractConfig,
  functionName: "allowance",
  watch: true,
};

// USDC token approve
export const USDCTokenApprove = {
  ...USDCContractConfig,
  functionName: "approve",
  watch: true,
};
