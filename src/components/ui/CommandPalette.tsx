"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Book,
  LayoutDashboard,
  Settings,
  Trophy,
  User,
  Sparkles,
  Home,
  CreditCard,
  LifeBuoy,
} from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/courses"))}>
            <Book className="mr-2 h-4 w-4" />
            <span>Browse Courses</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/ai-roadmap"))}>
            <Sparkles className="mr-2 h-4 w-4" />
            <span>AI Roadmap</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem onSelect={() => runCommand(() => router.push("/profile"))}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/my-courses"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>My Learning</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/leaderboard"))}>
            <Trophy className="mr-2 h-4 w-4" />
            <span>Leaderboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Help & Support">
          <CommandItem onSelect={() => runCommand(() => router.push("/support"))}>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/pricing"))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Pricing</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
