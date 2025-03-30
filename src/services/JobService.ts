
import { Job } from "@/types/job";

// Mock data to start with
const INITIAL_JOBS: Job[] = [
  {
    id: "1",
    company: "Figma",
    title: "Senior Product Designer",
    location: "New York, NY",
    url: "https://www.figma.com/careers",
    description: "Join our team to help shape the future of design tools",
    datePosted: "2023-10-15",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/figma-1.svg",
    source: "Company Website"
  },
  {
    id: "2",
    company: "Google",
    title: "UX Designer",
    location: "New York, NY",
    url: "https://careers.google.com/jobs/results/",
    description: "Design user experiences for Google's next generation products",
    datePosted: "2023-10-10",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/google-icon.svg",
    source: "LinkedIn"
  },
  {
    id: "3",
    company: "Airbnb",
    title: "Product Designer",
    location: "New York, NY",
    url: "https://careers.airbnb.com/",
    description: "Create meaningful experiences for travelers around the world",
    datePosted: "2023-10-05",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/airbnb-1.svg",
    source: "Indeed"
  },
  {
    id: "4",
    company: "Spotify",
    title: "Senior Product Designer",
    location: "New York, NY",
    url: "https://www.spotifyjobs.com/",
    description: "Help reimagine the audio experience for millions of users",
    datePosted: "2023-09-28",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/spotify-1.svg",
    source: "Company Website"
  },
  {
    id: "5",
    company: "Meta",
    title: "Product Designer, AR/VR",
    location: "New York, NY",
    url: "https://www.metacareers.com/",
    description: "Design the next generation of mixed reality experiences",
    datePosted: "2023-09-20",
    logoUrl: "https://cdn.worldvectorlogo.com/logos/meta-1.svg",
    source: "Glassdoor"
  }
];

// Save jobs to localStorage
const saveJobs = (jobs: Job[]) => {
  localStorage.setItem('designJobs', JSON.stringify(jobs));
};

// Load jobs from localStorage or use initial data
const loadJobs = (): Job[] => {
  const saved = localStorage.getItem('designJobs');
  return saved ? JSON.parse(saved) : INITIAL_JOBS;
};

export const JobService = {
  getJobs: (): Job[] => {
    return loadJobs();
  },

  addJob: (job: Omit<Job, "id">): Job => {
    const jobs = loadJobs();
    const newJob = {
      ...job,
      id: Date.now().toString(),
    };
    
    const updatedJobs = [newJob, ...jobs];
    saveJobs(updatedJobs);
    return newJob;
  },

  searchJobs: (term: string, location: string): Job[] => {
    const jobs = loadJobs();
    const searchTermLower = term.toLowerCase();
    const locationLower = location.toLowerCase();
    
    return jobs.filter(job => {
      const matchesTerm = !term || 
        job.title.toLowerCase().includes(searchTermLower) || 
        job.company.toLowerCase().includes(searchTermLower) || 
        (job.description && job.description.toLowerCase().includes(searchTermLower));
      
      const matchesLocation = !location || job.location.toLowerCase().includes(locationLower);
      
      return matchesTerm && matchesLocation;
    });
  },

  // Simulated crawl function - in a real app, this would connect to a backend
  crawlWebsite: async (url: string): Promise<{ success: boolean; message: string }> => {
    // In a real implementation, this would send the URL to a backend service
    console.log("Crawling website:", url);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For demo purposes, always return success
    return {
      success: true,
      message: "Website crawled successfully. Any job listings found will be added."
    };
  }
};
