# Whitepaper

::: warning
This document is a work in progress! Key concepts may still be adjusted prior to its first release.
:::

## Abstract

This paper introduces **Moonlight**, a privacy layer built on the Stellar network. Moonlight transforms each account into a constellation of unlinkable UTXOs, shielding balances and payments from public traceability. Provider-managed channels enforce asset-specific rules and bundle transfers, allowing wallets and businesses to offer confidential transactions while users keep full custody of their keys, whether those keys originate on Stellar or any other blockchain. By orchestrating the channel infrastructure and validating trusted providers, Moonlight delivers private, regulation-ready payments without changing Stellar’s underlying consensus.



## Introduction

Public ledgers are powerful tools for trust, but their radical transparency can expose sensitive business relationships, trading strategies, and even personal spending habits. On Stellar, every balance change is recorded in a single, permanent account, enabling chain-analysis tools to map user profiles in minutes. This tension between openness and confidentiality has grown sharper as larger institutions, bound by privacy laws and competitive secrecy, look to adopt open networks without broadcasting internal flows.

Moonlight was conceived to resolve that tension without fragmenting liquidity or compromising self-custody. Rather than pushing activity to a side-chain or relying on custodial mixers, Moonlight adds an opt-in privacy layer directly on Stellar. It lets any wallet or application treat an account as a constellation of discrete UTXO addresses that are mathematically unlinkable on-chain, yet still governed by a single master secret in the user’s possession. Transfers are routed through smart-contract “channels” run by KYB-verified privacy providers; these entities handle compliance paperwork and bundle many user-signed transactions into a single on-chain submission, so external observers see only the provider address, never the user’s.

The result is a system where balances and payments are private by default, regulatory needs are met through accountable providers, and control never leaves the user’s hands. Moonlight aims to make Stellar viable for everything from consumer wallets to enterprise treasuries by delivering privacy, composability, and compliance in one cohesive protocol layer.

####

