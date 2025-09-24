import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, Clock, Bug, Target } from "lucide-react"

export function ProblemStatement() {
  const problems = [
    {
      icon: AlertTriangle,
      title: "Fragmented Testing",
      description: "Testing each API endpoint in isolation misses critical integration points and workflow dependencies."
    },
    {
      icon: Clock,
      title: "Time-Consuming Process",
      description: "Manual testing of complex API flows requires jumping between tools, slowing down development cycles."
    },
    {
      icon: Bug,
      title: "Late Error Discovery",
      description: "Integration bugs are discovered late in the development cycle when they're expensive to fix."
    },
    {
      icon: Target,
      title: "Poor Visibility",
      description: "Lack of visual representation makes it hard to understand and validate complex business workflows."
    }
  ]

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl mb-6">
            The API Testing Challenge
          </h2>
          <p className="mx-auto max-w-3xl text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
            Traditional API testing tools focus on individual endpoints, leaving complex workflows untested and vulnerable.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {problems.map((problem, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <problem.icon className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">{problem.title}</h3>
                      <p className="text-gray-600 font-medium leading-relaxed">{problem.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}