# NotWallet Crypto

Not just a crypto wallet: Self-custody, Simplified. ❄️

## Download

- [Apple App Store](https://apps.apple.com/se/app/notwallet-crypto/id6749607570)
- [Google Play Store](https://play.google.com/store/apps/details?id=xyz.notwallet.NotWallet)
- [Microsoft Store](https://apps.microsoft.com/detail/xpdcnnd1ql3vm7)
- [Apple App Store (Apple Watch only)](https://apps.apple.com/se/app/notwallet-crypto-watch/id6749650386)

---

Made with ❄️ in Stockholm

## Monorepo

This site lives in the `notwallet` monorepo at `apps/web`. It has its own `pnpm-workspace.yaml`,
so install and build from this folder, not the repo root:

```sh
cd apps/web
pnpm install
pnpm dev
pnpm build
```

Deploy: until its smbCloud FrontendApp is registered (see the commented entry in the root
`.smb/config.toml`), production still runs `run-server.js`. It was deployed by pushing this repo's `main` to the old
`deploy` remote. From the monorepo that push has to carry only this folder, which `git subtree push`
does. Not yet tried from here, so check the result on a throwaway branch first:

```sh
git subtree push --prefix=apps/web deploy main
```

The `deploy` remote is `git@deploy-notwalletweb:notwalletweb.git`; add it with `git remote add`
if your clone does not have it.
