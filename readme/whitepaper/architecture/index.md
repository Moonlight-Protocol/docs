# Architecture

Moonlight is designed as a layered protocol that prescribes core guidelines and shared infrastructure while leaving room for participating entities to personalize and extend. Each layer builds on the guarantees of the one below it: a standardized foundation ensures end-to-end privacy and atomicity, while well-defined extension points let SDKs, privacy providers, and on-chain modules adapt to diverse use cases and regulatory regimes without sacrificing interoperability.

**On-Chain Privacy Channels**\
Modular Privacy Channel contracts and UTXO modules codify asset rules, council-based governance, and atomic bundle execution directly on Stellar’s ledger. These contracts validate bundle integrity, enforce on-chain membership criteria, and record state transitions in an append-only log. Any extension, whether for new asset types, governance thresholds or custom fee strategies, plugs into clearly defined entry points, keeping all privacy guarantees verifiable under the network’s immutable security.

**Provider Layer**\
We define a unified API surface, anchored in SEP-10 authentication and an extensible JSON-RPC schema, that all privacy providers implement for bundling, compliance checks, fee management and optional value-added services. By following the same handshake and bundle-submission workflows, providers interoperate seamlessly while retaining the freedom to introduce bespoke features such as customized KYC flows, rate-limiting policies or off-chain analytics.

**Client Layer**\
Our non-custodial SDK abstracts the protocol’s complexity into a seamless developer and user experience. It handles master-key derivation and address generation, tracks and assembles UTXO fragments, and bundles transactions according to on-chain requirements. Developers can integrate custom UX components or key-management schemes, yet every implementation speaks the same transaction-bundling language, ensuring compatibility with any compliant privacy provider.


