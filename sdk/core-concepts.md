# Core Concepts

## Key Derivation

Moonlight uses P256 (secp256r1) keypairs for UTXO ownership. These are derived deterministically from a Stellar Ed25519 secret key, so users do not need to manage a separate set of keys.

The derivation path:

```
Stellar secret key (Ed25519)
  + network passphrase
  + Privacy Channel contract ID
  + index (0-299)
  -> SHA-256
  -> HKDF (SHA-256, 48 bytes)
  -> P256 private scalar
  -> Uncompressed P256 public key (65 bytes)
```

Each combination of secret key, network, and contract produces up to 300 unique UTXO addresses. The 65-byte uncompressed public key serves as the UTXO address on-chain.

```typescript
import { StellarDerivator } from "@moonlight/moonlight-sdk";

const derivator = StellarDerivator.createForAccount(
  "SXXXXXXX...",       // Stellar secret key
  "Test SDF Network ; September 2015",  // network passphrase
  "CDMZSH..."          // Privacy Channel contract ID
);

// Derive a single keypair at index 0
const keypair = derivator.deriveKeypair(0);
// keypair.publicKey  -> Uint8Array (65 bytes, uncompressed P256)
// keypair.privateKey -> Uint8Array (PKCS#8 encoded)
```

For more detail on account types and key separation, see [Accounts and Keys](../protocol/accounts.md).

## UTXOs

A UTXO (Unspent Transaction Output) is the fundamental unit of value in Moonlight. Each UTXO has:

- A **public key** (65-byte P256) that identifies and controls it
- A **balance** (amount of the channel's asset, e.g. XLM)
- A **state**: FREE (never used), UNSPENT (has funds), SPENT (already consumed)

UTXOs are created by deposit or transfer operations and consumed by spend or withdraw operations. Once spent, a UTXO cannot be reused.

### UTXO Lifecycle

```
FREE  ->  (deposit/create)  ->  UNSPENT  ->  (spend/withdraw)  ->  SPENT
```

The SDK tracks these states locally through the `UtxoBasedStellarAccount` class, which syncs with the on-chain contract to load current balances.

## Operations

There are four operation types:

| Type | What it does | Signing |
|------|-------------|---------|
| **CREATE** | Allocates a new UTXO with a given amount | No signature needed (the UTXO is new) |
| **DEPOSIT** | Moves funds from a public Stellar account into the channel | Ed25519 (depositor's Stellar key) |
| **WITHDRAW** | Moves funds from the channel to a public Stellar account | P256 (UTXO owner's key) |
| **SPEND** | Consumes a UTXO (used alongside CREATE to transfer privately) | P256 (UTXO owner's key) |

A private transfer works by combining SPEND + CREATE: spend existing UTXOs and create new ones at the recipient's derived addresses. The amounts must balance.

For a walkthrough of how these operations compose into deposit and withdrawal flows, see [Deposit and Withdrawal Flows](../protocol/flows.md).

## Conditions

Conditions are constraints attached to operations that ensure atomic execution. If someone tampers with a bundle mid-way, conditions prevent partial execution.

For example, a deposit operation includes conditions specifying which UTXOs must be created as part of the same transaction. If those creates do not happen, the deposit fails.

```typescript
import { Condition } from "@moonlight/moonlight-sdk";

// "This deposit must create a UTXO at this address with this amount"
const condition = Condition.create(utxoPublicKey, amount);
```

## Bundles and Transactions

A **bundle** is a set of operations that a Privacy Provider groups together. The provider adds its Ed25519 signature to authorize the bundle, then submits it to the Stellar network via the Privacy Channel's `transact()` function.

The `MoonlightTransactionBuilder` handles composing bundles:

1. Add operations (create, spend, deposit, withdraw)
2. Sign UTXO spends with P256 keys
3. Sign deposits with Ed25519 keys
4. Sign the full bundle with the provider's Ed25519 key
5. Build the final Stellar transaction

For details on how bundles are batched and processed, see [Mempool](../privacy-providers/mempool.md).

## Entropy

Entropy is a user-controlled privacy level that determines how many UTXOs a transaction uses:

| Level | UTXOs | Privacy | Cost |
|-------|-------|---------|------|
| LOW | 1 | Minimal | Lowest fees |
| MEDIUM | 5 | Moderate | Medium fees |
| HIGH | 10 | Good | Higher fees |
| V_HIGH | 15-20 | Strong | Highest fees |

More UTXOs means the transaction is harder to trace, especially when batched with other users' operations in the mempool. Channel activity is the dominant privacy factor: a busy channel with MEDIUM entropy provides better privacy than a dead channel with V_HIGH.

For a deeper look at entropy and how it affects privacy, see [Entropy and Privacy](../privacy-providers/entropy-and-privacy.md).
