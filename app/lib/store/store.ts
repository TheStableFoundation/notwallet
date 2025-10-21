import { LazyStore } from "@tauri-apps/plugin-store";
import { STORE } from "../crate/generated";

export function store() {
  const store = new LazyStore(STORE);
  return store;
}