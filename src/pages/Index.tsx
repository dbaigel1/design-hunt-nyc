
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { SearchForm } from "@/components/SearchForm";
import { JobList } from "@/components/JobList";
import { CrawlForm } from "@/components/CrawlForm";
import { JobFilter } from "@/types/job";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  const [filter, setFilter] = useState<JobFilter>({
    searchTerm: "",
    location: "New York, NY",
  });

  const handleSearch = (newFilter: JobFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />

        <section id="jobs" className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <div className="mb-10">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl mb-4">
                Product Design Jobs in NYC
              </h2>
              <p className="text-muted-foreground mb-6">
                Search through our curated list of product design opportunities in New York
              </p>
              <SearchForm onSearch={handleSearch} />
            </div>
            
            <JobList filter={filter} />
          </div>
        </section>

        <Separator />

        <section id="add-jobs" className="py-12 md:py-16 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl mb-4">
                  Add New Job Listings
                </h2>
                <p className="text-muted-foreground mb-4">
                  Know of a company hiring product designers in NYC? Add their website to our crawler to find and list their open positions.
                </p>
                <p className="text-muted-foreground">
                  Our system will automatically extract relevant job details and add them to our listings.
                </p>
              </div>
              <CrawlForm />
            </div>
          </div>
        </section>

        <About />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
