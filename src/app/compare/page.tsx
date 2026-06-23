"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, X, ArrowRightLeft, CheckCircle2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { College } from "@/types";
import * as apiClient from "@/lib/api-client";

export default function ComparePage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);
  const [compareData, setCompareData] = useState<College[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      searchColleges();
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearch]);

  const searchColleges = async () => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        limit: "5"
      });
      const data = await apiClient.fetchColleges(params);
      setSearchResults(data.data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to search colleges");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const addCollege = (college: College) => {
    if (selectedColleges.length >= 3) {
      toast.error("You can compare up to 3 colleges at a time");
      return;
    }
    if (selectedColleges.find(c => c.id === college.id)) {
      toast.error("College already added for comparison");
      return;
    }
    setSelectedColleges([...selectedColleges, college]);
    setSearch("");
    setSearchResults([]);
  };

  const removeCollege = (id: string) => {
    setSelectedColleges(selectedColleges.filter(c => c.id !== id));
    setCompareData(compareData.filter(c => c.id !== id));
  };

  const handleCompare = async () => {
    if (selectedColleges.length < 2) {
      toast.error("Select at least 2 colleges to compare");
      return;
    }

    setIsComparing(true);
    try {
      const ids = selectedColleges.map(c => c.id);
      const data = await apiClient.compareColleges(ids);
      setCompareData(data);
    } catch (e) {
      toast.error("Failed to compare colleges");
      setCompareData([]);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ArrowRightLeft className="h-8 w-8 text-primary" />
          Compare Colleges
        </h1>
        <p className="text-muted-foreground text-lg">
          Select up to 3 colleges to compare their fees, placements, ratings, and courses side-by-side.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Add Colleges to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search college name..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              
              {search.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No colleges found</div>
                  ) : (
                    <ul className="py-1">
                      {searchResults.map((college) => (
                        <li 
                          key={college.id}
                          className="px-4 py-2 hover:bg-muted cursor-pointer flex justify-between items-center"
                          onClick={() => addCollege(college)}
                        >
                          <div>
                            <p className="font-medium text-sm">{college.name}</p>
                            <p className="text-xs text-muted-foreground">{college.location}</p>
                          </div>
                          <Plus className="h-4 w-4 text-primary" />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-6 flex flex-wrap gap-2">
              {selectedColleges.map((college) => (
                <Badge key={college.id} variant="secondary" className="px-3 py-1.5 flex items-center gap-2">
                  <span className="truncate max-w-[200px]">{college.name}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-destructive transition-colors" 
                    onClick={() => removeCollege(college.id)}
                  />
                </Badge>
              ))}
              {selectedColleges.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">No colleges selected yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex flex-col justify-center items-center p-6 text-center bg-primary/5 border-primary/20">
          <CheckCircle2 className="h-12 w-12 text-primary mb-4 opacity-80" />
          <h3 className="font-semibold mb-2">{selectedColleges.length}/3 Selected</h3>
          <Button 
            className="w-full mt-4" 
            size="lg" 
            disabled={selectedColleges.length < 2 || isComparing}
            onClick={handleCompare}
          >
            {isComparing ? "Comparing..." : "Compare Now"}
          </Button>
        </Card>
      </div>

      {compareData.length > 0 && (
        <Card className="overflow-hidden border-t-4 border-t-primary shadow-lg animate-in fade-in slide-in-from-bottom-4">
          <div className="overflow-x-auto">
            <Table className="w-full text-base">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/4 bg-muted/50 font-semibold align-top pt-6">Features</TableHead>
                  {compareData.map((college) => (
                    <TableHead key={`header-${college.id}`} className="min-w-[250px] align-top pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/college/${college.id}`} className="font-bold text-lg text-primary hover:underline line-clamp-2">
                          {college.name}
                        </Link>
                        <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 shrink-0" onClick={() => removeCollege(college.id)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge variant="outline" className="font-normal">{college.location}</Badge>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium bg-muted/50">Rating</TableCell>
                  {compareData.map((college) => (
                    <TableCell key={`rating-${college.id}`}>
                      <div className="flex items-center gap-1 font-bold">
                        {college.rating} <span className="text-yellow-500">★</span>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium bg-muted/50">Yearly Fees</TableCell>
                  {compareData.map((college) => (
                    <TableCell key={`fees-${college.id}`} className="font-semibold">
                      ₹{(college.fees / 100000).toFixed(1)} Lakhs
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium bg-muted/50">Average Package</TableCell>
                  {compareData.map((college) => (
                    <TableCell key={`avg-${college.id}`} className="font-semibold text-green-600">
                      ₹{(college.averagePackage / 100000).toFixed(1)} LPA
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium bg-muted/50">Highest Package</TableCell>
                  {compareData.map((college) => (
                    <TableCell key={`high-${college.id}`} className="font-semibold">
                      ₹{(college.highestPackage / 100000).toFixed(1)} LPA
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium bg-muted/50 align-top">Top Courses</TableCell>
                  {compareData.map((college) => (
                    <TableCell key={`courses-${college.id}`} className="align-top">
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {college.courses?.slice(0, 4).map((c) => (
                          <li key={c.id} className="truncate">{c.courseName}</li>
                        ))}
                        {(college.courses?.length ?? 0) > 4 && (
                          <li className="list-none text-xs text-primary mt-2">+{(college.courses?.length ?? 0) - 4} more courses</li>
                        )}
                      </ul>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}
