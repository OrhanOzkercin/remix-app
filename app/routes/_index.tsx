import type { MetaFunction } from "@remix-run/node";
import { Button } from "~/components/ui/button";
import { Keyboard, ArrowRight } from "lucide-react";
import { AnimatedBackground } from "~/components/animated-background";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "TypeSpeed - Test Your Typing Speed" },
    { name: "description", content: "Test and improve your typing speed with real-time feedback" },
  ];
};

export default function Index() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden">
      <AnimatedBackground />
      
      {/* Main Content */}
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <div className="text-center space-y-8 max-w-2xl">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-4 ring-1 ring-primary/20 relative">
                <Keyboard className="h-10 w-10 text-primary rotate-[-10deg] transform" />
                <div className="absolute -inset-0.5 bg-primary/10 blur-sm rounded-full" />
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="font-mono text-4xl sm:text-5xl font-bold tracking-tight">
                Test Your{" "}
                <span className="text-primary relative">
                  Typing Speed
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/30 blur-sm" />
                </span>
              </h1>
              <p className="font-mono text-lg text-muted-foreground tracking-wide">
                Challenge yourself with a <span className="text-primary">one-minute</span> typing
                test
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link to="/test">
                <Button size="lg" className="font-mono text-base tracking-wide group relative">
                  <span className="relative z-10">Start Typing Test</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 relative z-10" />
                  <div className="absolute inset-0 bg-primary/10 blur group-hover:bg-primary/20 transition-colors" />
                </Button>
              </Link>
            </div>

            {/* Stats Preview */}
            <div className="pt-8 flex justify-center gap-8 text-muted-foreground">
              <div className="space-y-1 font-mono relative">
                <p className="text-3xl font-bold text-foreground">60</p>
                <p className="text-xs uppercase tracking-widest">seconds</p>
              </div>
              <div className="space-y-1 font-mono">
                <p className="text-3xl font-bold text-foreground">WPM</p>
                <p className="text-xs uppercase tracking-widest">speed</p>
              </div>
              <div className="space-y-1 font-mono">
                <p className="text-3xl font-bold text-foreground">%</p>
                <p className="text-xs uppercase tracking-widest">accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
