"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type SectionKey = "home" | "about" | "experience" | "projects" | "contact";
type NavItem = { key: SectionKey; label: string };

const NAV: NavItem[] = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "experience", label: "Experience" },
  { key: "projects", label: "Projects" },
  { key: "contact", label: "Contact" },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 shadow-sm">
      {children}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold tracking-widest text-indigo-200/90 uppercase">
        {eyebrow}
      </p>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      {description ? (
        <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl shadow-[0_10px_30px_-12px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2 text-sm text-white/70 list-disc pl-5">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

/** Small "header image" area for cards (Experience / Projects) */
function CardHeaderImage({
  src,
  alt,
  tone = "dark",
}: {
  src: string;
  alt: string;
  tone?: "dark" | "light";
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10">
      <div className="aspect-[16/6] w-full bg-white/5">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* overlay for readability / style */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          tone === "dark"
            ? "bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent"
            : "bg-gradient-to-t from-white/30 via-transparent to-transparent"
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />
    </div>
  );
}

export default function Page() {
  const [active, setActive] = useState<SectionKey>("home");

  const homeRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const expRef = useRef<HTMLElement | null>(null);
  const projRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  const sectionRefMap = useMemo(
    () => ({
      home: homeRef,
      about: aboutRef,
      experience: expRef,
      projects: projRef,
      contact: contactRef,
    }),
    []
  );

  const scrollTo = (key: SectionKey) => {
    const el = sectionRefMap[key].current;
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const targets = NAV.map(({ key }) => sectionRefMap[key].current)
      .filter(Boolean)
      .map((el) => el as HTMLElement);

    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
          )[0];
        if (!best) return;
        const key = best.target.getAttribute("data-section") as SectionKey | null;
        if (key) setActive(key);
      },
      {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0.05, 0.15, 0.25, 0.5],
      }
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [sectionRefMap]);

  // Contact form -> mailto (no backend required)
  const [contact, setContact] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const recipientEmail = "hvwen@uwaterloo.ca";

  const mailtoHref = useMemo(() => {
    const subject = (contact.subject || "Website inquiry").trim();
    const body = [
      `Name: ${contact.name || "(not provided)"}`,
      `Email: ${contact.email || "(not provided)"}`,
      "",
      contact.message || "(no message)",
    ].join("\n");

    const params = new URLSearchParams({ subject, body });
    return `mailto:${recipientEmail}?${params.toString()}`;
  }, [contact]);

  return (
    <div className="min-h-screen text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        {/* Scenic background image (put at: public/bg.jpg) */}
        <div
          className="absolute inset-0 bg-center bg-cover opacity-60"
          style={{ backgroundImage: "url(/bg.jpg)" }}
        />

        {/* Gradient + base */}
        <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_10%,rgba(99,102,241,0.35),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(236,72,153,0.22),transparent_55%),radial-gradient(800px_circle_at_50%_95%,rgba(34,197,94,0.18),transparent_55%)]" />
        {/* reduce darkness so the photo shows more */}
        <div className="absolute inset-0 bg-slate-950/40" />

        {/* Pattern */}
        <div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(2,6,23,0.85)_85%)]" />
      </div>

      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <button
            onClick={() => scrollTo("home")}
            className="group inline-flex items-center gap-2"
            aria-label="Go to top"
          >
            <span className="h-8 w-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shadow-sm">
              <span className="text-sm font-semibold">HW</span>
            </span>
            <span className="font-semibold tracking-tight text-white group-hover:text-white/90">
              Hanyao Wen
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollTo(item.key)}
                className={cn(
                  "px-3 py-2 rounded-full text-sm transition border",
                  active === item.key
                    ? "bg-white/10 border-white/20 text-white"
                    : "border-transparent text-white/75 hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => scrollTo("contact")}
            className="inline-flex items-center justify-center rounded-full bg-white text-slate-950 px-4 py-2 text-sm font-semibold shadow-sm hover:opacity-90 transition"
          >
            Contact
          </button>
        </div>

        {/* Mobile nav */}
        <div className="md:hidden border-t border-white/10">
          <div className="mx-auto max-w-6xl px-3 py-2 flex gap-2 overflow-x-auto">
            {NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollTo(item.key)}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-full text-sm transition border",
                  active === item.key
                    ? "bg-white/10 border-white/20 text-white"
                    : "border-transparent text-white/75 hover:text-white hover:bg-white/5"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section 1: Hero */}
        <section
          ref={(el) => {
            homeRef.current = el;
          }}
          data-section="home"
          id="home"
          className="scroll-mt-24 py-12 sm:py-16"
        >
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap gap-2">
                <Pill>University of Waterloo · CS</Pill>
                <Pill>Open to Intern / Co-op</Pill>
              </div>

              <div className="space-y-3">
                <h1 className="max-w-2xl text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-semibold tracking-tight">
                  Hanyao Wen
                </h1>
                <p className="max-w-2xl text-lg sm:text-xl text-white/80">
                  Computer Science undergraduate focused on maintainable
                  engineering, clear abstractions, and practical execution.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={() => scrollTo("projects")}
                  className="rounded-full bg-white text-slate-950 px-5 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition"
                >
                  View Projects
                </button>
                <button
                  onClick={() => scrollTo("experience")}
                  className="rounded-full bg-white/10 border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition"
                >
                  Experience
                </button>
                <a
                  href={`mailto:${recipientEmail}`}
                  className="rounded-full bg-white/10 border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition"
                >
                  Email
                </a>
              </div>

              {/* Cleaner info row (2 columns) */}
              <div className="pt-5">
                <Card className="p-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-white/60">Location</p>
                      <p className="mt-1 font-semibold">
                        Waterloo, Ontario, Canada
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Stack</p>
                      <p className="mt-1 font-semibold">
                        C++20 · Python · Java · Linux · Git
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Right */}
            <div className="lg:col-span-5">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">Profile</p>
                    <span className="text-xs rounded-full border border-white/15 bg-white/10 px-2 py-1 text-white/80">
                      Snapshot
                    </span>
                  </div>

                  {/* keep photo slot commented */}
                  {/*
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <img
                      src="/profile.jpg"
                      alt="Profile"
                      className="h-[320px] w-full object-cover"
                    />
                  </div>
                  */}

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-white/75 leading-relaxed">
                      CGPA 3.9. Experienced in remote coordination, technical
                      writing (meeting notes / blog recaps), and building
                      multi-module projects with clean architecture.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-white/60">Strength</p>
                      <p className="mt-1 font-semibold">OOP & Patterns</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs text-white/60">Collaboration</p>
                      <p className="mt-1 font-semibold">Remote + Async</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <Divider />

        {/* Section 2: About */}
        <section
          ref={(el) => {
            aboutRef.current = el;
          }}
          data-section="about"
          id="about"
          className="scroll-mt-24 py-14 sm:py-20"
        >
          <SectionTitle
            eyebrow="About"
            title="Background"
            description="A brief overview of what I do and how I work."
          />

          <div className="mt-8 grid lg:grid-cols-3 gap-6">
            <Card className="p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold">Summary</h3>
              <p className="mt-3 text-white/70 leading-relaxed">
                I am a Computer Science student at the University of Waterloo
                with a strong academic record (CGPA 3.9). I enjoy building
                software with clean structure—separating core logic from
                interfaces—and I value clear communication, especially in remote
                collaboration settings.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="text-xs rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/80">
                  C++20
                </span>
                <span className="text-xs rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/80">
                  Python
                </span>
                <span className="text-xs rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/80">
                  Java
                </span>
                <span className="text-xs rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/80">
                  Linux · Git · SSH
                </span>
                <span className="text-xs rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/80">
                  MySQL · SQL
                </span>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold">Relevant Coursework</h3>
              <p className="mt-2 text-sm text-white/70">
                University of Waterloo
              </p>
              <div className="mt-4 space-y-2 text-sm text-white/75">
                <p>• CS 246 — Object-Oriented Software Development</p>
                <p>• CS 245 — Logic and Computation</p>
                <p>• CS 240 — Data Structures and Data Management</p>
                <p>• CS 241 — Foundations of Sequential Programs</p>
                <p>• CS 251 — Computer Organization and Design</p>
              </div>
            </Card>
          </div>
        </section>

        <Divider />

        {/* Section 3: Experience */}
        <section
          ref={(el) => {
            expRef.current = el;
          }}
          data-section="experience"
          id="experience"
          className="scroll-mt-24 py-14 sm:py-20"
        >
          <SectionTitle
            eyebrow="Experience"
            title="Work experience"
            description="Selected roles and responsibilities."
          />

          <div className="mt-8 grid gap-6">
            <Card className="p-6 space-y-4">
              <CardHeaderImage
                src="/experience/aaia.jpg"
                alt="AAIA — events and partnerships"
              />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">
                    Project Coordinator — Asian American Innovation Alliance (AAIA)
                  </h3>
                  <p className="text-white/60 text-sm">Remote</p>
                </div>
                <p className="text-sm text-white/70">Jan 2025 — Aug 2025</p>
              </div>

              <BulletList
                items={[
                  "Planned and coordinated company projects by organizing timelines, stakeholders, and deliverables to support future initiatives.",
                  "Managed content creation and social platforms, publishing event recap articles to document activities and improve outreach efficiency.",
                ]}
              />
            </Card>

            <Card className="p-6 space-y-4">
              <CardHeaderImage
                src="/experience/lightland-team.jpg"
                alt="Lightland Minecraft Development Team — development and community"
              />

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold">
                    Game Development & Content Contributor — Lightland Minecraft Development Team
                  </h3>
                  <p className="text-white/60 text-sm">Remote</p>
                </div>
                <p className="text-sm text-white/70">2022 — Present</p>
              </div>

              <BulletList
                items={[
                  "Designed gameplay concepts and implemented basic logic including entities, skills, and lightweight database support for custom game systems.",
                  "Applied AI-assisted design tools and localization workflows to accelerate content development and adapt features for different player environments.",
                ]}
              />
            </Card>
          </div>
        </section>

        <Divider />

        {/* Section 4: Projects */}
        <section
          ref={(el) => {
            projRef.current = el;
          }}
          data-section="projects"
          id="projects"
          className="scroll-mt-24 py-14 sm:py-20"
        >
          <SectionTitle
            eyebrow="Projects"
            title="Selected work"
            description="A few projects that represent how I build and think."
          />

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-4">
              <CardHeaderImage
                src="/projects/biquadris.jpg"
                alt="Biquadris — two-player Tetris"
              />

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Biquadris (C++20)</h3>
                <span className="text-xs rounded-full border border-white/15 bg-white/10 px-2 py-1 text-white/80">
                  C++
                </span>
              </div>

              <p className="text-sm text-white/70 leading-relaxed">
                A competitive two-player Tetris variant with both text and
                graphical interfaces.
              </p>

              <BulletList
                items={[
                  "Developed a competitive two-player Tetris game in C++20 using object-oriented design, supporting text and graphical interfaces.",
                  "Applied design patterns (Observer, MVC-style separation) and modern memory management to ensure modularity and maintainability.",
                ]}
              />
            </Card>

            <Card className="p-6 space-y-4">
              <CardHeaderImage
                src="/projects/land-opt.jpg"
                alt="Land parcel optimization — geospatial model"
              />

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Land Parcel Optimization for Carbon Storage
                </h3>
                <span className="text-xs rounded-full border border-white/15 bg-white/10 px-2 py-1 text-white/80">
                  Python
                </span>
              </div>

              <p className="text-sm text-white/70 leading-relaxed">
                A geospatial optimization workflow to select land parcels that
                maximize carbon storage under constraints.
              </p>

              <BulletList
                items={[
                  "Developed a geospatial optimization model in Python to maximize carbon storage subject to budget and adjacency constraints.",
                  "Integrated GeoPandas with mathematical optimization techniques to analyze land-use trade-offs.",
                ]}
              />
            </Card>

            <Card className="p-6 md:col-span-2 space-y-4">
              <CardHeaderImage
                src="/projects/lightland-mod.jpg"
                alt="Light Land — Minecraft mod development"
              />

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Light Land (Minecraft Mod)
                </h3>
                <span className="text-xs rounded-full border border-white/15 bg-white/10 px-2 py-1 text-white/80">
                  Java
                </span>
              </div>

              <p className="text-sm text-white/70 leading-relaxed">
                Ongoing mod development and community iteration.
              </p>

              <BulletList
                items={[
                  "Utilized Java and the Forge API to design gameplay mechanics and maintained JSON-based localization files to enable multi-language content support.",
                  "Engaged with the player community on Modrinth and Discord to collect feedback and address concerns.",
                ]}
              />
            </Card>
          </div>
        </section>

        <Divider />

        {/* Section 5: Contact */}
        <section
          ref={(el) => {
            contactRef.current = el;
          }}
          data-section="contact"
          id="contact"
          className="scroll-mt-24 py-14 sm:py-20"
        >
          <SectionTitle
            eyebrow="Contact"
            title="Let's connect"
            description="This form opens your mail client with a pre-filled email (no backend required)."
          />

          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold">Quick message</h3>
              <p className="mt-2 text-sm text-white/70">
                Fill this out and click{" "}
                <span className="font-semibold text-white">Open Email</span>.
              </p>

              <div className="mt-5 grid gap-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="space-y-1">
                    <span className="text-xs text-white/70">Your name</span>
                    <input
                      value={contact.name}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, name: e.target.value }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
                      placeholder="Jane Doe"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs text-white/70">Your email</span>
                    <input
                      value={contact.email}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, email: e.target.value }))
                      }
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
                      placeholder="jane@example.com"
                    />
                  </label>
                </div>

                <label className="space-y-1">
                  <span className="text-xs text-white/70">Subject</span>
                  <input
                    value={contact.subject}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, subject: e.target.value }))
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
                    placeholder="Co-op / Internship inquiry"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-xs text-white/70">Message</span>
                  <textarea
                    value={contact.message}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, message: e.target.value }))
                    }
                    className="min-h-[140px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
                    placeholder="Hi Hanyao, I'd like to discuss..."
                  />
                </label>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={mailtoHref}
                    className="inline-flex items-center justify-center rounded-full bg-white text-slate-950 px-5 py-2.5 text-sm font-semibold shadow-sm hover:opacity-90 transition"
                  >
                    Open Email
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      setContact({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      })
                    }
                    className="inline-flex items-center justify-center rounded-full bg-white/10 border border-white/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/15 transition"
                  >
                    Clear
                  </button>
                </div>

                <p className="text-xs text-white/50">
                  Recipient:{" "}
                  <span className="font-mono text-white/70">
                    {recipientEmail}
                  </span>
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold">Links</h3>
              <p className="mt-2 text-sm text-white/70">
              </p>

              <div className="mt-5 grid gap-3">
                <a
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10 transition"
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm hover:bg-white/10 transition"
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-white/60">Phone</p>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">
                    437-232-7626
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="py-10 text-center text-xs text-white/50">
            © {new Date().getFullYear()} Hanyao Wen · Built with Next.js
          </div>
        </section>
      </main>
    </div>
  );
}





