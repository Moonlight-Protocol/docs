# Entropy and Privacy

When a user transacts through a privacy channel, their transaction amount can be split across multiple UTXOs. The number of splits is controlled by the **entropy level** — the more splits, the harder it is for an observer to reconstruct the original amount.

## Entropy Levels

| Level | Slots / UTXOs | Fees | Effect |
|---|---|---|---|
| LOW | 1 | 0.05–0.1 XLM | No splitting. Single UTXO. Only address privacy, no amount privacy. |
| MEDIUM | 5 | 0.25 XLM | Amount split randomly across 5 UTXOs. Default. Reasonable privacy at low cost. |
| HIGH | 10 | 0.5 XLM | Split across 10 UTXOs. Better for large or distinctive amounts. |
| V_HIGH | 15–20 | 0.75–1.0 XLM | Maximum splitting. Best for institutional or high-value transfers. |

Splitting is performed using cryptographically secure randomization — the amount is partitioned into random-sized pieces, not equal parts.

## Is LOW Good Enough?

No — not for meaningful privacy. With a single UTXO, the transaction amount stays whole. Anyone scanning the UTXO set can match deposit and withdrawal amounts directly.

LOW provides only **address unlinkability**: the provider submits on the user's behalf, so the user's address is not directly on-chain. But the amount itself offers no cover.

LOW is appropriate for:
- Testing and development (cheaper, faster)
- Transactions where only address privacy matters, not amount privacy
- Very small amounts where the fee outweighs the privacy benefit

## Is MEDIUM Good Enough for Production?

MEDIUM is a reasonable default, but effectiveness depends on **channel activity** more than the entropy level itself.

With 5 splits, an observer sees 5 UTXOs of random sizes that sum to the original amount. If someone deposits 137.42 XLM and shortly after 5 UTXOs appear that sum to roughly 137.42, the correlation is straightforward — especially in a quiet channel.

MEDIUM works well when many users transact simultaneously. Their UTXOs mix together, making it far harder to attribute specific outputs to a specific deposit. In a low-activity channel, even HIGH entropy can be traced if you are the only one transacting in that window.

**A busy channel with MEDIUM entropy is more private than a dead channel with V_HIGH.**

For production use, MEDIUM is the practical minimum — provided the channel has healthy transaction volume.

## When to Use HIGH and V_HIGH

**HIGH (10 splits)** is useful when:
- Transacting large, distinctive amounts (e.g., 50,000 XLM) where more splits make it harder to reconstruct the original sum
- Channel activity is moderate but not heavy — more splits improve the odds of blending in
- Performing repeated transactions where pattern analysis across multiple operations is a concern

**V_HIGH (15–20 splits)** is useful when:
- Handling institutional or high-value transfers where correlation would be damaging
- The adversary is sophisticated (chain analysis firms, state-level actors)
- Plausible deniability is required — with 15–20 UTXOs of random sizes, the combinatorial space of possible original amounts explodes, making subset-sum reconstruction computationally expensive

The jump from MEDIUM to HIGH provides more marginal privacy gain than the jump from HIGH to V_HIGH. Diminishing returns apply unless the adversary is actively running subset-sum attacks against the UTXO set.

## Key Takeaway

Entropy levels matter, but **channel activity is the dominant factor** in transaction privacy. A channel with high transaction volume provides strong privacy at any entropy level. A channel with low volume offers weak privacy regardless of how many splits are used.

For wallet integrators: MEDIUM is the right default for most users. HIGH and V_HIGH serve as premium tiers for users or institutions with stronger privacy requirements.
