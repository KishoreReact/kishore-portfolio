"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiExternalLink,
  FiGithub,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiArrowUpRight,
} from "react-icons/fi";
import SectionHeading from "@/components/ui/SectionHeading";
import projects, { Project } from "@/data/projects";

// ── Placeholder for missing screenshots ─────────────────────────────────────
function ImageWithFallback({
  src,
  alt,
  className,
  projectId,
}: {
  src: string;
  alt: string;
  className?: string;
  projectId: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`${className} flex flex-col items-center justify-center bg-deep-space/80 gap-3`}>
        <div className="w-16 h-16 rounded-2xl glass border border-border-glass flex items-center justify-center">
          <FiArrowUpRight className="text-ghost-white/20" size={28} />
        </div>
        <p className="text-ghost-white/20 text-xs text-center px-4">
          Screenshot coming soon
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}

// ── Project Detail Overlay ───────────────────────────────────────────────────
function ProjectDetail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [imageIndex, setImageIndex] = useState(0);

  const nextImage = () =>
    setImageIndex((i) => (i + 1) % project.images.length);
  const prevImage = () =>
    setImageIndex((i) => (i - 1 + project.images.length) % project.images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-obsidian/80 backdrop-blur-xl"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        layoutId={`project-card-${project.id}`}
        className="relative z-10 w-full max-w-3xl glass gradient-border rounded-3xl overflow-hidden"
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Image slider */}
        <div className="relative h-52 sm:h-72 bg-deep-space overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={imageIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0"
            >
              <ImageWithFallback
                src={project.images[imageIndex]}
                alt={`${project.title} screenshot ${imageIndex + 1}`}
                className="w-full h-full object-cover"
                projectId={project.id}
              />
            </motion.div>
          </AnimatePresence>

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-cyber-blue to-neon-violet text-obsidian">
              <FiStar size={10} />
              Featured
            </div>
          )}

          {/* Image controls */}
          {project.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 glass rounded-lg flex items-center justify-center text-ghost-white/70 hover:text-ghost-white"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 glass rounded-lg flex items-center justify-center text-ghost-white/70 hover:text-ghost-white"
              >
                <FiChevronRight size={16} />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {project.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === imageIndex ? "bg-cyber-blue w-4" : "bg-ghost-white/30 w-1.5"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 glass rounded-lg flex items-center justify-center text-ghost-white/70 hover:text-ghost-white"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
          <h3 className="text-2xl font-bold gradient-text mb-1">{project.title}</h3>

          {/* Outcome */}
          {project.outcome && (
            <p className="text-cyber-blue/70 text-xs font-medium mb-3 flex items-center gap-1.5">
              <FiStar size={11} /> {project.outcome}
            </p>
          )}

          <p className="text-ghost-white/60 text-sm leading-relaxed mb-5">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs font-mono font-medium glass border border-cyber-blue/15 text-cyber-blue rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-3">
            <motion.a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-obsidian rounded-xl bg-gradient-to-r from-cyber-blue to-neon-violet"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiExternalLink size={15} /> Live Demo
            </motion.a>
            {project.githubOwned && project.code && (
              <motion.a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-ghost-white rounded-xl glass gradient-border"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <FiGithub size={15} /> Code
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({
  project,
  onClick,
  index,
}: {
  project: Project;
  onClick: () => void;
  index: number;
}) {
  const displayTechs = project.technologies.slice(0, 3);

  return (
    <motion.div
      layoutId={`project-card-${project.id}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: "easeOut" }}
      onClick={onClick}
      className="group glass gradient-border rounded-2xl overflow-hidden cursor-pointer hover:shadow-card-hover transition-all duration-300"
      whileHover={{ y: -6 }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-deep-space">
        <ImageWithFallback
          src={project.src}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          projectId={project.id}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-cyber-blue to-neon-violet text-obsidian">
            <FiStar size={9} />
            Featured AI
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-bold text-ghost-white group-hover:text-cyber-blue transition-colors duration-200 mb-1.5 line-clamp-1 text-sm">
          {project.title}
        </h3>
        <p className="text-ghost-white/50 text-xs leading-relaxed line-clamp-2 mb-4">
          {project.shortDescription}
        </p>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {displayTechs.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] font-mono font-medium glass border border-border-glass text-ghost-white/40 rounded-full"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] font-mono text-ghost-white/25 rounded-full">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-cyber-blue font-medium group-hover:underline underline-offset-2">
            View Details →
          </span>
          <div className="flex gap-2">
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-ghost-white/30 hover:text-cyber-blue transition-colors"
              aria-label="Live demo"
            >
              <FiExternalLink size={14} />
            </a>
            {project.githubOwned && project.code && (
              <a
                href={project.code}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-ghost-white/30 hover:text-cyber-blue transition-colors"
                aria-label="Source code"
              >
                <FiGithub size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────
export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Featured first, then rest
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const ordered = [...featured, ...rest];

  return (
    <section id="projects" className="section-padding relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />

      <div className="container-max px-6">
        <SectionHeading
          label="My Work"
          title="Featured"
          highlight="Projects"
          description="AI-powered platforms to full-stack web apps — built, shipped, and live in production."
        />

        {/* Featured label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-6"
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold text-cyber-blue uppercase tracking-widest">
            <FiStar size={12} /> AI Projects
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-cyber-blue/30 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {ordered.map((project, index) => {
            // Add a visual divider label before non-featured items
            if (!project.featured && ordered[index - 1]?.featured) {
              return (
                <div key={`group-${project.id}`} className="col-span-full">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 mb-6 mt-2"
                  >
                    <span className="text-xs font-semibold text-ghost-white/30 uppercase tracking-widest">
                      More Projects
                    </span>
                    <div className="flex-1 h-px bg-ghost-white/10" />
                  </motion.div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {ordered
                      .filter((p) => !p.featured)
                      .map((p, i) => (
                        <ProjectCard
                          key={p.id}
                          project={p}
                          index={i}
                          onClick={() => setSelectedProject(p)}
                        />
                      ))}
                  </div>
                </div>
              );
            }
            if (!project.featured) return null;
            return (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onClick={() => setSelectedProject(project)}
              />
            );
          })}
        </div>
      </div>

      {/* Detail overlay */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
