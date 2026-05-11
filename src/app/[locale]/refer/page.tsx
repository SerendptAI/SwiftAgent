"use client";

import { useState } from "react";

import { Navbar } from "@/components/landing/navbar";
import { ReferScreenFour } from "@/components/referrals/refer-screen-four";
import { ReferScreenOne } from "@/components/referrals/refer-screen-one";
import { ReferScreenThree } from "@/components/referrals/refer-screen-three";
import { ReferScreenTwo } from "@/components/referrals/refer-screen-two";

export default function ReferPage() {
  const [screen, setScreen] = useState<number>(3);

  return (
    <main className="relative min-h-screen overflow-hidden bg-white">
      <Navbar />

      {screen === 0 && <ReferScreenOne onNext={() => setScreen(1)} />}
      {screen === 1 && (
        <ReferScreenTwo
          onBack={() => setScreen(0)}
          onNext={() => setScreen(2)}
        />
      )}
      {screen === 2 && (
        <ReferScreenThree
          onBack={() => setScreen(1)}
          onNext={() => setScreen(3)}
        />
      )}
      {screen === 3 && <ReferScreenFour />}
    </main>
  );
}
