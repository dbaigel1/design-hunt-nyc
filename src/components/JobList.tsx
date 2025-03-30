
import { useState, useEffect } from "react";
import { Job, JobFilter } from "@/types/job";
import { JobCard } from "@/components/JobCard";
import { JobService } from "@/services/JobService";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface JobListProps {
  filter: JobFilter;
}

export function JobList({ filter }: JobListProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const filteredJobs = await JobService.searchJobs(
          filter.searchTerm,
          filter.location
        );
        setJobs(filteredJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load job listings. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    // Add a small delay for better UX
    const timer = setTimeout(() => {
      fetchJobs();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filter.searchTerm, filter.location, toast]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No jobs found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your search filters or add more job listings
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

function JobCardSkeleton() {
  return (
    <div className="border rounded-lg p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-9 w-full rounded-md" />
    </div>
  );
}
