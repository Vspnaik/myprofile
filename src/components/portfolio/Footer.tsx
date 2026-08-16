import { Code2, Github, Linkedin, Mail } from "lucide-react";
import { navItems, profile } from "@/lib/portfolio-data";
import { getGmailUrl } from "@/lib/utils";

export function Footer() {
  const socials = [
    { icon: Linkedin, href: profile.linkedin, label: "LinkedIn" },
    { icon: Github, href: profile.github, label: "GitHub" },
    { icon: Mail, href: getGmailUrl(profile.email), label: "Email" },
    { icon: Code2, href: profile.leetcode, label: "LeetCode" },
  ];

  return (
    <footer className="relative border-t border-border px-4 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-3">
            <span className="bg-gradient-brand grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold text-primary-foreground">
              {profile.initials}
            </span>
            <span className="truncate font-semibold">{profile.name}</span>
          </div>
          <nav className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {navItems.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex gap-2">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target="_blank"
              rel="noreferrer"
              className="glass card-hover grid h-10 w-10 place-items-center rounded-xl text-muted-foreground hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p>Built with React, TanStack Start, Tailwind CSS and Framer Motion.</p>
      </div>
    </footer>
  );
}
