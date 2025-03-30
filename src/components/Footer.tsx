
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with <Heart className="inline-block h-4 w-4 text-red-500" /> for a special designer
        </p>
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-right">
          &copy; {new Date().getFullYear()} DesignHuntNYC
        </p>
      </div>
    </footer>
  );
}
