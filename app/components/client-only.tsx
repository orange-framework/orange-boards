import { PropsWithChildren } from "react";

export function ClientOnly({
  children,
  fallback,
}: PropsWithChildren<{ fallback?: React.ReactNode }>) {
  return typeof window === "undefined" ? fallback : children;
}
