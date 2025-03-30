
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    
    // Set up a PostgreSQL cron job to run the daily-job-crawler function at 3 AM daily
    // First, we need to enable the required extensions if they aren't already
    const { error: extensionError } = await supabase.rpc('setup_cron_extensions');
    
    if (extensionError) {
      console.error("Error setting up extensions:", extensionError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Failed to set up required extensions: ${extensionError.message}` 
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
    
    // Prepare the SQL to create a cron job
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)/)?.[1];
    const cronSql = `
    SELECT cron.schedule(
      'daily-job-crawler',  -- unique name for the job
      '0 3 * * *',         -- run at 3 AM every day (cron syntax)
      $$
      SELECT net.http_post(
        url:='https://${projectRef}.supabase.co/functions/v1/daily-job-crawler',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer ${supabaseAnonKey}"}'::jsonb,
        body:='{}'::jsonb
      ) AS request_id;
      $$
    );`;
    
    // Execute the SQL to schedule the cron job
    const { error: cronError } = await supabase.rpc('setup_daily_crawl_job', { 
      cron_sql: cronSql,
      project_ref: projectRef || '',
      anon_key: supabaseAnonKey
    });
    
    if (cronError) {
      console.error("Error scheduling cron job:", cronError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Failed to schedule cron job: ${cronError.message}` 
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
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Daily job crawler scheduled successfully to run at 3 AM daily."
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  } catch (error) {
    console.error("Error in schedule-daily-crawl function:", error);
    
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
