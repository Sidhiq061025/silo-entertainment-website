// Contact.js — EmailJS-only contact form for Silo Entertainment
// Install:  npm install @emailjs/browser
// Setup:    https://www.emailjs.com  →  create a service, template, and get your public key
//
// Required EmailJS template variables (set up in your EmailJS dashboard):
//   {{from_name}}   — sender's name
//   {{from_email}}  — sender's email
//   {{subject}}     — inquiry subject
//   {{message}}     — message body
//
// Replace the three placeholder strings below with your real EmailJS credentials.

import { useState } from "react";
import emailjs from "@emailjs/browser";

// ─── EmailJS credentials ───────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
// ──────────────────────────────────────────────────────────────────────────

const INQUIRY_SUBJECTS = [
  "Press & Media Inquiry",
  "Collaboration",
  "Partnership / Sponsorship",
  "General Question",
  "Bug Report",
  "Business Proposal",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: INQUIRY_SUBJECTS[0],
    message: "",
  });
  const [status, setStatus]   = useState("idle"); // idle | loading | success | error
  const [errors, setErrors]   = useState({});
  const [focused, setFocused] = useState(null);

  // ── validation ────────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!form.name.trim())
      e.name = "Name is required";
    if (!form.email.trim())
      e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email address";
    if (!form.message.trim() || form.message.trim().length < 20)
      e.message = "Message must be at least 20 characters";
    return e;
  }

  // ── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }

    setStatus("loading");

    try {
      const res = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
        },
        {
          publicKey: EMAILJS_PUBLIC_KEY,
        }
      );

      console.log("SUCCESS:", res);
      setStatus("success");
    } catch (err) {
      console.error("ERROR:", err);
      setStatus("error");
    }
  };
  function reset() {
    setForm({ name: "", email: "", subject: INQUIRY_SUBJECTS[0], message: "" });
    setStatus("idle");
    setErrors({});
  }

  // ── shared styles ─────────────────────────────────────────────────────────
  const fieldStyle = (field) => ({
    width: "100%",
    background: focused === field ? "rgba(139,26,26,0.04)" : "transparent",
    border: "none",
    borderBottom: `1px solid ${
      errors[field]
        ? "#e8541a"
        : focused === field
        ? "var(--crimson)"
        : "rgba(139,26,26,0.25)"
    }`,
    color: "var(--bone)",
    fontFamily: "var(--font-body)",
    fontSize: "1.05rem",
    padding: "0.7rem 0",
    outline: "none",
    transition: "all 0.25s",
    cursor: "crosshair",
  });

  const labelStyle = (field) => ({
    display: "block",
    fontFamily: "var(--font-mono)",
    fontSize: "0.6rem",
    letterSpacing: "0.3em",
    textTransform: "uppercase",
    color: errors[field] ? "#e8541a" : "var(--crimson)",
    marginBottom: "0.4rem",
  });

  // ── success state ─────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <section id="contact" style={{ padding: "8rem 4rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "1.8rem" }}>
          <div style={{
            width: 52, height: 52,
            background: "rgba(139,26,26,0.18)",
            border: "1px solid rgba(139,26,26,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.5rem", color: "var(--crimson)",
          }}>✓</div>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "0.12em", color: "var(--bone)", lineHeight: 1 }}>
              MESSAGE SENT
            </h3>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", letterSpacing: "0.2em", color: "var(--ash)", textTransform: "uppercase" }}>
              We'll get back to you soon.
            </p>
          </div>
        </div>

        <button
          onClick={reset}
          style={{
            marginTop: "1rem",
            padding: "1rem 2.5rem",
            background: "transparent",
            border: "1px solid rgba(139,26,26,0.3)",
            color: "var(--ash)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            cursor: "crosshair",
            transition: "all 0.25s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--crimson)"; e.currentTarget.style.color = "var(--bone)"; }}
          onMouseLeave={e => { e.currentT
            arget.style.borderColor = "rgba(139,26,26,0.3)"; e.currentTarget.style.color = "var(--ash)"; }}
        >
          ← Send Another Message
        </button>
      </section>
    );
  }

  // ── form state ────────────────────────────────────────────────────────────
  return (
    <section id="contact" style={{ padding: "8rem 4rem", maxWidth: 900, margin: "0 auto" }}>
      {/* heading */}
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "var(--crimson)", marginBottom: "1.5rem" }}>
        005 / Get In Touch
      </p>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.5rem,7vw,7rem)", lineHeight: 0.88, letterSpacing: "0.02em", color: "var(--bone)", marginBottom: "1.5rem" }}>
        <span style={{ color: "var(--crimson)" }}>REACH</span><br />OUT
      </h2>
      <p style={{ color: "var(--ash)", fontWeight: 300, fontSize: "1.05rem", marginBottom: "4rem", maxWidth: 500 }}>
        Press inquiries, collaborations, partnerships — or just want to talk horror? Step into the darkness.
      </p>

      <form onSubmit={handleSubmit} noValidate>

        {/* error banner */}
        {status === "error" && (
          <div style={{ background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.3)", padding: "1rem 1.5rem", marginBottom: "2rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <span style={{ color: "var(--ember)", fontSize: "1.2rem", lineHeight: 1.3, flexShrink: 0 }}>!</span>
            <div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ember)", marginBottom: "0.25rem" }}>
                Submission Failed
              </p>
              <p style={{ fontSize: "0.92rem", color: "var(--ash)" }}>
                Something went wrong. Please try again or reach us on WhatsApp.
              </p>
            </div>
          </div>
        )}

        {/* name + email */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", marginBottom: "2rem" }}>
          {[
            ["name",  "Your Name",      "text",  "Full name"],
            ["email", "Email Address",  "email", "your@email.com"],
          ].map(([field, label, type, ph]) => (
            <div key={field}>
              <label style={labelStyle(field)}>{label}</label>
              <input
                type={type}
                placeholder={ph}
                value={form[field]}
                onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                onFocus={() => setFocused(field)}
                onBlur={() => setFocused(null)}
                style={fieldStyle(field)}
              />
              {errors[field] && (
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.57rem", color: "#e8541a", marginTop: "0.35rem" }}>
                  {errors[field]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* subject */}
        <div style={{ marginBottom: "2rem" }}>
          <label style={labelStyle("subject")}>Subject</label>
          <select
            value={form.subject}
            onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
            onFocus={() => setFocused("subject")}
            onBlur={() => setFocused(null)}
            style={{ ...fieldStyle("subject"), appearance: "none", cursor: "crosshair" }}
          >
            {INQUIRY_SUBJECTS.map(s => (
              <option key={s} value={s} style={{ background: "#0d0b10", color: "#e8e0d4" }}>{s}</option>
            ))}
          </select>
        </div>

        {/* message */}
        <div style={{ marginBottom: "2.5rem" }}>
          <label style={labelStyle("message")}>Message</label>
          <textarea
            value={form.message}
            placeholder="Tell us what's on your mind… (min. 20 characters)"
            onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
            onFocus={() => setFocused("message")}
            onBlur={() => setFocused(null)}
            style={{ ...fieldStyle("message"), resize: "vertical", minHeight: 140, lineHeight: 1.75 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.3rem" }}>
            {errors.message
              ? <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.57rem", color: "#e8541a" }}>{errors.message}</p>
              : <span />}
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", color: "rgba(184,168,154,0.4)" }}>
              {form.message.length} chars
            </p>
          </div>
        </div>

        {/* submit */}
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            width: "100%",
            padding: "1.35rem",
            background: status === "loading" ? "rgba(139,26,26,0.5)" : "var(--crimson)",
            color: "var(--bone)",
            border: "none",
            fontFamily: "var(--font-display)",
            fontSize: "1.4rem",
            letterSpacing: "0.22em",
            cursor: status === "loading" ? "not-allowed" : "crosshair",
            transition: "background 0.25s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
          onMouseEnter={e => { if (status !== "loading") e.currentTarget.style.background = "var(--blood)"; }}
          onMouseLeave={e => { if (status !== "loading") e.currentTarget.style.background = "var(--crimson)"; }}
        >
          {status === "loading" ? (
            <>
              <span style={{
                display: "inline-block", width: 18, height: 18,
                border: "2px solid rgba(232,224,212,0.3)",
                borderTopColor: "var(--bone)", borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }} />
              SENDING…
            </>
          ) : "SEND MESSAGE →"}
        </button>

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.57rem", letterSpacing: "0.15em", color: "rgba(184,168,154,0.35)", textAlign: "center", marginTop: "1rem", textTransform: "uppercase" }}>
          Sent directly to admin via EmailJS
        </p>

      </form>
    </section>
  );
}