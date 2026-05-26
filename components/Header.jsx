"use client";

import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";


import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FileText,
  Bot,
  PenBox,
  GraduationCap,
  ChevronDown,
  StarsIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ui/Modetoggle";
import { useTheme } from "next-themes";
import { getUserOnboardingStatus } from "@/actions/user"; // server action

export default function Header() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [clerkKeyless, setClerkKeyless] = useState(false);
    const [open, setOpen] = useState(false);


  useEffect(() => setMounted(true), []);

  useEffect(() => {
    // Check dev status endpoint to detect Clerk keyless mode and show a banner
    let mounted = true;
    fetch('/api/dev/status')
      .then((res) => res.json())
      .then((data) => {
        if (mounted && data?.clerkKeyless) setClerkKeyless(true);
      })
      .catch(() => {});
    return () => (mounted = false);
  }, []);

  const logoSrc = mounted && resolvedTheme === "dark" ? "/logo.png" : "/dark-logo.png";

  /** guarded navigation */
  const go = async (href) => {
    if (!isSignedIn) return router.push("/sign-in");

    try {
      const { isOnboarded } = await getUserOnboardingStatus();
      router.push(isOnboarded ? href : "/onboarding");
    } catch (err) {
      console.error("Onboarding check failed:", err);
      router.push(href);
    }
  };

  return (
    <header  className="fixed top-0 left-0 right-0 z-50">
      {clerkKeyless && (
        <div className="w-full bg-yellow-100 text-yellow-800 text-sm py-1 text-center">
          Clerk running in keyless dev mode — auth is disabled locally.
        </div>
      )}
      <nav className="container mx-auto px-3 md:px-4 lg:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src={logoSrc}
            alt="Pathfinder AI Logo"
            width={500}
            height={100}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link> 
        <div className="hidden lg:flex flex-1 justify-center">

    <ul className="flex gap-4 text-base font-semibold"> 
            <li>
          <a href="#home" className="hover:text-cyan-400 transition">
            Home
          </a>
        </li>

        <li>
          <a href="#features" className="hover:text-cyan-400 transition">
            Features
          </a>
        </li>
        <li>
          <a href="#about" className="hover:text-cyan-400 transition">
            About
          </a>
        </li>
        <li>
          <a href="#feedback" className="hover:text-cyan-400 transition">
            Feedback
          </a>
        </li>
        <li>
          <a href="#question" className="hover:text-cyan-400 transition">
            F&Q
          </a>
        </li>        
        <li>
          <a href="#contact" className="hover:text-cyan-400 transition">
            Contact Us
          </a>
        </li>
      </ul>
      </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
        <ModeToggle />

        <div className="hidden lg:flex items-center  space-x-2 md:space-x-4">
          {/* -------- Signed-in navigation -------- */}
          <SignedIn>
            
            {/* Dashboard button */}
            <Button
              variant="outline"
              className="hidden md:inline-flex items-center gap-2"
              onClick={() => go("/dashboard")}
            >
              <LayoutDashboard className="h-4 w-4" />
              Industry Insights
            </Button>
            <Button
              variant="ghost"
              className="md:hidden w-10 h-10 p-0"
              onClick={() => go("/dashboard")}
            >
              <LayoutDashboard className="h-4 w-4" />
            </Button>

            {/* Growth Tools dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => go("/resume")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  Build Resume
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => go("/ai-cover-letter")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <PenBox className="h-4 w-4" />
                  Cover Letter
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => go("/interview")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <GraduationCap className="h-4 w-4" />
                  Interview Prep
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          {/* -------- Signed-out button -------- */}
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Sign&nbsp;In</Button>
            </SignInButton>
          </SignedOut>

          {/* -------- Avatar -------- */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
        </div>
      </nav>
{/* Mobile Menu */}
  <div
    className={`lg:hidden absolute top-16 left-0 w-full transition-all duration-300 ease-in-out ${
      open
        ? "opacity-100 visible translate-y-0"
        : "opacity-0 invisible -translate-y-5"
    }`}
  >
    <div className="mx-4 mt-3 rounded-2xl border border-white/10 bg-white/10 dark:bg-black/40 backdrop-blur-xl shadow-2xl p-6">
      
      <ul className="flex flex-col gap-5 text-base font-medium">
        
        <li>
          <a
            href="#home"
            className="block rounded-lg px-4 py-3 hover:bg-cyan-500/10 hover:text-cyan-400 transition"
            onClick={() => setOpen(false)}
          >
            Home
          </a>
        </li>

        <li>
          <a
            href="#features"
            className="block rounded-lg px-4 py-3 hover:bg-cyan-500/10 hover:text-cyan-400 transition"
            onClick={() => setOpen(false)}
          >
            Features
          </a>
        </li>

        <li>
          <a
            href="#about"
            className="block rounded-lg px-4 py-3 hover:bg-cyan-500/10 hover:text-cyan-400 transition"
            onClick={() => setOpen(false)}
          >
            About
          </a>
        </li>

        <li>
          <a
            href="#feedback"
            className="block rounded-lg px-4 py-3 hover:bg-cyan-500/10 hover:text-cyan-400 transition"
            onClick={() => setOpen(false)}
          >
            Feedback
          </a>
        </li>

        <li>
          <a
            href="#question"
            className="block rounded-lg px-4 py-3 hover:bg-cyan-500/10 hover:text-cyan-400 transition"
            onClick={() => setOpen(false)}
          >
            F&Q
          </a>
        </li>

        <li>
          <a
            href="#contact"
            className="block rounded-lg px-4 py-3 hover:bg-cyan-500/10 hover:text-cyan-400 transition"
            onClick={() => setOpen(false)}
          >
            Contact Us
          </a>
        </li>
      </ul>

      {/* Mobile Buttons */}
      <div className="mt-6 flex flex-col gap-3">
        

        <SignedOut>
          <SignInButton>
            <Button className="w-full">Sign In</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  </div>
      </header>
    );
  }
