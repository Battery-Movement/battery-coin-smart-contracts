/**
 *Submitted for verification at Etherscan.io on 2024-12-12
*/

// SPDX-License-Identifier: MIT
// File: contract/IERC20.sol


// OpenZeppelin Contracts (last updated v5.0.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.19;

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}
// File: contract/IERC165.sol


// OpenZeppelin Contracts (last updated v5.0.0) (utils/introspection/IERC165.sol)

pragma solidity ^0.8.19;

/**
 * @dev Interface of the ERC-165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[ERC].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[ERC section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
// File: contract/IERC1363.sol


// OpenZeppelin Contracts (last updated v5.1.0) (interfaces/IERC1363.sol)

pragma solidity ^0.8.20;



/**
 * @title IERC1363
 * @dev Interface of the ERC-1363 standard as defined in the https://eips.ethereum.org/EIPS/eip-1363[ERC-1363].
 *
 * Defines an extension interface for ERC-20 tokens that supports executing code on a recipient contract
 * after `transfer` or `transferFrom`, or code on a spender contract after `approve`, in a single transaction.
 */
interface IERC1363 is IERC20, IERC165 {
    /*
     * Note: the ERC-165 identifier for this interface is 0xb0202a11.
     * 0xb0202a11 ===
     *   bytes4(keccak256('transferAndCall(address,uint256)')) ^
     *   bytes4(keccak256('transferAndCall(address,uint256,bytes)')) ^
     *   bytes4(keccak256('transferFromAndCall(address,address,uint256)')) ^
     *   bytes4(keccak256('transferFromAndCall(address,address,uint256,bytes)')) ^
     *   bytes4(keccak256('approveAndCall(address,uint256)')) ^
     *   bytes4(keccak256('approveAndCall(address,uint256,bytes)'))
     */

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferAndCall(address to, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @param data Additional data with no specified format, sent in call to `to`.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferAndCall(
        address to,
        uint256 value,
        bytes calldata data
    ) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param from The address which you want to send tokens from.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferFromAndCall(
        address from,
        address to,
        uint256 value
    ) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism
     * and then calls {IERC1363Receiver-onTransferReceived} on `to`.
     * @param from The address which you want to send tokens from.
     * @param to The address which you want to transfer to.
     * @param value The amount of tokens to be transferred.
     * @param data Additional data with no specified format, sent in call to `to`.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function transferFromAndCall(
        address from,
        address to,
        uint256 value,
        bytes calldata data
    ) external returns (bool);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens and then calls {IERC1363Spender-onApprovalReceived} on `spender`.
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function approveAndCall(
        address spender,
        uint256 value
    ) external returns (bool);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens and then calls {IERC1363Spender-onApprovalReceived} on `spender`.
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     * @param data Additional data with no specified format, sent in call to `spender`.
     * @return A boolean value indicating whether the operation succeeded unless throwing.
     */
    function approveAndCall(
        address spender,
        uint256 value,
        bytes calldata data
    ) external returns (bool);
}

// File: contract/SafeERC20.sol


// OpenZeppelin Contracts (last updated v5.1.0) (token/ERC20/utils/SafeERC20.sol)

pragma solidity ^0.8.20;



/**
 * @title SafeERC20
 * @dev Wrappers around ERC-20 operations that throw on failure (when the token
 * contract returns false). Tokens that return no value (and instead revert or
 * throw on failure) are also supported, non-reverting calls are assumed to be
 * successful.
 * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,
 * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.
 */
library SafeERC20 {
    /**
     * @dev An operation with an ERC-20 token failed.
     */
    error SafeERC20FailedOperation(address token);

    /**
     * @dev Indicates a failed `decreaseAllowance` request.
     */
    error SafeERC20FailedDecreaseAllowance(
        address spender,
        uint256 currentAllowance,
        uint256 requestedDecrease
    );

    /**
     * @dev Transfer `value` amount of `token` from the calling contract to `to`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     */
    function safeTransfer(IERC20 token, address to, uint256 value) internal {
        _callOptionalReturn(token, abi.encodeCall(token.transfer, (to, value)));
    }

    /**
     * @dev Transfer `value` amount of `token` from `from` to `to`, spending the approval given by `from` to the
     * calling contract. If `token` returns no value, non-reverting calls are assumed to be successful.
     */
    function safeTransferFrom(
        IERC20 token,
        address from,
        address to,
        uint256 value
    ) internal {
        _callOptionalReturn(
            token,
            abi.encodeCall(token.transferFrom, (from, to, value))
        );
    }

    /**
     * @dev Increase the calling contract's allowance toward `spender` by `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful.
     *
     * IMPORTANT: If the token implements ERC-7674 (ERC-20 with temporary allowance), and if the "client"
     * smart contract uses ERC-7674 to set temporary allowances, then the "client" smart contract should avoid using
     * this function. Performing a {safeIncreaseAllowance} or {safeDecreaseAllowance} operation on a token contract
     * that has a non-zero temporary allowance (for that particular owner-spender) will result in unexpected behavior.
     */
    function safeIncreaseAllowance(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        uint256 oldAllowance = token.allowance(address(this), spender);
        forceApprove(token, spender, oldAllowance + value);
    }

    /**
     * @dev Decrease the calling contract's allowance toward `spender` by `requestedDecrease`. If `token` returns no
     * value, non-reverting calls are assumed to be successful.
     *
     * IMPORTANT: If the token implements ERC-7674 (ERC-20 with temporary allowance), and if the "client"
     * smart contract uses ERC-7674 to set temporary allowances, then the "client" smart contract should avoid using
     * this function. Performing a {safeIncreaseAllowance} or {safeDecreaseAllowance} operation on a token contract
     * that has a non-zero temporary allowance (for that particular owner-spender) will result in unexpected behavior.
     */
    function safeDecreaseAllowance(
        IERC20 token,
        address spender,
        uint256 requestedDecrease
    ) internal {
        unchecked {
            uint256 currentAllowance = token.allowance(address(this), spender);
            if (currentAllowance < requestedDecrease) {
                revert SafeERC20FailedDecreaseAllowance(
                    spender,
                    currentAllowance,
                    requestedDecrease
                );
            }
            forceApprove(token, spender, currentAllowance - requestedDecrease);
        }
    }

    /**
     * @dev Set the calling contract's allowance toward `spender` to `value`. If `token` returns no value,
     * non-reverting calls are assumed to be successful. Meant to be used with tokens that require the approval
     * to be set to zero before setting it to a non-zero value, such as USDT.
     *
     * NOTE: If the token implements ERC-7674, this function will not modify any temporary allowance. This function
     * only sets the "standard" allowance. Any temporary allowance will remain active, in addition to the value being
     * set here.
     */
    function forceApprove(
        IERC20 token,
        address spender,
        uint256 value
    ) internal {
        bytes memory approvalCall = abi.encodeCall(
            token.approve,
            (spender, value)
        );

        if (!_callOptionalReturnBool(token, approvalCall)) {
            _callOptionalReturn(
                token,
                abi.encodeCall(token.approve, (spender, 0))
            );
            _callOptionalReturn(token, approvalCall);
        }
    }

    /**
     * @dev Performs an {ERC1363} transferAndCall, with a fallback to the simple {ERC20} transfer if the target has no
     * code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
     * targeting contracts.
     *
     * Reverts if the returned value is other than `true`.
     */
    function transferAndCallRelaxed(
        IERC1363 token,
        address to,
        uint256 value,
        bytes memory data
    ) internal {
        if (to.code.length == 0) {
            safeTransfer(token, to, value);
        } else if (!token.transferAndCall(to, value, data)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Performs an {ERC1363} transferFromAndCall, with a fallback to the simple {ERC20} transferFrom if the target
     * has no code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
     * targeting contracts.
     *
     * Reverts if the returned value is other than `true`.
     */
    function transferFromAndCallRelaxed(
        IERC1363 token,
        address from,
        address to,
        uint256 value,
        bytes memory data
    ) internal {
        if (to.code.length == 0) {
            safeTransferFrom(token, from, to, value);
        } else if (!token.transferFromAndCall(from, to, value, data)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Performs an {ERC1363} approveAndCall, with a fallback to the simple {ERC20} approve if the target has no
     * code. This can be used to implement an {ERC721}-like safe transfer that rely on {ERC1363} checks when
     * targeting contracts.
     *
     * NOTE: When the recipient address (`to`) has no code (i.e. is an EOA), this function behaves as {forceApprove}.
     * Opposedly, when the recipient address (`to`) has code, this function only attempts to call {ERC1363-approveAndCall}
     * once without retrying, and relies on the returned value to be true.
     *
     * Reverts if the returned value is other than `true`.
     */
    function approveAndCallRelaxed(
        IERC1363 token,
        address to,
        uint256 value,
        bytes memory data
    ) internal {
        if (to.code.length == 0) {
            forceApprove(token, to, value);
        } else if (!token.approveAndCall(to, value, data)) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturnBool} that reverts if call fails to meet the requirements.
     */
    function _callOptionalReturn(IERC20 token, bytes memory data) private {
        uint256 returnSize;
        uint256 returnValue;
        assembly ("memory-safe") {
            let success := call(
                gas(),
                token,
                0,
                add(data, 0x20),
                mload(data),
                0,
                0x20
            )
            // bubble errors
            if iszero(success) {
                let ptr := mload(0x40)
                returndatacopy(ptr, 0, returndatasize())
                revert(ptr, returndatasize())
            }
            returnSize := returndatasize()
            returnValue := mload(0)
        }

        if (
            returnSize == 0 ? address(token).code.length == 0 : returnValue != 1
        ) {
            revert SafeERC20FailedOperation(address(token));
        }
    }

    /**
     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement
     * on the return value: the return value is optional (but if data is returned, it must not be false).
     * @param token The token targeted by the call.
     * @param data The call data (encoded using abi.encode or one of its variants).
     *
     * This is a variant of {_callOptionalReturn} that silently catches all reverts and returns a bool instead.
     */
    function _callOptionalReturnBool(
        IERC20 token,
        bytes memory data
    ) private returns (bool) {
        bool success;
        uint256 returnSize;
        uint256 returnValue;
        assembly ("memory-safe") {
            success := call(
                gas(),
                token,
                0,
                add(data, 0x20),
                mload(data),
                0,
                0x20
            )
            returnSize := returndatasize()
            returnValue := mload(0)
        }
        return
            success &&
            (
                returnSize == 0
                    ? address(token).code.length > 0
                    : returnValue == 1
            );
    }
}

// File: contract/Context.sol


// OpenZeppelin Contracts (last updated v5.0.1) (utils/Context.sol)

pragma solidity ^0.8.19;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }

    function _contextSuffixLength() internal view virtual returns (uint256) {
        return 0;
    }
}
// File: contract/Ownable.sol


// OpenZeppelin Contracts (last updated v5.0.0) (access/Ownable.sol)

pragma solidity ^0.8.19;


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * The initial owner is set to the address provided by the deployer. This can
 * later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    /**
     * @dev The caller account is not authorized to perform an operation.
     */
    error OwnableUnauthorizedAccount(address account);

    /**
     * @dev The owner is not a valid owner account. (eg. `address(0)`)
     */
    error OwnableInvalidOwner(address owner);

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the address provided by the deployer as the initial owner.
     */
    constructor(address initialOwner) {
        if (initialOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(initialOwner);
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if the sender is not the owner.
     */
    function _checkOwner() internal view virtual {
        if (owner() != _msgSender()) {
            revert OwnableUnauthorizedAccount(_msgSender());
        }
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby disabling any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) {
            revert OwnableInvalidOwner(address(0));
        }
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
// File: contract/ReentrancyGuard.sol


// OpenZeppelin Contracts (last updated v5.0.0) (utils/ReentrancyGuard.sol)

pragma solidity ^0.8.19;

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        _status = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == ENTERED;
    }
}
// File: contract/Pausable.sol


// OpenZeppelin Contracts (last updated v5.0.0) (utils/Pausable.sol)

pragma solidity ^0.8.19;


/**
 * @dev Contract module which allows children to implement an emergency stop
 * mechanism that can be triggered by an authorized account.
 *
 * This module is used through inheritance. It will make available the
 * modifiers `whenNotPaused` and `whenPaused`, which can be applied to
 * the functions of your contract. Note that they will not be pausable by
 * simply including this module, only once the modifiers are put in place.
 */
abstract contract Pausable is Context {
    bool private _paused;

    /**
     * @dev Emitted when the pause is triggered by `account`.
     */
    event Paused(address account);

    /**
     * @dev Emitted when the pause is lifted by `account`.
     */
    event Unpaused(address account);

    /**
     * @dev The operation failed because the contract is paused.
     */
    error EnforcedPause();

    /**
     * @dev The operation failed because the contract is not paused.
     */
    error ExpectedPause();

    /**
     * @dev Initializes the contract in unpaused state.
     */
    constructor() {
        _paused = false;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    modifier whenNotPaused() {
        _requireNotPaused();
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    modifier whenPaused() {
        _requirePaused();
        _;
    }

    /**
     * @dev Returns true if the contract is paused, and false otherwise.
     */
    function paused() public view virtual returns (bool) {
        return _paused;
    }

    /**
     * @dev Throws if the contract is paused.
     */
    function _requireNotPaused() internal view virtual {
        if (paused()) {
            revert EnforcedPause();
        }
    }

    /**
     * @dev Throws if the contract is not paused.
     */
    function _requirePaused() internal view virtual {
        if (!paused()) {
            revert ExpectedPause();
        }
    }

    /**
     * @dev Triggers stopped state.
     *
     * Requirements:
     *
     * - The contract must not be paused.
     */
    function _pause() internal virtual whenNotPaused {
        _paused = true;
        emit Paused(_msgSender());
    }

    /**
     * @dev Returns to normal state.
     *
     * Requirements:
     *
     * - The contract must be paused.
     */
    function _unpause() internal virtual whenPaused {
        _paused = false;
        emit Unpaused(_msgSender());
    }
}
// File: contract/AggregatorV3Interface.sol


pragma solidity ^0.8.0;

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);

    function description() external view returns (string memory);

    function version() external view returns (uint256);

    function getRoundData(
        uint80 _roundId
    )
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}
// File: contract/BatteryCoinPresale.sol


pragma solidity ^0.8.19;







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