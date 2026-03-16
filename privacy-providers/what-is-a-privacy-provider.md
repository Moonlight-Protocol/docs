# What is a Privacy Provider?

A Privacy Provider is an authorized entity that acts as the relay layer between end-users and on-chain Privacy Channels. Providers collect user-signed transaction bundles, validate them, optionally enhance privacy through mixing, and submit them to the channel from their own on-chain address. This breaks the direct link between users and their on-chain activity.

## Two Components

Every Privacy Provider has two distinct identities:

**Key pair identifier (off-chain)**
An Ed25519 key pair that identifies the provider within the protocol. This key pair is registered in a quorum (council) smart contract and is used to sign and authorize bundles. The public key maps to a Stellar account address (G...) but it does not need to be a funded on-chain account — it exists as a cryptographic identity.

**Treasury account (on-chain)**
A funded Stellar account that pays network fees and moves funds in and out of channels on behalf of users. This is the address that appears on-chain when bundles are submitted. One treasury account per provider.

## What a Provider Does

- **Receives user bundles** via a standardized API (SEP-10 authenticated sessions)
- **Validates** bundle signatures and structure
- **Enhances privacy** by optionally adding mixing operations (additional inputs/outputs) to increase entropy
- **Submits batches** to the Privacy Channel from its treasury address
- **Manages a mempool** that queues, prioritizes, and executes bundles
- **Holds transaction data** linking off-chain user sessions to on-chain activity, for audit purposes
- **Processes deposits** including third-party ramp flows where users pay the provider directly (fiat, cross-chain) and the provider funds the channel from its treasury

## Privacy Guarantees

- A provider only has access to transactions processed through it. If a user switches to another provider, the new provider has no history of previous transactions.
- On-chain, observers see only the provider's treasury address submitting bundles — not the individual users involved.
- An auditing organization can identify which provider submitted a bundle and contact that provider for details. The provider maintains the off-chain records needed to respond.

## Relationship to Councils

Every provider must be registered in at least one quorum (council) smart contract. The quorum administrator adds the provider's key pair identifier to the on-chain registry. Only registered providers can submit bundles to channels governed by that quorum.

A provider can be registered in multiple quorums, enabling it to serve channels across different regions, asset types, or compliance regimes.
