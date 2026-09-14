"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { SERVICE_COMPANY_NAMES } from "./referral-companies";

interface ReferScreenThreeProps {
  onBack: () => void;
  onNext: () => void;
}

type FormScreen = "founder" | "you";

type FieldName =
  | "founderName"
  | "companyName"
  | "founderPosition"
  | "founderPhone"
  | "founderEmail"
  | "bankName"
  | "accountNumber"
  | "accountName"
  | "yourEmail";

type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName | "captcha", string>>;

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

const RECAPTCHA_SCRIPT_ID = "google-recaptcha-script";
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const inputClass =
  "h-10 w-full rounded-md bg-[#EDEDED] px-3 text-sm leading-none text-black outline-none placeholder:text-black/45";

const initialValues: FormValues = {
  founderName: "",
  companyName: "",
  founderPosition: "",
  founderPhone: "",
  founderEmail: "",
  bankName: "",
  accountNumber: "",
  accountName: "",
  yourEmail: "",
};

const founderFields: FieldName[] = [
  "founderName",
  "companyName",
  "founderPosition",
  "founderPhone",
  "founderEmail",
];

const yourFields: FieldName[] = [
  "bankName",
  "accountNumber",
  "accountName",
  "yourEmail",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const accountNumberPattern = /^[0-9]{10}$/;

function normalizeNumericValue(name: FieldName, value: string) {
  if (name === "founderPhone") {
    const hasCountryCode = value.trim().startsWith("+");
    const digits = value.replace(/\D/g, "");
    if (hasCountryCode) return `+${digits.slice(0, 13)}`;
    return digits.slice(0, 11);
  }

  if (name === "accountNumber") return value.replace(/\D/g, "").slice(0, 10);

  return value;
}

function getPhoneDigitGroups(value: string) {
  const hasCountryCode = value.startsWith("+");
  const digits = value.replace(/\D/g, "");
  if (!hasCountryCode) return { hasCountryCode, localDigits: digits };

  const countryCodeLength = Math.max(1, digits.length - 10);
  return {
    hasCountryCode,
    localDigits: digits.slice(countryCodeLength),
  };
}

function validateField(name: FieldName, value: string) {
  const trimmed = value.trim();

  switch (name) {
    case "founderName":
      if (!trimmed) return "Founder name is required.";
      if (trimmed.length < 2) return "Enter a valid founder name.";
      return "";
    case "companyName":
      if (!trimmed) return "Company name is required.";
      return "";
    case "founderPosition":
      if (!trimmed) return "Founder position is required.";
      return "";
    case "founderPhone":
      if (!trimmed) return "Founder phone number is required.";
      if (!/^\+?\d+$/.test(trimmed)) return "Use numbers only.";
      if (trimmed.startsWith("+")) {
        const { localDigits } = getPhoneDigitGroups(trimmed);
        if (localDigits.length !== 10) {
          return "Enter 10 digits after the country code.";
        }
        return "";
      }
      if (trimmed.length !== 11) return "Enter an 11-digit phone number.";
      return "";
    case "founderEmail":
      if (!trimmed) return "Founder email is required.";
      if (!emailPattern.test(trimmed)) return "Enter a valid email address.";
      return "";
    case "bankName":
      if (!trimmed) return "Bank name is required.";
      if (trimmed.length < 2) return "Enter a valid bank name.";
      return "";
    case "accountNumber":
      if (!trimmed) return "Account number is required.";
      if (!accountNumberPattern.test(trimmed)) {
        return "Enter a valid 10-digit account number.";
      }
      return "";
    case "accountName":
      if (!trimmed) return "Account name is required.";
      if (trimmed.length < 2) return "Enter a valid account name.";
      return "";
    case "yourEmail":
      if (!trimmed) return "Your email is required.";
      if (!emailPattern.test(trimmed)) return "Enter a valid email address.";
      return "";
  }
}

function Field({
  label,
  name,
  placeholder,
  required,
  type = "text",
  inputMode,
  value,
  error,
  onBlur,
  onChange,
}: {
  label: string;
  name: FieldName;
  placeholder: string;
  required?: boolean;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  value: string;
  error?: string;
  onBlur: (name: FieldName) => void;
  onChange: (name: FieldName, value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2.5 text-left">
      <span className="text-base leading-normal font-normal text-black">
        {label}
        {required && <span className="text-[#F25430]">*</span>}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        className={`${inputClass} ${error ? "ring-1 ring-[#F25430]" : ""}`}
        onBlur={() => onBlur(name)}
        onChange={(event) =>
          onChange(name, normalizeNumericValue(name, event.target.value))
        }
      />
      {error && (
        <span className="text-xs leading-normal text-[#F25430]">{error}</span>
      )}
    </label>
  );
}

function SelectField({
  label,
  name,
  placeholder,
  options,
  value,
  error,
  onBlur,
  onChange,
}: {
  label: string;
  name: FieldName;
  placeholder: string;
  options: string[];
  value: string;
  error?: string;
  onBlur: (name: FieldName) => void;
  onChange: (name: FieldName, value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2.5 text-left">
      <span className="text-base leading-normal font-normal text-black">
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          className={`${inputClass} appearance-none pr-10 ${
            value ? "" : "text-black/45"
          } ${error ? "ring-1 ring-[#F25430]" : ""}`}
          onBlur={() => onBlur(name)}
          onChange={(event) => onChange(name, event.target.value)}
        >
          <option value="" className="text-black/45">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Image
          src="/images/Referrals/icons/dropdown-arrow.svg"
          alt=""
          width={11}
          height={6}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2"
        />
      </span>
      {error && (
        <span className="text-xs leading-normal text-[#F25430]">{error}</span>
      )}
    </label>
  );
}

function RecaptchaField({
  error,
  onVerify,
  onExpire,
}: {
  error?: string;
  onVerify: (token: string) => void;
  onExpire: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [scriptError, setScriptError] = useState("");

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) {
      setScriptError("Missing reCAPTCHA site key.");
      return;
    }

    const renderWidget = () => {
      if (!containerRef.current || !window.grecaptcha) return;
      if (widgetIdRef.current !== null) return;

      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: onVerify,
        "expired-callback": onExpire,
        "error-callback": () => {
          onExpire();
          setScriptError("reCAPTCHA failed to load. Try again.");
        },
      });
    };

    const existingScript = document.getElementById(RECAPTCHA_SCRIPT_ID);
    if (existingScript) {
      renderWidget();
      existingScript.addEventListener("load", renderWidget);
      return () => existingScript.removeEventListener("load", renderWidget);
    }

    const script = document.createElement("script");
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = renderWidget;
    script.onerror = () =>
      setScriptError("reCAPTCHA failed to load. Try again.");
    document.head.appendChild(script);
  }, [onExpire, onVerify]);

  return (
    <div className="mt-18 flex flex-col items-center gap-2">
      <div ref={containerRef} />
      {(error || scriptError) && (
        <span className="text-xs leading-normal text-[#F25430]">
          {error || scriptError}
        </span>
      )}
    </div>
  );
}

