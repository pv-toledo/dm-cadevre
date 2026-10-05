"use client";

import { useEffect } from "react";

export default function TimezoneDetector() {
  useEffect(() => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    document.cookie = `timezone=${timeZone}; path=/; max-age=31536000`;
  }, []);

  return null;
}