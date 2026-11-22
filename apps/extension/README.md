# NotWallet Crypto

Not just a crypto wallet: remittance, payment, DAO, DeFi. You name it.

## Credit

https://github.com/JohnBra/vite-web-extension.git

## Monorepo

This extension lives in the `notwallet` monorepo at `apps/extension`. It has its own
`pnpm-workspace.yaml` (pnpm only; the old `yarn.lock` is gone), so install and build from this
folder, not the repo root:

```sh
cd apps/extension
pnpm install
pnpm dev:chrome      # or dev:firefox
pnpm build:chrome    # output in dist_chrome
pnpm build:firefox   # output in dist_firefox
```

CI builds both browsers on pull requests that touch this folder. Store uploads are manual.
