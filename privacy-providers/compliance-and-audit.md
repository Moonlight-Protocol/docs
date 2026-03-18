# Compliance and Audit

Privacy is not anonymity. Moonlight's regulatory readiness depends on Privacy Providers maintaining the ability to trace, report, and produce records when required by their governing council or by jurisdiction.

## Core Principle

Every provider holds the off-chain data needed to link on-chain activity to authenticated user sessions. This data is never written to the blockchain — it remains under the provider's control and is disclosed only when legally or contractually required.

## What Providers Must Record

For every bundle processed, the provider maintains:

- **Session identity** — the user's public key from SEP-10 authentication
- **Bundle details** — the full bundle as received (inputs, outputs, signatures)
- **Submission record** — the on-chain transaction hash, ledger number, and timestamp
- **Outcome** — success or failure, including failure reason if applicable

For ramp deposits, additionally:

- **Payment reference** — the external payment identifier (fiat transaction ID, cross-chain tx hash)
- **Amount and source** — what the user paid and through which method

## Audit Flow

1. **Identification** — an auditing organization observes a bundle on-chain and identifies the submitting provider from the treasury address.
2. **Contact** — the auditor contacts the provider through established channels (defined by the council's compliance policy).
3. **Disclosure** — the provider produces the relevant session and bundle records for the auditor's review.
4. **Scope** — the provider can only disclose records for transactions it processed. It has no visibility into transactions handled by other providers, even within the same channel.

## Council Oversight

Councils set the compliance requirements for their registered providers. This may include:

- Minimum data retention periods
- Required KYC/KYB procedures for user onboarding
- Reporting obligations and formats
- Response time requirements for audit requests

{% hint style="warning" %}
Council governance and compliance policy enforcement mechanisms are under development. The current protocol version uses centralized admin control. Future versions will introduce on-chain policy definitions and automated compliance checks.
{% endhint %}

## Data Retention

Providers must retain audit records for the duration specified by their council's policy and applicable jurisdiction. Records should be stored securely with appropriate access controls.

When a user switches providers, the previous provider retains records of past transactions but receives no further data. The new provider starts with no history of the user's previous activity.

## Regulatory Positioning

Moonlight's compliance model positions Privacy Providers as accountable intermediaries:

- **To regulators**: providers can demonstrate that transaction data is available on demand, distinguishing Moonlight from permissionless privacy protocols.
- **To users**: privacy is preserved in normal operation. Data is disclosed only through formal audit processes, not by default.
- **To councils**: providers operate within a governance framework that can enforce jurisdiction-specific requirements without changing the underlying protocol.
