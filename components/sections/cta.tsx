import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTE } from "@/constants/route";
import { ArrowRight, Rocket, CheckCircle } from "lucide-react";
import Link from "next/link";

export function CallToAction() {
  const benefits = [
    "Visual API flow testing",
    "Drag-and-drop workflow builder",
    "Real-time execution monitoring",
    "Smart data dependency handling",
  ];

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 md:p-12 lg:p-16">
              <div className="text-center space-y-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                  <Rocket className="w-8 h-8 text-blue-600" />
                </div>

                <div className="space-y-6">
                  <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                    Ready to Transform Your
                    <br />
                    <span className="text-blue-600 font-extrabold">
                      API Testing?
                    </span>
                  </h2>

                  <p className="mx-auto max-w-2xl text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
                    Join developers who have revolutionized their API testing
                    workflow with Chain API&apos;s visual approach to complex
                    flow validation.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto py-6">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-600 font-medium">
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center pt-4">
                  <Link href={ROUTE.BUILDER}>
                    <Button
                      size="lg"
                      className="h-14 px-10 text-lg font-semibold"
                    >
                      Get Started Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
