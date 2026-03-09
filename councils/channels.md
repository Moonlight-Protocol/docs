# Channels

A Privacy Channel is the on-chain smart contract where private transactions happen. It hosts the UTXO ledger for a single asset.

## One Asset Per Channel

Each channel is configured with:
- **One Stellar asset** — either a SEP-41 contract token or a native asset via its SAC (Stellar Asset Contract).
- **One Channel Auth contract** — maintains the provider registry and admin for this channel.

The channel does not care whether the token is custom or native, as long as it implements the standard token interface (transfer, balance, etc.).

## What a Channel Does

- **Accepts deposits** — users (or providers on their behalf) transfer assets into the channel. The channel allocates the matching balance to newly created UTXOs.
- **Processes bundles** — providers submit batches of bundles. The channel validates signatures, checks balance conservation, and updates the UTXO set atomically.
- **Handles withdrawals** — UTXOs are spent, and the corresponding asset value is sent to an external Stellar address.
- **Maintains collateralization** — the channel's on-chain token balance always equals the total value of all unspent UTXOs. No double-spending, minting, or unintended burning is possible.

## Liquidity

All liquidity within a channel is fully collateralized by the underlying asset. The total value of unspent UTXOs equals the channel's token holdings at all times.

Each channel is an independent liquidity pool. Cross-channel transfers require a provider registered in both channels to bridge the operation.

## Channel Creation

Channels are deployed with two key parameters:
1. The asset the channel handles
2. The Channel Auth contract address that controls its provider registry

The Channel Auth contract's admin manages the provider set for the channel.

{% hint style="info" %}
The whitepaper's On-chain Privacy Channel section covers the technical internals (UTXO module, transaction processing, liquidity management) in detail.
{% endhint %}
