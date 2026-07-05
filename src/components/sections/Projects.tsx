"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiGithub, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import projects, { Project } from "@/data/projects";

// ── Project Detail Overlay ───────────────────────────────────────────────────
function ProjectDetail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const techs =
    typeof project.technologies === "string"
      ? project.technologies.split(",").map((t) => t.trim())
      : project.technologies;

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
              <img
                src={project.images[imageIndex]}
                alt={`${project.title} screenshot ${imageIndex + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${project.id}/800/400`;
                }}
              />
            </motion.div>
          </AnimatePresence>

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
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      i === imageIndex ? "bg-cyber-blue w-4" : "bg-ghost-white/30"
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
        <div className="p-6 sm:p-8">
          <h3 className="text-2xl font-bold gradient-text mb-3">{project.title}</h3>
          <p className="text-ghost-white/60 text-sm leading-relaxed mb-5">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {techs.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs font-medium glass border border-cyber-blue/15 text-cyber-blue rounded-full"
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
              id={`project-detail-demo-${project.id}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-obsidian rounded-xl bg-gradient-to-r from-cyber-blue to-neon-violet"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiExternalLink size={15} /> Live Demo
            </motion.a>
            <motion.a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              id={`project-detail-code-${project.id}`}
              className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-ghost-white rounded-xl glass gradient-border"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <FiGithub size={15} /> Code
            </motion.a>
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
  const techs =
    typeof project.technologies === "string"
      ? project.technologies.split(",").map((t) => t.trim()).slice(0, 3)
      : (project.technologies as string[]).slice(0, 3);

  return (
    <motion.div
      layoutId={`project-card-${project.id}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      onClick={onClick}
      className="group glass gradient-border rounded-2xl overflow-hidden cursor-pointer hover:shadow-card-hover transition-all duration-300"
      whileHover={{ y: -6 }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-deep-space">
        <img
          src={project.src}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${project.id + 10}/600/300`;
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent" />
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-bold text-ghost-white group-hover:text-cyber-blue transition-colors duration-200 mb-2 line-clamp-1">
          {project.title}
        </h3>
        <p className="text-ghost-white/50 text-xs leading-relaxed line-clamp-2 mb-4">
          {project.description}
        </p>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {techs.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[10px] font-medium glass border border-border-glass text-ghost-white/40 rounded-full"
            >
              {tech}
            </span>
          ))}
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
              id={`project-demo-${project.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-ghost-white/30 hover:text-cyber-blue transition-colors"
              aria-label="Live demo"
            >
              <FiExternalLink size={14} />
            </a>
            <a
              href={project.code}
              target="_blank"
              rel="noopener noreferrer"
              id={`project-code-${project.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-ghost-white/30 hover:text-cyber-blue transition-colors"
              aria-label="Source code"
            >
              <FiGithub size={14} />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────
export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="section-padding relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-glass to-transparent" />

      <div className="container-max px-6">
        <SectionHeading
          label="My Work"
          title="Featured"
          highlight="Projects"
          description="A collection of projects I've built — from AI-powered platforms to full-stack web applications."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
            />
          ))}
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
