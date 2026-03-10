# Governance

## Current State

Each Channel Auth contract has a single admin address. This admin can:

- Add providers to the channel
- Remove providers from the channel
- Transfer admin rights to another address

There is no on-chain voting, policy enforcement, time-locks, or automated governance. The admin address has full control.

## Multi-sig via Stellar

The admin is a Soroban Address. On Stellar, any account can be configured as a multi-sig account at the network level — requiring multiple signers to authorize transactions.

This means **councils are already possible** without any contract changes:

1. Create a Stellar account to serve as the admin
2. Add signers to that account (the council members)
3. Set the threshold to require N-of-M signatures (e.g., 2-of-3)
4. Deploy Channel Auth contracts with that account as admin

Every governance action (`add_provider`, `remove_provider`, `set_admin`) now requires the council members to co-sign. Signers can be added or removed over time, and thresholds can be changed — all on the same account, without redeploying contracts.

**What Stellar multi-sig provides:**
- Multi-party control over provider management
- No single point of failure
- Add/remove council members at any time
- Adjust thresholds without changing the admin address
- No contract changes required

**What it leaves to the council:**
- How members coordinate and make decisions (off-chain process)
- Per-action governance rules (Stellar thresholds apply uniformly to all admin actions)
- Proposal and voting flows (if needed, the council organizes this themselves)

A council is effectively a multi-sig Stellar account that administers one or more Channel Auth contracts. The protocol does not prescribe how councils organize — it provides the primitives and lets each council define their own process.