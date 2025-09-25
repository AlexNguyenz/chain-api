"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ShoppingCart,
  User,
  Mail,
  Database,
  Shield,
  Clock,
  BarChart,
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  category: "auth" | "crud" | "email" | "payment" | "analytics" | "workflow";
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  endpoints: number;
}

const templates: Template[] = [
  {
    id: "auth-template",
    name: "Authentication Flow",
    category: "auth",
    description: "Complete authentication with JWT",
    icon: Shield,
    endpoints: 5,
  },
  {
    id: "crud-template",
    name: "CRUD Operations",
    category: "crud",
    description: "Basic Create, Read, Update, Delete",
    icon: Database,
    endpoints: 4,
  },
  {
    id: "email-template",
    name: "Email Service",
    category: "email",
    description: "Send and manage emails",
    icon: Mail,
    endpoints: 3,
  },
  {
    id: "payment-template",
    name: "Payment Gateway",
    category: "payment",
    description: "Process payments with Stripe",
    icon: ShoppingCart,
    endpoints: 6,
  },
  {
    id: "user-template",
    name: "User Management",
    category: "crud",
    description: "User profile and settings",
    icon: User,
    endpoints: 7,
  },
  {
    id: "analytics-template",
    name: "Analytics Dashboard",
    category: "analytics",
    description: "Track and analyze data",
    icon: BarChart,
    endpoints: 8,
  },
  {
    id: "workflow-template",
    name: "Workflow Automation",
    category: "workflow",
    description: "Automate business processes",
    icon: Clock,
    endpoints: 10,
  },
  {
    id: "blog-template",
    name: "Blog System",
    category: "crud",
    description: "Blog posts and comments",
    icon: FileText,
    endpoints: 9,
  },
];

const categoryColors = {
  auth: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  crud: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  email: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  payment:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
  analytics: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
  workflow:
    "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
};

export function TemplateList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTemplates = templates.filter(
    (template) =>
      (template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) &&
      (!selectedCategory || template.category === selectedCategory)
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 space-y-3">
        <h2 className="text-lg font-semibold">Templates</h2>
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Separator />
      </div>

      <ScrollArea className="flex-1 h-0">
        <div className="p-4 space-y-3">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <Card
                key={template.id}
                className="group hover:shadow-md transition-shadow"
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{template.name}</span>
                        <Badge className={categoryColors[template.category]}>
                          {template.category}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {template.description}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {template.endpoints} endpoints
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
