import { useState } from "react";
import {
  MessageCircle,
  X,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JOURNAL } from "@/lib/journal";

const WHATSAPP_NUMBER = "919999999999";
const CALL_NUMBER = "+919999999999";

const SOCIALS = [
  { label: "Facebook", href: "https://facebook.com/insightonix", icon: Facebook, color: "#1877F2" },
  {
    label: "Instagram",
    href: "https://instagram.com/insightonix",
    icon: Instagram,
    color: "#E4405F",
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/insightonix",
    icon: Twitter,
    color: "#0f1419",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/insightonix",
    icon: Linkedin,
    color: "#0A66C2",
  },
];

type Msg = { from: "bot" | "me"; text: string };

const QUICK = [
  "How do I submit a paper?",
  "What is the APC?",
  "How long is peer review?",
  "How can I verify a certificate?",
];

const ANSWERS: Record<string, string> = {
  "How do I submit a paper?":
    "Visit the Submit page from the header, create an account, and upload your manuscript (DOCX/PDF) with a completed copyright form.",
  "What is the APC?":
    "INSIGHTONIX charges a nominal Article Processing Charge to support open-access publication. See the APC page for current rates and waivers.",
  "How long is peer review?":
    "Our target is 3–6 weeks for the first decision under double-blind review. See the Publication Process page for SLA details.",
  "How can I verify a certificate?":
    "Use the Verify page and enter the certificate ID (format: INSIGHTONIX-YYYY-####).",
};

export function FloatingSocial() {
  const [chatOpen, setChatOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "bot",
      text: `Hi! I'm the ${JOURNAL.short} assistant. Ask a question or pick one below.`,
    },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    const reply =
      ANSWERS[text] ??
      "Thanks! Our editorial team will reply on WhatsApp. Tap the green WhatsApp button to continue the chat.";
    setMsgs((m) => [...m, { from: "me", text }, { from: "bot", text: reply }]);
    setInput("");
  };

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello ${JOURNAL.short}, I have a question about `,
  )}`;

  return (
    <>
      {/* LEFT SIDE — vertical social wall */}
      <aside
        aria-label="Follow us on social media"
        className="fixed left-0 top-1/2 z-30 -translate-y-1/2"
      >
        <ul className="flex flex-col overflow-hidden rounded-r-2xl border border-l-0 border-border bg-background/90 shadow-xl backdrop-blur-md">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="group relative flex h-12 w-12 items-center justify-center text-foreground/70 transition-all hover:w-40 hover:text-white"
                style={{ ["--wall" as never]: s.color }}
              >
                <span
                  className="absolute inset-0 origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
                  style={{ background: s.color }}
                  aria-hidden
                />
                <span className="relative flex w-full items-center gap-3 pl-4">
                  <s.icon className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap text-xs font-semibold opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    {s.label}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </aside>

      {/* RIGHT SIDE — WhatsApp, Call, Chatbot */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        <a
          href={`tel:${CALL_NUMBER}`}
          aria-label="Call editorial office"
          className="grid h-12 w-12 place-items-center rounded-full text-white shadow-xl ring-2 ring-white/60 transition hover:scale-105"
          style={{ background: "linear-gradient(135deg,#0ea5e9,#2563eb)" }}
        >
          <Phone className="h-5 w-5" />
        </a>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid h-14 w-14 place-items-center rounded-full text-white shadow-xl ring-2 ring-white/60 transition hover:scale-105"
          style={{ background: "#25D366" }}
        >
          <MessageCircle className="h-6 w-6" />
        </a>

        <button
          type="button"
          onClick={() => setChatOpen((o) => !o)}
          aria-label={chatOpen ? "Close chatbot" : "Open chatbot"}
          className="grid h-12 w-12 place-items-center rounded-full text-white shadow-xl ring-2 ring-white/60 transition hover:scale-105"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
        >
          {chatOpen ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </button>
      </div>

      {/* Chatbot panel */}
      {chatOpen && (
        <div className="fixed bottom-24 right-4 z-50 flex w-[92vw] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:bottom-28 sm:right-6">
          <div
            className="flex items-center gap-3 px-4 py-3 text-white"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
          >
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
              <Bot className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold">{JOURNAL.short} Assistant</div>
              <div className="text-[11px] opacity-80">Instant answers · 24/7</div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="ml-auto rounded-full p-1 hover:bg-white/10"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto bg-secondary/30 p-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-[13px] shadow-sm",
                  m.from === "bot"
                    ? "rounded-bl-sm bg-background text-foreground"
                    : "ml-auto rounded-br-sm bg-brand text-brand-foreground",
                )}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-background p-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {QUICK.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] hover:border-brand hover:text-brand"
                >
                  {q}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="h-9 flex-1 rounded-full border border-border bg-background px-3 text-sm outline-none focus:border-brand"
              />
              <button
                type="submit"
                className="grid h-9 w-9 place-items-center rounded-full text-white"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
