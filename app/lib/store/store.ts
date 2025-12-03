import { LazyStore } from "@tauri-apps/plugin-store";
import { STORE, STORE_ACCOUNT } from "../crate/generated";

export function store() {
  const store = new LazyStore(STORE);
  return store;
}

export function storeAccount() {
  const store = new LazyStore(STORE_ACCOUNT);
  return store;
}
