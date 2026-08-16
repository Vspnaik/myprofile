import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Github, CheckCircle2 } from "lucide-react";
import { projects } from "@/lib/portfolio-data";
import { projectDetails } from "@/lib/project-details";

function getProject(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  const detail = projectDetails[slug];
  if (!project || !detail) throw notFound();
  return { project, detail };
}

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const { project, detail } = getProject(params.slug);
    return { title: project.title, summary: detail.summary };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Project not found" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.title} — Aditya Verma`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.summary.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.summary.slice(0, 155) },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Project not found</h1>
        <Link to="/" className="mt-4 inline-block text-sm text-primary underline">
          Back to portfolio
        </Link>
      </div>
    </div>
  ),
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const { project, detail } = getProject(slug);

  return (
    <main className="relative min-h-screen px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          hash="projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to projects
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8"
        >
          <span className="inline-flex rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs tracking-widest text-muted-foreground uppercase">
            {project.category}
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{detail.summary}</p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-md bg-secondary px-2 py-1 text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <Github className="h-4 w-4" /> View source
          </a>
        </motion.header>

        <section className="mt-14 grid gap-4 sm:grid-cols-3">
          {detail.results.map((r) => (
            <div key={r.label} className="glass rounded-2xl p-5 text-center">
              <div className="text-gradient-brand text-2xl font-semibold">{r.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{r.label}</div>
            </div>
          ))}
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold">The problem</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{detail.problem}</p>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold">Key features</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {detail.features.map((f) => (
              <li key={f} className="glass flex gap-3 rounded-xl p-4 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold">Architecture</h2>
          <ol className="mt-4 space-y-3">
            {detail.architecture.map((step, i) => (
              <li key={step} className="glass flex items-center gap-4 rounded-xl p-4 text-sm">
                <span className="bg-gradient-brand flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold">Important functions</h2>
          <div className="mt-4 space-y-6">
            {detail.code.map((block) => (
              <div key={block.title} className="glass overflow-hidden rounded-2xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="text-sm font-medium">{block.title}</span>
                  <span className="text-[11px] tracking-widest text-muted-foreground uppercase">
                    {block.language}
                  </span>
                </div>
                <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
                  <code className="font-mono text-muted-foreground">{block.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold">Simulation & screenshots</h2>
          <div className="mt-4 grid gap-5">
            <figure className="glass overflow-hidden rounded-2xl">
              <img
                src={project.image}
                alt={`${project.title} cover`}
                width={1200}
                height={750}
                loading="lazy"
                className="w-full object-cover"
              />
              <figcaption className="px-4 py-3 text-xs text-muted-foreground">
                {project.title} — concept visual
              </figcaption>
            </figure>
            {detail.gallery.map((shot) => (
              <figure key={shot.src} className="glass overflow-hidden rounded-2xl">
                <img
                  src={shot.src}
                  alt={shot.caption}
                  width={1200}
                  height={750}
                  loading="lazy"
                  className="w-full object-cover"
                />
                <figcaption className="px-4 py-3 text-xs text-muted-foreground">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <div className="mt-16 border-t border-border pt-8">
          <Link
            to="/"
            hash="projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to all projects
          </Link>
        </div>
      </div>
    </main>
  );
}
