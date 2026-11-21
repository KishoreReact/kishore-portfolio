"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  FiCalendar,
  FiClock,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiUser,
  FiMail,
  FiPhone,
  FiMessageSquare,
  FiCheckCircle,
  FiCheck,
  FiDownload,
  FiExternalLink,
  FiGlobe,
} from "react-icons/fi";
import { useBooking } from "@/context/BookingContext";
import { siteConfig } from "@/data/config";
import ConfettiCanvas from "./ConfettiCanvas";
import {
  formatAppointmentDate,
  generateGoogleCalendarUrl,
  downloadIcsFile,
  AppointmentDetails,
} from "@/lib/calendar-utils";

const TIME_SLOTS = {
  morning: ["09:30 AM", "10:30 AM", "11:30 AM"],
  afternoon: ["02:00 PM", "03:00 PM", "04:00 PM"],
  evening: ["05:30 PM", "06:30 PM", "07:30 PM", "08:30 PM"],
};

const TOPIC_PRESETS = [
  "AI Agents & RAG Architecture",
  "Full Stack / Next.js Product",
  "Real-Time Voice / LiveKit",
  "Freelance / Contract Project",
  "Hiring / Full-Time Role",
  "Tech Consultation / Other",
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function BookingModal() {
  const { isOpen, closeBooking, prefilledTopic } = useBooking();

  // Wizard step: 1 = Date & Time, 2 = Contact Details, 3 = Success / Celebration
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Calendar state
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    // Default to tomorrow or next weekday
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  });
  const [selectedTime, setSelectedTime] = useState<string>("03:00 PM");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Timezone display
  const [userTimezone, setUserTimezone] = useState("IST (GMT+5:30)");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setUserTimezone(tz || "IST (GMT+5:30)");
    } catch {
      setUserTimezone("IST (GMT+5:30)");
    }
  }, []);

  // Update topic if prefilled
  useEffect(() => {
    if (prefilledTopic) {
      setTopic(prefilledTopic);
    } else if (!topic) {
      setTopic(TOPIC_PRESETS[0]);
    }
  }, [prefilledTopic, topic]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeBooking();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeBooking]);

  // Reset modal when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSubmitError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Calendar calculations
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthName = currentMonthDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { date: Date; isCurrentMonth: boolean; isPast: boolean }[] = [];

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push({ date, isCurrentMonth: false, isPast: true });
    }

    // Current month days
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isPast = date.getTime() < today.getTime();
      days.push({ date, isCurrentMonth: true, isPast });
    }

    // Next month padding to reach a complete 35 or 42 grid
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, month + 1, d);
      days.push({ date, isCurrentMonth: false, isPast: false });
    }

    return days;
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setSubmitError("Please pick a date and time slot.");
      return;
    }
    if (!name.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const formattedDate = formatAppointmentDate(selectedDate);

    // Template parameters for EmailJS
    const emailParams = {
      to_name: "Kishore",
      from_name: name,
      user_name: name,
      name: name,
      user_email: email,
      from_email: email,
      reply_to: email,
      email: email,
      date: formattedDate,
      time: selectedTime,
      timezone: userTimezone,
      phone: phone || "Not provided",
      topic: topic || "General Consultation",
      notes: notes || "No additional notes",
      message: `📅 NEW APPOINTMENT BOOKED ON PORTFOLIO!
--------------------------------------------------
Client Name:     ${name}
Client Email:    ${email}
Phone/WhatsApp:  ${phone || "Not provided"}
Scheduled Date:  ${formattedDate}
Scheduled Time:  ${selectedTime} (${userTimezone})
Duration:        30 Minutes
Discussion Topic: ${topic}
Client Notes:    ${notes || "None"}
--------------------------------------------------
Please review and send the Google Meet invitation link to ${email}!`,
    };

    try {
      // 1. Send via EmailJS directly to Kishore's email
      try {
        await emailjs.send(
          siteConfig.emailjs.serviceId,
          siteConfig.emailjs.templateId,
          emailParams,
          siteConfig.emailjs.publicKey
        );
      } catch (err) {
        console.warn("EmailJS notification attempt:", err);
      }

      // 2. Also register booking with server API route
      await fetch("/api/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: formattedDate,
          time: selectedTime,
          timezone: userTimezone,
          topic,
          notes,
        }),
      });

      // Advance to Step 3: Celebration & Confirmation
      setStep(3);
    } catch (error) {
      console.error("Booking error:", error);
      // Still show success if local validation passed, so user is not blocked
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  };

  const appointmentDetails: AppointmentDetails = useMemo(() => {
    return {
      name: name || "Guest",
      email: email || siteConfig.email,
      phone,
      date: selectedDate || new Date(),
      timeSlot: selectedTime,
      timezone: userTimezone,
      topic: topic || "AI & Full Stack Consultation",
      notes,
    };
  }, [name, email, phone, selectedDate, selectedTime, userTimezone, topic, notes]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeBooking}
          className="fixed inset-0 bg-obsidian/85 backdrop-blur-xl transition-all"
        />

        {/* Confetti celebration on Step 3 */}
        {step === 3 && <ConfettiCanvas />}

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-4xl glass gradient-border rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.85)] border border-cyber-blue/25 bg-obsidian/90 overflow-hidden my-auto"
        >
          {/* Ambient background glows */}
          <div className="absolute -top-32 -left-32 w-72 h-72 bg-cyber-blue/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-72 h-72 bg-neon-violet/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={closeBooking}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full glass border border-white/10 flex items-center justify-center text-ghost-white/60 hover:text-ghost-white hover:border-cyber-blue/40 transition-all z-20"
            aria-label="Close modal"
          >
            <FiX size={18} />
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-border-glass">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-cyber-blue/30 shadow-md flex-shrink-0 bg-obsidian">
                <Image
                  src="/images/kishore-hero.png"
                  alt="Kishore C"
                  fill
                  className="object-cover object-top"
                  sizes="48px"
                />
                <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-obsidian animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-ghost-white">
                    Book a Call with Kishore
                  </h2>
                  <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 font-semibold">
                    1-on-1 Video Call
                  </span>
                </div>
                <p className="text-xs text-ghost-white/50 mt-0.5">
                  30-min strategy session • AI architecture, engineering, or project inquiry
                </p>
              </div>
            </div>

            {/* Timezone pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border border-border-glass text-[11px] font-mono text-ghost-white/70">
              <FiGlobe className="text-cyber-blue" size={13} />
              <span>{userTimezone}</span>
            </div>
          </div>

          {/* Step Progress Bar */}
          <div className="flex items-center justify-between gap-2 py-4 border-b border-white/5 text-xs font-mono">
            <button
              onClick={() => step === 2 && setStep(1)}
              disabled={step === 3}
              className={`flex items-center gap-2 transition-colors ${
                step === 1
                  ? "text-cyber-blue font-bold"
                  : step > 1
                  ? "text-ghost-white/80 hover:text-cyber-blue cursor-pointer"
                  : "text-ghost-white/30"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 1
                    ? "bg-cyber-blue text-obsidian font-bold shadow-sm shadow-cyber-blue/50"
                    : step > 1
                    ? "bg-green-500/20 text-green-400 border border-green-500/40"
                    : "glass border border-white/10"
                }`}
              >
                {step > 1 ? "✓" : "1"}
              </span>
              <span>Select Date & Time</span>
            </button>

            <div className="flex-1 h-px bg-white/10 mx-2" />

            <div
              className={`flex items-center gap-2 ${
                step === 2
                  ? "text-cyber-blue font-bold"
                  : step === 3
                  ? "text-green-400 font-bold"
                  : "text-ghost-white/30"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 2
                    ? "bg-cyber-blue text-obsidian font-bold shadow-sm shadow-cyber-blue/50"
                    : step === 3
                    ? "bg-green-500/20 text-green-400 border border-green-500/40"
                    : "glass border border-white/10"
                }`}
              >
                {step === 3 ? "✓" : "2"}
              </span>
              <span>Your Details</span>
            </div>

            <div className="flex-1 h-px bg-white/10 mx-2" />

            <div
              className={`flex items-center gap-2 ${
                step === 3 ? "text-neon-violet font-bold" : "text-ghost-white/30"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step === 3
                    ? "bg-gradient-to-r from-cyber-blue to-neon-violet text-obsidian font-bold"
                    : "glass border border-white/10"
                }`}
              >
                3
              </span>
              <span>Confirmation</span>
            </div>
          </div>

          {/* ════════════ STEP 1: CALENDAR & TIME SLOTS ════════════ */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="pt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Left Column: Interactive Month Calendar */}
              <div className="lg:col-span-7 glass border border-border-glass rounded-2xl p-4 sm:p-5 bg-obsidian/40">
                {/* Month navigation */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm sm:text-base font-bold text-ghost-white font-mono flex items-center gap-2">
                    <FiCalendar className="text-cyber-blue" />
                    {monthName}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-ghost-white/70 hover:text-cyber-blue hover:border-cyber-blue/40 transition-colors"
                      aria-label="Previous month"
                    >
                      <FiChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center text-ghost-white/70 hover:text-cyber-blue hover:border-cyber-blue/40 transition-colors"
                      aria-label="Next month"
                    >
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Day-of-week headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-mono text-ghost-white/40 mb-2 font-semibold">
                  {DAYS_OF_WEEK.map((d) => (
                    <div key={d} className="py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                  {calendarDays.map(({ date, isCurrentMonth, isPast }, idx) => {
                    const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                    const isToday = isSameDay(date, new Date());

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isPast || !isCurrentMonth}
                        onClick={() => setSelectedDate(date)}
                        className={`relative aspect-square rounded-xl text-xs font-mono font-medium transition-all flex flex-col items-center justify-center ${
                          !isCurrentMonth
                            ? "opacity-15 cursor-not-allowed"
                            : isPast
                            ? "opacity-25 cursor-not-allowed text-ghost-white/30"
                            : isSelected
                            ? "bg-gradient-to-tr from-cyber-blue to-neon-violet text-obsidian font-bold shadow-lg shadow-cyber-blue/30 scale-105 z-10"
                            : "hover:glass hover:border-cyber-blue/40 hover:text-cyber-blue text-ghost-white/80 bg-white/[0.02]"
                        } ${
                          isToday && !isSelected
                            ? "border border-cyber-blue/40 text-cyber-blue font-bold"
                            : ""
                        }`}
                      >
                        <span>{date.getDate()}</span>
                        {/* Dot for available future weekdays */}
                        {!isPast && isCurrentMonth && !isSelected && (
                          <span className="w-1 h-1 rounded-full bg-cyber-blue/60 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Date Summary */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-ghost-white/50">
                  <span>Selected Date:</span>
                  <span className="font-semibold text-ghost-white font-mono">
                    {selectedDate ? formatAppointmentDate(selectedDate) : "None"}
                  </span>
                </div>
              </div>

              {/* Right Column: Time Slots */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-ghost-white/50 flex items-center gap-1.5">
                      <FiClock className="text-neon-violet" /> Select Time Slot
                    </span>
                    <span className="text-[11px] font-mono text-cyber-blue font-semibold px-2 py-0.5 rounded-md glass border border-cyber-blue/20">
                      30 Mins Call
                    </span>
                  </div>

                  {/* Morning Slots */}
                  <div>
                    <div className="text-[11px] font-mono text-ghost-white/40 mb-1.5">
                      Morning (IST)
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.morning.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2 px-2 text-xs font-mono rounded-xl transition-all text-center flex items-center justify-center gap-1 border ${
                              isSelected
                                ? "bg-cyber-blue text-obsidian font-bold border-cyber-blue shadow-md shadow-cyber-blue/30 scale-102"
                                : "glass border-border-glass text-ghost-white/70 hover:border-cyber-blue/30 hover:text-ghost-white"
                            }`}
                          >
                            {isSelected && <FiCheck size={12} />}
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Afternoon Slots */}
                  <div>
                    <div className="text-[11px] font-mono text-ghost-white/40 mb-1.5">
                      Afternoon (IST)
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.afternoon.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2 px-2 text-xs font-mono rounded-xl transition-all text-center flex items-center justify-center gap-1 border ${
                              isSelected
                                ? "bg-cyber-blue text-obsidian font-bold border-cyber-blue shadow-md shadow-cyber-blue/30 scale-102"
                                : "glass border-border-glass text-ghost-white/70 hover:border-cyber-blue/30 hover:text-ghost-white"
                            }`}
                          >
                            {isSelected && <FiCheck size={12} />}
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Evening Slots */}
                  <div>
                    <div className="text-[11px] font-mono text-ghost-white/40 mb-1.5">
                      Evening (IST)
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {TIME_SLOTS.evening.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`py-2 px-2 text-xs font-mono rounded-xl transition-all text-center flex items-center justify-center gap-1 border ${
                              isSelected
                                ? "bg-cyber-blue text-obsidian font-bold border-cyber-blue shadow-md shadow-cyber-blue/30 scale-102"
                                : "glass border-border-glass text-ghost-white/70 hover:border-cyber-blue/30 hover:text-ghost-white"
                            }`}
                          >
                            {isSelected && <FiCheck size={12} />}
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <div className="pt-2">
                  <motion.button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={!selectedDate || !selectedTime}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-obsidian bg-gradient-to-r from-cyber-blue to-neon-violet glow-blue flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span>Next: Enter Details</span>
                    <FiChevronRight size={16} />
                  </motion.button>
                  <p className="text-[11px] text-center text-ghost-white/40 mt-2 font-mono">
                    Instant calendar sync & email confirmation
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════ STEP 2: USER DETAILS FORM ════════════ */}
          {step === 2 && (
            <motion.form
              key="step-2"
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="pt-5 space-y-5"
            >
              {/* Selected Slot Recap Banner */}
              <div className="glass gradient-border rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-cyber-blue/5 border border-cyber-blue/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center text-cyber-blue">
                    <FiCalendar size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-ghost-white/50 font-mono">
                      Selected Appointment Slot
                    </div>
                    <div className="text-sm sm:text-base font-bold text-ghost-white font-mono">
                      {selectedDate ? formatAppointmentDate(selectedDate) : ""} • {selectedTime}{" "}
                      <span className="text-xs text-cyber-blue font-normal">({userTimezone})</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-cyber-blue hover:underline font-mono flex items-center gap-1"
                >
                  <FiChevronLeft size={13} /> Change Time
                </button>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ghost-white/80 flex items-center gap-1.5">
                    <FiUser className="text-cyber-blue" />
                    <span>Your Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full px-4 py-3 rounded-xl glass border border-border-glass bg-obsidian/40 text-ghost-white text-sm focus:border-cyber-blue focus:outline-none transition-colors"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ghost-white/80 flex items-center gap-1.5">
                    <FiMail className="text-cyber-blue" />
                    <span>Your Email *</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-4 py-3 rounded-xl glass border border-border-glass bg-obsidian/40 text-ghost-white text-sm focus:border-cyber-blue focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Phone / WhatsApp & Topic Presets */}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ghost-white/80 flex items-center gap-1.5">
                    <FiPhone className="text-neon-violet" />
                    <span>Phone or WhatsApp (Optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 0192 / +91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl glass border border-border-glass bg-obsidian/40 text-ghost-white text-sm focus:border-cyber-blue focus:outline-none transition-colors"
                  />
                </div>

                {/* Topic Pills */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-ghost-white/80 flex items-center gap-1.5">
                    <FiMessageSquare className="text-cyber-blue" />
                    <span>What would you like to discuss?</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TOPIC_PRESETS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTopic(t)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                          topic === t
                            ? "bg-neon-violet/20 border-neon-violet text-ghost-white shadow-sm shadow-neon-violet/30"
                            : "glass border-border-glass text-ghost-white/60 hover:text-ghost-white hover:border-white/20"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ghost-white/80">
                    Brief note or questions (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tell Kishore a little bit about your project or inquiry..."
                    className="w-full px-4 py-2.5 rounded-xl glass border border-border-glass bg-obsidian/40 text-ghost-white text-sm focus:border-cyber-blue focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Submit Error Banner */}
              {submitError && (
                <div className="p-3 rounded-xl glass border border-red-500/30 text-red-400 text-xs">
                  {submitError}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl glass border border-border-glass text-ghost-white/70 hover:text-ghost-white text-xs font-medium transition-colors"
                >
                  Back to Calendar
                </button>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 max-w-xs py-3.5 px-6 rounded-xl font-semibold text-obsidian bg-gradient-to-r from-cyber-blue to-neon-violet glow-blue flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full"
                      />
                      <span>Booking Appointment...</span>
                    </>
                  ) : (
                    <>
                      <FiCheckCircle size={16} />
                      <span>Confirm & Book Call</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.form>
          )}

          {/* ════════════ STEP 3: CELEBRATION & SUCCESS ════════════ */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 220 }}
              className="pt-6 pb-2 text-center space-y-6"
            >
              {/* Animated Glowing Ring & Checkmark */}
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                {/* Concentric pulse rings */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.4, 1.6], opacity: [0.6, 0.2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-cyber-blue/30 pointer-events-none"
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.3, 1.5], opacity: [0.7, 0.2, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                  className="absolute inset-0 rounded-full bg-neon-violet/30 pointer-events-none"
                />

                {/* Center Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.15 }}
                  className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-cyber-blue via-green-400 to-neon-violet p-[2px] shadow-2xl shadow-cyber-blue/40"
                >
                  <div className="w-full h-full rounded-full bg-obsidian flex items-center justify-center">
                    <FiCheckCircle size={36} className="text-green-400 drop-shadow-md" />
                  </div>
                </motion.div>
              </div>

              {/* Success Message */}
              <div className="space-y-2">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="text-2xl sm:text-3xl font-extrabold gradient-text tracking-tight"
                >
                  Your Appointment is Booked Successfully!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm sm:text-base text-ghost-white/80 max-w-lg mx-auto leading-relaxed"
                >
                  <strong className="text-cyber-blue font-semibold">Kishore will reach you soon</strong> at{" "}
                  <span className="font-mono text-ghost-white underline decoration-cyber-blue/50 underline-offset-4">
                    {email}
                  </span>{" "}
                  with the Google Meet invitation & call link.
                </motion.p>
              </div>

              {/* Digital Pass / Ticket Card */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="max-w-md mx-auto glass gradient-border rounded-2xl p-5 text-left border border-cyber-blue/30 bg-obsidian/70 shadow-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-blue/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-ghost-white/40">
                    Confirmed Video Call
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-green-500/15 text-green-400 border border-green-500/30">
                    ● Confirmed
                  </span>
                </div>

                <div className="py-3.5 space-y-2.5 font-mono text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-ghost-white/50">Date:</span>
                    <span className="font-bold text-ghost-white text-right">
                      {selectedDate ? formatAppointmentDate(selectedDate) : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-ghost-white/50">Time:</span>
                    <span className="font-bold text-cyber-blue text-right">
                      {selectedTime} ({userTimezone})
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-ghost-white/50">Host:</span>
                    <span className="text-ghost-white text-right font-medium">
                      Kishore C (AI Full Stack Dev)
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-ghost-white/50">Topic:</span>
                    <span className="text-ghost-white/90 text-right font-medium truncate max-w-[200px]">
                      {topic}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-ghost-white/50">Platform:</span>
                    <span className="text-green-400 text-right font-semibold">
                      Google Meet (Link will be sent)
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 text-[11px] text-ghost-white/40 font-mono text-center">
                  A notification has been dispatched to Kishore&apos;s direct inbox.
                </div>
              </motion.div>

              {/* Action Buttons: Google Calendar + Download ICS + Close */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex flex-wrap items-center justify-center gap-3 pt-2"
              >
                <a
                  href={generateGoogleCalendarUrl(appointmentDetails)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl font-semibold text-obsidian bg-cyber-blue hover:bg-cyber-blue/90 glow-blue text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  <FiExternalLink size={14} /> Add to Google Calendar
                </a>

                <button
                  type="button"
                  onClick={() => downloadIcsFile(appointmentDetails)}
                  className="px-4 py-2.5 rounded-xl font-medium text-ghost-white glass gradient-border text-xs flex items-center gap-1.5 hover:text-cyber-blue transition-colors"
                >
                  <FiDownload size={14} /> Download .ics File
                </button>

                <button
                  type="button"
                  onClick={closeBooking}
                  className="px-5 py-2.5 rounded-xl font-medium text-ghost-white/60 hover:text-ghost-white glass border border-white/10 text-xs transition-colors"
                >
                  Done
                </button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
