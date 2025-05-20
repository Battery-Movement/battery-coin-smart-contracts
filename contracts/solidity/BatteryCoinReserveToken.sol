// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Pausable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// BatteryCoinReserveToken ($BATR) is a placeholder token for reserving Battery Coin ($BATT) during its presale and sale phases.
/// Battery Coin ($BATT) is an asset-backed AI token created specifically for powering Artificial Intelligence (AI) and Artificial General Intelligence (AGI) applications on the Battery Blockchain. The value of Battery Coin ($BATT) is in its asset-backing and utility.
/// BatteryCoinReserveToken ($BATR), as a placeholder, does not possess intrinsic or monetary value and is not designed for investment, speculative trading, or financial purposes. BatteryCoinReserveToken ($BATR) is solely for reserving Battery Coin ($BATT).
/// Upon the successful conclusion of the presale and sale phases, and as the Battery Blockchain progresses according to its development roadmap, holders of $BATR will have the opportunity to exchange their tokens for Battery Coin ($BATT), subject to the terms and conditions outlined at https://batterycoin.org/home/tos/.

/// @custom:security-contact tech@batterycoin.org
contract BatteryCoinReserveToken is ERC20, ERC20Pausable, AccessControl, ERC20Permit {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    constructor(address defaultAdmin, address pauser)
        ERC20("Battery Coin Reserve Token", "BATR")
        ERC20Permit("Battery Coin Reserve Token")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _mint(msg.sender, 1080000000 * 10 ** decimals());
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    /// @notice Burn tokens from a specified account. Only callable by the owner (DEFAULT_ADMIN_ROLE).
    /// @param account The address from which to burn tokens.
    /// @param amount The number of tokens to burn.
    function ownerBurn(address account, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _burn(account, amount);
    }

    // The following functions are overrides required by Solidity.
    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, value);
    }
}
