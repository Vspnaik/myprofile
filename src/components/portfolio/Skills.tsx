import { motion } from "framer-motion";
import { skillGroups } from "@/lib/portfolio-data";
import { SectionHeading } from "./Reveal";

export function Skills() {
  return (
    <section id="skills" className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Skills"
          title="The toolkit behind the work"
          subtitle="Depth where it counts — modelling, retrieval, vision and the backend that serves it all."
        />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: gi * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="glass card-hover rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                {group.category}
              </h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-border bg-secondary/60 px-3 py-1.5 text-sm text-foreground/90"
                  >
                    {skill}
                  </span>
                ))}
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
