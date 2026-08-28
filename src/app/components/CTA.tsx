import { Play, Activity, Eye, RefreshCw } from "lucide-react";
import { Section } from "./primitives/Section";
import { EditorialHeading } from "./primitives/EditorialHeading";
import { MotionReveal } from "./primitives/MotionReveal";
import { CTAButton } from "./primitives/CTAButton";
import { fadeUpSmall, fadeUp, stagger } from "../lib/motion";
import { motion, useReducedMotion } from "motion/react";

const FEATURES = [
  {
    n: "01",
    icon: Activity,
    title: "Autonomous Pipeline",
    desc: "Ingests listings and processes spatial 3D views automatically.",
  },
  {
    n: "02",
    icon: Eye,
    title: "Grounded Spatial QA",
    desc: "Cross-checks evidence against source photos with zero hallucinations.",
  },
  {
    n: "03",
    icon: RefreshCw,
    title: "15-Second Recaptures",
    desc: "Dispatches single-link mobile capture requests only when angles are missing.",
  },
];

export function CTA() {
  const reduce = useReducedMotion();
  return (
    <Section spacing="none" className="pt-14 md:pt-18 pb-36 md:pb-48">
      {/* Hero: full film strip fills the right of the band, copy at the lower-left */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="relative max-w-[38rem] py-24 md:py-32">
          <MotionReveal>
            <EditorialHeading as="h2" size="section" className="[&>h2]:text-[clamp(2.25rem,5vw,4.25rem)]">
              Your next listing
              <br />
              becomes an open house.
            </EditorialHeading>
          </MotionReveal>
          <MotionReveal variants={fadeUpSmall} delay={0.05}>
            <p className="mt-7 max-w-md text-[1rem] leading-[1.65] text-ink-2">
              List the property normally on your portal.
              <br />
              OpenHouse builds the interactive 3D tour in the background.
            </p>
          </MotionReveal>
          <MotionReveal variants={fadeUpSmall} delay={0.1}>
            <div className="mt-9 flex flex-wrap gap-3">
              <CTAButton size="lg" href="#/properties">Open Realtor Workspace</CTAButton>
              <CTAButton variant="secondary" size="lg" href="#/demo-portal">
                <Play className="h-3.5 w-3.5" /> Simulate Listing Portal
              </CTAButton>
            </div>
          </MotionReveal>
        </div>
      </div>

      {/* Feature triplet with left dividers */}
      <motion.div
        variants={stagger(0.1)}
        initial={reduce ? undefined : "hidden"}
        whileInView={reduce ? undefined : "visible"}
        viewport={{ once: true, amount: 0.3 }}
        className="mt-20 grid grid-cols-1 gap-10 border-t border-line pt-14 md:grid-cols-3 md:gap-0"
      >
        {FEATURES.map((f) => (
          <motion.div
            key={f.n}
            variants={reduce ? undefined : fadeUp}
            className="md:px-8 md:not-first:border-l md:not-first:border-line md:first:pl-0"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="text-[1.1rem] tabular-nums text-emerald-400 font-bold">{f.n}</span>
              <f.icon className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="text-[1.05rem] font-medium text-ink">{f.title}</div>
            <p className="mt-2 max-w-[16rem] text-[0.9rem] leading-[1.6] text-ink-2">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}

const FOOTER_COLS: Array<{ title: string; links: Array<{ label: string; href?: string; scrollTo?: string }> }> = [
  {
    title: "Product",
    links: [
      { label: "How it works", scrollTo: "how-it-works" },
      { label: "Virtual Tour", scrollTo: "examples" },
      { label: "Spatial QA", scrollTo: "technology" },
    ],
  },
  {
    title: "Demo Experience",
    links: [
      { label: "8 Admiralty Way (Balcony Missing)", href: "#/show/8-admiralty-way" },
      { label: "14 Bourdillon Road (Happy Path)", href: "#/show/14-bourdillon-road" },
      { label: "Public 3D Viewer", href: "#/view/8-admiralty-way" },
      { label: "Simulate Listing Trigger", href: "#/demo-portal" },
    ],
  },
  {
    title: "Workspace",
    links: [
      { label: "Attention Inbox", href: "#/properties" },
      { label: "Capture Requests", href: "#/capture-requests" },
      { label: "Experiences Hub", href: "#/experiences" },
      { label: "Publication Approvals", href: "#/approvals" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-10">
        <div>
          <div className="text-[1.05rem] font-semibold tracking-[-0.02em] text-ink">
            Open<span className="text-emerald-400">House</span>
          </div>
          <p className="mt-4 max-w-[16rem] text-[0.9rem] leading-[1.6] text-ink-3">
            Autonomous spatial real estate AI for realtors, property managers, and renters.
          </p>
          <div className="mt-5 inline-flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-xs text-stone-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Autonomous Agent Engine</span>
          </div>
        </div>

        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <div className="mb-5 text-[0.72rem] uppercase tracking-[0.18em] text-ink-3">
              {col.title}
            </div>
            <ul className="flex flex-col gap-4">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.scrollTo ? (
                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById(l.scrollTo!)?.scrollIntoView({ behavior: "smooth", block: "start" })
                      }
                      className="text-[0.95rem] text-ink-2 transition-colors duration-150 hover:text-ink"
                    >
                      {l.label}
                    </button>
                  ) : (
                    <a
                      href={l.href}
                      {...(l.href?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="text-[0.95rem] text-ink-2 transition-colors duration-150 hover:text-ink"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-6 text-[0.85rem] text-ink-4 md:px-10">
          © 2026 OpenHouse Spatial Intelligence
        </div>
      </div>
    </footer>
  );
}
