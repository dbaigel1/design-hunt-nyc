
export interface Job {
  id: string;
  company: string;
  title: string;
  location: string;
  url: string;
  description?: string;
  datePosted: string;
  logoUrl?: string;
  source?: string;
}

export interface JobFilter {
  searchTerm: string;
  location: string;
}
