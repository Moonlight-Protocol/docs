# API Reference

Complete reference for all public classes in `@moonlight/moonlight-sdk` v0.7.0.

---

## StellarDerivator

Derives P256 UTXO keypairs deterministically from a Stellar secret key, bound to a specific network and contract.

### Factory

```typescript
StellarDerivator.createForAccount(
  secretKey: string,          // Stellar secret key (S...)
  networkPassphrase: string,  // e.g. "Test SDF Network ; September 2015"
  contractId: string          // Privacy Channel contract ID
): StellarDerivator
```

### Builder Pattern

```typescript
const derivator = new StellarDerivator()
  .withNetworkAndContract(networkPassphrase, contractId)
  .withSecretKey(secretKey);
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `deriveKeypair(index: number)` | `UTXOKeypairBase` | Derive a P256 keypair at the given index (0-299) |

### StellarNetworkId

```typescript
enum StellarNetworkId {
  Mainnet = "Public Global Stellar Network ; September 2015",
  Testnet = "Test SDF Network ; September 2015",
  Futurenet = "Test SDF Future Network ; October 2022",
}
```

---

## PrivacyChannel

Client for interacting with a deployed Privacy Channel smart contract.

### Constructor

```typescript
new PrivacyChannel(
  networkConfig: NetworkConfig,  // { rpcUrl, networkPassphrase }
  channelId: string,             // Privacy Channel contract ID
  authId: string,                // Channel Auth contract ID
  assetId: string,               // Asset contract ID (e.g. XLM SAC)
  options?: { tracer?: MoonlightTracer }
)
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getChannelId()` | `string` | The Privacy Channel contract ID |
| `getAuthId()` | `string` | The Channel Auth contract ID |
| `getAssetId()` | `string` | The asset contract ID |
| `getNetworkConfig()` | `NetworkConfig` | Network configuration |
| `getDerivator()` | `StellarDerivator` | A derivator pre-configured for this channel |
| `getBalancesFetcher()` | `BalanceFetcher` | A function to query UTXO balances on-chain |
| `read(method, args?)` | `Promise<any>` | Read contract state (no transaction) |
| `invoke(method, args?, signer?)` | `Promise<any>` | Invoke a contract method (submits a transaction) |
| `invokeRaw(operation, signer)` | `Promise<any>` | Invoke with raw `xdr.Operation` and `LocalSigner` |

### Read Methods

```typescript
// Get the admin address
const admin = await channel.read("admin");

// Get the asset contract address
const asset = await channel.read("asset");

// Get the linked auth contract address
const auth = await channel.read("auth");

// Get total supply locked in the channel
const supply = await channel.read("supply");

// Get a single UTXO balance (-1 = nonexistent, 0 = spent, >0 = unspent)
const balance = await channel.read("utxo_balance", { utxo: publicKeyBytes });

// Get multiple UTXO balances at once
const balances = await channel.read("utxo_balances", { utxos: [pk1, pk2, pk3] });
```

### Invoke Methods

```typescript
// Submit a transaction (use MoonlightTransactionBuilder instead for most cases)
await channel.invoke("transact", { op: channelOperation }, signer);

// Admin operations
await channel.invoke("set_admin", { new_admin: newAdminAddress }, adminSigner);
await channel.invoke("upgrade", { wasm_hash: wasmHash }, adminSigner);
```

---

## ChannelAuth

Client for interacting with a deployed Channel Auth (council) smart contract.

### Constructor

```typescript
new ChannelAuth(
  networkConfig: NetworkConfig,
  authId: string  // Channel Auth contract ID
)
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getNetworkConfig()` | `NetworkConfig` | Network configuration |
| `getAuthId()` | `string` | The Channel Auth contract ID |
| `read(method, args?)` | `Promise<any>` | Read contract state |
| `invoke(method, args?, signer?)` | `Promise<any>` | Invoke a contract method |

### Read Methods

```typescript
// Get admin address
const admin = await auth.read("admin");

// Check if an address is a registered provider
const isProvider = await auth.read("is_provider", { provider: providerAddress });
```

### Invoke Methods

```typescript
// Register a provider (admin only)
await auth.invoke("add_provider", { provider: providerAddress }, adminSigner);

// Remove a provider (admin only)
await auth.invoke("remove_provider", { provider: providerAddress }, adminSigner);

// Transfer admin rights (admin only)
await auth.invoke("set_admin", { new_admin: newAdminAddress }, adminSigner);

