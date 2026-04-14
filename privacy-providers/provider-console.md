# Provider Console

The Provider Console is a web-based operator dashboard for managing and monitoring Privacy Provider instances. It connects to the provider platform's dashboard API and provides visibility into channels, operations, treasury, and mempool state.

## Authentication

The console uses Ed25519 challenge/verify authentication. The operator signs a random nonce with their Stellar secret key — the key never leaves the browser.

1. Enter your Stellar secret key (`S...`) in the login screen.
2. The console requests a challenge (random nonce) from the provider platform.
3. Your key signs the nonce locally.
4. The signed nonce is sent to the provider platform for verification.
5. The provider checks that the signer is authorized on the PP's Stellar account (supports multisig via Horizon signers lookup).
6. A JWT session token is returned and used for all subsequent API calls.

::: info
Any signer on the provider's Stellar account can authenticate. This means if your provider key has multisig configured, any authorized signer can access the console.
:::

## Views

### Channels

Shows all channels the provider is registered in, detected via on-chain event subscription. Each channel has a state:

| State | Meaning |
|-------|---------|
| **Active** | Registered on-chain AND configured in this provider instance |
| **Pending** | Registered on-chain but not yet configured |
| **Inactive** | Was registered but has been removed on-chain |

The provider platform polls Stellar RPC for `provider_added` and `provider_removed` events emitted by the Channel Auth contract.

### Operations

Bundle and transaction statistics:

- **Bundles**: total, pending, processing, completed, expired, and success rate
- **Transactions**: total, verified, failed, unverified, and success rate

### Mempool

Live mempool state and configuration:

- **Live state**: slot count, bundle count, total weight, average bundles per slot
- **Configuration**: slot capacity, operation weights, executor/verifier/TTL intervals

### Treasury

The OpEx (operating expense) account info from the Stellar network:

- Account address and sequence number
- Asset balances (XLM and any other assets held)

### Audit Export

Export bundle data as CSV for compliance reporting. Filterable by:

- **Status**: completed, pending, processing, expired
- **Date range**: from/to dates

The CSV includes bundle ID, status, fee, and timestamps.

### Analytics

Embedded Grafana panels for real-time observability. Panels are configured at deployment time via the runtime config file (`config.js`). The console only loads panels served over HTTPS.

## Deployment

The console is a static site built with vanilla TypeScript and served by a Deno static file server.

### Build

```bash
deno run --allow-all src/build.ts              # development (with source maps)
deno run --allow-all src/build.ts --production # production (minified, no source maps)
```

### Configuration

Runtime configuration is in `public/config.js`:

```javascript
window.__CONSOLE_CONFIG__ = {
  apiBaseUrl: "https://your-provider.example.com/api/v1",
  environment: "production",
  posthogKey: "phc_...",
  posthogHost: "https://us.i.posthog.com",
  grafana: {
    baseUrl: "https://your-grafana.example.com",
    panels: [
      {
        title: "Request Latency",
        src: "https://your-grafana.example.com/d-solo/abc/dashboard?panelId=1&orgId=1",
        height: 300
      }
    ]
  }
};
```

### Run

```bash
PORT=3000 deno run --allow-all src/server.ts
```

## Dashboard API

The console connects to these endpoints on the provider platform:

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/dashboard/auth/challenge` | Public | Request auth challenge |
| POST | `/api/v1/dashboard/auth/verify` | Public | Verify signed challenge |
| GET | `/api/v1/dashboard/channels` | JWT | Channel registry state |
| GET | `/api/v1/dashboard/mempool` | JWT | Mempool stats and config |
| GET | `/api/v1/dashboard/operations` | JWT | Bundle/tx counts |
| GET | `/api/v1/dashboard/treasury` | JWT | OpEx account balance |
| GET | `/api/v1/dashboard/audit-export` | JWT | CSV export |

## Security

- **CSP enforced**: no inline scripts, scoped `connect-src`, Grafana frames restricted to HTTPS
- **Path traversal protection**: static file server validates resolved paths
- **XSS prevention**: all dynamic data escaped via `textContent` or `escapeHtml()`
- **Token expiry**: JWT `exp` claim checked client-side, expired tokens auto-cleared
- **Rate limiting**: auth endpoints limited to 10 requests/minute
- **No CDN dependencies**: Stellar SDK bundled at build time
