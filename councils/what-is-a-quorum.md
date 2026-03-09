# What is a Quorum?

A quorum is a smart contract deployed on Stellar's Soroban platform that manages a group of Privacy Providers operating together in a shared trusted context. It is the on-chain representation of a council.

## Purpose

The quorum contract serves three functions:

1. **Provider registry** — maintains an on-chain list of authorized Privacy Providers. Only providers registered in the quorum can submit bundles to channels governed by it.
2. **Channel ownership** — a quorum controls one or more Privacy Channels. Each channel is deployed under a specific quorum and inherits its provider set.
3. **Rule enforcement** — defines the operating rules for its providers. Different quorums can operate under different regulations, enabling regional or compliance-specific groupings.

## Structure

```
Quorum (Council)
├── Admin (manages the quorum)
├── Registered Providers
│   ├── Provider A (key pair identifier)
│   ├── Provider B (key pair identifier)
│   └── ...
└── Channels
    ├── Channel: XLM
    ├── Channel: USDC
    └── ...
```

A single quorum can govern multiple channels (one per asset). A single provider can be registered in multiple quorums, enabling it to serve different regions or compliance regimes.

## How It Works Today

In the current protocol version, quorums are managed by a **centralized admin**:

- The admin deploys the quorum contract
- The admin registers and removes providers by adding/removing their key pair identifiers
- The admin deploys channels under the quorum
- There is no on-chain voting, policy enforcement, or automated governance

This is sufficient for the PoC and early Testnet phases. Governance mechanisms are planned for later milestones.

## Regional Grouping

Quorums enable natural regional or jurisdictional grouping. For example:

- A **South American quorum** with banks from Argentina, Brazil, and Chile operating under shared regional regulations
- A **European quorum** with providers subject to GDPR and MiCA requirements
- A **global quorum** with relaxed requirements for general-purpose privacy

Each quorum sets its own rules for provider admission, data retention, and compliance. Providers choose which quorums to join based on their business model and regulatory environment.

## Relationship to Privacy Channels

A Privacy Channel is always deployed under a specific quorum. The channel inherits the quorum's provider registry — only providers registered in that quorum can submit bundles to the channel.

Each channel handles exactly one asset (e.g., XLM, USDC). A quorum can have multiple channels for different assets, but each channel belongs to exactly one quorum.

This means:
- Providers in the same quorum share access to the same set of channels
- Users connected to a provider can access any channel that provider's quorum controls
- Liquidity is scoped to the quorum level — channels in different quorums are separate pools

## Relationship to Privacy Providers

Providers must be registered in a quorum to operate. Registration means the provider's secp256r1 public key is added to the quorum's on-chain registry.

A provider registered in a quorum can:
- Submit bundles to any channel governed by that quorum
- Process deposits and withdrawals for users on those channels
- Add mixing operations to bundles within those channels

A provider can be registered in multiple quorums simultaneously. This enables cross-quorum operation — a provider serving both a regional and a global quorum, for example.
