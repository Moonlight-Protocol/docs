# Channels

A Privacy Channel is the on-chain smart contract where private transactions actually happen. It hosts the UTXO ledger for a single asset within a single quorum.

## One Asset, One Quorum

Each channel is configured with:
- **One Stellar asset** — either a SEP-41 contract token or a native asset via its SAC (Stellar Asset Contract).
- **One quorum** — the channel inherits its provider registry from the quorum it belongs to.

The channel does not care whether the token is custom or native, as long as it implements the standard token interface (transfer, balance, etc.).

## What a Channel Does

- **Accepts deposits** — users (or providers on their behalf) transfer assets into the channel. The channel allocates the matching balance to newly created UTXOs.
- **Processes bundles** — providers submit batches of bundles. The channel validates signatures, checks balance conservation, and updates the UTXO set atomically.
- **Handles withdrawals** — UTXOs are spent, and the corresponding asset value is sent to an external Stellar address.
- **Maintains collateralization** — the channel's on-chain token balance always equals the total value of all unspent UTXOs. No double-spending, minting, or unintended burning is possible.

## Liquidity

All liquidity within a channel is fully collateralized by the underlying asset. The total value of unspent UTXOs equals the channel's token holdings at all times.

Liquidity is scoped to the channel level:
- Two channels for the same asset in different quorums maintain separate pools
- Cross-channel transfers require a provider registered in both quorums to bridge the operation

## Channel Creation

In the current protocol version, channels are deployed by the quorum admin:

1. Admin deploys the channel contract, specifying the asset and the governing quorum
2. The channel reads its provider registry from the quorum
3. Providers can immediately begin submitting bundles

{% hint style="info" %}
Channel creation parameters (asset, quorum, initial configuration) are set at deployment time. The whitepaper's On-chain Privacy Channel section covers the technical internals in detail.
{% endhint %}
