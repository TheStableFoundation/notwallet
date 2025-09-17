# iOS Development Workflow

Tauri uses Xcode generated project to build and run iOS apps. Update the `tauri.conf.json` file with your development team ID.

```json
{
  "iOS": {
    "minimumSystemVersion": "13.0",
    "developmentTeam": "your_team_id"
  }
}
```

And then run the following commands:

```bash
$ rm -rf src-tauri/gen/apple
$ cargo tauri ios init
$ pnpm gim
$ cargo tauri ios dev
```
