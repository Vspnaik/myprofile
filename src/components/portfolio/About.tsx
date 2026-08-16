import { motion } from "framer-motion";
import profileImg from "@/assets/profile.jpg";
import { focusAreas, profile } from "@/lib/portfolio-data";
import { Reveal, SectionHeading } from "./Reveal";

export function About() {
  return (
    <section id="about" className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="About"
          title="Engineering intelligence into products"
          subtitle="I turn research-grade AI into reliable, measurable systems — from data pipeline to deployed endpoint."
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
          <Reveal className="relative mx-auto w-full max-w-sm">
            <div className="bg-gradient-brand absolute -inset-3 rounded-[2rem] opacity-25 blur-2xl" />
            <div className="glass relative overflow-hidden rounded-[1.75rem] p-2">
              <img
                src={profileImg}
                alt={`${profile.name}, AI and machine learning engineer`}
                width={800}
                height={1000}
                loading="lazy"
                className="h-full w-full rounded-[1.4rem] object-cover"
              />
            </div>
            <div className="glass mt-4 rounded-2xl px-5 py-4 text-sm text-muted-foreground">
              Based in {profile.location} · Open to relocation & remote
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {focusAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="glass card-hover rounded-2xl p-5"
              >
                <div className="bg-gradient-brand mb-3 h-1 w-8 rounded-full" />
                <h3 className="text-base font-semibold">{area.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{area.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