// Upgrade contract (admin only)
await auth.invoke("upgrade", { wasm_hash: wasmHash }, adminSigner);
```

---

## UtxoBasedStellarAccount

Manages a collection of derived UTXO keypairs with state tracking and balance loading.

### Factory

```typescript
const account = UtxoBasedStellarAccount.fromPrivacyChannel(channel);
// channel: PrivacyChannel instance
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `deriveBatch(secretKey, count)` | `void` | Derive `count` keypairs starting from the current index |
| `batchLoad()` | `Promise<void>` | Fetch balances from the network for all derived UTXOs |
| `getTotalBalance()` | `bigint` | Sum of all UNSPENT UTXO balances |
| `getUTXOsByState(state)` | `UTXOKeypair[]` | Filter UTXOs by state (FREE, UNSPENT, SPENT) |
| `selectUTXOsForTransfer(amount, strategy?)` | `UTXOSelectionResult` | Select UTXOs to cover a transfer amount |
| `reserveUTXOs(keypairs, ttl?)` | `void` | Reserve UTXOs for a pending transaction |
| `releaseStaleReservations()` | `void` | Release reservations past their TTL |
| `updateUTXOState(publicKey, state, balance?)` | `void` | Manually update a UTXO's state |

### UTXOSelectionResult

```typescript
interface UTXOSelectionResult {
  selected: UTXOKeypair[];  // UTXOs chosen to cover the amount
  total: bigint;            // Total value of selected UTXOs
  change: bigint;           // Excess amount (needs a change UTXO)
}
```

### UTXOSelectionStrategy

```typescript
enum UTXOSelectionStrategy {
  SEQUENTIAL,  // Pick UTXOs in derivation order
  RANDOM,      // Pick UTXOs randomly (better for privacy)
}
```

### UTXOStatus

```typescript
enum UTXOStatus {
  UNLOADED,  // Derived but not yet checked on-chain
  FREE,      // Never been used on-chain
  UNSPENT,   // Has funds (available to spend)
  SPENT,     // Already consumed
}
```

---

## MoonlightOperation

Represents a single UTXO operation. Use the static factory methods to create operations.

### Factories

```typescript
// Create a new UTXO
MoonlightOperation.create(
  publicKey: Uint8Array,  // 65-byte P256 public key (the new UTXO address)
  amount: bigint
): MoonlightOperation

// Deposit from a public Stellar account into the channel
MoonlightOperation.deposit(
  address: string,  // Stellar address (G...)
  amount: bigint
): MoonlightOperation

// Withdraw from the channel to a public Stellar account
MoonlightOperation.withdraw(
  address: string,  // Stellar address (G...)
  amount: bigint
): MoonlightOperation

// Spend an existing UTXO
MoonlightOperation.spend(
  publicKey: Uint8Array,  // 65-byte P256 public key of the UTXO to spend
  amount: bigint
): MoonlightOperation
```

### Deserialization

```typescript
MoonlightOperation.fromXDR(xdr: Buffer): MoonlightOperation
MoonlightOperation.fromScVal(scVal: xdr.ScVal): MoonlightOperation
MoonlightOperation.fromMLXDR(mlxdr: Uint8Array): MoonlightOperation
```

### Instance Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `addCondition(condition)` | `this` | Attach a condition to this operation |
| `addConditions(conditions)` | `this` | Attach multiple conditions |
| `signWithUTXO(keypair, liveUntilLedger)` | `this` | Sign a SPEND with a P256 keypair |
| `signWithEd25519(keypair, liveUntilLedger)` | `this` | Sign a DEPOSIT with an Ed25519 keypair |
| `toCondition()` | `Condition` | Convert this operation to a condition |
| `toScVal()` | `xdr.ScVal` | Serialize to Soroban ScVal |
| `toXDR()` | `Buffer` | Serialize to XDR |
| `toMLXDR()` | `Uint8Array` | Serialize to MLXDR (Moonlight custom format) |

### Type Guards

```typescript
operation.isCreate()   // true if CREATE
operation.isDeposit()  // true if DEPOSIT
operation.isWithdraw() // true if WITHDRAW
operation.isSpend()    // true if SPEND
```

---

## Condition

Constraints attached to operations for atomic execution guarantees.

### Factories

```typescript
Condition.create(publicKey: Uint8Array, amount: bigint): Condition
Condition.deposit(address: string, amount: bigint): Condition
Condition.withdraw(address: string, amount: bigint): Condition
```

### Deserialization

```typescript
Condition.fromXDR(xdr: Buffer): Condition
Condition.fromScVal(scVal: xdr.ScVal): Condition
Condition.fromMLXDR(mlxdr: Uint8Array): Condition
```

