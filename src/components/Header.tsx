
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-6 w-6 text-primary"
          >
            <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
          </svg>
          <span className="text-xl font-bold">DesignHuntNYC</span>
        </div>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <a href="#jobs">Jobs</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="#add-jobs">Add Jobs</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#about">About</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
