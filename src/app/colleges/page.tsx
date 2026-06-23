"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { CollegeCard } from "@/components/college/college-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, FilterX, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { College } from "@/types";
import * as apiClient from "@/lib/api-client";

export default function CollegesPage() {
  const { data: session } = useSession();
  
  const [colleges, setColleges] = useState<College[]>([]);
  const [savedColleges, setSavedColleges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [location, setLocation] = useState("all");
  const [sortBy, setSortBy] = useState("rating-desc");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const prevSearchRef = useRef(debouncedSearch);
  const prevLocationRef = useRef(location);
  const prevSortByRef = useRef(sortBy);

  useEffect(() => {
    const fetchSavedColleges = async () => {
      if (!session?.user?.id) return;
      try {
        const data = await apiClient.fetchSavedColleges();
        setSavedColleges(data.map((item) => item.collegeId));
      } catch (e) {
        console.error("Failed to fetch saved colleges:", e);
      }
    };
    fetchSavedColleges();
  }, [session]);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      });
      
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (location !== "all") params.append("location", location);
      
      if (sortBy) {
        const [sort, order] = sortBy.split("-");
        params.append("sortBy", sort);
        params.append("sortOrder", order);
      }

      const data = await apiClient.fetchColleges(params);
      setColleges(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load colleges. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, location, sortBy, page]);

  useEffect(() => {
    const filtersChanged = 
      debouncedSearch !== prevSearchRef.current ||
      location !== prevLocationRef.current ||
      sortBy !== prevSortByRef.current;

    prevSearchRef.current = debouncedSearch;
    prevLocationRef.current = location;
    prevSortByRef.current = sortBy;

    if (filtersChanged && page !== 1) {
      setPage(1);
      return;
    }

    fetchColleges();
  }, [debouncedSearch, location, sortBy, page, fetchColleges]);

  const handleSave = async (collegeId: string) => {
    if (!session) {
      toast.error("Please login to save colleges");
      return;
    }

    const isSaved = savedColleges.includes(collegeId);

    try {
      if (isSaved) {
        await apiClient.removeSavedCollege(collegeId);
        setSavedColleges(prev => prev.filter(id => id !== collegeId));
        toast.success("Removed from saved colleges");
      } else {
        await apiClient.saveCollege(collegeId);
        setSavedColleges(prev => [...prev, collegeId]);
        toast.success("College saved successfully");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "An error occurred. Please try again.");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("all");
    setSortBy("rating-desc");
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 shrink-0 space-y-6">
        <div>
          <h2 className="text-lg font-bold mb-4">Filters</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search colleges..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={location} onValueChange={(val) => setLocation(val || "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                  <SelectItem value="Kolkata">Kolkata</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort By</Label>
              <Select value={sortBy} onValueChange={(val) => setSortBy(val || "rating-desc")}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
                  <SelectItem value="fees-asc">Fees: Low to High</SelectItem>
                  <SelectItem value="fees-desc">Fees: High to Low</SelectItem>
                  <SelectItem value="averagePackage-desc">Placements: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full" onClick={clearFilters}>
              <FilterX className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Explore Colleges</h1>
          <span className="text-sm text-muted-foreground">
            {!loading && colleges && `${colleges.length} results`}
          </span>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-destructive/10 rounded-lg">
            <AlertCircle className="h-10 w-10 text-destructive mb-4" />
            <h3 className="text-lg font-medium text-destructive">{error}</h3>
            <Button variant="outline" className="mt-4" onClick={fetchColleges}>Try Again</Button>
          </div>
        ) : loading ? (
          <div className="flex flex-col space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col sm:flex-row w-full gap-6 bg-card border border-border/60 rounded-xl overflow-hidden p-0 h-auto">
                <Skeleton className="h-56 sm:h-64 sm:w-72 shrink-0 rounded-none" />
                <div className="flex flex-col flex-1 p-6 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                  <Skeleton className="h-24 w-full max-w-md mt-4" />
                  <div className="mt-auto pt-6 flex justify-end gap-3 border-t">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : colleges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-lg bg-muted/20">
            <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-bold">No colleges found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              We couldn't find any colleges matching your current filters. Try adjusting your search criteria.
            </p>
            <Button variant="outline" className="mt-6" onClick={clearFilters}>Clear all filters</Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col space-y-6">
              {colleges.map((college) => (
                <CollegeCard 
                  key={college.id} 
                  college={college} 
                  onSave={handleSave}
                  saved={savedColleges.includes(college.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-8">
                <Button 
                  variant="outline" 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={page === i + 1 ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setPage(i + 1)}
                      className="w-8 h-8"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
