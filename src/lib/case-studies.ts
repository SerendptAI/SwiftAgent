import { videoUrl } from "@/lib/cloudinary";
import { cn } from "@/lib/utils";

/**
 * Partner footage is hosted on Cloudinary rather than committed to the repo —
 * it is hundreds of megabytes and Cloudinary transcodes it per browser.
 * `clip` is the `<partner>/<clip-slug>` pair that scripts/upload-videos.mjs
 * prints after an upload.
 */
const partnerVideo = (clip: string) => videoUrl(`partners/${clip}`);

export interface CaseStudyUseCase {
  title: string;
  /**
   * Trusted HTML, as with `CaseStudy.description`. Plain prose can be written
   * bare; `p`, `ul`/`li` and `blockquote` are styled by the detail view.
   */
  description: string;
  /**
   * Walkthrough clip for this use case, played in the detail view. Optional
   * because the unpublished studies have no footage; the detail view falls
   * back to the static mockup.
   */
  video?: string;
}

export interface CaseStudy {
  id: string;
  name: string;
  logo: string;
  mockup: string;
  description: string;
  /**
   * Orientation of this partner's clips, reserving the right space before the
   * video loads. Written out in full so Tailwind picks the classes up when it
   * scans this file.
   */
  videoAspect?: "aspect-[9/16]" | "aspect-video";
  useCases: CaseStudyUseCase[];
  /** Sign-off shown under the use cases. Trusted HTML, as with `description`. */
  closing?: string;
  /** Unpublished studies stay here for reference but are not served anywhere. */
  published: boolean;
}

const MOCKUP = "/images/products/swift-agents-sdk.svg";

/** Orange from the design library; fills the play-progress ring. */
export const DEFAULT_ACCENT_COLOR = "#F25430";

