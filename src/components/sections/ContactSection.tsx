"use client";

import { DATA } from "@/data";
import { ContactCard } from "@/components/cards/ContactCard";

export function ContactSection() {
  const contacts = [
    {
      platform: "GitHub",
      url: DATA.contact.social.GitHub.url,
      testId: "contact-card-github",
      icon: <GitHubIcon />,
    },
    {
      platform: "LinkedIn",
      url: DATA.contact.social.LinkedIn.url,
      testId: "contact-card-linkedin",
      icon: <LinkedInIcon />,
    },
    {
      platform: "Twitter",
      url: DATA.contact.social.X.url,
      testId: "contact-card-twitter",
      icon: <TwitterIcon />,
    },
    {
      platform: "Email",
      url: DATA.contact.social.Email.url,
      testId: "contact-card-email",
      icon: <EmailIcon />,
    },
  ];

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="min-h-screen py-24 px-6 md:px-12 flex flex-col justify-center relative overflow-hidden"
    >
      <RadarBackground />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-ocean-cyan/50">
            <svg className="w-4 h-4 text-ocean-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <span className="text-sm font-mono text-ocean-cyan uppercase tracking-wider">
              Uplink Active
            </span>
          </div>

          <h2 className="text-6xl md:text-8xl font-heading font-bold">
            <span className="text-ocean-text dark:text-abyss-text">SAY</span>{" "}
            <span className="text-ocean-cyan">HELLO</span>
          </h2>

          <p className="hud-text mt-4">INITIALIZE COMMUNICATION PROTOCOL</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.platform}
              platform={contact.platform}
              url={contact.url}
              testId={contact.testId}
              icon={contact.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RadarBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
      <svg viewBox="0 0 400 400" className="w-[600px] h-[600px]">
        <circle
          cx="200"
          cy="200"
          r="180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="8 8"
          className="text-ocean-blue animate-pulse"
        />
        <circle
          cx="200"
          cy="200"
          r="120"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="8 8"
          className="text-ocean-blue"
        />
        <circle
          cx="200"
          cy="200"
          r="60"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-ocean-blue"
        />
        <circle cx="200" cy="200" r="4" fill="currentColor" className="text-ocean-cyan" />
      </svg>
    </div>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}
