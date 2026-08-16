import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { positions } from "@/lib/portfolio-data";
import { SectionHeading } from "./Reveal";

export function Responsibilities() {
  return (
    <section id="responsibilities" className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Leadership"
          title="Position of responsibilities"
          subtitle="Roles I took on during college — from cultural fests to club coordination."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {positions.map((item, i) => (
            <motion.article
              key={`${item.organization}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="glass card-hover rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="bg-gradient-brand/10 grid h-10 w-10 shrink-0 place-items-center rounded-xl">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold sm:text-lg">{item.role}</h3>
                  <p className="mt-1 text-sm text-cyan">{item.organization}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.context}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
