import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Award, Mail, BookOpen, IndianRupee, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

async function getCollege(id: string) {
  const college = await prisma.college.findUnique({
    where: { id },
    include: {
      courses: true,
      reviews: {
        include: {
          user: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!college) notFound();
  return college;
}

export default async function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const college = await getCollege(id);

  return (
    <div className="flex-1 bg-muted/20">
      {/* Header / Hero */}
      <div className="bg-background border-b">
        <div 
          className="h-64 md:h-80 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${college.image})` }}
        >
          <div className="w-full h-full bg-black/60 flex items-end">
            <div className="container mx-auto px-4 pb-8 pt-20">
              <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
                <div className="space-y-4 text-white">
                  <Badge className="bg-primary/80 hover:bg-primary/90 text-primary-foreground border-none">
                    Top Rated College
                  </Badge>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{college.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm md:text-base">
                    <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {college.location}</span>
                    <span className="flex items-center text-yellow-400"><Award className="h-4 w-4 mr-1" /> {college.rating} Rating</span>
                    <span className="flex items-center"><Mail className="h-4 w-4 mr-1" /> {college.contactEmail}</span>
                  </div>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                  <Button size="lg" className="w-full md:w-auto">Apply Now</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent space-x-6">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3">Overview</TabsTrigger>
                <TabsTrigger value="courses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3">Courses</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3">Reviews ({college.reviews.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="mt-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">About {college.name}</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {college.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="courses" className="mt-6 space-y-4">
                <h3 className="text-2xl font-bold mb-4">Courses Offered</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {college.courses.map((course) => (
                    <Card key={course.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center justify-between">
                          {course.courseName}
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                        </CardTitle>
                        <CardDescription>Duration: {course.duration}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="font-semibold text-primary">₹{(course.fees / 100000).toFixed(2)} Lakhs / year</p>
                      </CardContent>
                    </Card>
                  ))}
                  {college.courses.length === 0 && (
                    <p className="text-muted-foreground">No courses information available.</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Student Reviews</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">{college.rating}</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(college.rating) ? 'fill-current' : 'text-muted'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {college.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{review.user.name}</CardTitle>
                            <CardDescription>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</CardDescription>
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {review.rating} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                  {college.reviews.length === 0 && (
                    <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar / Placement Stats */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Placement Statistics
                </CardTitle>
                <CardDescription>Recent year placement highlights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Highest Package</p>
                  <p className="text-3xl font-bold text-green-600 flex items-center">
                    <IndianRupee className="h-6 w-6 mr-1" />
                    {(college.highestPackage / 100000).toFixed(1)} LPA
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Average Package</p>
                  <p className="text-2xl font-bold flex items-center">
                    <IndianRupee className="h-5 w-5 mr-1 text-muted-foreground" />
                    {(college.averagePackage / 100000).toFixed(1)} LPA
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Average Yearly Fees</p>
                  <p className="text-xl font-semibold flex items-center">
                    <IndianRupee className="h-5 w-5 mr-1" />
                    {(college.fees / 100000).toFixed(1)} L
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
