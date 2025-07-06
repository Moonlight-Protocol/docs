# Trusted Privacy Providers

Private providers act as the relay layer between end-users and Privacy Channels. A provider maintains network connectivity, adds any provider-level logic, and submits batches for on-chain execution while satisfying regulatory and governance rules.

**On-chain identity**\
Each provider designates a Stellar address that serves as its on-chain identity. The channel administrator registers this address in the provider registry, and only registered addresses are permitted to submit batches for processing.

**Standardized API**\
Providers expose a public API that follows a common specification.

* _Session authentication_ uses a SEP-10 style flow: the server issues a challenge, the client signs it with its master key, and the session is bound to that public key for all subsequent requests.
* _Compliance workflow_ offers endpoints for uploading KYC and other regulatory documents when required by the channel’s jurisdictional policy.
* _Bundle intake_ accepts user-signed bundles, validates signatures and basic structure, attaches provider-level details such as fee outputs, optionally aggregates multiple user bundles, and prepares a batch for submission.
* **Batch submission**\
  After internal checks the provider submits the prepared batch to the privacy channel via its registered address. The provider monitors confirmation status and returns results to the originating clients.
* **Audit responsibility**\
  Each provider keeps its own logs and audit records, binding every off-chain request to the client’s public key obtained during session authentication. This audit trail supports regulatory review without compromising user privacy.

{% hint style="info" %}
As part of V1: A reference implementation of the provider server, including the full API and SEP-10 authentication flow, will be released as open-source software that providers can deploy as-is or extend to meet custom requirements.
{% endhint %}

