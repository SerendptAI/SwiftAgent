"use client";

import { useEffect, useRef, useState } from "react";

interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

export function PrivacyContent() {
  const [activeSection, setActiveSection] = useState<string>("introduction");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sections: Section[] = [
    {
      id: "introduction",
      title: "1. Introduction",
      content: (
        <>
          <p className="mb-4 text-base leading-relaxed text-gray-700">
            Welcome to Swift Agents. We provide an automated and human-escalated
            customer support software platform accessible via our website and
            mobile application (collectively, the &ldquo;Service&rdquo;). We are
            deeply committed to protecting the privacy and security of our
            business clients (&ldquo;Clients&rdquo;) and the users or customers
            they serve (&ldquo;End-Users&rdquo;).
          </p>
          <p className="text-base leading-relaxed text-gray-700">
            This Privacy Policy outlines how we collect, use, process, store,
            and safeguard data when you interact with our Service. Please read
            this document carefully to understand our data practices.
          </p>
        </>
      ),
    },
    {
      id: "information-we-collect",
      title: "2. Information We Collect",
      content: (
        <>
          <p className="mb-6 text-base leading-relaxed text-gray-700">
            To effectively manage message backlogs, automate support workflows,
            and resolve queries, we collect the following categories of
            information:
          </p>

          <div className="space-y-6">
            <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:border-black/20 hover:shadow-md">
              <h4 className="mb-4 flex items-center gap-3 text-lg font-bold text-black">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#7CA2FE]/30 bg-[#7CA2FE]/10 font-mono text-xs font-bold text-[#7CA2FE]">
                  A
                </span>
                Information Provided Voluntarily by Clients
              </h4>
              <ul className="list-disc space-y-3 pl-5 text-sm text-gray-600">
                <li>
                  <strong className="text-gray-900">
                    Account Registration Data:
                  </strong>{" "}
                  Full name, business email address, business phone number,
                  corporate physical address, and account login credentials.
                </li>
                <li>
                  <strong className="text-gray-900">
                    Business Profile Data:
                  </strong>{" "}
                  Business name, industry type, corporate website URL, and
                  branding assets (such as logos) used to customize
                  customer-facing interfaces.
                </li>
                <li>
                  <strong className="text-gray-900">
                    Knowledge Base Data & Company Documents:
                  </strong>{" "}
                  Training documents, product manuals, internal knowledge bases,
                  frequently asked questions (FAQs), and other contextual
                  documentation uploaded by the Client to help our system answer
                  queries.
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:border-black/20 hover:shadow-md">
              <h4 className="mb-4 flex items-center gap-3 text-lg font-bold text-black">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#7CA2FE]/30 bg-[#7CA2FE]/10 font-mono text-xs font-bold text-[#7CA2FE]">
                  B
                </span>
                Information Processed on Behalf of Your End-Users
              </h4>
              <ul className="list-disc space-y-3 pl-5 text-sm text-gray-600">
                <li>
                  <strong className="text-gray-900">
                    Customer Query Logs:
                  </strong>{" "}
                  The text content, attachments, timestamps, and metadata of
                  messages sent to our clients by potential or existing
                  customers through integrated communication channels.
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm transition-all hover:border-black/20 hover:shadow-md">
              <h4 className="mb-4 flex items-center gap-3 text-lg font-bold text-black">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#7CA2FE]/30 bg-[#7CA2FE]/10 font-mono text-xs font-bold text-[#7CA2FE]">
                  C
                </span>
                Automatically Collected Technical Data
              </h4>
              <ul className="list-disc space-y-3 pl-5 text-sm text-gray-600">
                <li>
                  <strong className="text-gray-900">Log and Usage Data:</strong>{" "}
                  IP addresses, browser types, mobile device identification
                  numbers (IMEI/UUID), operating system versions, language
                  preferences, and interaction metrics within our web platform
                  and mobile application.
                </li>
                <li>
                  <strong className="text-gray-900">
                    Cookies and Tracking Technologies:
                  </strong>{" "}
                  We use essential cookies to maintain secure user sessions and
                  remember system preferences. With your consent, we also use
                  analytics cookies to understand how the platform is used and
                  to improve it. You can decline these in the cookie banner
                  without affecting your use of the platform.
                </li>
              </ul>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "how-we-use-your-information",
      title: "3. How We Use Your Information",
      content: (
        <>
          <p className="mb-6 text-base leading-relaxed text-gray-700">
            We process and utilize data strictly for legitimate business
            operations and to deliver our core service functionalities:
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-black/5 bg-white/80 p-6 shadow-sm">
              <h5 className="mb-3 text-base font-bold text-gray-900">
                1. Automated Customer Support
              </h5>
              <p className="text-sm leading-relaxed text-gray-600">
                To analyze incoming customer messages against your uploaded
                company documents to deliver precise, automated, and immediate
                support solutions.
              </p>
            </div>

            <div className="rounded-xl border border-black/5 bg-white/80 p-6 shadow-sm">
              <h5 className="mb-3 text-base font-bold text-gray-900">
                2. Intelligent Escalation
              </h5>
              <p className="text-sm leading-relaxed text-gray-600">
                To seamlessly package and transfer communication histories to a
                designated human support agent when our automated system
                encounters a query it cannot confidently resolve.
              </p>
            </div>

            <div className="rounded-xl border border-black/5 bg-white/80 p-6 shadow-sm sm:col-span-2">
              <h5 className="mb-3 text-base font-bold text-gray-900">
                3. Platform Enhancement & AI Optimization
              </h5>
              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                To constantly work to make customer support more efficient for
                the broader business community. To achieve this, we may analyze
                anonymized, aggregated operational data to train and refine our
                machine learning models, helping other businesses optimize their
                workflows and improve support response quality.
              </p>
              <div className="rounded-r-lg border-l-4 border-[#7CA2FE] bg-[#7CA2FE]/5 p-4 text-xs text-gray-700">
                <strong className="mb-1 block text-gray-900">
                  Model Training Safeguards:
                </strong>{" "}
                Any data used for model training is strictly stripped of all
                personally identifiable information (PII) and company-specific
                proprietary details to ensure your business privacy remains
                entirely protected.
              </div>
            </div>

            <div className="rounded-xl border border-black/5 bg-white/80 p-6 shadow-sm sm:col-span-2">
              <h5 className="mb-3 text-base font-bold text-gray-900">
                4. Account Administration
              </h5>
              <p className="text-sm leading-relaxed text-gray-600">
                To send technical alerts, security updates, service
                announcements, and administrative messages regarding
                subscription renewals or feature changes.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "data-sharing",
      title: "4. Data Sharing & Disclosures",
      content: (
        <>
          <p className="mb-6 text-base leading-relaxed text-gray-700">
            We do not sell, rent, trade, or monetize your business or customer
            data to third parties. Data sharing is strictly confined to the
            following narrow business necessities:
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-black font-mono text-sm font-bold text-white">
                1
              </div>
              <div>
                <h5 className="mb-1 text-base font-bold text-gray-900">
                  Payment Processing
                </h5>
                <p className="text-sm leading-relaxed text-gray-600">
                  We do not collect or store financial card or banking
                  credentials. Subscription billing transactions are handled
                  entirely by our secure, third-party payment gateway. These
                  processors are bound by strict PCI-DSS compliance regulations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-black font-mono text-sm font-bold text-white">
                2
              </div>
              <div>
                <h5 className="mb-1 text-base font-bold text-gray-900">
                  Authorized Human Agents
                </h5>
                <p className="text-sm leading-relaxed text-gray-600">
                  Customer queries flagged for escalation are only made visible
                  to human support personnel authorized by the Client within
                  their internal dashboard workflow.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-black font-mono text-sm font-bold text-white">
                3
              </div>
              <div>
                <h5 className="mb-1 text-base font-bold text-gray-900">
                  Legal Compliance and Safety
                </h5>
                <p className="text-sm leading-relaxed text-gray-600">
                  We may disclose data if legally required to do so by
                  applicable law, state regulations, subpoena, or a binding
                  court order, or to protect the safety and vital interests of
                  our users and platform.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "mobile-permissions",
      title: "5. Mobile Permissions",
      content: (
        <>
          <p className="mb-6 text-base leading-relaxed text-gray-700">
            When utilizing the Swift Agents mobile application, the software may
            request specific device permissions to operate correctly. These may
            include:
          </p>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-lg bg-[#7CA2FE]/10 p-2.5 text-[#7CA2FE]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </span>
                <h5 className="text-base font-bold text-gray-900">
                  Push Notifications
                </h5>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                To alert your team instantly of pending ticket backlogs, urgent
                customer messages, or manual escalation requests.
              </p>
            </div>

            <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <span className="rounded-lg bg-[#7CA2FE]/10 p-2.5 text-[#7CA2FE]">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </span>
                <h5 className="text-base font-bold text-gray-900">
                  Storage & Files Access
                </h5>
              </div>
              <p className="text-sm leading-relaxed text-gray-600">
                To allow your administrators or human agents to upload company
                training documents or download customer chat transcripts
                directly from a mobile device.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "data-security",
      title: "6. Data Security & Global Transfers",
      content: (
        <>
          <p className="mb-6 text-base leading-relaxed text-gray-700">
            We implement robust administrative, technical, and physical security
            measures designed to shield your business records and customer
            communications from unauthorized access, loss, alteration, or
            exposure.
          </p>

          <div className="space-y-6">
            <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
              <h5 className="mb-2 text-base font-bold text-gray-900">
                1. Encryption
              </h5>
              <p className="text-sm leading-relaxed text-gray-600">
                Data is encrypted both in transit (using HTTPS/TLS protocols)
                and at rest on secure cloud servers.
              </p>
            </div>
            <div className="rounded-xl border border-black/5 bg-white p-6 shadow-sm">
              <h5 className="mb-2 text-base font-bold text-gray-900">
                2. Cross-Border Transfers
              </h5>
              <p className="text-sm leading-relaxed text-gray-600">
                Because Swift Agents relies on global cloud infrastructure to
                maintain high availability, your data may be transferred to and
                maintained on servers located outside your state, province, or
                country. By using the platform, you consent to these secure data
                transfers.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "data-retention",
      title: "7. Data Retention",
      content: (
        <p className="text-base leading-relaxed text-gray-700">
          We retain your business profile data and uploaded documents for as
          long as your Swift Agents account remains active or as needed to
          provide you with the Service. Customer communication logs are retained
          based on your subscription settings or until account deletion, after
          which data is systematically purged, deleted, or scrubbed of
          identifiable information in accordance with standard data sanitation
          practices.
        </p>
      ),
    },
    {
      id: "your-rights",
      title: "8. Your Rights & Data Control",
      content: (
        <>
          <p className="mb-6 text-base leading-relaxed text-gray-700">
            We provide Clients with full agency over their personal and
            organizational information. You can exercise the following rights
            directly via your account settings dashboard:
          </p>

          <div className="space-y-6">
            <div className="border-l-4 border-black pl-5">
              <h5 className="mb-1 text-base font-bold text-gray-900">
                Right to Rectification (Correct and Update)
              </h5>
              <p className="text-sm leading-relaxed text-gray-600">
                You have the right to modify, correct inaccurate data points, or
                instantly update outdated profile details, business info, or
                contact numbers.
              </p>
            </div>

            <div className="border-l-4 border-black pl-5">
              <h5 className="mb-1 text-base font-bold text-gray-900">
                Right to Erasure (Delete Data)
              </h5>
              <p className="text-sm leading-relaxed text-gray-600">
                You may delete uploaded company documents, old chat logs, or any
                data fields you deem no longer useful or necessary for your
                business operations.
              </p>
            </div>

            <div className="border-l-4 border-black pl-5">
              <h5 className="mb-1 text-base font-bold text-gray-900">
                Account Termination
              </h5>
              <p className="text-sm leading-relaxed text-gray-600">
                Upon terminating your subscription, you may request the
                permanent deletion of your complete system profile and all
                underlying uploaded assets.
              </p>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "childrens-privacy",
      title: "9. Children's Privacy",
      content: (
        <p className="text-base leading-relaxed text-gray-700">
          Swift Agents is a business-to-business (B2B) utility platform designed
          for corporate use by business entities and adult professionals. We do
          not knowingly solicit or collect data from individuals under the age
          of 18. If we discover that an underaged individual has provided us
          with personal information, we will take immediate steps to delete it.
        </p>
      ),
    },
    {
      id: "changes-to-policy",
      title: "10. Changes to This Privacy Policy",
      content: (
        <p className="text-base leading-relaxed text-gray-700">
          We reserve the right to modify this Privacy Policy at any time. When
          modifications are made, we will update the &ldquo;Effective
          Date&rdquo; at the top of this document. For material changes that
          impact how your data is treated, we will provide a prominent notice
          within your account dashboard or send an email alert before the
          changes go into effect.
        </p>
      ),
    },
    {
      id: "contact-us",
      title: "11. Contact Us",
      content: (
        <>
          <p className="mb-6 text-base leading-relaxed text-gray-700">
            If you have any questions, legal concerns, compliance inquiries, or
            data requests regarding this Privacy Policy, please contact our team
            at:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
              <span className="mb-1 block font-mono text-xs tracking-wider text-gray-400 uppercase">
                Primary Support
              </span>
              <a
                href="mailto:thelma@swiftagents.org"
                className="text-lg font-bold text-black transition-colors hover:text-[#7CA2FE]"
              >
                thelma@swiftagents.org
              </a>
            </div>
            <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm">
              <span className="mb-1 block font-mono text-xs tracking-wider text-gray-400 uppercase">
                Corporate Services
              </span>
              <a
                href="mailto:services@swiftagents.org"
                className="text-lg font-bold text-black transition-colors hover:text-[#7CA2FE]"
              >
                services@swiftagents.org
              </a>
            </div>
          </div>
        </>
      ),
    },
  ];

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      rootMargin: "-20% 0px -60% 0px",
    });

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navbarOffset = 100;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-6 pt-32 pb-24 md:pt-40">
      {/* Header section */}
      <div className="mb-16 max-w-3xl text-left">
        <span className="mb-4 inline-block rounded border border-[#7CA2FE]/20 bg-[#7CA2FE]/10 px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-[#7CA2FE] uppercase">
          Legal Portal
        </span>
        <h1 className="font-greed-narrow mb-6 text-4xl font-medium tracking-tight text-black uppercase sm:text-5xl md:text-6xl">
          Privacy Policy
        </h1>
        <p className="font-mono text-base text-gray-500">
          EFFECTIVE DATE: JULY 2, 2026
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
        {/* Table of contents - Sticky sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 flex flex-col gap-2 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-mono text-[11px] font-bold tracking-wider text-gray-400 uppercase">
              Sections
            </h3>
            <nav className="flex flex-col gap-1.5">
              {sections.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`rounded-lg px-3 py-1.5 text-left text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-black text-white"
                        : "text-gray-500 hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    {section.title}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content body */}
        <div className="flex max-w-4xl flex-col gap-16">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 border-b border-black/5 pb-12 last:border-0"
            >
              <h2 className="font-greed-narrow mb-6 text-2xl font-semibold text-black uppercase">
                {section.title}
              </h2>
              <div className="prose max-w-none font-sans text-gray-600">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
