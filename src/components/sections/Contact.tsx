"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { FiSend, FiUser, FiMail, FiMessageSquare, FiCheckCircle, FiAlertCircle, FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/config";
import { BsInstagram } from "react-icons/bs";
import { BiPhone } from "react-icons/bi";

type FormStatus = "idle" | "loading" | "success" | "error";

interface FloatingInputProps {
  id: string;
  name: string;
  type?: string;
  label: string;
  icon: React.ElementType;
  required?: boolean;
  textarea?: boolean;
}

function FloatingInput({
  id,
  name,
  type = "text",
  label,
  icon: Icon,
  required,
  textarea,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const isFloated = focused || hasValue;
  const sharedClass = `w-full bg-transparent text-ghost-white text-sm pt-6 pb-2 px-4 outline-none peer`;

  return (
    <div className="relative glass gradient-border rounded-xl overflow-hidden group">
      {/* Icon */}
      <div
        className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200 ${textarea ? "top-6 translate-y-0" : ""
          } ${focused ? "text-cyber-blue" : "text-ghost-white/25"}`}
      >
        <Icon size={15} />
      </div>

      {/* Floating label */}
      <label
        htmlFor={id}
        className={`absolute left-10 transition-all duration-200 pointer-events-none select-none font-medium ${isFloated
          ? "top-2 text-[10px] tracking-widest uppercase text-cyber-blue"
          : "top-1/2 -translate-y-1/2 text-sm text-ghost-white/30"
          } ${textarea && !isFloated ? "top-4 translate-y-0" : ""}`}
      >
        {label}
      </label>

      {/* Input or Textarea */}
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          className={`${sharedClass} resize-none pl-10 pt-8`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setHasValue(e.target.value.length > 0)}
          className={`${sharedClass} pl-10`}
        />
      )}

      {/* Focus glow line */}
      <motion.div
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-cyber-blue to-neon-violet origin-left"
        style={{ filter: "drop-shadow(0 0 4px rgba(0,240,255,0.5))" }}
      />
    </div>
  );
}

const socialLinks = [
  { icon: FiGithub, href: siteConfig.social.github, label: "GitHub" },
  { icon: FiLinkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
  { icon: BsInstagram, href: siteConfig.social.instagram, label: "Instagram" },
];

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus("loading");
    try {
      await emailjs.sendForm(
        siteConfig.emailjs.serviceId,
        siteConfig.emailjs.templateId,
        formRef.current,
        { publicKey: siteConfig.emailjs.publicKey }
      );
      setStatus("success");
      formRef.current.reset();
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section-padding relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-neon-violet/6 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-max px-6">
        <SectionHeading
          label="Get In Touch"
          title="Let's"
          highlight="Connect"
          description="Have a project in mind or want to collaborate? I'd love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="glass gradient-border rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-semibold text-ghost-white">Let&apos;s build something together</h3>
              <p className="text-ghost-white/50 text-sm leading-relaxed">
                I&apos;m currently available for freelance work and full-time opportunities. Whether it&apos;s a quick question or a long-term project — my inbox is always open.
              </p>

              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 glass rounded-lg flex items-center justify-center border border-border-glass">
                    <FiMail size={14} className="text-cyber-blue" />
                  </div>
                  <span className="text-sm text-ghost-white/50">{siteConfig.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 glass rounded-lg flex items-center justify-center border border-border-glass">
                    <FiUser size={14} className="text-neon-violet" />
                  </div>
                  <span className="text-sm text-ghost-white/50">{siteConfig.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 glass rounded-lg flex items-center justify-center border border-border-glass">
                    <BiPhone size={14} className="text-neon-violet" />
                  </div>
                  <span className="text-sm text-ghost-white/50">{siteConfig.phone}</span>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  id={`contact-social-${label.toLowerCase()}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 glass gradient-border rounded-xl text-ghost-white/50 hover:text-cyber-blue text-sm font-medium transition-colors"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Icon size={16} />
                  {label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass gradient-border rounded-2xl p-10 text-center space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                    className="w-16 h-16 mx-auto rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center"
                  >
                    <FiCheckCircle size={30} className="text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold gradient-text">Message Sent!</h3>
                  <p className="text-ghost-white/50 text-sm">
                    Thank you for reaching out. I&apos;ll get back to you as soon as possible — it will be a pleasure to work together!
                  </p>
                  <motion.button
                    onClick={() => setStatus("idle")}
                    className="mt-2 px-6 py-2 text-sm glass gradient-border rounded-xl text-ghost-white/60 hover:text-ghost-white transition-colors"
                    whileHover={{ scale: 1.03 }}
                  >
                    Send another
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass gradient-border rounded-2xl p-6 sm:p-8 space-y-4"
                >
                  <FloatingInput
                    id="user_name"
                    name="user_name"
                    label="Your Name"
                    icon={FiUser}
                    required
                  />
                  <FloatingInput
                    id="user_email"
                    name="user_email"
                    type="email"
                    label="Email Address"
                    icon={FiMail}
                    required
                  />
                  <FloatingInput
                    id="message"
                    name="message"
                    label="Your Message"
                    icon={FiMessageSquare}
                    required
                    textarea
                  />

                  {status === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-red-400 text-sm p-3 glass border border-red-500/20 rounded-xl"
                    >
                      <FiAlertCircle size={14} />
                      Something went wrong. Please try again.
                    </motion.div>
                  )}

                  <motion.button
                    id="contact-submit"
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full py-3.5 flex items-center justify-center gap-2 font-semibold text-obsidian rounded-xl bg-gradient-to-r from-cyber-blue to-neon-violet disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    whileHover={status !== "loading" ? { scale: 1.02, boxShadow: "0 0 30px rgba(0,240,255,0.3)" } : {}}
                    whileTap={status !== "loading" ? { scale: 0.97 } : {}}
                  >
                    {status === "loading" ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend size={15} />
                        Let&apos;s Talk
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
