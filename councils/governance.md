# Governance

## Current State

Each Channel Auth contract has a single admin address. This admin can:

- Add providers to the channel
- Remove providers from the channel
- Transfer admin rights to another address

There is no on-chain voting, policy enforcement, time-locks, or automated governance. The admin address has full control.

## Multi-sig via Stellar

The admin is a Soroban Address. On Stellar, an account can be configured as a multi-sig account at the network level — requiring multiple signers to authorize transactions. This means multi-sig governance can be achieved without changing the contract: the admin address itself becomes a multi-sig account.

## Open Questions

- Should there be a shared governance contract that manages multiple channels (a true "quorum")?
- Should the provider threshold (currently hardcoded to 1) be configurable per channel?
- Should there be a way to enumerate all registered providers (currently only point lookups are supported)?
