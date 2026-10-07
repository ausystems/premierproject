import { useEffect, useLayoutEffect } from "react";

/** A layout effect in the browser (runs before paint) and a no-op-safe effect during build-time rendering. */
export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
