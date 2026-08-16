import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { achievements, techStack } from "@/lib/portfolio-data";
import { SectionHeading } from "./Reveal";

function Counter({ value, suffix }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 60;
    const id = setInterval(() => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / total, 3);
      setDisplay(Math.round(value * progress));
      if (frame >= total) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [inView, value]);

  return (
    <span ref={ref} className="text-gradient text-4xl font-semibold tracking-tight sm:text-5xl">
      {display}
      {suffix}
    </span>
  );
}

export function Achievements() {
  return (
    <section className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="Achievements" title="Numbers that back the work" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {achievements.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="glass card-hover rounded-2xl p-6 text-center"
            >
              <Counter value={a.value} suffix={a.suffix} />
              <p className="mt-3 text-xs tracking-wide text-muted-foreground uppercase">
                {a.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TechStack() {
  return (
    <section id="stack" className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Tech Stack"
          title="Daily drivers"
          subtitle="The frameworks, stores and platforms I reach for first."
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: (i % 5) * 0.06 }}
              className="glass card-hover grid place-items-center rounded-2xl px-3 py-6 text-center"
            >
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 4 + (i % 4),
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.15,
                }}
                className="text-sm font-medium text-muted-foreground"
              >
                {tech}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
