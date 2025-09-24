import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Workflow,
  Zap,
  BarChart3,
  Shield,
  Code,
  Users,
  Timer,
  Database,
  PlayCircle
} from "lucide-react"

export function KeyFeatures() {
  const features = [
    {
      icon: Workflow,
      title: "Visual Flow Designer",
      description: "Drag-and-drop interface to create complex API testing workflows without writing code.",
      category: "Design"
    },
    {
      icon: Database,
      title: "Smart Data Passing",
      description: "Automatically extract and pass data between API calls with intelligent variable mapping.",
      category: "Automation"
    },
    {
      icon: PlayCircle,
      title: "One-Click Execution",
      description: "Run entire API workflows with a single click and watch them execute in real-time.",
      category: "Execution"
    },
    {
      icon: BarChart3,
      title: "Performance Insights",
      description: "Detailed metrics on response times, success rates, and bottlenecks in your API flows.",
      category: "Analytics"
    },
    {
      icon: Shield,
      title: "Error Handling",
      description: "Built-in error handling with retry logic and conditional branching for robust testing.",
      category: "Reliability"
    },
    {
      icon: Code,
      title: "Custom Assertions",
      description: "Define custom validation rules and assertions for complex business logic testing.",
      category: "Validation"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share and collaborate on API testing scenarios with your development team.",
      category: "Teamwork"
    },
    {
      icon: Timer,
      title: "Scheduled Testing",
      description: "Automate your API flow tests to run on schedules for continuous validation.",
      category: "Automation"
    },
    {
      icon: Zap,
      title: "Fast Execution",
      description: "Parallel execution of independent API calls for lightning-fast test completion.",
      category: "Performance"
    }
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      Design: "bg-purple-100 text-purple-800",
      Automation: "bg-green-100 text-green-800",
      Execution: "bg-blue-100 text-blue-800",
      Analytics: "bg-orange-100 text-orange-800",
      Reliability: "bg-red-100 text-red-800",
      Validation: "bg-yellow-100 text-yellow-800",
      Teamwork: "bg-pink-100 text-pink-800",
      Performance: "bg-indigo-100 text-indigo-800"
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl mb-6">
            Powerful Features for
            <br />
            <span className="text-blue-600 font-extrabold">Modern API Testing</span>
          </h2>
          <p className="mx-auto max-w-3xl text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
            Everything you need to test complex API workflows effectively and efficiently.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <Badge className={getCategoryColor(feature.category)} variant="secondary">
                      {feature.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-bold leading-tight">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}