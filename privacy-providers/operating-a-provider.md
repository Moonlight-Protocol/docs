# Operating a Provider

This page describes the day-to-day operations of running a Privacy Provider.

## Mempool

The provider platform manages an in-memory transaction queue (mempool) that handles the lifecycle of user bundles:

1. **Intake** — bundles arrive via the API, are validated, and placed into slots.
2. **Prioritization** — bundles are scored using a weighted model:
   - Fee: 60%
   - Age: 30%
   - TTL (time to live): 10%
3. **Execution** — the executor picks bundles from slots, constructs batches, and submits them to the Stellar network.
4. **Verification** — after submission, the verifier confirms that the transaction was included in the ledger and updates bundle status.

Failed bundles may be retried or moved to a dead-letter queue depending on the failure type (network error vs. invalid bundle).

## Treasury Management

The treasury account is the provider's on-chain wallet. It:

- Pays network fees for every batch submission
- Moves funds in and out of channels on behalf of users (deposits, withdrawals)
- Receives ramp payments from users in third-party deposit flows

The reference implementation includes automatic top-up logic that replenishes the operational (OpEx) account when its balance drops below a threshold.

**Key considerations:**

- Monitor treasury balance to avoid failed submissions due to insufficient funds
- Track inflows and outflows for accounting and reconciliation
- Separate operational funds from user-deposited funds in bookkeeping

## User Onboarding

Providers onboard users through a SEP-10 authentication flow:

1. User's wallet requests a challenge from the provider API.
2. Provider issues a challenge transaction.
3. User signs the challenge with their master key.
4. Provider verifies the signature and creates an authenticated session.

All subsequent API calls are bound to that session and the user's public key. The provider maintains the mapping between sessions and on-chain activity for audit purposes.

## Deposit Flows

### Direct Deposit
User has a funded Stellar account. The wallet constructs a deposit bundle that transfers the asset from the user's public balance into the channel, creating UTXOs. The provider validates and submits the bundle.

### Third-Party Ramp
User pays the provider through an external method (fiat payment, cross-chain transfer). The provider uses its treasury to fund the channel on the user's behalf, creating UTXOs assigned to the user's derived addresses. The user may never need a funded Stellar account.

## Monitoring

Providers should monitor:

- Mempool depth and throughput (bundles queued, processed, failed)
- Treasury account balance and transaction history
- Channel state (total liquidity, UTXO counts)
- API availability and response times
- Bundle success/failure rates

The [Provider Console](provider-console.md) provides a web dashboard for monitoring all of these. For deeper observability, the provider platform supports OpenTelemetry tracing — see the Analytics section of the console docs for Grafana panel integration.
