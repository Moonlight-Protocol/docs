---
icon: file-lines
---

# Whitepaper



## Abstract

This paper introduces **Moonlight**, a privacy layer built on the Stellar network. Moonlight transforms each account into a constellation of unlinkable UTXOs, shielding balances and payments from public traceability. Provider-managed channels enforce asset-specific rules and bundle transfers, allowing wallets and businesses to offer confidential transactions while users keep full custody of their keys, whether those keys originate on Stellar or any other blockchain. By orchestrating the channel infrastructure and validating trusted providers, Moonlight delivers private, regulation-ready payments without changing Stellar’s underlying consensus.



## Introduction

Public ledgers are powerful tools for trust, but their radical transparency can expose sensitive business relationships, trading strategies, and even personal spending habits. On Stellar, every balance change is recorded in a single, permanent account, enabling chain-analysis tools to map user profiles in minutes. This tension between openness and confidentiality has grown sharper as larger institutions, bound by privacy laws and competitive secrecy, look to adopt open networks without broadcasting internal flows.

Moonlight was conceived to resolve that tension without fragmenting liquidity or compromising self-custody. Rather than pushing activity to a side-chain or relying on custodial mixers, Moonlight adds an opt-in privacy layer directly on Stellar. It lets any wallet or application treat an account as a constellation of discrete UTXO addresses that are mathematically unlinkable on-chain, yet still governed by a single master secret in the user’s possession. Transfers are routed through smart-contract “channels” run by KYB-verified privacy providers; these entities handle compliance paperwork and bundle many user-signed transactions into a single on-chain submission, so external observers see only the provider address, never the user’s.

The result is a system where balances and payments are private by default, regulatory needs are met through accountable providers, and control never leaves the user’s hands. Moonlight aims to make Stellar viable for everything from consumer wallets to enterprise treasuries by delivering privacy, composability, and compliance in one cohesive protocol layer.

## The Privacy & Traceability Challenge

Stellar’s open ledger and other DLTs are designed for verifiability: every account, balance change, and payment path is publicly recorded and permanently accessible. That transparency fuels trust, yet it also invites sophisticated chain analysis. With a few queries, observers can correlate deposit patterns, payment routes, and order-book activity to identify counterparties and reconstruct entire cash-flow histories. For individuals, this means every purchase or salary receipt can be traced; for businesses, competitive strategies and supplier relationships are laid bare.

For regulated institutions, the public nature of a blockchain poses a different cost: transparency **sacrifices confidentiality**. Because every transaction is linkable, a single exposed payment can deanonymize an entire historical balance sheet, making it difficult to satisfy data-protection mandates while still enjoying the native settlement guarantees of an open network. At the same time, frameworks such as the Travel Rule demand that originator and beneficiary information be available to the right parties on demand, tightening the paradox between privacy and visibility.

Existing workarounds each carry heavy drawbacks. Custodial methods (mixers or private wallets) can obscure flows but require users to surrender control of their funds and place full trust in a third-party intermediary. Private side-chains create walled gardens, fragmenting liquidity and breaking composability with the broader blockchain ecosystem. Layering zero-knowledge proofs directly on account-based balances is theoretically possible, but it demands heavyweight circuits and complex trusted-setup workflows. Moonlight pursues the same privacy end-state with lighter, purpose-built techniques that align more naturally with Soroban’s efficient resource model.

What the ecosystem lacks is a solution that keeps assets on Stellar, preserves user self-custody, provides robust privacy, and still offers hooks for compliance when required. Moonlight is designed to meet all four constraints simultaneously, laying the groundwork for confidential consumer payments, enterprise treasury operations, and regulated financial products to coexist on the same public network.





