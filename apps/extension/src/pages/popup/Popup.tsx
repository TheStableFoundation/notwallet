import logo from "@assets/img/logo.svg";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Onboarding() {
  const [mode, setMode] = useState("home"); // home | new | import

  const seedWords = Array.from({ length: 12 }, (_, i) => ({
    index: i + 1,
    value: "",
  }));

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-6 font-sans text-center">
      {/* Home Screen */}
      {mode === "home" && (
        <>
          <motion.img
            src={logo}
            alt="NotWallet Logo"
            className="h-32 mb-6 opacity-90"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />

          <motion.h1
            className="text-3xl font-semibold tracking-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Welcome to NotWallet
          </motion.h1>

          <p className="text-gray-400 text-sm mt-2 max-w-xs">
            A minimal, secure and privacy-first crypto wallet built for the
            modern web.
          </p>

          <div className="w-full max-w-sm mt-10 space-y-3">
            <button
              className="w-full py-3 rounded-xl bg-white text-gray-900 font-medium shadow-md hover:bg-gray-200 transition-all"
              onClick={() => setMode("new")}
            >
              Get Started
            </button>

            <button
              className="w-full py-3 rounded-xl bg-gray-800 border border-gray-700 text-gray-200 font-medium hover:bg-gray-700 transition-all"
              onClick={() => setMode("import")}
            >
              I already have a wallet
            </button>

            <a
              href="https://notwallet.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4 text-gray-400 text-sm hover:text-gray-200"
            >
              Visit notwallet.eu
            </a>
          </div>
        </>
      )}

      {/* 12-Seed Phrase Display */}
      {mode === "new" && (
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4">Your Recovery Phrase</h2>
          <p className="text-gray-400 text-sm mb-6">
            Write these 12 words down in order and keep them somewhere safe.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {seedWords.map((w) => (
              <div
                key={w.index}
                className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-left"
              >
                <span className="text-gray-500 text-xs">{w.index}</span>
                <p className="text-gray-200 text-sm mt-1 select-all">
                  word{w.index}
                </p>
              </div>
            ))}
          </div>

          <button className="w-full py-3 rounded-xl bg-white text-gray-900 font-medium shadow-md hover:bg-gray-200 transition-all">
            Continue
          </button>

          <button
            className="w-full mt-4 text-gray-400 text-sm hover:text-gray-200"
            onClick={() => setMode("home")}
          >
            Back
          </button>
        </div>
      )}

      {/* Seed Phrase Import */}
      {mode === "import" && (
        <div className="w-full max-w-sm">
          <h2 className="text-xl font-semibold mb-4">Import Your Wallet</h2>
          <p className="text-gray-400 text-sm mb-6">
            Enter your 12-word recovery phrase to restore your wallet.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {seedWords.map((w) => (
              <input
                key={w.index}
                type="text"
                placeholder={`Word ${w.index}`}
                className="bg-gray-800 p-3 rounded-xl border border-gray-700 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
            ))}
          </div>

          <button className="w-full py-3 rounded-xl bg-white text-gray-900 font-medium shadow-md hover:bg-gray-200 transition-all">
            Import Wallet
          </button>

          <button
            className="w-full mt-4 text-gray-400 text-sm hover:text-gray-200"
            onClick={() => setMode("home")}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
