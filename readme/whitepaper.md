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

## Solving the Traceability Puzzle

Public blockchains achieve trust through transparency, but that same openness exposes several avenues for chain analysis. Moonlight addresses each of these with purpose-built mechanisms that preserve self-custody and composability while removing the data points analysts rely on.

### UTXO Entropy Model

Moonlight replaces the single running balance of an account-based ledger with a UTXO model in which every transfer can consume several existing outputs and create several new ones. Value is continually fragmented: a payment may gather multiple small inputs, spend more than the face value of the intended transfer, and return change to fresh addresses controlled by the sender. The same operation can distribute funds across many outputs, some owned by the recipient and others retained by the sender, without revealing which belong to whom.

Transactions are executed as _bundles_ submitted to a channel contract. A bundle may involve one or many senders and one or many receivers; the on-chain record is simply a set of inputs and a set of outputs whose total values balance. Because address, identity, and amount are no longer linked in a one-to-one pattern, observers cannot infer counterparties or payment size from the ledger alone.

The protocol deliberately leaves tuning space for _entropy_—the degree of fragmentation a wallet applies. Low-entropy settings keep balances concentrated in fewer addresses and minimise resource use and fees; high-entropy settings involve more inputs and outputs, raising cost but maximising privacy. Wallets can expose this spectrum to users, while privacy providers can offer tailored services that further randomise bundles, aggregate multiple users, or inject their own intermediary outputs. By allowing such strategies, Moonlight makes heuristic chain analysis exponentially harder without locking participants into a single privacy posture.

### Key Derivation Scheme

Fragmentation is effective only if it remains invisible to the user. Moonlight hides the underlying web of UTXO addresses behind a single recovery secret by defining a deterministic derivation scheme. Part of the derivation path captures **context**—information about the environment where the keys will operate, such as “Stellar mainnet” and the contract ID of the chosen channel—while another part anchors to the **root secret** the user actually controls, whether that secret is a Stellar seed, an Ethereum private key, or any other cryptographic credential. A standardized stepping function then advances an index so that wallets can generate each new address in an orderly, repeatable sequence.

Because every wallet follows the same formula, a user can back up one mnemonic or hardware key and later recreate the entire constellation of Moonlight addresses on a new device or with a different provider. Centralized control stays intact even as on-chain activity is fragmented, and no piece of the derivation path is exposed on the ledger, preventing clustering heuristics from linking addresses.

This approach offers the same day-to-day experience and security expectations as a conventional non-custodial wallet. Users manage a single private key, view a unified balance, and rely on familiar backup practices. All derived addresses remain secure unless that central secret is compromised, so established best-practice safeguards—hardware storage, multisig custody, or social recovery—continue to apply without modification.

Abstracting the root secret from any specific blockchain format also invites cross-ecosystem participation. A wallet native to Ethereum or another network can derive valid Moonlight addresses directly from the user’s existing key, letting holders move liquidity into Stellar privacy channels without first generating a Stellar account. Conversely, the same derivation logic can be ported to other chains, turning Moonlight into a shared, cross-chain privacy layer rather than an isolated feature of a single network.

### Trusted Privacy Providers

Every transaction on Stellar must be signed and submitted by a visible G-address that pays network fees. If end-users broadcast their own bundles, the sending account instantly links their constellation of UTXOs to a single, traceable identity. Moonlight breaks that link by introducing trusted privacy providers—whitelisted relayers that collect user-signed payloads, pay the base fees, and post the final bundle from their own address. On-chain observers now see only the provider interacting with the channel; the user’s addresses remain off the public radar.

Because the provider runs entirely off-ledger between wallet and channel, it becomes the natural point for jurisdiction-specific checks. A wallet acting as a privacy provider can authenticate the holder through a [SEP-10 web session](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md) tied to the master secret, perform its own KYC, and keep an encrypted audit log—all without writing customer data to the blockchain. The same flow lets providers append a service fee or subsidise costs, creating flexible business models around privacy as a service.

Control stays with the user throughout. Keys never leave the wallet, and a holder can migrate to—or simply route a single payment through—any other whitelisted provider by meeting that entity’s onboarding requirements. The result is a relay layer that satisfies compliance, shields on-chain identity, and preserves the user’s freedom to choose or switch service providers at will.

### Privacy Channel Framework

In Moonlight, a **channel** is an on-chain module composed of one or more coordinated smart contracts that together host a private UTXO ledger. The module exposes a public entry-point interface through which value can enter the pool as deposits, be moved internally via bundled UTXO transactions, and exit back to the account-based layer as withdrawals. Inside the channel, the contracts validate each bundle’s signatures and asset rules, update output sets, and maintain an auditable record of total inflows and outflows.

Moonlight’s registry links each channel to a roster of whitelisted privacy providers, enabling both open pools and tightly scoped consortia. A GDPR-oriented channel, for example, might accept only EURC, enforce region-specific policies, and list only verified European providers serving compliant users. A public multi-asset channel could relax those constraints while still protecting on-chain identities behind provider addresses.

Because channels are modular, businesses can encode asset lists, membership criteria, and verification hooks that match their regulatory stance without forking the protocol or fragmenting liquidity. Whether the goal is a controlled corporate treasury pool or a broad consumer wallet hub, the channel architecture supplies the contract-level flexibility to balance privacy with policy, while every UTXO transaction inside retains Moonlight’s core confidentiality guarantees.

Because each channel’s inflows and outflows pass exclusively through its roster of vetted privacy providers, liquidity need not fracture into isolated pools. A provider that meets the admission criteria of multiple channels can serve as a native bridge: it receives a user-signed payload in one channel, creates the corresponding outputs in another, and settles both sides with a single cross-channel bundle. In the GDPR example, a European provider might operate within the region-restricted EURC pool while also participating in a broader global channel, allowing customers of both environments to transact seamlessly. Users retain full custody of their keys, regulators see funds move only through authorised entities, and the provider earns a fee for privacy-preserving, compliant interoperability, sustaining a unified liquidity surface without compromising channel policies.
