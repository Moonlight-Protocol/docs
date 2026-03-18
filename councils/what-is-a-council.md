# What is a Council?

In Moonlight, a council is the governance entity that controls which providers can operate on a channel. On-chain, this is implemented by the **Channel Auth contract** — each Privacy Channel is deployed with its own Channel Auth contract that maintains the list of authorized providers for that channel.

## What It Does

The Channel Auth contract exposes a minimal interface:

| Function | Who can call | What it does |
|---|---|---|
| `add_provider(provider)` | Admin only | Register a provider's address |
| `remove_provider(provider)` | Admin only | Unregister a provider |
| `is_provider(provider)` | Anyone | Check if an address is registered |
| `set_admin(new_admin)` | Admin only | Transfer admin rights |
| `admin()` | Anyone | Read current admin address |

That's the full governance surface today.

## How It Works

Each Privacy Channel is deployed with a reference to its Channel Auth contract. When a provider submits a bundle to the channel, the channel calls `require_provider()` on the auth contract to verify the submitting address is registered. If not, the entire batch is rejected.

The admin is a single Soroban Address set at deployment time. This address controls all provider lifecycle operations for that channel.

## One Council Per Channel

Each channel has its own Channel Auth contract with its own admin and its own provider set. There is no shared council contract that governs multiple channels. If the same providers need to operate across multiple channels, they must be registered in each channel's auth contract individually.

## Provider Threshold

The current implementation requires exactly one registered provider signature per transaction (hardcoded threshold of 1). The provider signs with Ed25519, and UTXO owners sign with secp256r1. Both signatures are required.

## Relationship to Privacy Providers

A provider registered in a channel's council can:
- Submit bundles to that channel
- Process deposits and withdrawals for users on that channel
- Add mixing operations to bundles within that channel

To operate across multiple channels, a provider must be registered in each channel's council separately.