### Instance Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getOperation()` | `string` | The condition type ("create", "deposit", "withdraw") |
| `getAmount()` | `bigint` | The required amount |
| `getPublicKey()` | `Uint8Array \| undefined` | The UTXO public key (for create conditions) |
| `getUtxo()` | `Uint8Array \| undefined` | Alias for getPublicKey |
| `toScVal()` | `xdr.ScVal` | Serialize to Soroban ScVal |
| `toXDR()` | `Buffer` | Serialize to XDR |
| `toMLXDR()` | `Uint8Array` | Serialize to MLXDR |

### Type Guards

```typescript
condition.isCreate()   // true if create condition
condition.isDeposit()  // true if deposit condition
condition.isWithdraw() // true if withdraw condition
```

---

## MoonlightTransactionBuilder

Composes multi-operation Moonlight transactions with all required signatures.

### Constructor

```typescript
new MoonlightTransactionBuilder({
  channelId: string,    // Privacy Channel contract ID
  authId: string,       // Channel Auth contract ID
  assetId: string,      // Asset contract ID
  network: NetworkConfig,
  tracer?: MoonlightTracer,
})
```

### Factory

```typescript
MoonlightTransactionBuilder.fromPrivacyChannel(
  channel: PrivacyChannel
): MoonlightTransactionBuilder
```

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `addOperation(op)` | `this` | Add a `MoonlightOperation` to the transaction |
| `signWithProvider(secretKey, liveUntilLedger)` | `this` | Sign the bundle with the provider's Ed25519 key |
| `signWithSpendUtxo(keypair, liveUntilLedger)` | `this` | Sign a UTXO spend with its P256 keypair |
| `signExtWithEd25519(keypair, liveUntilLedger)` | `this` | Sign a deposit with the depositor's Ed25519 key |
| `getSignedAuthEntries()` | `xdr.SorobanAuthorizationEntry[]` | Get all authorization entries for submission |
| `getInvokeOperation()` | `xdr.Operation` | Get the Stellar `invokeContractFunction` operation |
| `buildXDR()` | `xdr.ScVal` | Build the raw ScVal payload for `transact()` |
| `addProviderInnerSignature(pk, sig, liveUntil)` | `this` | Add a pre-computed provider signature |
| `addExtSignedEntry(entry)` | `this` | Add a pre-signed authorization entry |

---

## MoonlightTracer

Optional interface for distributed tracing (OpenTelemetry compatible). Added in v0.7.0.

### Interface

```typescript
interface MoonlightTracer {
  withActiveSpan<T>(
    name: string,
    fn: (span: MoonlightSpan) => T
  ): T;
}

interface MoonlightSpan {
  setAttribute(key: string, value: string | number | boolean): void;
  setStatus(status: { code: number; message?: string }): void;
  end(): void;
}
```

Pass a tracer to `PrivacyChannel` or `MoonlightTransactionBuilder` via the options/config object. When no tracer is provided, the SDK uses a no-op implementation with zero overhead.

```typescript
const channel = new PrivacyChannel(
  networkConfig, channelId, authId, assetId,
  { tracer: myOpenTelemetryTracer }
);
```

---

## UTXOKeypair

Represents a derived UTXO keypair with state tracking.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `publicKey` | `Uint8Array` | 65-byte uncompressed P256 public key |
| `privateKey` | `Uint8Array` | PKCS#8 encoded P256 private key |
| `status` | `UTXOStatus` | Current state (UNLOADED, FREE, UNSPENT, SPENT) |
| `balance` | `bigint` | Current balance (0 if not loaded or spent) |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `signPayload(payload)` | `Uint8Array` | Sign arbitrary data with P256 ECDSA |
| `load(balanceFetcher)` | `Promise<void>` | Fetch balance from network and update state |
| `updateState(balance)` | `void` | Manually set state from a known balance |

---

## Serialization Formats

The SDK supports three serialization formats:

| Format | Description | Use case |
|--------|-------------|----------|
| **ScVal** | Soroban's native value encoding | On-chain contract interaction |
| **XDR** | Stellar's standard binary format | Stellar transaction payloads |
| **MLXDR** | Moonlight custom binary format (prefix `0x30b0`) | Bundle transport between wallet and provider platform |

All operation and condition classes support `toScVal()`, `toXDR()`, `toMLXDR()` and their corresponding `fromScVal()`, `fromXDR()`, `fromMLXDR()` static deserializers.
