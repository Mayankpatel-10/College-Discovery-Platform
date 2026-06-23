import { College, CollegesApiResponse, SavedCollege } from "@/types";

export async function fetchColleges(params: URLSearchParams): Promise<CollegesApiResponse> {
  const res = await fetch(`/api/colleges?${params.toString()}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch colleges");
  }
  return res.json();
}

export async function fetchSavedColleges(): Promise<SavedCollege[]> {
  const res = await fetch("/api/saved-colleges");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch saved colleges");
  }
  return res.json();
}

export async function saveCollege(collegeId: string): Promise<SavedCollege> {
  const res = await fetch("/api/saved-colleges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ collegeId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.details || "Failed to save college");
  }
  return res.json();
}

export async function removeSavedCollege(collegeId: string): Promise<{ message: string }> {
  const res = await fetch(`/api/saved-colleges?collegeId=${collegeId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to remove saved college");
  }
  return res.json();
}

export async function compareColleges(collegeIds: string[]): Promise<College[]> {
  const res = await fetch("/api/compare", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ collegeIds }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to compare colleges");
  }
  return res.json();
}
