import { CreditCard } from "lucide-react";

import { Icons } from "@/components/icons";

export function CardBrandIcon({ brand }: { brand: string }) {
  if (brand.toLowerCase() === "mastercard") {
    return <Icons.mastercard />;
  }
  return <CreditCard className="h-4 w-4 text-gray-500" />;
}
