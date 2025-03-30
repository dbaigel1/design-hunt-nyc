
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Search, Heart } from "lucide-react";

export function About() {
  return (
    <section id="about" className="py-12 md:py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              About DesignHuntNYC
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Created with love to help product designers find their dream job in the Big Apple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-5xl">
            <Card className="bg-background">
              <CardHeader className="pb-2">
                <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Job Discovery</CardTitle>
                <CardDescription>
                  Find the latest product design jobs in NYC, all in one place.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our website crawls company career pages and job boards to bring you the most up-to-date listings.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader className="pb-2">
                <Building className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Top Companies</CardTitle>
                <CardDescription>
                  Discover opportunities at leading companies in New York.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  From startups to established enterprises, find your next role at companies that value great design.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader className="pb-2">
                <Heart className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Made with Love</CardTitle>
                <CardDescription>
                  A personal project created to help someone special.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This site was built as a labor of love to help a talented product designer find their perfect role in NYC.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
