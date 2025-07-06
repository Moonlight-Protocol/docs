# On-chain Privacy Channel

In Moonlight, each Privacy Channel is represented by an entry point smart contract deployed with a standardized interface for interaction. Its instance implements the core privacy mechanisms to operate through the protocol while also allowing for unique customization based on the following channel configuration:

**Supported Stellar Asset:** \
As of protocol v1, each channel handles exactly one Stellar asset, either a [SEP-41](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0041.md) contract token or a native asset accessed through the [SAC interface](https://developers.stellar.org/docs/tokens/stellar-asset-contract). When users deposit the asset into the contract, the channel allocates the matching balance to UTXOs created during the deposit.  Withdrawals spend the selected UTXOs, moving the corresponding liquidity from the contract to the receiver address. Both depositors and receivers can be any valid stellar address or smart contract.  As a result, the on-chain asset balance held by the contract always equals the total value represented by outstanding UTXOs, guaranteeing full collateralization of all private transfers.

**Provider Set and Governance:** \
Each Privacy Channel keeps an on chain registry that lists the accounts allowed to act as privacy providers. The registry is maintained by a custom governance that can be defined based on the channel requirements, ensuring a systematic control over verified entities. \
\
These accounts will be authorized to relay stellar transactions and submit bundles for processing within the channel. If any unauthorized account tries to submit a bundle, even if the inner operations are correctly signed, the whole bundle is rejected by the channel as a single unauthorized atomic transaction.\


### Core components:

#### UTXO Module

The UTXO module implements Moonlight’s balance-management logic, replacing a single pool account with a distributed set of individually addressable balances. Every value held inside a Privacy Channel is represented by one or more UTXOs, each tracked independently and manipulated only through state transitions that the module enforces.

**Address format:** Each UTXO is represented by a secp256r1 public key. Possession of the corresponding secret key is required to authorize any operation that changes the UTXO’s state.

**UTXO states:** These are the possible states a UTXO can be represented within the Channel context.

* **`Free`:** When no storage entry exists for the address, it means the address haven't been used in the past its implicit balance is zero.&#x20;
* **`Unspent`:** The address is recorded with a positive balance that can serve as an input. This means the a portion of the liquidity is allocated to this address.
* **`Spent`:** The address is recorded with balance zero and can never be used again. This indicates the address has been consumed in past transactions and cannot be reused.

**UTXO operations:** These are the core operations that can be executed for a UTXO in order to change its state.

* **Create:** Allocates balance to an address that is currently in the Free state, inserting a storage entry and marking it Unspent.&#x20;
* **Spend:** Consumes one or more Unspent outputs, sets their stored balances to zero, and marks them Spent. A spend frees the corresponding value for redistribution within the same execution context.

**Bundles:** A bundle is a set of instructions that combines multiple UTXO operations and signatures to authorize this operations atomically within a single ledger update.

During execution the UTXO module verifies that the total value removed by Spends equals the total value allocated by Creates, ensuring perfect conservation of liquidity inside the bundle scope. If any imbalance is detected the entire bundle reverts.

Because the UTXO module runs inside the Privacy Channel contract, channel-level actions can attach extra liquidity flows to a bundle. Deposits provide additional value that feeds Create operations, while withdrawals route value released by Spends to an external Stellar address. These hooks let the channel add or remove liquidity without relaxing the module’s guarantee that every unit of the asset is always represented by an Unspent output at the end of execution.

**Bundle authorization:** Every UTXO listed in the spend set must include a secp256r1 signature produced with its secret key. The signature is calculated over a deterministic payload that concatenates the channel contract identifier with the bundle context, specifically the expected outputs and their amounts, ensuring the signer explicitly approves the final distribution of value. If any required signature is missing or fails verification, the module aborts and the entire bundle is discarded.

#### **Transaction Processing Module**

This component applies the channel’s rules to every batch of bundles submitted for execution. All transactions enter the channel as batches, and the module enforces the following underlying mechanisms when handling them.

* **Provider validation**\
  Each batch is submitted by a privacy provider. The module checks the submitting address against the on-chain provider registry and confirms the call is properly authenticated by an authorized provider. If the caller is not an an authorized provider the batch is rejected outright, even when every bundle inside it would otherwise be valid.
* **Bundle handling**\
  A batch carries one or more bundles that are processed in list order. The module invokes the UTXO logic to validate each bundle’s signatures and balance conservation, then applies its state updates. Processing is atomic at the batch level: if any bundle fails verification the module rolls back every change, so no bundle in the batch is applied.
* **Liquidity consistency**\
  Throughout execution the module integrates with the liquidity-management layer to track value entering and leaving the contract. After the final bundle is applied it confirms that the channel’s token holdings match the total held by Unspent outputs, ensuring all liquidity remains fully collateralized with no double spending, minting or unintended burning.



**Liquidity Management Module**\
This component integrates the accepted Stellar asset with the UTXO ledger, maintaining a one-to-one relationship between the channel’s token balance and the value recorded in Unspent outputs.

* **Deposit tracking**\
  When the channel receives an asset transfer, the module records the incoming amount and verifies that an equal value is allocated to newly created UTXOs, ensuring every unit of deposited liquidity is immediately represented on the internal ledger.
* **Bundle verification**\
  During bundle execution the module checks that the sum of balances removed from inputs equals the sum added to outputs, and that the contract’s token holdings remain consistent with the total Unspent value after each state update.
* **Withdrawal reconciliation**\
  For outflows the module confirms that the value released to an external Stellar address exactly matches the balances consumed from the corresponding UTXOs, removing that liquidity from the channel’s accounting.

By applying these checks at deposit, transfer, and withdrawal points, the LiquidityManagementModule guarantees that the channel stays fully collateralized and that no token enters or leaves the contract without a matching change in the UTXO set.