const ALL_CASE_STUDIES: CaseStudy[] = [
  {
    id: "kuda-bank",
    name: "Kuda Bank",
    logo: "/images/Referrals/logos/kuda.png",
    mockup: MOCKUP,
    published: false,
    description:
      "<strong>Kuda Bank</strong> is a digital-first bank built for Africans, offering zero-fee banking, savings, and spending tools through a seamless mobile experience.",
    useCases: [
      {
        title: "Resolve Account Access Issues",
        description:
          "Help customers unlock their accounts, reset PINs, and verify identity without waiting for a human agent.",
      },
      {
        title: "Answer Transaction Queries",
        description:
          "Instantly explain failed transactions, pending payments, and transfer limits to reduce inbound support load.",
      },
      {
        title: "Guide Savings Product Setup",
        description:
          "Walk customers through setting up savings targets, automated round-ups, and overdraft protection.",
      },
    ],
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    logo: "/images/Referrals/logos/flutterwave.png",
    mockup: MOCKUP,
    published: false,
    description:
      "<strong>Flutterwave</strong> is a global payments technology company that enables businesses across Africa and beyond to accept and make payments with a single API.",
    useCases: [
      {
        title: "Support Merchant Onboarding",
        description:
          "Guide new merchants through KYC, account setup, and API integration so they can start accepting payments faster.",
      },
      {
        title: "Handle Payout Disputes",
        description:
          "Automatically triage and respond to settlement queries, reducing time-to-resolution for payout disputes.",
      },
      {
        title: "Explain Compliance Requirements",
        description:
          "Answer questions about documentation, country-specific regulations, and integration requirements at scale.",
      },
    ],
  },
  {
    id: "chowdeck",
    name: "Chowdeck",
    logo: "/images/Referrals/logos/chowdeck.png",
    mockup: MOCKUP,
    description:
      "<strong>Chowdeck</strong> is a food delivery platform connecting hungry customers with their favourite restaurants across Nigerian cities, built for speed and reliability.",
    videoAspect: "aspect-[9/16]",
    published: true,
    useCases: [
      {
        title: "Turn Common Questions Into Instant Conversations",
        description:
          "A customer asking to change their delivery address gets the full answer in chat — what to do before the order is placed, how to reach support once it is already on its way, and when a fee adjustment applies.",
        video: partnerVideo("chowdeck/common-questions"),
      },
      {
        title: "Reduce Repetitive Support Work",
        description:
          "Order tracking, payment issues, delivery timelines and merchant availability are the same handful of questions over and over. Swift Agents resolves those instantly so human agents keep their attention on the complex cases.",
        video: partnerVideo("chowdeck/repetitive-support"),
      },
      {
        title: "Discover Through Conversation",
        description:
          "Customers who do not know what they want can just ask. “Three breakfast options under ₦5,000” comes back as real dishes with vendors, prices and ratings, ready to order.",
        video: partnerVideo("chowdeck/discover-meals"),
      },
    ],
  },
  {
    id: "raenest",
    name: "Raenest",
    logo: "/images/Referrals/logos/raenest.png",
    mockup: MOCKUP,
    description:
      "<strong>Raenest</strong> provides global financial tools for African professionals, including multi-currency accounts, USD cards, and cross-border payment solutions.",
    videoAspect: "aspect-video",
    published: true,
    useCases: [
      {
        title: "Simplify Account Setup & Onboarding",
        description:
          "New users are walked through verification in chat — which documents are accepted, why an upload was rejected for glare, a name mismatch or an expired proof of address, and exactly where in the dashboard to try again.",
        video: partnerVideo("raenest/setup-onboarding"),
      },
      {
        title: "Bring Clarity to Cross-Border Payments",
        description:
          "International transfers raise questions before, during and after they land. “Has my payment been received?” is answered rather than queued — the agent collects the transaction reference, amount and date, then confirms the status back to the user.",
        video: partnerVideo("raenest/payments"),
      },
      {
        title: "Keep Users Informed Every Step of the Way",
        description:
          "Once a transfer clears, the agent confirms the funds reached the recipient and tells them how to find the money in their account. Support should bring trust, not uncertainty.",
        video: partnerVideo("raenest/every-step"),
      },
    ],
  },
  {
    id: "partyverse",
    name: "Partyverse",
    logo: "/images/Referrals/logos/partyverse.png",
    mockup: MOCKUP,
    description:
      "<strong>Partyverse</strong> helps people discover and buy tickets to events. From our analysis, the current experience appears optimized for users who already know what event they want to attend. But for users who are undecided, exploring options, or simply looking for somewhere interesting to go, the journey can create friction.",
    videoAspect: "aspect-[9/16]",
    published: true,
    useCases: [
      {
        title: "Discover Events Through Conversation",
        description: [
          "<p>Instead of searching through multiple events, users can simply describe what they want:</p>",
          "<blockquote>",
          "<p>“What parties are happening this Friday?”</p>",
          "<p>“I want something chill around Lekki.”</p>",
          "<p>“I want a nightlife event with Afrobeat music.”</p>",
          "</blockquote>",
          "<p>SwiftAgents helps guide users to relevant suggestions instantly.</p>",
        ].join(""),
        video: partnerVideo("partyverse/describe-what-you-want"),
      },
      {
        title: "Handle Payment Questions Faster",
        description: [
          "<p>Help users get answers to common payment-related issues immediately:</p>",
          "<ul>",
          "<li>Failed payments</li>",
          "<li>Ticket confirmation questions</li>",
          "<li>Transaction status updates</li>",
          "<li>Refund-related questions</li>",
          "</ul>",
        ].join(""),
        video: partnerVideo("partyverse/payment-issues"),
      },
      {
        title: "Make Support Feel Like a Conversation",
        description:
          "Instead of sending customers to support forms or waiting for email responses, users can ask questions naturally and receive immediate guidance.",
        video: partnerVideo("partyverse/refund-in-chat"),
      },
    ],
    closing: [
      "<p>Less searching. Less waiting. Faster experiences.</p>",
      "<p>Traditional support platforms help teams manage support. ",
      "<strong>SwiftAgents helps teams reduce it.</strong></p>",
    ].join(""),
  },
  {
    id: "evolution",
    name: "Evolution",
    logo: "/images/Referrals/logos/evolution.png",
    mockup: MOCKUP,
    videoAspect: "aspect-[9/16]",
    published: true,
    description: [
      "<p><strong>Evolution</strong> is building a future where Africans can access ",
      "the global economy through a single financial account. Whether it is receiving ",
      "international payments, managing global balances, spending across borders, or ",
      "accessing financial opportunities beyond local markets, the platform is designed ",
      "to make global finance feel simple.</p>",
      "<p>As more users rely on Evolution for international transactions, customer ",
      "conversations naturally become more time-sensitive. Questions about verification, ",
      "incoming payments, transfers, virtual cards, exchange rates, and account activity ",
      "often require quick clarification, because every delay can create uncertainty.</p>",
    ].join(""),
    useCases: [
      {
        title: "Make Global Finance Feel Simpler",
        description: [
          "<p>International banking can be complex, but getting help should not be. ",
          "Instead of searching through help articles or waiting for a response, users ",
          "can simply ask:</p>",
          "<blockquote>",
          "<p>“Has my international payment arrived?”</p>",
          "<p>“Why is my account still under review?”</p>",
          "<p>“How do I create a virtual card?”</p>",
          "<p>“Why was my transfer delayed?”</p>",
          "</blockquote>",
          "<p>SwiftAgents delivers immediate, conversational guidance that helps users ",
          "move forward with confidence.</p>",
        ].join(""),
        video: partnerVideo("evolution/simpler-global-finance"),
      },
      {
        title: "Reduce Uncertainty Around Every Transaction",
        description: [
          "<p>Cross-border payments often generate the same types of questions:</p>",
          "<ul>",
          "<li>Payment status</li>",
          "<li>Account verification</li>",
          "<li>Virtual card enquiries</li>",
          "<li>Exchange rate questions</li>",
          "<li>Transfer timelines</li>",
          "<li>Withdrawal status</li>",
          "</ul>",
          "<p>SwiftAgents resolves these routine conversations instantly, giving customers ",
          "greater visibility while allowing the support team to focus on more complex ",
          "financial issues.</p>",
        ].join(""),
        video: partnerVideo("evolution/reduce-uncertainty"),
      },
      {
        title: "Support Users Across Every Time Zone",
        description: [
          "<p>Global finance does not stop when business hours end. Whether a customer is ",
          "receiving a payment from the US, sending funds to another country, or managing ",
          "their account late at night, SwiftAgents provides intelligent 24/7 assistance ",
          "that keeps users informed whenever they need help.</p>",
          "<p>The result is a smoother customer journey, greater confidence, and a support ",
          "experience that scales as Evolution grows.</p>",
        ].join(""),
        video: partnerVideo("evolution/every-time-zone"),
      },
    ],
    closing: [
      "<p>Access to the global economy should come with access to instant answers.</p>",
      "<p><strong>SwiftAgents helps Evolution transform customer support into ",
      "intelligent conversations</strong> — reducing uncertainty, building trust, and ",
      "delivering world-class support at scale.</p>",
    ].join(""),
  },
  {
    id: "selar",
    name: "Selar",
    logo: "/images/Referrals/logos/selar.png",
    mockup: MOCKUP,
    videoAspect: "aspect-[9/16]",
    published: true,
    description: [
      "<p><strong>Selar</strong> has become one of Africa's leading platforms ",
      "for creators and entrepreneurs to sell digital products, online courses, ",
      "memberships, event tickets, subscriptions, services, and physical ",
      "products to customers around the world. The platform also supports ",
      "multiple currencies, automated product delivery, affiliate marketing, ",
      "and creator payouts, making it an all-in-one commerce platform for ",
      "digital businesses.</p>",
      "<p>As Selar continues to grow, so does the number of conversations ",
      "happening around purchases, creator onboarding, payouts, downloads, ",
      "customer access, and product management. Most of these conversations do ",
      "not require a support agent. They simply require the right answer at the ",
      "right moment.</p>",
    ].join(""),
    useCases: [
      {
        title: "Turn Help Articles Into Instant Answers",
        description: [
          "<p>Selar already provides detailed documentation and support ",
          "resources. Instead of asking users to search through articles, ",
          "SwiftAgents allows them to simply ask:</p>",
          "<blockquote>",
          "<p>“Why can’t I access my course?”</p>",
          "<p>“How do I receive payments in USD?”</p>",
          "<p>“Where can I find my customer’s receipt?”</p>",
          "<p>“Why hasn’t my payout arrived?”</p>",
          "</blockquote>",
          "<p>The right answer appears instantly in natural conversation.</p>",
        ].join(""),
        video: partnerVideo("selar/help-articles"),
      },
      {
        title: "Support Both Creators and Buyers Simultaneously",
        description: [
          "<p>Every transaction creates two different support journeys.</p>",
          "<p>The creator wants to know:</p>",
          "<blockquote>",
          "<p>“Why is my payout pending?”</p>",
          "<p>“How do I connect my domain?”</p>",
          "</blockquote>",
          "<p>While the buyer asks:</p>",
          "<blockquote>",
          "<p>“Where’s my download?”</p>",
          "<p>“I paid but haven’t received access.”</p>",
          "</blockquote>",
          "<p>SwiftAgents understands who is asking and provides contextual ",
          "guidance without adding pressure to the support team.</p>",
        ].join(""),
        video: partnerVideo("selar/creators-and-buyers"),
      },
      {
        title: "Scale Knowledge, Not Support Tickets",
        description: [
          "<p>As more creators join Selar and more customers make purchases ",
          "across different countries, repetitive questions naturally ",
          "increase.</p>",
          "<p>SwiftAgents transforms repetitive conversations into self-service ",
          "experiences, helping users find answers in seconds while allowing ",
          "support teams to focus on the conversations that genuinely need ",
          "human attention.</p>",
        ].join(""),
        video: partnerVideo("selar/scale-knowledge"),
      },
    ],
    closing: [
      "<p>The best customer support isn’t the fastest reply. It’s the answer ",
      "users never have to wait for.</p>",
      "<p><strong>SwiftAgents helps Selar turn thousands of support ",
      "interactions into instant conversations</strong> — creating a better ",
      "experience for creators, buyers, and the support team alike.</p>",
    ].join(""),
  },
  {
    id: "rank",
    name: "Rank",
    logo: "/images/Referrals/logos/rank.png",
    mockup: MOCKUP,
    videoAspect: "aspect-[9/16]",
    published: true,
    description: [
      "<p><strong>Rank</strong>, formerly Moni, is building a new way for ",
      "Africans to save, spend, send money, and grow wealth together. Built on ",
      "the trust of community finance, the platform combines digital banking ",
      "with group savings, payments, and financial tools to make everyday money ",
      "management simpler.</p>",
      "<p>As more users trust Rank with their finances, support becomes more ",
      "than solving problems — it is about maintaining confidence. Questions ",
      "around account verification, transfers, savings, transaction status, ",
      "bill payments, and onboarding are part of the daily customer journey. ",
      "Many of these conversations are repetitive, yet customers expect ",
      "answers immediately.</p>",
    ].join(""),
    useCases: [
      {
        title: "Make Everyday Banking Feel Effortless",
        description: [
          "<p>Instead of searching through FAQs or waiting for a support ",
          "response, customers can simply ask:</p>",
          "<blockquote>",
          "<p>“Why is my transfer still pending?”</p>",
          "<p>“How do I start a savings plan?”</p>",
          "<p>“Why hasn’t my account been verified?”</p>",
          "<p>“How do I increase my transaction limit?”</p>",
          "</blockquote>",
          "<p>SwiftAgents provides immediate, conversational guidance, helping ",
          "customers resolve common issues within seconds.</p>",
        ].join(""),
        video: partnerVideo("rank/everyday-banking"),
      },
      {
        title: "Transform Routine Questions Into Instant Conversations",
        description: [
          "<p>Many customer enquiries follow familiar patterns:</p>",
          "<ul>",
          "<li>Account onboarding and verification</li>",
          "<li>Transfer status</li>",
          "<li>Savings and withdrawal enquiries</li>",
          "<li>Bill payment issues</li>",
          "<li>Transaction history</li>",
          "<li>Account and security questions</li>",
          "</ul>",
          "<p>SwiftAgents resolves these conversations instantly, reducing ",
          "support queues while allowing human agents to focus on more complex ",
          "financial cases.</p>",
        ].join(""),
        video: partnerVideo("rank/routine-questions"),
      },
      {
        title: "Grow Customer Confidence Alongside the Platform",
        description: [
          "<p>As Rank expands its banking and wealth offerings, customer ",
          "expectations continue to grow.</p>",
          "<p>SwiftAgents delivers intelligent, 24/7 conversational support ",
          "that keeps customers informed at every step — whether they are ",
          "opening an account, sending money, saving towards a goal, or ",
          "managing everyday finances.</p>",
          "<p>The result is a faster, more reassuring customer experience that ",
          "scales with the business.</p>",
        ].join(""),
        video: partnerVideo("rank/grow-confidence"),
      },
    ],
    closing: [
      "<p>Every financial conversation is an opportunity to build trust.</p>",
      "<p><strong>SwiftAgents helps Rank turn routine support into intelligent ",
      "conversations</strong> — giving customers instant answers while ",
      "empowering the support team to focus on what matters most.</p>",
    ].join(""),
  },
];

