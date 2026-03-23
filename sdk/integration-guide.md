# Integration Guide

Step-by-step examples for common Moonlight SDK flows. All examples use testnet configuration.

## Setup

```typescript
import {
  PrivacyChannel,
  UtxoBasedStellarAccount,
  MoonlightOperation,
  MoonlightTransactionBuilder,
  Condition,
} from "@moonlight/moonlight-sdk";
import { Keypair } from "@stellar/stellar-sdk";

// Contract IDs (testnet)
const CHANNEL_ID = "CDMZSHMT2AIL2UG7XBOHZKXM6FY3MUP75HAXUUSAHLGRQ2VWPGYKPM5T";
const AUTH_ID = "CAF7DFHTPSYIW5543WBXJODZCDI5WF5SSHBXGMPKFOYPFRDVWFDNBGX7";
const ASSET_ID = "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC";

const networkConfig = {
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
};

// Initialize the Privacy Channel client
const channel = new PrivacyChannel(networkConfig, CHANNEL_ID, AUTH_ID, ASSET_ID);
```

## 1. Derive Keys and Load Balances

Before any transaction, derive UTXO keypairs and check their on-chain state.

```typescript
// Create an account manager from the channel
const account = UtxoBasedStellarAccount.fromPrivacyChannel(channel);

// Derive 10 keypairs from the user's Stellar secret key
const userSecretKey = "SXXXXXXX...";
account.deriveBatch(userSecretKey, 10);

// Load balances from the network
// This checks each derived UTXO's on-chain state and updates:
//   FREE     -> never used
//   UNSPENT  -> has funds
//   SPENT    -> already consumed
await account.batchLoad();

// Check total available balance
const balance = account.getTotalBalance();
console.log(`Available: ${balance} stroops`);

// Get UTXOs by state
const available = account.getUTXOsByState("UNSPENT");
const unused = account.getUTXOsByState("FREE");
```

## 2. Deposit Funds into a Channel

Move funds from a public Stellar account into the privacy channel.

```typescript
const depositAmount = 1000000000n; // 100 XLM in stroops
const userKeypair = Keypair.fromSecret(userSecretKey);

// Pick a FREE UTXO to receive the deposit
const freeUtxos = account.getUTXOsByState("FREE");
const targetUtxo = freeUtxos[0];

// Build the operations:
// 1. CREATE - allocate a new UTXO at the target address
// 2. DEPOSIT - move funds from the public account into the channel

const createOp = MoonlightOperation.create(targetUtxo.publicKey, depositAmount);
const depositOp = MoonlightOperation.deposit(userKeypair.publicKey(), depositAmount);

// Add conditions: the deposit requires the create to happen atomically
const createCondition = Condition.create(targetUtxo.publicKey, depositAmount);
depositOp.addCondition(createCondition);

// Build the transaction
const txBuilder = MoonlightTransactionBuilder.fromPrivacyChannel(channel);
txBuilder.addOperation(createOp);
txBuilder.addOperation(depositOp);

// Sign the deposit with the user's Ed25519 key (proves account ownership)
const currentLedger = 12345; // get from network
const liveUntilLedger = currentLedger + 100;
txBuilder.signExtWithEd25519(userKeypair, liveUntilLedger);

// Sign with the provider's key (authorizes the bundle)
txBuilder.signWithProvider(providerSecretKey, liveUntilLedger);

// Get the Stellar operation and auth entries for submission
const invokeOp = txBuilder.getInvokeOperation();
const authEntries = txBuilder.getSignedAuthEntries();
```

## 3. Private Transfer (Spend + Create)

Transfer funds privately within the channel. This spends existing UTXOs and creates new ones at the recipient's addresses.

```typescript
const transferAmount = 500000000n; // 50 XLM

// Select UTXOs to cover the transfer
const selection = account.selectUTXOsForTransfer(transferAmount);
// selection.selected  -> UTXOs to spend
// selection.total     -> total value of selected UTXOs
// selection.change    -> excess amount that needs a change UTXO

// Recipient's derived public key (they derive this from their own secret key)
const recipientPublicKey = recipientUtxo.publicKey; // 65-byte Uint8Array

// Build operations
const txBuilder = MoonlightTransactionBuilder.fromPrivacyChannel(channel);

// Spend the selected UTXOs
for (const utxo of selection.selected) {
  const spendOp = MoonlightOperation.spend(utxo.publicKey, utxo.balance);

  // Add conditions: this spend requires the recipient's create
  spendOp.addCondition(Condition.create(recipientPublicKey, transferAmount));

  txBuilder.addOperation(spendOp);

  // Sign each spend with the UTXO's P256 key
  txBuilder.signWithSpendUtxo(utxo, liveUntilLedger);
}

// Create UTXO for the recipient
txBuilder.addOperation(MoonlightOperation.create(recipientPublicKey, transferAmount));

// If there is change, create a UTXO back to the sender
if (selection.change > 0n) {
  const changeUtxo = account.getUTXOsByState("FREE")[0];
  txBuilder.addOperation(MoonlightOperation.create(changeUtxo.publicKey, selection.change));
}

// Provider signs the bundle
txBuilder.signWithProvider(providerSecretKey, liveUntilLedger);

const invokeOp = txBuilder.getInvokeOperation();
const authEntries = txBuilder.getSignedAuthEntries();
```

