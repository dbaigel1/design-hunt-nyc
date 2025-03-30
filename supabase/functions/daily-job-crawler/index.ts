import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// List of websites to crawl for job listings
const WEBSITES_TO_CRAWL = [
  'https://www.designjobs.nyc',
  'https://www.linkedin.com/jobs/product-designer-jobs-new-york',
  'https://www.indeed.com/q-product-designer-l-new-york-ny-jobs.html',
  'https://www.glassdoor.com/Job/new-york-product-designer-jobs-SRCH_IL.0,8_IC1132348_KO9,25.htm',
  'https://www.behance.net/joblist?field=product%20design&location=New%20York',
  'https://dribbble.com/jobs?location=New%20York'
];

// Simple function to extract date from various formats
const extractDate = (text: string): Date | null => {
  // Match patterns like "Posted 3 days ago", "Posted on July 15, 2023", etc.
  const daysAgoMatch = text.match(/(\d+)\s+days?\s+ago/i);
  if (daysAgoMatch) {
    const daysAgo = parseInt(daysAgoMatch[1]);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  }
  
  // Try standard date parsing
  const date = new Date(text);
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  return null;
};

// Basic URL extraction from text
const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

// Function to crawl a website for job listings
async function crawlWebsite(url: string, supabase: any) {
  console.log(`Starting to crawl: ${url}`);
  
  try {
    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      return { success: false, message: `Failed to fetch ${url}` };
    }
    
    const html = await response.text();
    
    // Parse company name from URL
    const urlObj = new URL(url);
    const companyDomain = urlObj.hostname.replace('www.', '').split('.')[0];
    const companyName = companyDomain.charAt(0).toUpperCase() + companyDomain.slice(1);
    
    // Look for product designer job listings
    const jobListings = [];
    
    // Simple regex-based extraction - could be improved with a proper HTML parser
    const designerRegex = /product\s+designer|ux\s+designer|ui\s+designer/gi;
    const nyRegex = /new\s+york|nyc|ny\b/gi;
    
    // Find all job titles and their surrounding context
    const jobTitleMatches = html.match(/<h\d[^>]*>([^<]*(?:job|position|career|opening)[^<]*)<\/h\d>/gi) || [];
    
    for (const titleMatch of jobTitleMatches) {
      if (designerRegex.test(titleMatch) && nyRegex.test(html)) {
        // Extract job title
        const titleText = titleMatch.replace(/<\/?[^>]+(>|$)/g, "").trim();
        
        // Find nearby text that might contain a date (within 500 chars)
        const titleIndex = html.indexOf(titleMatch);
        const surroundingText = html.substring(
          Math.max(0, titleIndex - 500), 
          Math.min(html.length, titleIndex + titleMatch.length + 500)
        );
        
        // Try to extract a date
        const dateText = surroundingText.match(/posted\s+(?:on\s+)?([^<]+)/i);
        const datePosted = dateText ? extractDate(dateText[1]) : null;
        
        // Only include jobs posted in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        if (!datePosted || datePosted >= thirtyDaysAgo) {
          // Extract job URL
          const jobUrls = extractUrls(surroundingText);
          let jobUrl = url; // Default to the main URL
          
          // Find a URL that likely points to the job listing
          for (const extractedUrl of jobUrls) {
            if (extractedUrl.includes('job') || extractedUrl.includes('career') || extractedUrl.includes('position')) {
              jobUrl = extractedUrl;
              break;
            }
          }
          
          // Create job listing
          jobListings.push({
            company: companyName,
            title: titleText,
            location: "New York, NY",
            url: jobUrl,
            description: surroundingText.substring(0, 200) + "...", // Brief description
            date_posted: datePosted,
            source: "Automated Crawler",
          });
        }
      }
    }
    
    console.log(`Found ${jobListings.length} potential job listings on ${url}`);
    
    // Store job listings in database
    let newJobsAdded = 0;
    if (jobListings.length > 0) {
      for (const job of jobListings) {
        // Check if the job already exists (by URL)
        const { data: existingJobs } = await supabase
          .from('jobs')
          .select('id')
          .eq('url', job.url)
          .limit(1);
          
        if (!existingJobs || existingJobs.length === 0) {
          // Insert new job
          const { error } = await supabase
            .from('jobs')
            .insert([job]);
            
          if (error) {
            console.error("Error inserting job:", error);
          } else {
            newJobsAdded++;
          }
        }
      }
    }
    
    return { 
      success: true, 
      message: `Crawled ${url} and found ${jobListings.length} jobs. Added ${newJobsAdded} new listings.`,
      jobsFound: jobListings.length,
      newJobsAdded
    };
  } catch (error) {
    console.error(`Error crawling ${url}:`, error);
    return { 
      success: false, 
      message: `Error crawling ${url}: ${error.message}`,
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Parse request body
    let requestBody = {};
    let specificWebsite = null;
    
    try {
      if (req.method === 'POST') {
        requestBody = await req.json();
        specificWebsite = requestBody?.url;
      }
    } catch (e) {
      // If parsing fails, just continue with default websites
      console.log("No specific website provided or invalid JSON");
    }
    
    const results = [];
    
    // If a specific website is provided, only crawl that one
    if (specificWebsite) {
      const result = await crawlWebsite(specificWebsite, supabase);
      results.push({ website: specificWebsite, ...result });
    } else {
      // Otherwise crawl all websites in the list
      for (const website of WEBSITES_TO_CRAWL) {
        const result = await crawlWebsite(website, supabase);
        results.push({ website, ...result });
      }
    }
    
    // Count total stats
    const totalJobsFound = results.reduce((sum, result) => sum + (result.jobsFound || 0), 0);
    const totalNewJobsAdded = results.reduce((sum, result) => sum + (result.newJobsAdded || 0), 0);
    const successfulCrawls = results.filter(r => r.success).length;
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Crawled ${results.length} websites. Found ${totalJobsFound} jobs, added ${totalNewJobsAdded} new listings.`,
        details: results,
        stats: {
          totalWebsites: results.length,
          successfulCrawls,
          totalJobsFound,
          totalNewJobsAdded
        }
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error in daily-job-crawler function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `An error occurred: ${error.message}` 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    );
  }
});
