"use client";

import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { useScrollLock } from "@/hooks/use-scroll-lock";

interface AddCardModalProps {
  onClose: () => void;
  onSubmit: (card: CardFormData) => void;
}

export interface CardFormData {
  nameOnCard: string;
  cardNumber: string;
  cvv: string;
  expiry: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  state: string;
  city: string;
  country: string;
  postalCode: string;
}

function FormLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-stolzl mb-1 block text-sm font-semibold text-gray-900">
      {children}
    </label>
  );
}

function FormInput({
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`font-dm-mono w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-300 ${className}`}
    />
  );
}

export function AddCardModal({ onClose, onSubmit }: AddCardModalProps) {
  useScrollLock(true);

  const [form, setForm] = useState<CardFormData>({
    nameOnCard: "",
    cardNumber: "",
    cvv: "",
    expiry: "",
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    state: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const update = (field: keyof CardFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
      <div
        className="relative mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white px-8 py-8 shadow-xl [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="font-dm-mono mb-6 flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          BACK
        </button>

        <h2 className="font-greed mb-6 text-3xl font-bold tracking-tight text-black uppercase">
          CARD DETAILS
        </h2>

        <div className="mb-2 space-y-4">
          <div>
            <FormLabel>Name on card</FormLabel>
            <FormInput
              placeholder="Name on card"
              value={form.nameOnCard}
              onChange={(v) => update("nameOnCard", v)}
            />
          </div>

          <div>
            <FormLabel>Card Number</FormLabel>
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
              <input
                type="text"
                placeholder="*************"
                value={form.cardNumber}
                onChange={(e) => update("cardNumber", e.target.value)}
                className="font-dm-mono min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <input
                type="text"
                placeholder="CVV"
                value={form.cvv}
                onChange={(e) => update("cvv", e.target.value)}
                className="font-dm-mono w-16 bg-transparent px-3 py-3 text-center text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <input
                type="text"
                placeholder="MM/YY"
                value={form.expiry}
                onChange={(e) => update("expiry", e.target.value)}
                className="font-dm-mono w-20 bg-transparent px-3 py-3 text-center text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        <h2 className="font-greed mt-6 mb-4 text-2xl font-bold tracking-tight text-black uppercase">
          BILLING ADDRESS
        </h2>

        <div className="space-y-4">
          <div>
            <FormLabel>First name</FormLabel>
            <FormInput
              placeholder="First name"
              value={form.firstName}
              onChange={(v) => update("firstName", v)}
            />
          </div>

          <div>
            <FormLabel>Last name</FormLabel>
            <FormInput
              placeholder="Last name"
              value={form.lastName}
              onChange={(v) => update("lastName", v)}
            />
          </div>

          <div>
            <FormLabel>Address</FormLabel>
            <div className="space-y-2">
              <FormInput
                placeholder="Address line 1"
                value={form.addressLine1}
                onChange={(v) => update("addressLine1", v)}
              />
              <FormInput
                placeholder="Address line 2"
                value={form.addressLine2}
                onChange={(v) => update("addressLine2", v)}
              />
            </div>
          </div>

          <div>
            <FormLabel>State / Province</FormLabel>
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
              <input
                type="text"
                placeholder="State"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                className="font-dm-mono min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="font-dm-mono w-2/5 min-w-0 bg-transparent px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <FormLabel>Country & Postal Code</FormLabel>
            <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50">
              <input
                type="text"
                placeholder="Country"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className="font-dm-mono min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={form.postalCode}
                onChange={(e) => update("postalCode", e.target.value)}
                className="font-dm-mono min-w-0 bg-transparent px-4 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="font-dm-mono mt-8 w-full rounded-lg bg-[#006BE5] py-3 text-sm font-bold tracking-widest text-white uppercase shadow-[-4px_4px_0px_0px_#000000] transition-colors hover:bg-[#1E88E5]"
        >
          ADD CARD
        </button>
      </div>
    </div>
  );
}
