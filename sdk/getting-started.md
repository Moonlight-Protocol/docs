# Getting Started

The Moonlight SDK provides tools to deploy, manage, and interact with Moonlight privacy pools on the Stellar network using Soroban smart contracts.

## Installation

The SDK is published on [JSR](https://jsr.io/@moonlight/moonlight-sdk) as `@moonlight/moonlight-sdk`.

```bash
# Deno
deno add jsr:@moonlight/moonlight-sdk

# Node (via npx)
npx jsr add @moonlight/moonlight-sdk
```

Current version: **0.7.0**

## Requirements

- Deno 2.2+ (or Node with JSR compatibility)
- A Stellar account (for signing transactions)
- Access to a Stellar RPC endpoint (testnet or local)

## Quick Overview

The SDK has six main components:

| Component | What it does |
|-----------|-------------|
| `StellarDerivator` | Derives P256 UTXO keypairs from a Stellar secret key |
| `UtxoBasedStellarAccount` | Manages a set of derived UTXOs with balance tracking |
| `PrivacyChannel` | Interacts with Privacy Channel smart contracts |
| `ChannelAuth` | Interacts with Channel Auth (council) smart contracts |
| `MoonlightOperation` | Represents a single operation (create, spend, deposit, withdraw) |
| `MoonlightTransactionBuilder` | Composes and signs multi-operation transactions |

## Basic Flow

A typical Moonlight transaction follows these steps:

1. **Derive keys** from a Stellar secret key using `StellarDerivator`
2. **Load UTXO state** from the network using `UtxoBasedStellarAccount`
3. **Build operations** (deposit, spend, create, withdraw) using `MoonlightOperation`
4. **Compose a transaction** using `MoonlightTransactionBuilder`
5. **Sign** with the appropriate keys (P256 for UTXO spends, Ed25519 for deposits/provider auth)
6. **Submit** the transaction to the Stellar network

## Network Configuration

```typescript
import { PrivacyChannel } from "@moonlight/moonlight-sdk";

// For testnet
const networkConfig = {
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
};

// For local development
const networkConfig = {
  rpcUrl: "http://localhost:8000/soroban/rpc",
  networkPassphrase: "Standalone Network ; February 2017",
};
```

## Next Steps

- [Core Concepts](core-concepts.md) for a deeper look at key derivation, UTXOs, and operations
- [API Reference](api-reference.md) for the full public API
- [Integration Guide](integration-guide.md) for step-by-step examples of common flows
