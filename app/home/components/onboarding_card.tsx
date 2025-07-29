"use client";
import * as React from "react";
import OnboardingCardAirdrop from "./onboarding_card_airdrop";
import OnboardingCardUsername from "./onboarding_card_username";

type OnboardingCardProps = {
  open: boolean;
  onClose: () => void;
};

export default function OnboardingCard({ open, onClose }: OnboardingCardProps) {

  const [showUsername, setShowUsername] = React.useState(false);

  if (!open) return null;

  return (
    <>
      {!showUsername ? (
        <OnboardingCardAirdrop
          open={open}
          onSuccess={() => setShowUsername(true)}
          onClose={onClose}
        />
      ) : (
        <OnboardingCardUsername open={showUsername} onClose={() => { setShowUsername(false); onClose(); }} />
      )}
    </>
  );
}
