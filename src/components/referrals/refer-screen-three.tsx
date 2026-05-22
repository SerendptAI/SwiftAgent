"use client";

import Image from "next/image";
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
  | "companyOther"
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
  "font-dm-mono h-9.5 w-full rounded-md bg-[#EDEDED] px-3 text-sm leading-none text-black outline-none placeholder:text-black/45";

const initialValues: FormValues = {
  founderName: "",
  companyName: "",
  companyOther: "",
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

  return value.toUpperCase();
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
    case "companyOther":
      if (trimmed && trimmed.length < 2) return "Enter a valid company name.";
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
      <span className="font-stolzl text-base leading-normal font-normal text-black">
        {label}
        {required && <span className="text-[#F25430]">*</span>}
      </span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        className={`${inputClass} uppercase ${error ? "ring-1 ring-[#F25430]" : ""}`}
        onBlur={() => onBlur(name)}
        onChange={(event) =>
          onChange(name, normalizeNumericValue(name, event.target.value))
        }
      />
      {error && (
        <span className="font-dm-mono text-xs leading-normal text-[#F25430]">
          {error}
        </span>
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
      <span className="font-stolzl text-base leading-normal font-normal text-black">
        {label}
      </span>
      <span className="relative block">
        <select
          value={value}
          className={`${inputClass} appearance-none pr-10 uppercase ${
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
        <span className="font-dm-mono text-xs leading-normal text-[#F25430]">
          {error}
        </span>
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
        <span className="font-dm-mono text-xs leading-normal text-[#F25430]">
          {error || scriptError}
        </span>
      )}
    </div>
  );
}

export function ReferScreenThree({ onBack, onNext }: ReferScreenThreeProps) {
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
        <h1 className="font-greed-narrow w-full max-w-[700px] text-center text-[42px] leading-[1.08] font-medium tracking-[-0.02em] text-black uppercase sm:text-[52px] md:text-[60px] md:leading-[1.34]">
          Fill the founders form
        </h1>

        <p className="font-dm-mono mt-[30px] max-w-[790px] text-center text-base leading-[1.45] tracking-[0.08em] text-black/60 uppercase sm:text-lg sm:leading-[1.39] sm:tracking-widest">
          We&apos;re looking to connect with a few founders to use Swift Agents
        </p>

        <div className="mt-[42px] w-full max-w-[842px] rounded-[28px] border border-black/25 bg-white px-4 pt-7 pb-9 text-center sm:mt-[50px] sm:px-6 md:mt-[57px] md:rounded-[49px] md:px-8 md:pt-9 md:pb-12">
          <div className="mx-auto w-full max-w-[720px]">
            <div className="flex flex-wrap gap-5 text-left">
              <div className="w-fit">
                <p className="font-dm-mono text-sm leading-[22px] font-medium text-black uppercase">
                  Founder information
                </p>
                <div className="-mx-2 mt-3 h-1 rounded-t-[5px] bg-[#7132D7]" />
              </div>
              <div className="w-fit">
                <p
                  className={`font-dm-mono text-sm leading-[22px] font-medium uppercase ${
                    formScreen === "you" ? "text-black" : "text-black/25"
                  }`}
                >
                  Your information
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
                  label="Founders name"
                  name="founderName"
                  placeholder="FOUNDERS FULLNAME"
                  required
                  value={values.founderName}
                  error={errors.founderName}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
                <SelectField
                  label="Company name"
                  name="companyName"
                  placeholder="SELECT COMPANY"
                  options={SERVICE_COMPANY_NAMES}
                  value={values.companyName}
                  error={errors.companyName}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
                <SelectField
                  label="Founders Position in company"
                  name="founderPosition"
                  placeholder="SELECT"
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
                  label="Founders Phone number"
                  name="founderPhone"
                  placeholder="+234"
                  required
                  type="tel"
                  inputMode="tel"
                  value={values.founderPhone}
                  error={errors.founderPhone}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
                <Field
                  label="Founders Email"
                  name="founderEmail"
                  placeholder="FOUNDER@FG.COM"
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
                  label="Name of your bank"
                  name="bankName"
                  placeholder="BANK NAME"
                  required
                  value={values.bankName}
                  error={errors.bankName}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
                <Field
                  label="Your account number"
                  name="accountNumber"
                  placeholder="2245XXXXXXXX"
                  required
                  inputMode="numeric"
                  value={values.accountNumber}
                  error={errors.accountNumber}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
                <Field
                  label="Your account name"
                  name="accountName"
                  placeholder="JOHN DOE"
                  required
                  value={values.accountName}
                  error={errors.accountName}
                  onBlur={validateOnBlur}
                  onChange={setFieldValue}
                />
                <Field
                  label="Your email"
                  name="yourEmail"
                  placeholder="JOHNDOE@SWFTGO.COM"
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
              className="font-dm-mono mx-auto mt-18 flex h-11 w-full max-w-[440px] shrink-0 cursor-pointer items-center justify-center rounded-md bg-[#F2B035] text-base leading-none font-medium text-black uppercase shadow-[-3px_4px_0_#000]"
            >
              {formScreen === "founder" ? "Next" : "Submit"}
            </button>

            <button
              type="button"
              onClick={handleBack}
              className="font-dm-mono mt-8 cursor-pointer text-sm tracking-[0.08em] text-black/50 uppercase underline underline-offset-4 md:text-base"
            >
              Back
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
