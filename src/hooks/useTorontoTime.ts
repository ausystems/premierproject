import { useEffect, useState } from "react";

const fmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Live studio time, refreshed every 30 seconds. */
export const useTorontoTime = () => {
  const [time, setTime] = useState(() => fmt.format(new Date()));
  useEffect(() => {
    const tick = () => setTime(fmt.format(new Date()));
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
};
