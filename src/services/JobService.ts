
import { Job, JobFilter } from "@/types/job";
import { supabase } from "@/integrations/supabase/client";

export const JobService = {
  getJobs: async (): Promise<Job[]> => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('date_posted', { ascending: false });
      
      if (error) {
        console.error("Error fetching jobs:", error);
        return [];
      }
      
      return data.map(job => ({
        id: job.id,
        company: job.company,
        title: job.title,
        location: job.location,
        url: job.url,
        description: job.description,
        datePosted: job.date_posted ? new Date(job.date_posted).toISOString() : new Date().toISOString(),
        logoUrl: job.logo_url,
        source: job.source
      }));
    } catch (error) {
      console.error("Error in getJobs:", error);
      return [];
    }
  },

  searchJobs: async (term: string, location: string): Promise<Job[]> => {
    try {
      let query = supabase.from('jobs').select('*');
      
      // Apply search filters if provided
      if (term) {
        query = query.or(`company.ilike.%${term}%,title.ilike.%${term}%,description.ilike.%${term}%`);
      }
      
      if (location) {
        query = query.ilike('location', `%${location}%`);
      }
      
      // Get jobs from the last 30 days specifically
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      query = query.or(`date_posted.gte.${thirtyDaysAgo.toISOString()},date_posted.is.null`)
                   .order('date_posted', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error searching jobs:", error);
        return [];
      }
      
      return data.map(job => ({
        id: job.id,
        company: job.company,
        title: job.title,
        location: job.location,
        url: job.url,
        description: job.description,
        datePosted: job.date_posted ? new Date(job.date_posted).toISOString() : new Date().toISOString(),
        logoUrl: job.logo_url,
        source: job.source
      }));
    } catch (error) {
      console.error("Error in searchJobs:", error);
      return [];
    }
  },

  // Function to set up the scheduled crawler
  setupDailyCrawler: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await supabase.functions.invoke('schedule-daily-crawl');
      
      if (!response.data) {
        return {
          success: false,
          message: "Failed to set up daily crawler. No response from server."
        };
      }
      
      return response.data as { success: boolean; message: string };
    } catch (error) {
      console.error("Error in setupDailyCrawler:", error);
      return {
        success: false,
        message: `Failed to set up daily crawler: ${error.message}`
      };
    }
  },

  // Function to manually trigger the crawler for all configured websites
  runCrawler: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await supabase.functions.invoke('daily-job-crawler');
      
      if (!response.data) {
        return {
          success: false,
          message: "Failed to run crawler. No response from server."
        };
      }
      
      return response.data as { success: boolean; message: string };
    } catch (error) {
      console.error("Error in runCrawler:", error);
      return {
        success: false,
        message: `Failed to run crawler: ${error.message}`
      };
    }
  }
};
