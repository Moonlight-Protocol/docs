# Governance

Council governance defines how decisions are made within a quorum: who can join, what rules apply, and how changes are enacted. This is a critical area that will evolve significantly as the protocol matures.

## Current State: Centralized Admin

Today, each quorum has a single admin account that controls all governance actions:

- **Add providers** — register a provider's key pair in the quorum
- **Remove providers** — revoke a provider's registration
- **Deploy channels** — create new channels under the quorum
- **Configure policies** — set operational parameters

This is intentionally simple. For the PoC and early Testnet, centralized control allows rapid iteration without the overhead of consensus mechanisms.

## Future Direction

The admin role is expected to evolve toward decentralized or semi-decentralized governance. Potential models include:

**Multisig administration**
Multiple parties must approve governance actions (e.g., 3-of-5 signers to add a new provider). This is the simplest step beyond single-admin control.

**Council voting**
Registered providers vote on governance decisions. Voting weight could be equal, stake-based, or reputation-based.

**DAO-style governance**
Full on-chain governance with proposals, voting periods, and automated execution. This is the most complex model and likely a later-stage evolution.

**Hybrid models**
Different actions may require different governance levels. For example:
- Adding a provider: multisig approval
- Changing compliance policy: full council vote
- Emergency provider removal: admin unilateral action

{% hint style="warning" %}
Governance mechanism design is tracked as a separate task (Define admin role evolution for quorum contracts). The specific model has not been decided yet.
{% endhint %}

## Policy Enforcement

Councils will eventually enforce policies on their registered providers. Planned capabilities include:

- **Compliance requirements** — minimum KYC/KYB standards, data retention periods, audit response times
- **Operational standards** — uptime requirements, maximum transaction latency, treasury minimums
- **Fee guidelines** — maximum fees, fee transparency requirements
- **Admission criteria** — what a provider must demonstrate to join the quorum

How these policies are defined, stored, and enforced on-chain is still under design.

## Open Questions

- What governance model fits best for the Testnet milestone?
- Should different quorums be able to choose different governance models?
- How does a provider appeal a removal decision?
- What happens to a channel's users if a provider is removed from the quorum?
- Should governance actions have time-locks or cool-down periods?
