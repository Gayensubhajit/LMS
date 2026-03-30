import type React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";

export default function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
      }}
    >
      {children}
    </ClerkProvider>
  );
}
