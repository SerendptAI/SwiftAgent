import { Plus, X } from "lucide-react";
import { useState } from "react";

import { NextButton } from "./ui-elements";

interface AnswerBoundariesStepProps {
  onNext?: () => void;
  footerAction?: React.ReactNode;
}

export function AnswerBoundariesStep({
  onNext,
  footerAction,
}: AnswerBoundariesStepProps) {
  // Initial state mimicking the design
  const [ignoredTopics, setIgnoredTopics] = useState<string[]>([
    "FAQ",
    "MANUALS",
    "POLICIES",
    "SOPS",
    "INFO",
    "INFO",
    "INFO",
    "INFO",
    "INFO",
    "INFO",
    "INFO",
    "INFO",
    "INFO",
    "INFO",
    "INFO",
  ]);

  const [availableTopics, setAvailableTopics] = useState<string[]>([
    "INFO",
    "INFO",
    "INFO",
    "INFO",
    "INFO",
  ]);

  const toggleTopic = (topic: string, isIgnored: boolean) => {
    if (isIgnored) {
      setIgnoredTopics((prev) =>
        prev.filter((t, i) => i !== prev.indexOf(topic)),
      ); // Remove distinct one if duplicates exist, or by index? Using index is safer for duplicates
      setAvailableTopics((prev) => [...prev, topic]);
    } else {
      setAvailableTopics((prev) =>
        prev.filter((t, i) => i !== prev.indexOf(topic)),
      );
      setIgnoredTopics((prev) => [...prev, topic]);
    }
  };

  // Handling removal by index to correctly handle duplicate names if any (screenshot shows many "INFO"s)
  const removeIgnored = (index: number) => {
    const topic = ignoredTopics[index];
    setIgnoredTopics((prev) => prev.filter((_, i) => i !== index));
    setAvailableTopics((prev) => [...prev, topic]);
  };

  const addIgnored = (index: number) => {
    const topic = availableTopics[index];
    setAvailableTopics((prev) => prev.filter((_, i) => i !== index));
    setIgnoredTopics((prev) => [...prev, topic]);
  };

  return (
    <div className="mx-auto w-full max-w-4xl pb-4 text-center">
      {/* Top Section */}
      <h2 className="mb-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
        What uploaded information should the AI ignore?
      </h2>
      <p className="mb-8 text-sm text-gray-400">
        Any information that is ignored will not be used to talk to clients
      </p>

      <div className="mb-12 flex flex-wrap justify-center gap-4 rounded-3xl bg-gray-100 p-8 shadow-inner">
        {ignoredTopics.map((topic, index) => (
          <button
            key={`ignored-${index}`}
            onClick={() => removeIgnored(index)}
            className="group flex items-center gap-3 rounded-xl bg-white px-3 py-3 text-sm font-bold text-gray-900 uppercase shadow-[-4px_4px_0px_0px_#000000] transition-all hover:translate-y-[2px] hover:shadow-[-2px_2px_0px_0px_#000000]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5F3D] text-white">
              <X className="h-3 w-3" />
            </span>
            {topic}
          </button>
        ))}
      </div>

      {/* Bottom Section */}
      <h2 className="mb-2 text-sm font-bold tracking-wide text-gray-900 uppercase">
        Ignored Information
      </h2>
      <p className="mb-8 text-sm text-gray-400">
        Tap the plus sign to add it back
      </p>

      <div className="flex flex-wrap justify-center gap-4 rounded-3xl bg-gray-100 p-8 shadow-inner">
        {availableTopics.map((topic, index) => (
          <button
            key={`available-${index}`}
            onClick={() => addIgnored(index)}
            className="group flex items-center gap-3 rounded-xl bg-white px-3 py-3 text-sm font-bold text-gray-900 uppercase shadow-[-4px_4px_0px_0px_#000000] transition-all hover:translate-y-[2px] hover:shadow-[-2px_2px_0px_0px_#000000]"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-black">
              <Plus className="h-3 w-3" />
            </span>
            {topic}
          </button>
        ))}
      </div>

      <div className="mt-12">
        {footerAction ?? <NextButton onClick={onNext} />}
      </div>
    </div>
  );
}
