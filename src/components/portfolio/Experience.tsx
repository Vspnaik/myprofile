import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { experience } from "@/lib/portfolio-data";
import { SectionHeading } from "./Reveal";

export function Experience() {
  return (
    <section id="experience" className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Experience"
          title="Where I've shipped AI"
          subtitle="Hands-on work across generative AI, computer vision and business automation."
        />

        <div className="relative pl-6 sm:pl-10">
          <div className="bg-gradient-brand absolute top-2 bottom-2 left-0 w-px opacity-60 sm:left-3" />
          <div className="grid gap-6">
            {experience.map((job, i) => (
              <motion.article
                key={job.company}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="glass card-hover relative rounded-2xl p-6 sm:p-7"
              >
                <span className="bg-gradient-brand absolute top-8 -left-6 grid h-3 w-3 place-items-center rounded-full sm:-left-[1.85rem]" />
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold sm:text-xl">{job.role}</h3>
                    <p className="mt-1 text-sm text-cyan">{job.company}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                    {job.period}
                  </span>
                </div>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {job.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                      <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