## 4. Withdraw Funds from a Channel

Move funds from the privacy channel back to a public Stellar account.

```typescript
const withdrawAmount = 200000000n; // 20 XLM

// Select UTXOs to cover the withdrawal
const selection = account.selectUTXOsForTransfer(withdrawAmount);
const txBuilder = MoonlightTransactionBuilder.fromPrivacyChannel(channel);

// Spend UTXOs
for (const utxo of selection.selected) {
  const spendOp = MoonlightOperation.spend(utxo.publicKey, utxo.balance);
  txBuilder.addOperation(spendOp);
  txBuilder.signWithSpendUtxo(utxo, liveUntilLedger);
}

// Withdraw to the user's public Stellar address
const withdrawOp = MoonlightOperation.withdraw(userKeypair.publicKey(), withdrawAmount);
txBuilder.addOperation(withdrawOp);

// Create change UTXO if needed
if (selection.change > 0n) {
  const changeUtxo = account.getUTXOsByState("FREE")[0];
  txBuilder.addOperation(MoonlightOperation.create(changeUtxo.publicKey, selection.change));
}

// Provider signs
txBuilder.signWithProvider(providerSecretKey, liveUntilLedger);

const invokeOp = txBuilder.getInvokeOperation();
const authEntries = txBuilder.getSignedAuthEntries();
```

## 5. Query Channel State

Read on-chain state without submitting transactions.

```typescript
// Total supply locked in the channel
const supply = await channel.read("supply");
console.log(`Channel supply: ${supply}`);

// Check if an address is a registered provider
const auth = new ChannelAuth(networkConfig, AUTH_ID);
const isProvider = await auth.read("is_provider", { provider: "GABC..." });

// Check a specific UTXO's balance
const utxoBalance = await channel.read("utxo_balance", {
  utxo: somePublicKeyBytes,
});
// Returns: -1 (nonexistent), 0 (spent), or >0 (unspent with that balance)

// Batch query multiple UTXOs
const balances = await channel.read("utxo_balances", {
  utxos: [pk1, pk2, pk3],
});
```

## 6. Council Management

Deploy and manage councils using the Channel Auth contract.

```typescript
import { ChannelAuth } from "@moonlight/moonlight-sdk";

const auth = new ChannelAuth(networkConfig, AUTH_ID);

// Check current admin
const admin = await auth.read("admin");

// Register a new provider (admin only)
await auth.invoke("add_provider", { provider: providerAddress }, adminSigner);

// Remove a provider (admin only)
await auth.invoke("remove_provider", { provider: providerAddress }, adminSigner);

// Transfer admin rights (admin only)
await auth.invoke("set_admin", { new_admin: newAdminAddress }, adminSigner);
```

For more on council operations and governance, see [What is a Council?](../councils/what-is-a-council.md) and [Governance](../councils/governance.md).

## Working with the Provider Platform

In production, end users do not submit transactions directly to the Stellar network. Instead, they build bundles and send them to a Privacy Provider's API, which handles mempool batching and submission.

The flow:

1. User builds operations and signs with their P256/Ed25519 keys
2. User serializes the bundle to MLXDR format
3. User sends the MLXDR bundle to the provider's `POST /api/v1/bundle` endpoint
4. Provider adds it to the mempool, batches with other bundles, signs with its key, and submits

```typescript
// Serialize operations to MLXDR for the provider
const mlxdrBundle = operations.map(op => op.toMLXDR());

// Send to provider platform
const response = await fetch("https://provider.example.com/api/v1/bundle", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${sessionJwt}`,
  },
  body: JSON.stringify({ operations: mlxdrBundle }),
});
```

For more on how the provider processes bundles, see [Operating a Provider](../privacy-providers/operating-a-provider.md) and [Mempool](../privacy-providers/mempool.md).

## Tracing (Optional)

Add distributed tracing to track operations across the stack.

```typescript
import { PrivacyChannel } from "@moonlight/moonlight-sdk";

// Wrap an OpenTelemetry tracer to match the MoonlightTracer interface
const tracer = {
  withActiveSpan(name, fn) {
    return otelTracer.startActiveSpan(name, (span) => {
      const moonlightSpan = {
        setAttribute: (k, v) => span.setAttribute(k, v),
        setStatus: (s) => span.setStatus(s),
        end: () => span.end(),
      };
      return fn(moonlightSpan);
    });
  },
};

const channel = new PrivacyChannel(
  networkConfig, channelId, authId, assetId,
  { tracer }
);
```

When no tracer is provided, the SDK uses a no-op implementation with zero overhead.
