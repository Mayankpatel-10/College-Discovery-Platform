"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { CollegeCard } from "@/components/college/college-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SavedCollege } from "@/types";
import * as apiClient from "@/lib/api-client";

export default function SavedCollegesPage() {
  const { status } = useSession();
  
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      const loadSavedColleges = async () => {
        try {
          const data = await apiClient.fetchSavedColleges();
          setSavedColleges(data);
        } catch (e) {
          toast.error("Could not load saved colleges");
        } finally {
          setLoading(false);
        }
      };
      loadSavedColleges();
    }
  }, [status]);

  const handleRemove = async (collegeId: string) => {
    try {
      await apiClient.removeSavedCollege(collegeId);
      setSavedColleges(prev => prev.filter(item => item.collegeId !== collegeId));
      toast.success("Removed from saved colleges");
    } catch (e) {
      toast.error("Failed to remove college");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="flex flex-col space-y-6">
          {[...Array(3)].map((_, i) => (
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          My Dashboard
        </h1>
        <p className="text-muted-foreground text-lg flex items-center gap-2">
          <Bookmark className="h-5 w-5" /> Saved Colleges ({savedColleges.length})
        </p>
      </div>

      {savedColleges.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed rounded-lg bg-muted/20">
          <Bookmark className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-bold">No saved colleges</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            You haven't saved any colleges yet. Explore our listings and save colleges you're interested in.
          </p>
          <Button asChild className="mt-6">
            <Link href="/colleges">Explore Colleges</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          {savedColleges.map((item) => (
            <CollegeCard 
              key={item.id} 
              college={item.college} 
              onSave={handleRemove}
              saved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