export function ReferScreenThree({ onBack, onNext }: ReferScreenThreeProps) {
  const t = useTranslations("refer.form");
  const [formScreen, setFormScreen] = useState<FormScreen>("founder");
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [captchaToken, setCaptchaToken] = useState("");

  const setFieldValue = (name: FieldName, value: string) => {
    const nextValue = normalizeNumericValue(name, value);
    setValues((current) => ({ ...current, [name]: nextValue }));
    setErrors((current) => {
      if (!current[name]) return current;
      const error = validateField(name, nextValue);
      return { ...current, [name]: error || undefined };
    });
  };

  const validateFields = (fields: FieldName[]) => {
    const nextErrors: FormErrors = {};
    for (const field of fields) {
      const error = validateField(field, values[field]);
      if (error) nextErrors[field] = error;
    }
    setErrors((current) => ({ ...current, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const validateOnBlur = (name: FieldName) => {
    const error = validateField(name, values[name]);
    setErrors((current) => ({ ...current, [name]: error || undefined }));
  };

  const handleBack = () => {
    if (formScreen === "you") {
      setFormScreen("founder");
      return;
    }
    onBack();
  };

  const handlePrimaryAction = () => {
    if (formScreen === "founder") {
      if (validateFields(founderFields)) setFormScreen("you");
      return;
    }

    const fieldsValid = validateFields(yourFields);
    if (!captchaToken) {
      setErrors((current) => ({
        ...current,
        captcha: "Complete the reCAPTCHA to submit.",
      }));
    }
    if (fieldsValid && captchaToken) onNext();
  };

  return (
    <>
      <Image
        src="/images/Referrals/screen-3/coins-left-screen-3.svg"
        alt=""
        width={209}
        height={518}
        aria-hidden="true"
        className="pointer-events-none absolute top-[26px] -left-20 z-0 w-[150px] sm:w-[180px] md:top-13 md:left-0 md:w-[209px] md:opacity-100"
      />
      <Image
        src="/images/Referrals/screen-3/coins-right-screen-3.svg"
        alt=""
        width={206}
        height={450}
        aria-hidden="true"
        className="pointer-events-none absolute top-10 -right-20 z-0 w-[150px] sm:w-[180px] md:top-20 md:right-0 md:w-[206px] md:opacity-100"
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1180px] flex-col items-center px-4 pt-[128px] pb-16 text-center sm:px-5 md:pt-[160px] md:pb-24">
        <h1 className="font-press-start w-full max-w-4xl text-center text-2xl leading-relaxed tracking-[-2%] uppercase sm:text-3xl md:text-4xl lg:text-[40px]">
          {t("heading")}
        </h1>

        <p className="mt-8 max-w-lg text-center text-base leading-normal tracking-[2%] text-black/60 sm:text-lg">
          {t("subtitle")}
        </p>

        <div className="mt-[42px] w-full max-w-[842px] rounded-[28px] border border-black/25 bg-white px-4 pt-7 pb-9 text-center sm:mt-[50px] sm:px-6 md:mt-[57px] md:rounded-[49px] md:px-8 md:pt-9 md:pb-12">
          <div className="mx-auto w-full max-w-[720px]">
            <div className="flex flex-wrap gap-5 text-left">
              <div className="w-fit">
                <p className="text-sm leading-[22px] font-medium text-black capitalize">
                  {t("founderInfo")}
                </p>
                <div className="-mx-2 mt-3 h-1 rounded-t-[5px] bg-[#7132D7]" />
              </div>
              <div className="w-fit">
                <p
                  className={`text-sm leading-[22px] font-medium capitalize ${
                    formScreen === "you" ? "text-black" : "text-black/25"
                  }`}
                >
                  {t("yourInfo")}
                </p>
                <div
                  className={`-mx-2 mt-3 h-1 rounded-t-[5px] ${
                    formScreen === "you" ? "bg-[#F2B035]" : "bg-[#F8EEDB]"
                  }`}
                />
              </div>
            </div>

            {formScreen === "founder" ? (
              <div className="mt-14 space-y-5">
                <Field
                  label={t("fields.founderName.label")}
                  name="founderName"
                  placeholder={t("fields.founderName.placeholder")}
                  required
                  value={values.founderName}
                  error={errors.founderName}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
                <SelectField
                  label={t("fields.companyName.label")}
                  name="companyName"
                  placeholder={t("fields.companyName.placeholder")}
                  options={SERVICE_COMPANY_NAMES}
                  value={values.companyName}
                  error={errors.companyName}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
                <SelectField
                  label={t("fields.position.label")}
                  name="founderPosition"
                  placeholder={t("fields.position.placeholder")}
                  options={[
                    "Founder",
                    "Co-founder",
                    "CEO",
                    "Managing Director",
                  ]}
                  value={values.founderPosition}
                  error={errors.founderPosition}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
                <Field
                  label={t("fields.phone.label")}
                  name="founderPhone"
                  placeholder={t("fields.phone.placeholder")}
                  required
                  type="tel"
                  inputMode="tel"
                  value={values.founderPhone}
                  error={errors.founderPhone}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
                <Field
                  label={t("fields.email.label")}
                  name="founderEmail"
                  placeholder={t("fields.email.placeholder")}
                  required
                  type="email"
                  value={values.founderEmail}
                  error={errors.founderEmail}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
              </div>
            ) : (
              <div className="mt-14 space-y-5">
                <Field
                  label={t("fields.bankName.label")}
                  name="bankName"
                  placeholder={t("fields.bankName.placeholder")}
                  required
                  value={values.bankName}
                  error={errors.bankName}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
                <Field
                  label={t("fields.accountNumber.label")}
                  name="accountNumber"
                  placeholder={t("fields.accountNumber.placeholder")}
                  required
                  inputMode="numeric"
                  value={values.accountNumber}
                  error={errors.accountNumber}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
                <Field
                  label={t("fields.accountName.label")}
                  name="accountName"
                  placeholder={t("fields.accountName.placeholder")}
                  required
                  value={values.accountName}
                  error={errors.accountName}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
                <Field
                  label={t("fields.yourEmail.label")}
                  name="yourEmail"
                  placeholder={t("fields.yourEmail.placeholder")}
                  required
                  type="email"
                  value={values.yourEmail}
                  error={errors.yourEmail}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />

                <RecaptchaField
                  error={errors.captcha}
                  onVerify={(token) => {
                    setCaptchaToken(token);
                    setErrors((current) => ({
                      ...current,
                      captcha: undefined,
                    }));
                  }}
                  onExpire={() => setCaptchaToken("")}
                />
              </div>
            )}

            <button
              type="button"
              onClick={handlePrimaryAction}
              className="mx-auto mt-18 flex h-11 w-full max-w-100 shrink-0 cursor-pointer items-center justify-center rounded-md bg-[#F2B035] text-base leading-none font-medium shadow-[-4px_4px_0_#000]"
            >
              {formScreen === "founder" ? t("next") : t("submit")}
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="mt-8 cursor-pointer text-sm tracking-[2%] text-black/50 underline underline-offset-4 md:text-base"
            >
              {t("back")}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
