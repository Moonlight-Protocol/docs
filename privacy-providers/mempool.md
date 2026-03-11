# Mempool

The mempool is the transaction queue at the heart of every Privacy Provider. It sits between receiving user bundles and submitting them to the Stellar network. Rather than submitting each bundle as a separate transaction, the mempool groups bundles into **slots** and submits each slot as a single batched transaction.

## Why the Mempool Matters

### Privacy through mixing

If bundles are submitted one-by-one, an observer can correlate when a bundle arrived at the provider with when a transaction appeared on-chain. When bundles are batched into slots, multiple users' operations are interleaved in a single transaction. The more bundles per slot, the harder it is to attribute specific UTXOs to specific users.

The mempool is what makes entropy levels meaningful. Splitting an amount into 5 UTXOs provides real privacy when those UTXOs are mixed with other users' UTXOs in the same batch. Without batching, splitting only adds cost without meaningful obfuscation.

### Cost efficiency

Each Stellar transaction carries a network fee. By batching multiple bundles into a single transaction, the provider amortizes that fee across all users in the batch. One transaction fee covers many users' operations.

### Fairness and reliability

Bundles are scored and prioritized so that higher-fee transactions are processed first, but older transactions gradually rise in priority. Time-to-live (TTL) expiry prevents stale bundles from blocking the queue. Failed transactions are automatically retried.

## How It Works

### Slots

Bundles are organized into **slots**. Each slot has a maximum weight capacity. When a slot is full, new bundles go into the next slot. The executor processes slots in order (first in, first out).

### Weight model

Not all operations cost the same. Spend and withdraw operations are more expensive (they consume more network resources) and carry higher weight. Deposit and create operations are lighter. The weight model ensures fair resource allocation within each slot.

### Priority scoring

Each bundle receives a priority score based on three factors:

| Factor | Weight | What it rewards |
|--------|--------|----------------|
| Fee | 60% | Higher-paying bundles are processed first |
| Age | 30% | Older bundles gradually rise in priority |
| TTL proximity | 10% | Bundles approaching expiry get a boost |

Within each slot, bundles are sorted by priority score. This ensures that if a slot can only partially execute, the most important bundles go first.

### Bundle lifecycle

1. **Intake** — Bundle arrives via the API, is validated, and assigned to a slot based on weight.
2. **Queued** — Bundle waits in its slot. Priority score determines its position.
3. **Execution** — The executor takes the next slot, aggregates all operations, adds a fee operation from the provider's OpEx account, and submits to the Stellar network.
4. **Verification** — After submission, the verifier confirms inclusion in the ledger.
5. **Expiry** — Bundles that exceed their TTL (24 hours) are removed from the queue.

### Failure recovery

If a transaction fails (network error, simulation failure), the bundles in that slot are returned to the mempool for retry. Bundle status reverts to pending, and they are picked up on the next execution cycle. Bundles are never lost due to transient failures.

## Scaling

Each provider instance runs its own in-memory mempool backed by a database. Bundles are persisted on arrival and reloaded on restart, so no transactions are lost if the provider goes down.

For providers that need to scale horizontally (multiple instances for availability or throughput), the database persistence layer provides a natural coordination point. Multiple instances can share the same database and coordinate slot claiming through row-level locking.

{% hint style="info" %}
A larger mempool — whether from higher user volume or from multiple providers pooling bundles — increases the mixing set for each batch. This directly improves privacy for all users in that batch, at every entropy level.
{% endhint %}
