import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">CollegeDiscovery</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Your comprehensive platform for discovering, comparing, and applying to the best colleges.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/colleges" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  All Colleges
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Compare Colleges
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} CollegeDiscovery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
