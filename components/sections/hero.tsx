import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Link2, TestTube } from "lucide-react";
import Link from "next/link";
import { ROUTE } from "@/constants/route";

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-6">
            <Badge variant="outline" className="mx-auto">
              <Zap className="w-3 h-3 mr-1" />
              API Testing Revolution
            </Badge>
            <div className="space-y-4">
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl/none">
                <span className="text-blue-600">Chain API</span>
              </h1>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 max-w-4xl mx-auto">
                Test Complex API Flows
                <br />
                Visually & Effortlessly
              </h2>
            </div>
            <p className="mx-auto max-w-2xl text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
              Chain API transforms how developers and testers validate complex
              API workflows. Move beyond single endpoint testing to
              comprehensive flow validation with visual dependency mapping.
            </p>
          </div>
          <div className="flex justify-center">
            <Link href={ROUTE.BUILDER}>
              <Button size="lg" className="h-14 px-10 text-lg font-semibold">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium pt-4">
            <div className="flex items-center">
              <Link2 className="w-4 h-4 mr-1" />
              Chain APIs
            </div>
            <div className="flex items-center">
              <TestTube className="w-4 h-4 mr-1" />
              Visual Testing
            </div>
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1" />
              Fast Results
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
