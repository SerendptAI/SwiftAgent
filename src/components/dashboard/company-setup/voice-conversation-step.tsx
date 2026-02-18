import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { NextButton } from "./ui-elements";

interface VoiceConversationStepProps {
  onNext?: () => void;
}

export function VoiceConversationStep({ onNext }: VoiceConversationStepProps) {
  const [selectedVoice, setSelectedVoice] = useState<
    "professional" | "friendly" | "concise"
  >("professional");

  return (
    <div className="mx-auto w-full max-w-4xl pb-4 text-center">
      <h2 className="mb-12 text-sm font-bold tracking-wide text-gray-900 uppercase">
        How should your agent sound to customers
      </h2>

      <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Professional */}
        <VoiceCard
          value="professional"
          label="Professional"
          imageSrc="/images/professional.svg"
          sampleText="Your request has been processed successfully."
          subText="I can connect you to support for further help."
          selected={selectedVoice === "professional"}
          onSelect={setSelectedVoice}
        />

        {/* Friendly */}
        <VoiceCard
          value="friendly"
          label="Friendly"
          imageSrc="/images/friendly.svg"
          sampleText="Got it, I can help with that."
          subText="Let's check what's happening."
          selected={selectedVoice === "friendly"}
          onSelect={setSelectedVoice}
        />

        {/* Concise */}
        <VoiceCard
          value="concise"
          label="Concise"
          imageSrc="/images/concise.svg"
          sampleText="Payment failed. Card declined."
          subText="Transaction confirmed."
          selected={selectedVoice === "concise"}
          onSelect={setSelectedVoice}
        />
      </div>

      <div className="mt-12 flex justify-center">
        <NextButton className="max-w-2xl px-12" onClick={onNext}>
          Finish
        </NextButton>
      </div>
    </div>
  );
}

interface VoiceCardProps {
  value: "professional" | "friendly" | "concise";
  label: string;
  imageSrc: string;
  sampleText: string;
  subText: string;
  selected: boolean;
  onSelect: (value: "professional" | "friendly" | "concise") => void;
}

function VoiceCard({
  value,
  label,
  imageSrc,
  sampleText,
  subText,
  selected,
  onSelect,
}: VoiceCardProps) {
  return (
    <div
      onClick={() => onSelect(value)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(value);
        }
      }}
      className={cn(
        "flex h-full cursor-pointer flex-col rounded-3xl bg-gray-100 p-6 transition-all duration-300 hover:shadow-lg",
        selected && "shadow-[0px_4px_20px_rgba(0,0,0,0.05)]",
      )}
    >
      <div className="mb-6 flex justify-center">
        <Image
          src={imageSrc}
          alt={label}
          width={90}
          height={90}
          className="h-[90px] w-auto"
        />
      </div>

      <div className="mb-6 flex justify-center">
        <div
          className={cn(
            "rounded-xl px-4 py-1.5 text-sm font-semibold shadow-[-4px_4px_0px_0px_#000000]",
            "border border-white bg-white text-gray-900",
          )}
        >
          {label}
        </div>
      </div>

      <div className="mb-8 flex-1 text-left">
        <p className="mb-1 text-xs font-bold text-gray-900 uppercase">
          Sounds like
        </p>
        <div className="border-l-4 border-gray-400 pl-3">
          <p className="mb-2 text-xs text-gray-600 italic">
            &quot;{sampleText}&quot;
          </p>
          <p className="text-xs text-gray-600 italic">&quot;{subText}&quot;</p>
        </div>
      </div>

      <button
        className={cn(
          "mt-auto w-full rounded-xl py-3 text-sm font-bold text-gray-900 uppercase transition-colors",
          selected
            ? "bg-[#F25430] text-white shadow-[-4px_4px_0px_0px_#000000]"
            : "bg-white text-gray-900 shadow-[-4px_4px_0px_0px_#000000] hover:bg-gray-50",
        )}
      >
        {selected ? "Selected" : "Tap to select"}
      </button>
    </div>
  );
}