/** Only published studies are listed, routed, or put in the sitemap. */
export const CASE_STUDIES: CaseStudy[] = ALL_CASE_STUDIES.filter(
  (cs) => cs.published,
);

export function getCaseStudy(id: string): CaseStudy | undefined {
  return CASE_STUDIES.find((cs) => cs.id === id);
}

export function getCaseStudyPath(id: string): string {
  return `/case-studies/${id}`;
}

export function caseStudyChipClass(active: boolean): string {
  return cn(
    "ml-1 flex w-fit shrink-0 items-center gap-3 rounded-[10px] border px-4 py-2.5 text-sm font-medium tracking-[10%] text-black transition-colors md:gap-6 md:text-base lg:text-lg xl:text-xl",
    active
      ? "border-black bg-[#F6F4EF] shadow-[-4px_4px_0px_0px_#000000]"
      : "border-black/30 bg-[#F6F4EF]/50 hover:border-black",
  );
}

/**
 * Only these end a block of text. Inline tags have to close up with no space,
 * or `<strong>Rank</strong>,` reads as "Rank , formerly Moni"; block ends need
 * one, or paragraphs weld into "…digital businesses.As Selar continues…".
 */
const BLOCK_END = /<\/(?:p|li|ul|ol|blockquote|h[1-6]|div)>/gi;

/** Flattens a study's markup for the card summaries and meta descriptions. */
export function getCaseStudyPlainDescription(caseStudy: CaseStudy): string {
  return caseStudy.description
    .replace(BLOCK_END, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Search results show around this much; past it the tail is wasted. */
const META_DESCRIPTION_LIMIT = 155;

/**
 * The studies whose description runs several paragraphs would otherwise emit
 * the whole thing — Selar's reached 704 characters — so this cuts to a word
 * boundary instead of letting search engines truncate mid-word.
 */
export function getCaseStudyMetaDescription(caseStudy: CaseStudy): string {
  const plain = getCaseStudyPlainDescription(caseStudy);
  if (plain.length <= META_DESCRIPTION_LIMIT) return plain;

  const clipped = plain.slice(0, META_DESCRIPTION_LIMIT - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  const atWord = lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped;
  return `${atWord.replace(/[\s,;:—-]+$/, "")}…`;
}
