"use client";

import type React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();

  return (
    <ClerkProvider
      appearance={{
        // @ts-ignore - 'baseTheme' is the correct property for clerk/nextjs ^7
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
        variables: {
          colorBackground: resolvedTheme === "dark" ? "#0f0f1a" : "#ffffff",
          colorText: resolvedTheme === "dark" ? "#ffffff" : "#0f172a",
          colorPrimary: resolvedTheme === "dark" ? "#8b5cf6" : "#4f46e5",
          colorTextOnPrimaryBackground: "#ffffff",
          colorInputBackground: resolvedTheme === "dark" ? "rgba(255,255,255,0.05)" : "#f8fafc",
          colorInputText: resolvedTheme === "dark" ? "#ffffff" : "#0f172a",
        } as any,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
