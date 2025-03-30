
import { Job } from "@/types/job";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Building, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <Card className="job-card overflow-hidden border border-muted/60 h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {job.logoUrl ? (
              <div className="w-10 h-10 rounded overflow-hidden bg-muted flex items-center justify-center">
                <img 
                  src={job.logoUrl} 
                  alt={`${job.company} logo`} 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/100x100/f6f6f7/a0a0a0?text=" + job.company.charAt(0);
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded bg-primary/10 text-primary flex items-center justify-center">
                {job.company.charAt(0)}
              </div>
            )}
            <div>
              <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Building className="h-3 w-3" /> {job.company}
              </CardDescription>
            </div>
          </div>
          {job.source && (
            <Badge variant="outline" className="text-xs bg-muted/30">
              {job.source}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground gap-1">
            <MapPin className="h-3.5 w-3.5" /> {job.location}
          </div>
          
          {job.description && (
            <p className="text-sm line-clamp-2 text-muted-foreground">
              {job.description}
            </p>
          )}
          
          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <Calendar className="h-3 w-3" /> Posted on {formatDate(job.datePosted)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button 
          asChild 
          variant="outline" 
          className="w-full gap-1 border-primary/20 text-primary hover:text-primary-foreground hover:bg-primary transition-all"
        >
          <a href={job.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" /> View Job
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
