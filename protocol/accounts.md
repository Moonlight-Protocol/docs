# Accounts and Keys

Moonlight uses several distinct account types and key pairs, each with a specific role. Understanding the separation between them is important for deployment, security, and operations.

## Account Types

### Admin Account

A funded Stellar account that deploys and initializes smart contracts. The admin registers providers in council contracts and can update contract configuration.

In the current implementation, a single admin address controls each council. This address can be a standard Stellar account or a multi-signature account, enabling shared governance without any contract changes. See [Governance](../councils/governance.md) for details on the multi-sig path.

### Provider Identity Key (Off-chain)

An Ed25519 key pair that identifies a Privacy Provider within the protocol. This key is registered in a council contract and is used to sign bundles, certifying that the provider reviewed and approved the transactions.

The Ed25519 public key maps to a Stellar account address (`G...`) via the standard Stellar key encoding. It does not need to be a funded on-chain account — it can exist purely as a cryptographic identity. However, because it is a valid Stellar address, it can optionally be set up as a funded account with multiple signers, enabling multi-signature control over the provider identity.

The provider identity key is what links a bundle to a specific provider during audits. If a regulator needs to trace a transaction, this key identifies which provider processed it.

### OpEx (Operating Expense) Account

A funded Stellar account that handles operational finances. It pays network fees for every batch submission and moves funds in and out of channels on behalf of users during deposits and withdrawals.

The OpEx account is deliberately separate from the provider identity key:

- **No administrative power.** The OpEx account only handles money — it cannot modify contracts or provider registrations.
- **Cost isolation.** Dedicated operational accounts enable clear tracking of network fees, ramp flows, and cost centers.
- **Security separation.** If the OpEx key is compromised, the attacker can spend operational funds but cannot impersonate the provider in the protocol. If the provider identity key is compromised, the attacker can sign bundles but has no access to funds.
- **Scaling flexibility.** A provider can use multiple OpEx accounts to parallelize operations, manage cost centers, or isolate breach impact.

### User Keys

End users hold a secp256r1 (P256) key pair. From this root key pair, the wallet derives up to 300 addresses per channel. Each derived address can own UTXOs independently.

Users may or may not have a funded Stellar account:

- **With a Stellar account:** Can deposit directly from their public balance into a channel.
- **Without a Stellar account:** Can onboard through a third-party ramp flow where the provider funds the channel on their behalf.

## Key Summary

| Key / Account | On-chain? | Purpose | Who holds it |
|---------------|-----------|---------|-------------|
| Admin | Yes (funded) | Deploy contracts, register providers, update config | Council operator(s) |
| Provider identity | Stellar Address (not necessarily funded) | Sign bundles, identify provider for audit. Can have multisig signers. | PP operator |
| OpEx / Treasury | Yes (funded) | Pay fees, move funds in/out of channels | PP operator |
| User root key | No (key pair only) | Derive channel addresses, sign UTXO operations | End user (wallet) |
| User derived addresses | No (virtual) | Own UTXOs within a channel | Derived from user root key |

## Deployment Considerations

Provider identity keys and OpEx account keys must be stored securely. In a hosted environment (e.g., Fly.io), use the platform's secret management (Fly.io secrets, similar to AWS Secrets Manager) to inject keys at runtime rather than storing them in configuration files or environment variables at rest.

Key rotation for the OpEx account is straightforward — fund a new account, update the provider configuration, and drain the old account. Provider identity key rotation requires re-registration in the council contract, since the identity key is what the contract uses to verify bundle signatures.
