// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IERC20.sol";
import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./Pausable.sol";
import "./AccessControl.sol";

contract BatteryCoinPresale is Ownable, ReentrancyGuard, AccessControl, Pausable {
    IERC20 public BATT;
    IERC20 public USDT;
    IERC20 public USDC;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    uint256 public constant MAX_PARTICIPATION_AMOUNT = 1000000; // Example max amount

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
        uint256 tokenAmount;
        uint256 tokenPrice;
        address tokenSymbol;
        uint256 totalUsdPaidAmount;
        bool isReleased;
    }

    mapping(uint256 => PresaleRound) public presaleRoundList;
    uint256 public presaleRoundCount;
    mapping(address => uint256) public userParticipation;
    mapping(address => bool) public ownerList;
    uint256 public tokenValueDecimals = 2;
    bytes32[] private hashValueList; 
    mapping(bytes32 => HashValue) hashValues;
    uint256 lastRoundNo = 0;

    uint8 USDTDecimal = 6;
    uint8 batteryTokenDecimal = 0;

    event OwnerAdded(address indexed newOwner);
    event OwnerRemoved(address indexed removedOwner);
    event RoundSet(uint256 indexed roundNo, uint256 startDate);
    event Reserved(address indexed user, bytes32 hashValue, uint256 amount, uint256 price);
    event PresaleReleased(bytes32 hashValue, address indexed user, uint256 amount);
    event MoneyReleased(address indexed to, uint256 amount);
    event TokenAddressSet(address indexed tokenAddress);
    event Debug(string message);
    event Refunded(address indexed user, uint256 amount);

    constructor(address _usdt, address _usdc) Ownable(msg.sender) {
        _grantRole(ADMIN_ROLE, msg.sender);

        emit Debug("Constructor started");

        require(_usdt != address(0), "Invalid USDT address");
        require(_usdc != address(0), "Invalid USDC address");

        USDT = IERC20(_usdt);
        USDC = IERC20(_usdc);

        emit TokenAddressSet(_usdt);
        emit TokenAddressSet(_usdc);

        initializeRounds();
        emit Debug("Constructor finished");
    }

    modifier onlyOwners() {
        require(isOwner(msg.sender), "Caller is not an owner");
        _;
    }

    function isOwner(address _address) public view returns (bool) {
        return ownerList[_address];
    }

    function addOwner(address _newOwner) external onlyOwner {
        ownerList[_newOwner] = true;
        emit OwnerAdded(_newOwner);
    }

    function removeOwner(address _owner) external onlyOwner {
        ownerList[_owner] = false;
        emit OwnerRemoved(_owner);
    }

    function setRound(uint256 _roundNo, uint256 _startDate) external onlyOwners {
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
        } else if (block.timestamp >= round.startDate && round.remainAmount > 0) {
            round.isStarted = true;
            round.isFinished = false;
        } else {
            round.isStarted = false;
            round.isFinished = false;
        }
    }

    function reserve(uint256 _amount, address _token) external nonReentrant whenNotPaused {
        require(_token == address(USDT) || _token == address(USDC), "Invalid token");
        require(_amount > 0, "Amount must be greater than zero");
        require(userParticipation[msg.sender] + _amount <= MAX_PARTICIPATION_AMOUNT, "Exceeds max participation amount");

        PresaleRound storage currentRound = getCurrentRound();
        updateRoundStatus(currentRound);
        require(currentRound.isStarted && !currentRound.isFinished, "Presale round not active");
        require(currentRound.remainAmount >= _amount, "Not enough tokens left in this round");

        uint256 usdAmount = _amount * currentRound.roundPrice / (10 ** tokenValueDecimals) * 10 ** USDTDecimal;

        // Check allowance
        require(IERC20(_token).allowance(msg.sender, address(this)) >= usdAmount, "Insufficient allowance");

        require(IERC20(_token).transferFrom(msg.sender, address(this), usdAmount), "Token transfer failed");

        bytes32 hashValue = keccak256(abi.encodePacked(msg.sender, block.timestamp, _amount, currentRound.roundPrice));
        hashValues[hashValue] = HashValue({
            userAddress: msg.sender,
            roundNo: currentRound.roundNo,
            hashValue: hashValue,
            reserveDate: block.timestamp,
            tokenAmount: _amount,
            tokenPrice: currentRound.roundPrice,
            tokenSymbol: _token == address(USDT) ? address(USDT) : address(USDC),
            totalUsdPaidAmount: usdAmount / 10 ** USDTDecimal,
            isReleased: false
        });

        hashValueList.push(hashValue);

        currentRound.remainAmount = currentRound.remainAmount - _amount;
        userParticipation[msg.sender] = userParticipation[msg.sender] + _amount;

        emit Reserved(msg.sender, hashValue, _amount, currentRound.roundPrice);
    }

    function releasePresaleAll() external onlyOwners nonReentrant whenNotPaused {
        PresaleRound storage round = presaleRoundList[lastRoundNo];
        if (!round.isFinished) {
            uint256 oneTimeRelease = 50;
            uint256 releaseCount = hashValueList.length < oneTimeRelease ? hashValueList.length : oneTimeRelease;

            for (uint256 i = 0; i < releaseCount; i++) {
                bytes32 hashValue = hashValueList[hashValueList.length - 1];
                HashValue storage hv = hashValues[hashValue];
                if (!hv.isReleased) {
                    require(hv.userAddress != address(0), "Invalid hash value");

                    hv.isReleased = true;
                    require(BATT.transfer(hv.userAddress, hv.tokenAmount * 10 ** batteryTokenDecimal), "Token transfer failed");

                    emit PresaleReleased(hashValue, hv.userAddress, hv.tokenAmount);
                }
                hashValueList.pop();
            }

            if (hashValueList.length == 0) {
                round.isFinished = true;
                lastRoundNo++;
            }
        }
    }

    function releasePresaleByHashValue(bytes32 _hashValue) external nonReentrant whenNotPaused {
        HashValue storage hashValue = hashValues[_hashValue];
        require(hashValue.userAddress != address(0), "Invalid hash value");
        require(!hashValue.isReleased, "Already released");

        hashValue.isReleased = true;
        require(BATT.transfer(hashValue.userAddress, hashValue.tokenAmount * 10 ** batteryTokenDecimal), "Token transfer failed");
        emit PresaleReleased(_hashValue, hashValue.userAddress, hashValue.tokenAmount);
    }

    function releaseMoney(address _to, uint256 _amount, address _token) external onlyOwners nonReentrant whenNotPaused {
        require(_token == address(USDT) || _token == address(USDC), "Invalid token");
        require(IERC20(_token).transfer(_to, _amount * 10 ** USDTDecimal), "Token transfer failed");
        emit MoneyReleased(_to, _amount);
    }

    function setTokenAddress(address _tokenAddress, uint8 _decimal) external onlyOwner {
        BATT = IERC20(_tokenAddress);
        batteryTokenDecimal = _decimal;
        emit TokenAddressSet(_tokenAddress);
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

    function getPresaleInfo(bytes32 _hashValue) external view onlyOwner returns (HashValue memory) {
        HashValue storage hashValue = hashValues[_hashValue];
        require(hashValue.userAddress != address(0), "Invalid hash value");
        return hashValue;
    }

    function initializeRounds() internal {
        emit Debug("initializeRounds started");
        uint256[21] memory roundPrices = [
            25 * 10 ** (tokenValueDecimals - 2), 50 * 10 ** (tokenValueDecimals - 2), 75 * 10 ** (tokenValueDecimals - 2), 
            100 * 10 ** (tokenValueDecimals - 2), 200 * 10 ** (tokenValueDecimals - 2), 400 * 10 ** (tokenValueDecimals - 2), 
            600 * 10 ** (tokenValueDecimals - 2), 800 * 10 ** (tokenValueDecimals - 2), 1000 * 10 ** (tokenValueDecimals - 2), 
            1200 * 10 ** (tokenValueDecimals - 2), 1400 * 10 ** (tokenValueDecimals - 2), 1600 * 10 ** (tokenValueDecimals - 2), 
            1800 * 10 ** (tokenValueDecimals - 2), 2000 * 10 ** (tokenValueDecimals - 2), 2300 * 10 ** (tokenValueDecimals - 2), 
            2600 * 10 ** (tokenValueDecimals - 2), 2900 * 10 ** (tokenValueDecimals - 2), 3200 * 10 ** (tokenValueDecimals - 2), 
            3300 * 10 ** (tokenValueDecimals - 2), 3400 * 10 ** (tokenValueDecimals - 2), 3500 * 10 ** (tokenValueDecimals - 2)
        ];
        uint256[21] memory totalTokenAmounts = [
            uint256(1000000), uint256(2000000), uint256(3000000), uint256(4000000), uint256(5000000), 
            uint256(6000000), uint256(7000000), uint256(8000000), uint256(9000000), uint256(10000000), 
            uint256(11000000), uint256(12000000), uint256(13000000), uint256(14000000), uint256(15000000), 
            uint256(16000000), uint256(17000000), uint256(18000000), uint256(19000000), uint256(20000000), 
            uint256(30000000)
        ];

        require(roundPrices.length == totalTokenAmounts.length, "Array lengths do not match");

        for (uint256 i = 0; i < roundPrices.length; i++) {
            presaleRoundList[i] = PresaleRound({
                startDate: 0,
                roundNo: i,
                roundPrice: roundPrices[i],
                totalTokenAmount: totalTokenAmounts[i],
                remainAmount: totalTokenAmounts[i],
                isStarted: false,
                isFinished: false
            });
            presaleRoundCount++;
            emit RoundSet(i, 0); // Debugging event
        }

        lastRoundNo = 0;

        emit Debug("initializeRounds finished");
    }

    function refundUser(bytes32 _hashValue) external onlyOwners nonReentrant whenNotPaused {
        HashValue storage hashValue = hashValues[_hashValue];
        require(hashValue.userAddress != address(0), "Invalid hash value");
        require(!hashValue.isReleased, "Already released");

        uint256 refundAmount = hashValue.totalUsdPaidAmount;
        address userAddress = hashValue.userAddress;
        address token = hashValue.tokenSymbol == address(USDT) ? address(USDT) : address(USDC);

        hashValue.isReleased = true;
        require(IERC20(token).transfer(userAddress, refundAmount * 10 ** USDTDecimal), "Refund transfer failed");
        emit Refunded(userAddress, refundAmount);
    }

    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}