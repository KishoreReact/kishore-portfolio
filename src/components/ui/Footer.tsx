"use client";

import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from "react-icons/fi";
import { siteConfig } from "@/data/config";
import { CiInstagram } from "react-icons/ci";

const socialLinks = [
  { icon: FiGithub, href: siteConfig.social.github, label: "GitHub" },
  { icon: FiLinkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
  { icon: CiInstagram, href: siteConfig.social.instagram, label: "Instagram" },
  { icon: FiMail, href: `mailto:${siteConfig.email}`, label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border-glass py-12 px-6">
      {/* Gradient line top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-cyber-blue to-transparent" />

      <div className="container-max flex flex-col md:flex-row items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-ghost-white/30 text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="gradient-text font-semibold">{siteConfig.name}</span>.
            Crafted with passion in Kerala, India.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          {socialLinks.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-9 h-9 flex items-center justify-center rounded-lg glass border border-border-glass text-ghost-white/50 hover:text-cyber-blue hover:border-cyber-blue/30 transition-all duration-200"
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon size={16} />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </footer>
  );
}
