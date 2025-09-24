import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Workflow, Eye, GitBranch, CheckCircle2 } from "lucide-react"

export function SolutionOverview() {
  const solutions = [
    {
      icon: Workflow,
      title: "Visual Flow Builder",
      description: "Create complex API testing scenarios using an intuitive drag-and-drop interface.",
      badge: "Visual"
    },
    {
      icon: GitBranch,
      title: "Dependency Mapping",
      description: "Automatically handle data dependencies between API calls with intelligent variable passing.",
      badge: "Smart"
    },
    {
      icon: Eye,
      title: "Real-time Monitoring",
      description: "Watch your API flows execute in real-time with detailed logs and performance metrics.",
      badge: "Live"
    },
    {
      icon: CheckCircle2,
      title: "Comprehensive Validation",
      description: "Test entire business workflows instead of isolated endpoints for complete coverage.",
      badge: "Complete"
    }
  ]

  return (
    <section className="w-full py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-6">
            <Workflow className="w-3 h-3 mr-1" />
            The Chain API Solution
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl mb-6">
            Test API Flows,
            <br />
            <span className="text-blue-600 font-extrabold">Not Just Endpoints</span>
          </h2>
          <p className="mx-auto max-w-3xl text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
            Chain API provides a powerful, visual approach to testing complex API workflows with intelligent dependency management and real-time monitoring.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {solutions.map((solution, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <solution.icon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold">{solution.title}</h3>
                        <Badge variant="secondary" className="ml-2 flex-shrink-0">
                          {solution.badge}
                        </Badge>
                      </div>
                      <p className="text-gray-600 font-medium leading-relaxed">{solution.description}</p>
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