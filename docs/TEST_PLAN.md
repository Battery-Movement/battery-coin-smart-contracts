# BatteryCoin Memberstore Frontend - Test Plan

## 1. Objective
To verify the core functionality of the memberstore frontend after the refactoring of payment integrations and state management. This plan ensures that the application is stable, user flows are intuitive, and all backend integrations are working as expected.

## 2. Scope
This plan covers the following key areas:
- Wallet Connection & Disconnection (RainbowKit)
- Presale Information Display (fetched from backend)
- Token Purchase Flow (ETH, USDT, and USDC via backend API)

---

## 3. User Stories & Test Cases

### User Story 1: Wallet Connection
**As a user, I want to connect my wallet to the application so that I can interact with the presale.**

| Test Case ID | Step                                                                                             | Expected Result                                                                   |
| :----------- | :----------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **TC-1.1**   | Open the application without a wallet connected.                                                 | The "Connect Wallet" button is visible and enabled.                               |
| **TC-1.2**   | Click the "Connect Wallet" button.                                                               | The RainbowKit modal opens, displaying a list of supported wallet options.        |
| **TC-1.3**   | Select a wallet and complete the connection process.                                             | The modal closes, the user's wallet address is displayed, and the UI updates to a connected state. |
| **TC-1.4**   | With a wallet connected, locate and click the "Disconnect" button.                               | The wallet is disconnected, and the UI reverts to its initial, unconnected state. |

### User Story 2: Presale Information Display
**As a user, I want to see the current status of the presale so that I can make an informed purchase decision.**

| Test Case ID | Step                                                                 | Expected Result                                                                                             |
| :----------- | :------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **TC-2.1**   | With a wallet connected, observe the main presale section.           | The current presale stage (e.g., "Stage 1"), token price, and total tokens for the stage are correctly displayed. |
| **TC-2.2**   | Observe the countdown timer.                                         | The timer accurately displays the time remaining for the current stage and ticks down correctly.            |
| **TC-2.3**   | Observe the progress bar.                                            | The progress bar visually represents the percentage of tokens sold vs. the total supply for the stage.      |

### User Story 3: Token Purchase with ETH
**As a user, I want to purchase BATR tokens using ETH.**

| Test Case ID | Step                                                                                             | Expected Result                                                                                             |
| :----------- | :----------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **TC-3.1**   | Select "ETH" as the payment currency.                                                            | The input field is labeled for ETH.                                                                         |
| **TC-3.2**   | Enter a valid amount of ETH to spend.                                                            | The corresponding amount of BATR to be received is calculated and displayed in real-time. The "Buy Now" button is enabled. |
| **TC-3.3**   | Click the "Buy Now" button.                                                                      | The connected wallet prompts for a transaction confirmation, showing the correct ETH amount.                |
| **TC-3.4**   | Confirm the transaction in the wallet.                                                           | The application shows a "Processing" state, followed by a "Success" confirmation message.                   |
| **TC-3.5**   | (Negative) Enter an invalid amount (e.g., zero, non-numeric, or more than balance).              | The "Buy Now" button is disabled, or an appropriate error message is displayed.                             |

### User Story 4: Token Purchase with USDT/USDC
**As a user, I want to purchase BATR tokens using a stablecoin (USDT/USDC).**

| Test Case ID | Step                                                                                             | Expected Result                                                                                             |
| :----------- | :----------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **TC-4.1**   | Select "USDT" or "USDC" as the payment currency.                                                 | The input field is labeled for the selected stablecoin.                                                     |
| **TC-4.2**   | Enter a valid amount of the stablecoin to spend.                                                 | The corresponding amount of BATR is calculated and displayed. The "Approve" button is visible and enabled.  |
| **TC-4.3**   | Click the "Approve" button.                                                                      | The wallet prompts for an approval transaction.                                                             |
| **TC-4.4**   | Confirm the approval transaction in the wallet.                                                  | The application shows a "Processing" state, and upon success, the "Approve" button is replaced by a "Buy Now" button. |
| **TC-4.5**   | Click the "Buy Now" button.                                                                      | The wallet prompts for the final purchase transaction.                                                      |
| **TC-4.6**   | Confirm the purchase transaction in the wallet.                                                  | The application shows a "Processing" state, followed by a "Success" confirmation message.                   |
| **TC-4.7**   | (Negative) Attempt to purchase without approval.                                                 | The "Buy Now" button should not be visible or should be disabled.                                           |
