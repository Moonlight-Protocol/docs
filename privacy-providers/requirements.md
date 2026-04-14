# Requirements

This page outlines what is needed to become and operate a Privacy Provider on the Moonlight protocol.

## Infrastructure

- **Provider platform server** — the backend service that exposes the standardized API, manages the mempool, processes bundles, and submits batches to the network. A reference implementation is available as open-source software.
- **Funded treasury account** — a Stellar account with sufficient XLM to cover network fees for bundle submissions and operational transactions (OpEx top-ups, fund movements).
- **Persistent storage** — transaction logs, session records, and audit data must be stored durably. The reference implementation supports PostgreSQL.
- **Network connectivity** — reliable access to a Stellar RPC endpoint (Horizon or Soroban RPC) for submitting transactions and monitoring confirmations.

## Registration

1. Generate an Ed25519 key pair that will serve as the provider's identity.
2. Obtain registration in a council smart contract. The council administrator must add the provider's public key to the on-chain registry.
3. Fund a treasury account with enough XLM to cover operational costs.
4. Deploy and configure the provider platform, pointing it at the target network and channels.

::: info
In the current protocol version, council registration is managed by a centralized admin. Future versions will introduce governance mechanisms for provider onboarding.
:::

## Operational Requirements

- **Uptime** — providers must maintain availability for their users. Downtime means users connected to that provider cannot transact privately.
- **Bundle processing** — the mempool must be configured to handle expected throughput. Key parameters include slot capacity, executor parallelism, transaction expiration offsets, and priority weights.
- **Treasury management** — the treasury account must be kept funded. The reference implementation includes automatic OpEx top-up logic.
- **Security** — the provider platform uses three separate secrets, each with a distinct role:
  - **Provider identity key** (`PROVIDER_SK`) — Ed25519. Signs bundles and SEP-10 auth challenges. Compromise allows impersonation of the PP but no access to funds.
  - **OpEx/Treasury key** (`OPEX_SECRET`) — Ed25519. Submits transactions and manages operational funds. Compromise allows spending funds but not impersonating the PP.
  - **Service auth secret** (`SERVICE_AUTH_SECRET`) — 32 random bytes. Signs JWT session tokens for the API. Compromise allows forging user sessions.

  All secrets must be stored securely. In hosted environments (e.g. Fly.io), use the platform's secret management to inject keys at runtime. The key separation ensures no single compromise gives full control.

## Business Model

The provider's revenue comes from fees attached to bundle processing. The current model supports:

- **Per-transaction fees** — a fixed or variable fee added to each bundle processed.
- **Ramp fees** — fees for third-party deposit flows where the provider handles fiat or cross-chain onboarding.

::: warning
Fee structures and business models are still evolving. Future protocol versions may introduce dynamic pricing, rent models for pool participation, and standardized fee discovery for wallets.
:::
