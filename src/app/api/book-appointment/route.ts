import { NextRequest, NextResponse } from "next/server";

interface BookingRequestBody {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  timezone: string;
  topic: string;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: BookingRequestBody = await req.json();

    const { name, email, phone, date, time, timezone, topic, notes } = body;

    // Basic validation
    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, date, or time." },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    console.log("==========================================");
    console.log("📅 NEW APPOINTMENT BOOKED ON PORTFOLIO");
    console.log("------------------------------------------");
    console.log(`Attendee Name:     ${name}`);
    console.log(`Attendee Email:    ${email}`);
    console.log(`Phone/WhatsApp:    ${phone || "Not provided"}`);
    console.log(`Scheduled Date:    ${date}`);
    console.log(`Scheduled Time:    ${time} (${timezone || "IST"})`);
    console.log(`Topic/Service:     ${topic || "General Discussion"}`);
    console.log(`Attendee Notes:    ${notes || "None"}`);
    console.log(`Timestamp:         ${new Date().toISOString()}`);
    console.log("==========================================");

    // If RESEND_API_KEY is available in environment, send email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Portfolio Appointment <onboarding@resend.dev>",
            to: ["kishorekichan12@gmail.com"],
            subject: `📅 New Appointment Booked: ${name} on ${date} at ${time}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0A0F1D; color: #F0F4FF; border-radius: 12px; border: 1px solid #1E293B;">
                <h2 style="color: #00F0FF; margin-top: 0;">📅 New Call Booked with Kishore</h2>
                <p style="color: #94A3B8;">A visitor just booked an appointment through your portfolio calendar!</p>
                
                <div style="background: #111827; padding: 18px; border-radius: 8px; border-left: 4px solid #7B2CBF; margin: 20px 0;">
                  <p style="margin: 6px 0;"><strong>Name:</strong> ${name}</p>
                  <p style="margin: 6px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #00F0FF;">${email}</a></p>
                  <p style="margin: 6px 0;"><strong>Phone:</strong> ${phone || "Not specified"}</p>
                  <p style="margin: 6px 0;"><strong>Date:</strong> ${date}</p>
                  <p style="margin: 6px 0;"><strong>Time:</strong> ${time} (${timezone || "IST"})</p>
                  <p style="margin: 6px 0;"><strong>Topic:</strong> ${topic}</p>
                  <p style="margin: 6px 0;"><strong>Notes:</strong> ${notes || "None"}</p>
                </div>

                <p style="font-size: 13px; color: #64748B;">Please send the Google Meet invitation link to ${email} before the scheduled time.</p>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.warn("Resend email failed:", emailErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Appointment successfully registered",
        appointment: {
          name,
          email,
          date,
          time,
          timezone,
          topic,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing appointment." },
      { status: 500 }
    );
  }
}
