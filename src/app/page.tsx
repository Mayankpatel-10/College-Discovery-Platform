import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Award, BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CollegeCard } from "@/components/college/college-card";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function getFeaturedColleges() {
  try {
    return await prisma.college.findMany({
      take: 3,
      orderBy: { rating: 'desc' },
      include: { courses: true }
    });
  } catch (e) {
    console.error("Failed to fetch featured colleges:", e);
    return [];
  }
}

export default async function Home() {
  const featuredColleges = await getFeaturedColleges();

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-muted/40 py-20 md:py-32">
        <div className="container px-4 mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto">
            Find the Best College for Your Future
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover, compare, and apply to thousands of colleges across the country. Your journey starts here.
          </p>
          
          <div className="max-w-xl mx-auto relative mt-8">
            <form action="/colleges" className="flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                name="search"
                type="text" 
                placeholder="Search by college name..." 
                className="pl-10 pr-24 h-14 text-lg rounded-full"
              />
              <Button type="submit" size="lg" className="absolute right-1 top-1 bottom-1 rounded-full px-6">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Location Based</h3>
              <p className="text-muted-foreground">Find top colleges near you or in your dream city across the country.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Top Rated</h3>
              <p className="text-muted-foreground">Discover colleges with the best placement records and student reviews.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Diverse Courses</h3>
              <p className="text-muted-foreground">Explore thousands of courses spanning engineering, management, and more.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Colleges Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Top Rated Colleges</h2>
              <p className="text-muted-foreground">Explore some of our highest-rated institutions.</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/colleges">View All</Link>
            </Button>
          </div>

          <div className="flex flex-col space-y-6">
            {featuredColleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
            
            {featuredColleges.length === 0 && (
              <div className="col-span-3 text-center py-12 text-muted-foreground">
                No colleges found. Please seed the database.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
