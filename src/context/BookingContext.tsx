"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface BookingContextType {
  isOpen: boolean;
  openBooking: (topic?: string) => void;
  closeBooking: () => void;
  prefilledTopic: string;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prefilledTopic, setPrefilledTopic] = useState("");

  const openBooking = useCallback((topic?: string) => {
    if (topic) {
      setPrefilledTopic(topic);
    }
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
    setPrefilledTopic("");
  }, []);

  // Handle global triggers and hash changes
  useEffect(() => {
    const handleGlobalTrigger = (event: Event) => {
      const customEvent = event as CustomEvent<{ topic?: string }>;
      openBooking(customEvent.detail?.topic);
    };

    const handleHash = () => {
      if (window.location.hash === "#book-call" || window.location.hash === "#book") {
        openBooking();
        // Clear hash without reloading
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
    };

    window.addEventListener("open-booking-modal", handleGlobalTrigger);
    window.addEventListener("hashchange", handleHash);

    // Initial hash check
    handleHash();

    return () => {
      window.removeEventListener("open-booking-modal", handleGlobalTrigger);
      window.removeEventListener("hashchange", handleHash);
    };
  }, [openBooking]);

  return (
    <BookingContext.Provider value={{ isOpen, openBooking, closeBooking, prefilledTopic }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
