"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { debug, error as logError } from "@tauri-apps/plugin-log";
import haptics from "@app/lib/utils/haptics";
import { useLang } from "@app/lib/context/language-context";
import {
  CHAT_CLEAR_HISTORY,
  CHAT_EVENT_REPLY,
  CHAT_EVENT_STATUS_CHANGED,
  CHAT_GET_HISTORY,
  CHAT_GET_STATUS,
  CHAT_SEND_MESSAGE,
} from "@app/lib/commands";
import {
  ChatMessagePayload,
  ChatReplyPayload,
  ChatStatusPayload,
  ChatStatusResponse,
} from "@app/lib/crate/generated";

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

let messageCounter = 0;
function nextId() {
  messageCounter += 1;
  return `msg-${messageCounter}`;
}

export default function ChatView() {
  const { t } = useLang();
  const [messages, setMessages] = React.useState<DisplayMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [status, setStatus] = React.useState<ChatStatusResponse | undefined>(
    undefined,
  );
  const [thinking, setThinking] = React.useState(false);
  const endRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // The listener effect runs once on mount, so it would otherwise capture the
  // translations from first render and keep using them after a language switch.
  const tRef = React.useRef(t);
  tRef.current = t;

  React.useEffect(() => {
    let unlistenStatus: (() => void) | undefined;
    let unlistenReply: (() => void) | undefined;
    // `listen` is async: the effect can be torn down (StrictMode double-invoke,
    // fast unmount) before it resolves, which would leak the listener and
    // duplicate every reply. Unlisten immediately if that already happened.
    let disposed = false;

    const init = async () => {
      try {
        unlistenStatus = await listen<ChatStatusPayload>(
          CHAT_EVENT_STATUS_CHANGED,
          (event) => {
            debug(`Chat status changed: ${event.payload.status}`);
            setStatus((prev) => ({
              status: event.payload.status,
              model_name: event.payload.model_name ?? prev?.model_name,
              approx_memory: prev?.approx_memory,
              history_length: prev?.history_length ?? 0,
            }));
          },
        );

        unlistenReply = await listen<ChatReplyPayload>(
          CHAT_EVENT_REPLY,
          (event) => {
            setThinking(false);
            const { reply, error } = event.payload;
            if (reply) {
              setMessages((prev) => [
                ...prev,
                { id: nextId(), role: "assistant", content: reply },
              ]);
            } else {
              setMessages((prev) => [
                ...prev,
                {
                  id: nextId(),
                  role: "assistant",
                  content: error || tRef.current.chatSendError,
                  isError: true,
                },
              ]);
            }
          },
        );

        if (disposed) {
          unlistenStatus();
          unlistenReply();
          return;
        }

        const [initialStatus, history] = await Promise.all([
          invoke<ChatStatusResponse>(CHAT_GET_STATUS),
          invoke<ChatMessagePayload[]>(CHAT_GET_HISTORY),
        ]);
        setStatus(initialStatus);
        setMessages(
          history
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({
              id: nextId(),
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
        );
      } catch (e) {
        logError(`Failed to initialize chat: ${e}`);
      }
    };

    init();

    return () => {
      disposed = true;
      unlistenStatus?.();
      unlistenReply?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleSend = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || thinking) return;

    await haptics.selection();
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", content: text },
    ]);
    setInput("");
    setThinking(true);
    requestAnimationFrame(autoGrow);

    try {
      await invoke(CHAT_SEND_MESSAGE, { message: text });
    } catch (e) {
      logError(`Failed to send chat message: ${e}`);
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content: t.chatUnsupportedPlatform,
          isError: true,
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = async () => {
    await haptics.selection();
    try {
      await invoke(CHAT_CLEAR_HISTORY);
    } catch (e) {
      logError(`Failed to clear chat history: ${e}`);
    }
    setMessages([]);
  };

  const statusLabel = () => {
    if (thinking) return t.chatModelLoading;
    switch (status?.status) {
      case "loading":
        return t.chatModelLoading;
      case "ready":
        return t.chatModelReady;
      case "error":
        return t.chatModelError;
      default:
        return t.chatModelUnloaded;
    }
  };

  const dotClass = () => {
    if (thinking || status?.status === "loading")
      return "bg-amber-400 animate-pulse";
    if (status?.status === "error") return "bg-red-500";
    if (status?.status === "ready") return "bg-emerald-500";
    return "bg-slate-300";
  };

  return (
    <Box
      sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
    >
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-100 text-primary-main">
          <AutoAwesomeIcon fontSize="small" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-text-primary">
              {t.chatAssistantName}
            </span>
            <span
              className={`inline-block h-2 w-2 rounded-full ${dotClass()}`}
            />
          </div>
          <span className="text-xs text-text-secondary">{statusLabel()}</span>
        </div>
        {messages.length > 0 && (
          <IconButton
            size="small"
            onClick={handleClear}
            aria-label={t.chatClearHistory}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        )}
      </div>

      <div className="flex min-h-[50vh] flex-col gap-3 px-1">
        {messages.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-fuchsia-100 text-primary-main">
              <AutoAwesomeIcon />
            </div>
            <p className="text-lg font-semibold text-text-primary">
              {t.chatEmptyTitle}
            </p>
            <p className="max-w-xs text-sm text-text-secondary">
              {t.chatTagline}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {t.chatSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSend(suggestion)}
                  className="rounded-full border border-fuchsia-200 bg-white/80 px-3 py-1.5 text-xs text-primary-main shadow-sm transition-colors hover:bg-fuchsia-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm shadow-sm ${
                m.role === "user"
                  ? "bg-primary-main text-white"
                  : m.isError
                    ? "bg-red-50 text-red-700"
                    : "bg-white/90 text-text-primary"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl bg-white/90 px-4 py-3 shadow-sm">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 z-10 flex items-end gap-2 rounded-2xl border bg-white/90 p-2 shadow-lg backdrop-blur-md">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            autoGrow();
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={t.chatInputPlaceholder}
          className="max-h-[120px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-text-secondary"
        />
        <IconButton
          color="primary"
          disabled={!input.trim() || thinking}
          onClick={() => handleSend()}
          aria-label={t.chatInputPlaceholder}
        >
          {thinking ? <CircularProgress size={20} /> : <SendIcon />}
        </IconButton>
      </div>

      <p className="px-2 text-center text-[11px] text-text-secondary">
        {t.chatDisclaimer}
      </p>
    </Box>
  );
}
