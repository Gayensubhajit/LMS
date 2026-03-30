"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { backendRequest } from "@/lib/backend-client";
import { Loader2 } from "lucide-react";

interface UserResponse {
  ok: boolean;
  item: {
    role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  };
}

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/sign-in");
      return;
    }

    async function checkAuthorization() {
      try {
        const res = await backendRequest<UserResponse>("/users/me", {
          clerkUserId: user?.id,
        });
        
        if (res.ok && (res.item.role === "ADMIN" || res.item.role === "INSTRUCTOR")) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          router.push("/my-courses"); // Redirect unauthorized users
        }
      } catch (err) {
        setIsAuthorized(false);
        router.push("/my-courses");
      }
    }

    checkAuthorization();
  }, [isLoaded, user, router]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse uppercase tracking-[0.2em] text-[10px]">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return <>{children}</>;
}
