// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./SafeERC20.sol";
import "./IERC20.sol";
import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./Pausable.sol";
import "./AggregatorV3Interface.sol";

contract BatteryCoinPresale is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    IERC20 public BATR;
    IERC20 public USDT;
    IERC20 public USDC;

    AggregatorV3Interface internal priceFeed;

    struct PresaleRound {
        uint256 startDate;
        uint256 roundNo;
        uint256 roundPrice;
        uint256 totalTokenAmount;
        uint256 remainAmount;
        bool isStarted;
        bool isFinished;
    }

    struct HashValue {
        address userAddress;
        uint roundNo;
        bytes32 hashValue;
        uint256 reserveDate;
        uint256 totalBATRAmount;
        uint256 tokenPrice;
        address tokenSymbol;
        uint256 totalPaidAmount;
        bool isRefunded;
    }

    struct ReleaseFundsRequest {
        address to;
        uint256 amount;
        address token;
        uint256 confirmations;
        bool executed;
    }

    mapping(uint256 => PresaleRound) public presaleRoundList;
    uint256 public presaleRoundCount;
    mapping(address => uint256) public userParticipation;
    mapping(address => bool) public ownerList;
    mapping(address => bool) public coreOwnerList;
    bytes32[] private hashValueList;
    mapping(bytes32 => HashValue) hashValues;

    mapping(uint256 => ReleaseFundsRequest) public releaseFundsRequests;
    uint256 public releaseFundsRequestCount;
    mapping(uint256 => mapping(address => bool))
        public confirmationReleaseFunds;

    uint8 public USDTDecimal = 6;
    uint8 public batteryTokenDecimal = 18;
    uint8 public tokenValueDecimals = 2;
    uint256 public constant MAX_PARTICIPATION_AMOUNT = 1000000;
    uint256 public constant VESTING_PERIOD_MONTHS = 24;
    uint256 public numConfirmationsRequired = 2;

    bool public vestingPeriodStarted = false;
    uint256 public vestingPeriodStartTime;

    uint256 public constant MAX_SINGLE_RELEASE_AMOUNT = 10000 * 10 ** 6;
    uint256 public constant LARGE_RELEASE_THRESHOLD = 500000 * 10 ** 6;

    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed removedOwner);
    event RoundSet(uint256 indexed roundNo, uint256 startDate);
    event Reserved(
        address indexed user,
        bytes32 hashValue,
        uint256 amount,
        uint256 price
    );
    event MoneyReleased(address indexed to, uint256 amount);
    event TokenAddressSet(address indexed tokenAddress);
    event Debug(string message);
    event Refunded(address indexed user, uint256 amount);

    event ReleaseFundsRequested(
        uint256 requestId,
        address indexed to,
        uint256 amount,
        address token
    );
    event ReleaseFundsConfirmed(uint256 requestId, address indexed owner);
    event ReleaseFundsExecuted(
        uint256 requestId,
        address indexed to,
        uint256 amount,
        address token
    );

    constructor() Ownable(msg.sender) {
        emit Debug("Constructor started");

        ownerList[msg.sender] = true;

        // Main net
        address _usdt = 0xdAC17F958D2ee523a2206206994597C13D831ec7;
        address _usdc = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;

        require(
            _usdt != address(0) && _usdc != address(0),
            "Invalid token address"
        );

        USDT = IERC20(_usdt);
        USDC = IERC20(_usdc);

        emit TokenAddressSet(_usdt);
        emit TokenAddressSet(_usdc);

        initializeRounds();
        initCoreOwners();

        priceFeed = AggregatorV3Interface(
            0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419
        );

        emit Debug("Constructor finished");
    }

    modifier onlyOwners() {
        require(isOwner(msg.sender), "Caller is not an owner");
        _;
    }

    modifier onlyCoreOwners() {
        require(isCoreOwner(msg.sender), "Caller is not a core owner");
        _;
    }

    function isOwner(address _address) public view returns (bool) {
        return ownerList[_address];
    }

    function isCoreOwner(address _address) public view returns (bool) {
        return coreOwnerList[_address];
    }

    function addOwner(address _newOwner) external onlyCoreOwners {
        ownerList[_newOwner] = true;
        emit OwnerAdded(_newOwner);
    }

    function removeOwner(address _owner) external onlyCoreOwners {
        require(!isCoreOwner(_owner), "Cannot remove a core owner");
        ownerList[_owner] = false;
        emit OwnerRemoved(_owner);
    }

    function addCoreOwner(address _newCoreOwner) external onlyCoreOwners {
        require(ownerList[_newCoreOwner], "Core owner must be an owner");
        coreOwnerList[_newCoreOwner] = true;
    }

    function pause() external onlyCoreOwners {
        vestingPeriodStarted = true;
        vestingPeriodStartTime = block.timestamp;

        _pause();
    }

    function unpause() external onlyCoreOwners {
        vestingPeriodStarted = false;
        vestingPeriodStartTime = 0;

        _unpause();
    }

    function initializeRounds() internal {
        uint16[20] memory roundPrices = [
            50,
            75,
            100,
            200,
            400,
            600,
            800,
            1000,
            1200,
            1400,
            1600,
            1800,
            2000,
            2300,
            2600,
            2900,
            3200,
            3300,
            3400,
            3500
        ];
        uint32[20] memory totalTokenAmounts = [
            2000000,
            3000000,
            4000000,
            5000000,
            6000000,
            7000000,
            8000000,
            9000000,
            10000000,
            11000000,
            12000000,
            13000000,
            14000000,
            15000000,
            16000000,
            17000000,
            18000000,
            19000000,
            20000000,
            30000000
        ];

        uint256 multiplier = 10 ** batteryTokenDecimal;
        for (uint256 i = 0; i < roundPrices.length; i++) {
            presaleRoundList[i] = PresaleRound({
                startDate: 0,
                roundNo: i,
                roundPrice: roundPrices[i],
                totalTokenAmount: totalTokenAmounts[i] * multiplier,
                remainAmount: totalTokenAmounts[i] * multiplier,
                isStarted: false,
                isFinished: false
            });
        }

        presaleRoundCount = roundPrices.length;
    }

    function initCoreOwners() internal {
        address[2] memory initialCoreOwners = [
            0x1676Cb900C0CCE35B2E1416f2aba0d6c02d4B217,
            0x5b141241A18280dAC9CaA9418F2bc3E49f6131B6
        ];

        for (uint256 i = 0; i < initialCoreOwners.length; i++) {
            coreOwnerList[initialCoreOwners[i]] = true;
            ownerList[initialCoreOwners[i]] = true;
        }
    }

    function setBATRTokenAddress(
        address _tokenAddress,
        uint8 _decimal
    ) external onlyOwners {
        BATR = IERC20(_tokenAddress);
        batteryTokenDecimal = _decimal;
        emit TokenAddressSet(_tokenAddress);
    }

    function setRound(
        uint256 _roundNo,
        uint256 _startDate
    ) external onlyOwners {
        require(_roundNo < presaleRoundCount, "Invalid round number");
        PresaleRound storage round = presaleRoundList[_roundNo];
        round.startDate = _startDate;
        updateRoundStatus(round);
        emit RoundSet(_roundNo, _startDate);
    }

    function updateRoundStatus(PresaleRound storage round) internal {
        if (round.remainAmount == 0) {
            round.isStarted = false;
            round.isFinished = true;

            if (round.roundNo == 19) {
                vestingPeriodStarted = true;
                vestingPeriodStartTime = block.timestamp;
            }
        } else {
            round.isStarted = block.timestamp >= round.startDate;
            round.isFinished = false;
        }
    }

    function reserve(
        uint256 _amount,
        address _token
    ) external nonReentrant whenNotPaused {
        require(
            _token == address(USDT) || _token == address(USDC),
            "Invalid token"
        );
        require(_amount > 0, "Amount must be greater than zero");
        require(
            userParticipation[msg.sender] + _amount <=
                MAX_PARTICIPATION_AMOUNT * (10 ** batteryTokenDecimal),
            "Exceeds max participation amount"
        );

        PresaleRound storage currentRound = getCurrentRound();
        updateRoundStatus(currentRound);
        require(
            currentRound.isStarted && !currentRound.isFinished,
            "Presale round not active"
        );
        require(
            currentRound.remainAmount >= _amount,
            "Not enough tokens left in this round"
        );

        uint256 usdAmount = (((_amount / (10 ** batteryTokenDecimal)) *
            currentRound.roundPrice) / (10 ** tokenValueDecimals)) *
            10 ** USDTDecimal;

        require(
            IERC20(_token).allowance(msg.sender, address(this)) >= usdAmount,
            "Insufficient allowance"
        );

        IERC20(_token).safeTransferFrom(msg.sender, address(this), usdAmount);

        bytes32 hashValue = keccak256(
            abi.encodePacked(
                msg.sender,
                block.timestamp,
                _amount,
                currentRound.roundPrice
            )
        );
        hashValues[hashValue] = HashValue({
            userAddress: msg.sender,
            roundNo: currentRound.roundNo,
            hashValue: hashValue,
            reserveDate: block.timestamp,
            totalBATRAmount: _amount,
            tokenPrice: currentRound.roundPrice,
            tokenSymbol: _token,
            totalPaidAmount: usdAmount,
            isRefunded: false
        });

        hashValueList.push(hashValue);

        currentRound.remainAmount -= _amount;
        userParticipation[msg.sender] += _amount;

        require(
            BATR.balanceOf(address(this)) >= _amount,
            "Insufficient BATR tokens in BATR contract"
        );
        require(
            BATR.transfer(msg.sender, _amount),
            "BATR token transfer failed"
        );

        emit Reserved(msg.sender, hashValue, _amount, currentRound.roundPrice);
    }

    function reserveWithETH(
        uint256 _amount
    ) external payable nonReentrant whenNotPaused {
        require(_amount > 0, "Amount must be greater than zero");
        require(
            userParticipation[msg.sender] + _amount <=
                MAX_PARTICIPATION_AMOUNT * (10 ** batteryTokenDecimal),
            "Exceeds max participation amount"
        );

        PresaleRound storage currentRound = getCurrentRound();
        updateRoundStatus(currentRound);
        require(
            currentRound.isStarted && !currentRound.isFinished,
            "Presale round not active"
        );
        require(
            currentRound.remainAmount >= _amount,
            "Not enough tokens left in this round"
        );

        uint256 usdAmount = (((_amount / (10 ** batteryTokenDecimal)) *
            currentRound.roundPrice) / (10 ** tokenValueDecimals)) *
            10 ** USDTDecimal;
        uint256 ethAmount = getETHAmountFromUSD(usdAmount);

        require(msg.value >= ethAmount, "Insufficient ETH sent");

        bytes32 hashValue = keccak256(
            abi.encodePacked(
                msg.sender,
                block.timestamp,
                _amount,
                currentRound.roundPrice
            )
        );
        hashValues[hashValue] = HashValue({
            userAddress: msg.sender,
            roundNo: currentRound.roundNo,
            hashValue: hashValue,
            reserveDate: block.timestamp,
            totalBATRAmount: _amount,
            tokenPrice: currentRound.roundPrice,
            tokenSymbol: address(0),
            totalPaidAmount: msg.value,
            isRefunded: false
        });

        hashValueList.push(hashValue);

        currentRound.remainAmount -= _amount;
        userParticipation[msg.sender] += _amount;

        require(
            BATR.balanceOf(address(this)) >= _amount,
            "Insufficient BATR tokens in BATR contract"
        );
        require(
            BATR.transfer(msg.sender, _amount),
            "BATR token transfer failed"
        );

        emit Reserved(msg.sender, hashValue, _amount, currentRound.roundPrice);
    }

    function getHashValuesByAddress(
        address userAddress
    ) external view returns (HashValue[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < hashValueList.length; i++) {
            if (hashValues[hashValueList[i]].userAddress == userAddress) {
                count++;
            }
        }

        HashValue[] memory userHashValues = new HashValue[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < hashValueList.length; i++) {
            if (hashValues[hashValueList[i]].userAddress == userAddress) {
                userHashValues[index++] = hashValues[hashValueList[i]];
            }
        }

        return userHashValues;
    }

    function getLastHashValueByAddress(
        address userAddress
    ) external view returns (bytes32) {
        for (uint256 i = hashValueList.length; i > 0; i--) {
            bytes32 hashValue = hashValueList[i - 1];
            if (hashValues[hashValue].userAddress == userAddress) {
                return hashValue;
            }
        }
        revert("No hash value found for the given address");
    }

    function getPresaleInfo(
        bytes32 _hashValue
    ) external view returns (HashValue memory) {
        HashValue storage hashValue = hashValues[_hashValue];
        require(hashValue.userAddress != address(0), "Invalid hash value");
        return hashValue;
    }

    function requestReleaseFundsByCoreOwner(
        address _to,
        uint256 _amount,
        address _token
    ) external onlyCoreOwners {
        uint256 usdEquivalent = _amount;
        if (_token == address(0)) {
            usdEquivalent = getUSDAmountFromETH(_amount);
        }
        require(
            usdEquivalent >= (50 * 10 ** (USDTDecimal - 2)),
            "Amount must be at least 0.50 USD"
        );

        uint256 confirmationsCount = usdEquivalent >= LARGE_RELEASE_THRESHOLD
            ? 0
            : numConfirmationsRequired;

        releaseFundsRequests[releaseFundsRequestCount] = ReleaseFundsRequest({
            to: _to,
            amount: _amount,
            token: _token,
            confirmations: confirmationsCount,
            executed: false
        });

        emit ReleaseFundsRequested(
            releaseFundsRequestCount,
            _to,
            _amount,
            _token
        );

        if (confirmationsCount == numConfirmationsRequired) {
            executeReleaseFunds(releaseFundsRequestCount);
        }

        releaseFundsRequestCount++;
    }

    function requestReleaseFunds(
        address _to,
        uint256 _amount,
        address _token
    ) external onlyOwners {
        uint256 usdEquivalent = _amount;
        if (_token == address(0)) {
            usdEquivalent = getUSDAmountFromETH(_amount);
        }
        require(
            usdEquivalent >= (50 * 10 ** (USDTDecimal - 2)),
            "Amount must be at least 0.50 USD"
        );
        require(
            usdEquivalent < MAX_SINGLE_RELEASE_AMOUNT,
            "Amount exceeds max single release limit"
        );

        releaseFundsRequests[releaseFundsRequestCount] = ReleaseFundsRequest({
            to: _to,
            amount: _amount,
            token: _token,
            confirmations: 0,
            executed: false
        });

        emit ReleaseFundsRequested(
            releaseFundsRequestCount,
            _to,
            _amount,
            _token
        );
        releaseFundsRequestCount++;
    }

    function confirmReleaseFunds(uint256 _requestId) external onlyOwners {
        ReleaseFundsRequest storage request = releaseFundsRequests[_requestId];
        require(!request.executed, "Request already executed");
        require(
            !confirmationReleaseFunds[_requestId][msg.sender],
            "Already confirmed by this owner"
        );

        confirmationReleaseFunds[_requestId][msg.sender] = true;
        request.confirmations++;

        emit ReleaseFundsConfirmed(_requestId, msg.sender);

        if (request.confirmations >= numConfirmationsRequired) {
            executeReleaseFunds(_requestId);
        }
    }

    function executeReleaseFunds(uint256 _requestId) internal nonReentrant {
        ReleaseFundsRequest storage request = releaseFundsRequests[_requestId];
        require(!request.executed, "Request already executed");
        require(
            request.confirmations >= numConfirmationsRequired,
            "Not enough confirmations"
        );

        if (request.token == address(USDT) || request.token == address(USDC)) {
            IERC20(request.token).safeTransfer(request.to, request.amount);
        } else if (request.token == address(0)) {
            // address(0) is used to represent ETH
            (bool success, ) = request.to.call{value: request.amount}("");
            require(success, "ETH transfer failed");
        } else {
            revert("Invalid token");
        }

        request.executed = true;
        emit ReleaseFundsExecuted(
            _requestId,
            request.to,
            request.amount,
            request.token
        );
    }

    function getETHAmountFromUSD(
        uint256 usdAmount
    ) internal view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid ETH price");
        uint256 ethPriceInUSD = uint256(price) + uint256(50 * 10 ** 8);
        return (usdAmount * 10 ** 20) / ethPriceInUSD;
    }

    function getUSDAmountFromETH(
        uint256 ethAmount
    ) internal view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid ETH price");
        uint256 ethPriceInUSD = uint256(price);
        return (ethAmount * ethPriceInUSD) / 10 ** 20;
    }

    function getCurrentRound() internal view returns (PresaleRound storage) {
        for (uint256 i = 0; i < presaleRoundCount; i++) {
            PresaleRound storage round = presaleRoundList[i];
            if (block.timestamp >= round.startDate && round.remainAmount > 0) {
                return round;
            }
        }
        revert("No active presale round");
    }

    function getLatestRound() external view returns (PresaleRound memory) {
        for (uint256 i = 0; i < presaleRoundCount; i++) {
            PresaleRound memory round = presaleRoundList[i];
            if (!round.isFinished) {
                return round;
            }
        }
        revert("No active presale round");
    }

    function refundUser(bytes32 _hashValue) external onlyOwners nonReentrant {
        require(
            vestingPeriodStarted &&
                block.timestamp >=
                vestingPeriodStartTime + VESTING_PERIOD_MONTHS * 30 days,
            "Refunds only available after vesting period"
        );

        HashValue storage hashValue = hashValues[_hashValue];
        require(
            hashValue.roundNo >= 0 && hashValue.roundNo <= 5,
            "Refunds only available for rounds 1 to 6"
        );
        require(hashValue.userAddress != address(0), "Invalid hash value");
        require(!hashValue.isRefunded, "Already refunded");
        require(
            msg.sender == hashValue.userAddress,
            "Refund must be initiated by the original purchaser"
        );

        uint256 refundAmount = hashValue.totalPaidAmount;
        address userAddress = hashValue.userAddress;
        address tokenSymbol = hashValue.tokenSymbol;

        if (tokenSymbol == address(0)) {
            (bool success, ) = userAddress.call{value: refundAmount}("");
            require(success, "ETH refund transfer failed");
        } else {
            IERC20(tokenSymbol).safeTransfer(userAddress, refundAmount);
        }

        hashValue.isRefunded = true;

        emit Refunded(userAddress, refundAmount);
    }
}
