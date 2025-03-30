
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Find Your Perfect{" "}
              <span className="text-primary">Product Design</span> Role in NYC
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Curated job listings for product designers in New York City, all in one place.
            </p>
          </div>
          <div>
            <Button asChild size="lg">
              <a href="#jobs">Browse Jobs</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
