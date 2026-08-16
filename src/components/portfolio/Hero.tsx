import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Mail, Code2, Sparkles } from "lucide-react";
import { profile } from "@/lib/portfolio-data";
import { getGmailUrl } from "@/lib/utils";

function useTypedRole(roles: string[]) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[index % roles.length];
    const speed = deleting ? 35 : 70;
    const timeout = setTimeout(() => {
      const next = deleting
        ? current.slice(0, text.length - 1)
        : current.slice(0, text.length + 1);
      setText(next);
      if (!deleting && next === current) setTimeout(() => setDeleting(true), 1400);
      if (deleting && next === "") {
        setDeleting(false);
        setIndex((i) => i + 1);
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, index, roles]);

  return text;
}

function Particles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: (i * 37) % 100,
        top: (i * 61) % 100,
        size: 1 + (i % 3),
        duration: 9 + (i % 7) * 1.6,
        delay: (i % 9) * 0.5,
      })),
    [],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-primary/50"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size * 3,
            height: d.size * 3,
          }}
          animate={{ y: [0, -40, 0], opacity: [0.15, 0.75, 0.15] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const typed = useTypedRole(profile.roles);

  const socials = [
    { icon: Linkedin, href: profile.linkedin, label: "LinkedIn" },
    { icon: Github, href: profile.github, label: "GitHub" },
    { icon: Mail, href: getGmailUrl(profile.email), label: "Email" },
    { icon: Code2, href: profile.leetcode, label: "LeetCode" },
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-4 pt-28 pb-20"
    >
      <div aria-hidden className="absolute inset-0">
        <div className="animate-blob absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-primary/25 blur-[120px]" />
        <div
          className="animate-blob absolute top-1/3 -right-24 h-[26rem] w-[26rem] rounded-full bg-cyan/20 blur-[120px]"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="animate-blob absolute bottom-0 left-1/3 h-[22rem] w-[22rem] rounded-full bg-primary/15 blur-[120px]"
          style={{ animationDelay: "-11s" }}
        />
      </div>
      <Particles />

      <div className="relative mx-auto w-full max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan" />
          Available for AI engineering roles
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-7 text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-5 text-lg font-medium sm:text-2xl"
        >
          <span className="text-gradient">{typed}</span>
          <span className="animate-caret ml-0.5 text-cyan">|</span>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#projects"
            className="bg-gradient-brand rounded-xl px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.04]"
          >
            View Projects
          </a>
          <a
            href="/resume.pdf"
            download
            className="glass card-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium"
          >
            <Download className="h-4 w-4" /> Download Resume
          </a>
          <a
            href="#contact"
            className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            Contact Me
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noreferrer"
              className="glass card-hover grid h-11 w-11 place-items-center rounded-xl text-muted-foreground hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll to about"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
      >
        <ArrowDown className="h-5 w-5" />
      </motion.a>
    </section>
  );
}
