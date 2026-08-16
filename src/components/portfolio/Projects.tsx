import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Github, Search } from "lucide-react";

import { projects } from "@/lib/portfolio-data";
import { SectionHeading } from "./Reveal";
import { cn } from "@/lib/utils";

const filters = ["All", "Generative AI", "Computer Vision", "Automation", "Analytics"] as const;

export function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchFilter = filter === "All" || p.category === filter;
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tech.some((t) => t.toLowerCase().includes(q));
      return matchFilter && matchQuery;
    });
  }, [filter, query]);

  return (
    <section id="projects" className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Systems I've built end-to-end"
          subtitle="Agentic pipelines, vision models and automation that went beyond the notebook."
        />

        <div className="mb-10 grid gap-4 sm:flex sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-medium transition-colors",
                  filter === f
                    ? "border-transparent bg-gradient-brand text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="glass flex min-w-0 items-center gap-2 rounded-full px-4 py-2 sm:w-64">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              aria-label="Search projects"
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.article
                layout
                key={p.title}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, rotateX: 2, rotateY: -2 }}
                style={{ transformPerspective: 900 }}
                className="glass group flex flex-col overflow-hidden rounded-2xl transition-shadow hover:glow-ring"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={p.image}
                    alt={`${p.title} preview`}
                    width={1200}
                    height={750}
                    loading="lazy"
                    className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-secondary px-2 py-1 text-[11px] text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex gap-2 pt-1">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                    >
                      <Github className="h-3.5 w-3.5" /> GitHub
                    </a>
                    <Link
                      to="/projects/$slug"
                      params={{ slug: p.slug }}
                      className="bg-gradient-brand inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                    </Link>

                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {visible.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No projects match that search.
          </p>
        ) : null}
      </div>
    </section>
  );
}
