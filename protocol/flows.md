# Deposit and Withdrawal Flows

This page describes how funds move in and out of Privacy Channels.

## Deposits

A deposit moves funds from the public Stellar network into a Privacy Channel, creating UTXOs assigned to the user's derived addresses. Once deposited, the funds are private — only the user and their provider know the mapping between the user and their UTXOs.

### Direct Deposit

The user has a funded Stellar account and deposits from their public balance.

1. User selects an amount and entropy level in their wallet.
2. The wallet constructs a deposit bundle:
   - Splits the amount into UTXOs based on the chosen entropy level (e.g., MEDIUM = 5 UTXOs of random sizes).
   - Assigns each UTXO to one of the user's derived addresses in the channel.
   - Signs each UTXO operation with the corresponding derived key (secp256r1).
3. The wallet sends the signed bundle to the provider's API.
4. The provider validates the bundle, adds it to the mempool, and batches it with other bundles.
5. The provider submits the batch to the Stellar network from its OpEx account.
6. On-chain: the user's public balance decreases, and new UTXOs appear in the channel.

From an on-chain observer's perspective, the provider's OpEx account submitted a batch containing multiple operations. The observer cannot determine which UTXOs belong to which user.

### Third-Party Ramp Deposit

The user does not have a funded Stellar account — or prefers not to link their public address to the deposit.

1. User initiates a deposit through an external payment method (fiat, credit card, cross-chain transfer).
2. The payment goes to the provider.
3. The provider uses its OpEx/treasury account to fund the channel, creating UTXOs assigned to the user's derived addresses.
4. The user's wallet receives confirmation and updates the private balance.

The user may never need a funded Stellar account. This enables onboarding from fiat or other blockchain networks without any on-chain footprint on Stellar.

## Transfers

A transfer moves funds between users within the same Privacy Channel. The funds never leave the channel.

1. Sender selects a recipient, amount, and entropy level.
2. The wallet constructs a transfer bundle:
   - **Spends** existing UTXOs belonging to the sender (marks them as SPENT).
   - **Creates** new UTXOs assigned to the recipient's derived addresses.
   - Creates change UTXOs back to the sender if the spent UTXOs exceed the transfer amount.
   - Splits outputs based on the chosen entropy level.
3. The bundle is signed and sent to the provider.
4. The provider validates, batches, and submits.

On-chain, the transaction shows UTXOs being spent and new UTXOs being created. Without knowing the mapping between derived addresses and users, an observer cannot determine who sent funds to whom.

## Withdrawals

A withdrawal moves funds from a Privacy Channel back to the public Stellar network.

1. User selects an amount and destination address (can be their own public address or another address).
2. The wallet constructs a withdrawal bundle:
   - Spends existing UTXOs from the user's derived addresses.
   - Includes an operation to transfer the asset from the channel to the destination address.
3. The bundle is signed and sent to the provider.
4. The provider validates, batches, and submits.
5. On-chain: UTXOs are spent, and the destination address receives the funds.

### Withdrawal to Self

The most common case. The user withdraws to their own public Stellar address. The wallet can pre-fill the destination and calculate the maximum withdrawal amount (accounting for fees).

### Withdrawal to Another Address

The user can withdraw directly to any Stellar address. This is functionally a private-to-public transfer — the funds exit the channel and appear at the destination with no on-chain link to the sender's private balance.

## Fee Handling

Every bundle carries a fee. The provider collects fees to cover:

- Stellar network transaction fees (paid by the OpEx account)
- Provider operational costs

Fees are calculated based on the operations in the bundle. The provider's mempool uses the fee as the primary factor (60% weight) in prioritizing bundles. Higher fees result in faster processing.

Users must have sufficient private balance to cover both the transaction amount and the fee. If the private balance is insufficient, the user needs to deposit more funds first.

## Entropy and Batching

The combination of entropy level and mempool batching determines the effective privacy of a transaction:

- **Entropy** controls how many UTXOs a single user's amount is split into.
- **Batching** controls how many users' UTXOs are mixed in a single on-chain transaction.

A transaction with MEDIUM entropy (5 splits) submitted in a batch with 10 other users' transactions creates a mix of potentially 50+ UTXOs in a single on-chain operation. An observer attempting to reconstruct original amounts faces a combinatorial explosion.

See [Entropy and Privacy](../privacy-providers/entropy-and-privacy.md) for detailed analysis of each entropy level.
