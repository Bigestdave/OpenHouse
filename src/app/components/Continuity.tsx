import { Check, ArrowRight, ShieldCheck } from "lucide-react";
import { Section } from "./primitives/Section";
import { MotionReveal } from "./primitives/MotionReveal";
import { fadeUpSmall } from "../lib/motion";
import propAdmiraltyImg from "../../assets/prop-admiralty.jpg";

const SPATIAL_EVIDENCE = [
  "All 6 advertised spaces verified against source media",
  "Doorway circulation and balcony connection verified",
  "No speculative room dimensions without floor plan scale",
  "Automatic privacy blurring for faces & personal items",
];

const AUDIT_CHECKS = [
  { room: "Living Room", evidence: "Daytime 4K Video", status: "Verified", color: "text-emerald-400" },
  { room: "Kitchen", evidence: "Wide Angle Photo + Video", status: "Verified", color: "text-emerald-400" },
  { room: "Balcony Connection", evidence: "15s Mobile Recapture", status: "Verified", color: "text-emerald-400" },
  { room: "Bedroom 3", evidence: "Visual Ratio Estimate", status: "Dimension Estimated", color: "text-amber-400" },
];

export function Continuity() {
  return (
    <Section spacing="none" className="pt-28 md:pt-36 pb-14 md:pb-18">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
        {/* ── Left column: editorial ─────────────────────────────── */}
        <div>
          <MotionReveal>
            <div className="text-[0.8rem] uppercase tracking-[0.14em] text-emerald-400 font-bold">
              Disciplined Spatial Intelligence
            </div>
          </MotionReveal>

          <MotionReveal variants={fadeUpSmall} delay={0.05}>
            <h2 className="mt-4 text-[clamp(2.5rem,4.5vw,3.9rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
              Every answer is grounded in source evidence.
            </h2>
          </MotionReveal>

          <MotionReveal variants={fadeUpSmall} delay={0.1}>
            <p className="mt-6 max-w-md text-[1.06rem] leading-[1.6] text-ink-2">
              OpenHouse never hallucinates. When renters ask about daylight orientation, dimensions, or balcony connections, the agent answers with verifiable evidence badges.
            </p>
          </MotionReveal>

          <MotionReveal variants={fadeUpSmall} delay={0.15}>
            <ul className="mt-8 flex flex-col gap-2.5">
              {SPATIAL_EVIDENCE.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[1.05rem] text-ink-2">
                  <Check className="h-5 w-5 shrink-0 text-emerald-400" strokeWidth={2.25} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </div>

        {/* ── Right column: production card ───────────────────────── */}
        <MotionReveal variants={fadeUpSmall} delay={0.1}>
          <div className="rounded-2xl border border-line bg-surface p-6 md:p-7 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-5 border-b border-line pb-5 sm:flex-row sm:items-start">
              <img
                src={propAdmiraltyImg}
                alt="8 Admiralty Way"
                className="h-[150px] w-full shrink-0 rounded-xl sm:h-[130px] sm:w-[200px] object-cover"
              />
              <div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Spatial Audit Passed</span>
                </div>
                <h3 className="text-[1.8rem] font-semibold leading-tight tracking-[-0.02em] text-ink mt-1">
                  8 Admiralty Way
                </h3>
                <div className="mt-1 text-[0.95rem] text-ink-2">
                  3-Bedroom Waterfront Apartment · Lekki Phase 1
                </div>
                <div className="mt-2 text-[0.85rem] text-ink-3">
                  6 of 6 spaces captured · 1 issue resolved via 15s mobile capture
                </div>
              </div>
            </div>

            {/* Audit Table */}
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-ink-3 mb-3">
                Spatial Evidence Ledger
              </p>
              <div className="divide-y divide-line rounded-xl border border-line bg-raised overflow-hidden">
                {AUDIT_CHECKS.map((check) => (
                  <div key={check.room} className="flex items-center justify-between p-3.5 text-xs">
                    <div>
                      <p className="font-bold text-ink">{check.room}</p>
                      <p className="text-ink-3 mt-0.5">{check.evidence}</p>
                    </div>
                    <span className={`font-semibold ${check.color}`}>
                      {check.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-ink-3">Confidence Score: 98.4%</span>
              <a
                href="#/show/8-admiralty-way"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-900 transition-colors"
              >
                <span>Inspect in Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </MotionReveal>
      </div>

      {/* ── Closing line ─────────────────────────────────────────── */}
      <MotionReveal variants={fadeUpSmall}>
        <p className="mt-20 text-center text-[clamp(1.75rem,3.4vw,3.25rem)] font-semibold tracking-[-0.02em]">
          <span className="text-ink">The property is real. </span>
          <span className="text-emerald-400/70">The spatial experience is exact.</span>
        </p>
      </MotionReveal>
    </Section>
  );
}

