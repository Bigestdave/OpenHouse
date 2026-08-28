import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { EditorialHeading } from "./primitives/EditorialHeading";
import { MotionReveal } from "./primitives/MotionReveal";
import { PIPELINE_PANELS } from "./mockups/PipelinePanels";
import { crossfade } from "../lib/motion";

const STAGES = [
  {
    n: "01",
    title: "Intake & media check",
    sub: "Triggered automatically when a listing is published.",
    desc: "OpenHouse analyzes listing photos and video footage, identifies all advertised rooms, and checks camera angles and spatial coverage."
  },
  {
    n: "02",
    title: "15-second mobile recapture",
    sub: "Reaches out only if missing footage blocks the experience.",
    desc: "If a crucial room or doorway connection is missing, OpenHouse sends a single-link mobile capture request with exact walking instructions."
  },
  {
    n: "03",
    title: "Spatial reconstruction",
    sub: "Builds connected 3D open houses from everyday video.",
    desc: "Aligns camera poses, reconstructs 3D spatial geometry, and establishes seamless navigation between every room."
  },
  {
    n: "04",
    title: "Disciplined QA & verification",
    sub: "Never hallucinates. Grounded in source evidence.",
    desc: "Cross-checks room counts, dimensions, and floor plan orientation against source listing data with strict confidence auditing."
  },
  {
    n: "05",
    title: "Approve & publish",
    sub: "Realtor reviews in one click. Renters explore 24/7.",
    desc: "Once approved, the virtual open house is live—ready to share via WhatsApp, embed in listing portals, and receive live inspection bookings."
  }
];

export function StickyPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(STAGES.length - 1, Math.floor(p * STAGES.length));
    setActive(idx);
  });

  const ActivePanel = PIPELINE_PANELS[active] || PIPELINE_PANELS[0];

  return (
    <section className="relative">
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
        <MotionReveal className="pt-16 md:pt-20">
          <EditorialHeading size="section">
            One listing.
            <br />
            Builds the entire open house.
          </EditorialHeading>
        </MotionReveal>
      </div>

      {/* Tall scroll track drives the pinned experience */}
      <div ref={ref} className="relative mt-16" style={{ position: "relative", height: `${STAGES.length * 62}vh` }}>
        <div className="sticky top-16 flex min-h-[calc(100vh-4rem)] items-center">
          <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 px-6 md:px-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
            {/* Left: stage list */}
            <div className="flex flex-col justify-center">
              <ul className="flex flex-col gap-0 relative">
                {STAGES.map((s, i) => {
                  const isActive = i === active;
                  const isLast = i === STAGES.length - 1;
                  return (
                    <li key={s.n} className="relative">
                      {/* Vertical connector line between items */}
                      {!isLast && (
                        <div
                          className="absolute left-[9px] top-[24px] bottom-0 w-px"
                          style={{ backgroundColor: i < active ? "var(--color-accent)" : "rgba(255,255,255,0.06)" }}
                        />
                      )}

                      {/* Horizontal connector to mockup (active only) */}
                      {isActive && (
                        <div className="absolute right-[-48px] top-[12px] h-px bg-accent/25 hidden lg:block" style={{ width: "48px" }}>
                          <div
                            className="absolute right-[-4px] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-accent"
                            style={{ boxShadow: "0 0 12px rgba(163,230,53,0.8)" }}
                          />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (!ref.current) return;
                          const rect = ref.current;
                          const top = rect.offsetTop;
                          const per = rect.offsetHeight / STAGES.length;
                          window.scrollTo({ top: top + per * i + 8, behavior: reduce ? "auto" : "smooth" });
                        }}
                        className="group flex w-full items-start gap-4 py-3.5 text-left transition-colors cursor-pointer select-none"
                      >
                        {/* Dot indicator */}
                        <div className="relative mt-[2px] shrink-0">
                          <div
                            className={`h-[18px] w-[18px] rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                              isActive
                                ? "border-accent bg-accent/15"
                                : i < active
                                ? "border-accent/50 bg-accent/10"
                                : "border-white/10 bg-transparent"
                            }`}
                          >
                            {i < active && (
                              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                            )}
                            {isActive && (
                              <div className="h-2 w-2 rounded-full bg-accent" style={{ boxShadow: "0 0 8px rgba(163,230,53,0.6)" }} />
                            )}
                          </div>
                        </div>

                        {/* Number */}
                        <span
                          className={`text-[0.78rem] font-medium tabular-nums transition-colors duration-300 mt-[1px] ${
                            isActive ? "text-accent" : "text-white/20"
                          }`}
                        >
                          {s.n}
                        </span>

                        {/* Dash */}
                        <span
                          className="mt-[10px] h-px w-5 shrink-0 transition-colors duration-300"
                          style={{ backgroundColor: isActive ? "var(--color-accent)" : "rgba(255,255,255,0.06)" }}
                        />

                        {/* Title + expandable desc */}
                        <div className="flex-1">
                          <div
                            className={`text-[1.08rem] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                              isActive ? "text-accent font-semibold" : "text-white/50"
                            }`}
                          >
                            {s.title}
                          </div>
                          <AnimatePresence initial={false} mode="wait">
                            {isActive && (
                              <motion.div
                                key={s.n}
                                initial={reduce ? false : { opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                transition={crossfade}
                                className="overflow-hidden"
                              >
                                <div className="pt-2.5 pr-4 flex flex-col gap-1.5">
                                  <span className="block text-[0.88rem] font-semibold text-ink leading-snug">{s.sub}</span>
                                  <span className="block text-[0.85rem] text-white/40 leading-relaxed">{s.desc}</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right: crossfading mockup */}
            <div className="relative flex items-start pt-6">
              <div className="relative aspect-[4/3.4] w-full">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={active}
                    initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                    transition={crossfade}
                    className="absolute inset-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
                  >
                    <ActivePanel />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
