/**
 * Calendar utilities for booking modal, Google Calendar integration, and .ics generation
 */

export interface AppointmentDetails {
  name: string;
  email: string;
  phone?: string;
  date: Date;
  timeSlot: string; // e.g. "03:30 PM"
  timezone: string;
  topic: string;
  notes?: string;
}

/**
 * Format a Date object into readable date string
 * e.g. "Thursday, November 27, 2026"
 */
export function formatAppointmentDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Parse time string like "03:30 PM" into hours and minutes
 */
function parseTimeSlot(timeSlot: string): { hours: number; minutes: number } {
  const match = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return { hours: 10, minutes: 0 };
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

/**
 * Combine Date and Time slot into start & end Date objects (30 min duration)
 */
export function getAppointmentDateRange(date: Date, timeSlot: string, durationMinutes = 30): { start: Date; end: Date } {
  const { hours, minutes } = parseTimeSlot(timeSlot);
  const start = new Date(date);
  start.setHours(hours, minutes, 0, 0);

  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return { start, end };
}

/**
 * Convert Date to UTC YYYYMMDDTHHmmssZ format for calendar links
 */
function toUtcCalendarString(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Generate a direct Google Calendar creation link
 */
export function generateGoogleCalendarUrl(appointment: AppointmentDetails): string {
  const { start, end } = getAppointmentDateRange(appointment.date, appointment.timeSlot);
  const startStr = toUtcCalendarString(start);
  const endStr = toUtcCalendarString(end);

  const title = encodeURIComponent(`1-on-1 Strategy Call: Kishore C & ${appointment.name}`);
  const details = encodeURIComponent(
    `Topic: ${appointment.topic}\n\nClient Name: ${appointment.name}\nClient Email: ${appointment.email}\nPhone: ${appointment.phone || "Not specified"}\n\nNotes: ${appointment.notes || "None"}\n\nPlatform: Google Meet (link to be provided by Kishore)\nHost: Kishore C (AI Full Stack Developer)\nEmail: kishorekichan12@gmail.com`
  );
  const location = encodeURIComponent("Google Meet (link will be sent to " + appointment.email + ")");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}&add=${encodeURIComponent(
    appointment.email
  )}`;
}

/**
 * Generate and trigger download of an .ics calendar file
 */
export function downloadIcsFile(appointment: AppointmentDetails): void {
  const { start, end } = getAppointmentDateRange(appointment.date, appointment.timeSlot);
  const startStr = toUtcCalendarString(start);
  const endStr = toUtcCalendarString(end);
  const nowStr = toUtcCalendarString(new Date());
  const uid = `kishore-call-${Date.now()}@portfolio.kishore.dev`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Kishore C//AI Full Stack Developer Portfolio//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:1-on-1 Call: Kishore C & ${appointment.name}`,
    `DESCRIPTION:Topic: ${appointment.topic}\\nClient: ${appointment.name} (${appointment.email})\\nHost: Kishore C (AI Full Stack Developer)\\nNotes: ${appointment.notes || "None"}\\nPlatform: Google Meet`,
    "LOCATION:Google Meet (Link will be sent via email)",
    "ORGANIZER;CN=Kishore C:mailto:kishorekichan12@gmail.com",
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;CN=${appointment.name}:mailto:${appointment.email}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Call with Kishore in 15 minutes",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `kishore-call-${appointment.date.toISOString().slice(0, 10)}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
