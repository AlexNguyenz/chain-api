import { Hero } from "@/components/sections/hero"
import { ProblemStatement } from "@/components/sections/problem-statement"
import { SolutionOverview } from "@/components/sections/solution-overview"
import { KeyFeatures } from "@/components/sections/key-features"
import { CallToAction } from "@/components/sections/cta"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <ProblemStatement />
      <SolutionOverview />
      <KeyFeatures />
      <CallToAction />
    </div>
  );
}
