"use client";

import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";

interface BriggsAnimationProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function BriggsAnimation({
  className,
  style,
}: BriggsAnimationProps) {
  const { RiveComponent } = useRive({
    src: "/5briggs_face_animations.riv",
    artboard: "viewport 2",
    stateMachines: "State Machine 1",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  return (
    <div className={className} style={style}>
      <RiveComponent style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
