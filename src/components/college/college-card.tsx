import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Award, Bookmark } from "lucide-react";
import { College } from "@/types";

interface CollegeProps {
  college: College;
  onSave?: (id: string) => void;
  saved?: boolean;
}

export function CollegeCard({ college, onSave, saved }: CollegeProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row w-full bg-card border-border/60">
      {/* Left side: Image */}
      <div 
        className="h-56 sm:h-auto sm:w-72 shrink-0 bg-cover bg-center relative group"
        style={{ backgroundImage: `url(${college.image})` }}
      >
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <Button variant="secondary" asChild>
            <Link href={`/college/${college.id}`}>View</Link>
          </Button>
          {onSave && (
            <Button variant={saved ? "default" : "secondary"} size="icon" onClick={() => onSave(college.id)}>
              <Bookmark className={`h-4 w-4 ${saved ? "fill-white" : ""}`} />
            </Button>
          )}
        </div>
      </div>

      {/* Right side: Content */}
      <div className="flex flex-col flex-1">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl font-bold leading-tight">
                <Link href={`/college/${college.id}`} className="hover:text-primary transition-colors">
                  {college.name}
                </Link>
              </CardTitle>
              <CardDescription className="flex items-center mt-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1 text-primary" />
                {college.location}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge variant="secondary" className="flex items-center gap-1.5 px-2.5 py-1 text-sm font-bold shadow-sm">
                <Award className="h-4 w-4 fill-primary text-primary" />
                {college.rating} / 5
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 pb-4">
          <div className="grid grid-cols-2 gap-4 max-w-md bg-muted/30 p-4 rounded-lg border border-border/50">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Average Package</p>
              <p className="font-bold text-primary text-lg">₹{(college.averagePackage / 100000).toFixed(1)} LPA</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Yearly Fees</p>
              <p className="font-bold text-lg">₹{(college.fees / 100000).toFixed(1)} L</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 justify-end border-t border-border/50 mt-auto px-6 py-4 bg-muted/10">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onSave && (
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-none"
                onClick={() => onSave(college.id)}
              >
                <Bookmark className={`mr-2 h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} />
                {saved ? "Saved" : "Save"}
              </Button>
            )}
            <Button className="flex-1 sm:flex-none" asChild>
              <Link href={`/college/${college.id}`}>Explore Details</Link>
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
