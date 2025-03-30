
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import './App.css';
import { JobService } from './services/JobService';
import { Toaster } from './components/ui/sonner';

function App() {
  useEffect(() => {
    // Setup the daily job crawler when the app loads
    // This only needs to happen once to set up the cron job
    const setupCronJob = async () => {
      try {
        const result = await JobService.setupDailyCrawler();
        if (result.success) {
          console.log("Daily job crawler scheduled successfully:", result.message);
        } else {
          console.error("Failed to schedule daily job crawler:", result.message);
        }
      } catch (error) {
        console.error("Error setting up daily job crawler:", error);
      }
    };
    
    setupCronJob();
    
    // Also run the crawler once immediately to get initial data
    const runInitialCrawl = async () => {
      try {
        console.log("Running initial job crawl...");
        await JobService.runCrawler();
      } catch (error) {
        console.error("Error running initial job crawl:", error);
      }
    };
    
    // Run initial crawl with a short delay to ensure database is ready
    setTimeout(runInitialCrawl, 2000);
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
