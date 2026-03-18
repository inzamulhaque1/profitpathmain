"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

function IPTracker() {
  const { data: session } = useSession();
  const tracked = useRef(false);

  useEffect(() => {
    if (session?.user && !tracked.current) {
      tracked.current = true;
      fetch("/api/track-ip", { method: "POST" }).catch(() => {});
    }
  }, [session]);

  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <IPTracker />
      {children}
    </SessionProvider>
  );
}
