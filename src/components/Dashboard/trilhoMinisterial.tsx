import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { stepsProcess } from "@/components/Sidebar/linkProcesses";
import { useSession } from "next-auth/react";

const ProcessSteps = () => {
  const { data: session } = useSession();
  const churchId = session?.user.churchId as string;
  const cemId = session?.user.cem._id as string;
  const firstHalf = stepsProcess({ churchId, cemId }).slice(0, 5);
  const secondHalf = stepsProcess({ churchId, cemId }).slice(5, 10);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Trilho Ministerial</h1>
                <p className="text-sm text-muted-foreground">Acompanhe sua rede</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* First Column */}
          <div className="space-y-6">
            {firstHalf.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connecting line */}
                {index < firstHalf.length - 1 && (
                  <div className="absolute left-5 top-12 w-0.5 h-12 bg-primary" />
                )}

                {/* Step card */}
                <Link href={step.link} className="block group">
                  <div
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border transition-all",
                      "hover:shadow-md hover:border-primary",
                      "bg-primary/5 border-primary/20"
                    )}
                  >
                    {/* Step icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>

                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          Etapa {step.order}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {step.name}
                      </h3>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="h-5 w-5 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Second Column */}
          <div className="space-y-6">
            {secondHalf.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connecting line */}
                {index < secondHalf.length - 1 && (
                  <div className="absolute left-5 top-12 w-0.5 h-12 bg-primary" />
                )}

                {/* Step card */}
                <Link href={step.link} className="block group">
                  <div
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border transition-all",
                      "hover:shadow-md hover:border-primary",
                      "bg-primary/5 border-primary/20"
                    )}
                  >
                    {/* Step icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>

                    {/* Step content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          Etapa {step.order}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {step.name}
                      </h3>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg
                        className="h-5 w-5 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProcessSteps;
