import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, Bell, Archive, Send, GraduationCap, Users } from "lucide-react";

const features = [
  { icon: Newspaper, title: "Newsletter Publishing", desc: "Faculty publish categorized updates for the entire department." },
  { icon: Send, title: "Project Submissions", desc: "Students submit recognized projects for faculty approval." },
  { icon: Bell, title: "Instant Notifications", desc: "Get notified on new updates, approvals, and feedback." },
  { icon: Archive, title: "Digital Archive", desc: "Search, filter, and browse the complete newsletter history." },
  { icon: GraduationCap, title: "Student Achievements", desc: "Showcase approved projects and accomplishments." },
  { icon: Users, title: "Faculty Review", desc: "Streamlined approval workflow with feedback." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">DeptNews</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Department Newsletter
          <br />
          <span className="text-primary">Management System</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          A centralized platform for department communication. Faculty post updates, students stay informed, and project submissions flow through an organized approval workflow.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/signup">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">Log In</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container pb-20">
        <h2 className="mb-10 text-center text-2xl font-bold">Key Features</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="flex gap-4 p-6">
                <f.icon className="h-10 w-10 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2026 DeptNews — Department Newsletter Management System
      </footer>
    </div>
  );
}
