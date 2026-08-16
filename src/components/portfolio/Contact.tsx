import { useState } from "react";
import { z } from "zod";
import { Code2, Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import { profile } from "@/lib/portfolio-data";
import { getGmailUrl } from "@/lib/utils";
import { Reveal, SectionHeading } from "./Reveal";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(150),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

export function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    const { subject, name, email, message } = parsed.data;
    const body = `Name: ${name}\nSender Email: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`;
    const gmailUrl = getGmailUrl(profile.email, subject, body);

    window.open(gmailUrl, "_blank");
    toast.success("Opening Gmail to send your message…");
    e.currentTarget.reset();
  };

  const links = [
    { icon: Linkedin, label: "LinkedIn", href: profile.linkedin },
    { icon: Github, label: "GitHub", href: profile.github },
    { icon: Mail, label: "Email", href: getGmailUrl(profile.email) },
    { icon: Code2, label: "LeetCode", href: profile.leetcode },
  ];

  const field =
    "w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60";

  return (
    <section id="contact" className="relative px-4 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Contact"
          title="Let's build something intelligent"
          subtitle="Open to AI engineering roles, freelance builds and research collaborations."
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <Reveal>
            <form onSubmit={onSubmit} className="glass grid gap-4 rounded-2xl p-6 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-xs text-muted-foreground">
                    Name
                  </label>
                  <input id="name" name="name" maxLength={100} className={field} placeholder="Jane Doe" />
                  {errors.name ? (
                    <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-xs text-muted-foreground">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    maxLength={255}
                    className={field}
                    placeholder="jane@company.com"
                  />
                  {errors.email ? (
                    <p className="mt-1 text-xs text-destructive">{errors.email}</p>
                  ) : null}
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="mb-2 block text-xs text-muted-foreground">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  maxLength={150}
                  className={field}
                  placeholder="AI Engineer opportunity"
                />
                {errors.subject ? (
                  <p className="mt-1 text-xs text-destructive">{errors.subject}</p>
                ) : null}
              </div>
              <div>
                <label htmlFor="message" className="mb-2 block text-xs text-muted-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  maxLength={1000}
                  className={`${field} resize-none`}
                  placeholder="Tell me about the role or project…"
                />
                {errors.message ? (
                  <p className="mt-1 text-xs text-destructive">{errors.message}</p>
                ) : null}
              </div>
              <button
                type="submit"
                className="bg-gradient-brand inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          </Reveal>

          <div className="grid gap-4 content-start">
            <Reveal delay={0.1}>
              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">
                  Elsewhere
                </h3>
                <div className="mt-4 grid gap-2">
                  {links.map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Icon className="h-4 w-4 text-primary" /> {label}
                    </a>
                  ))}
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-cyan" /> {profile.location}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="glass overflow-hidden rounded-2xl">
                <iframe
                  title="Location map"
                  loading="lazy"
                  className="h-56 w-full border-0 opacity-80"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=Hyderabad,Telangana,India&output=embed"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
