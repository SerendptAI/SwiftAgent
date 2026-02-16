import { type ComponentType, type FC } from "react";

interface HugeiconsIconProps {
  icon: ComponentType<{ className?: string }>;
  className?: string;
}

export const HugeiconsIcon: FC<HugeiconsIconProps> = ({
  icon: Icon,
  ...props
}) => {
  return <Icon {...props} />;
};
