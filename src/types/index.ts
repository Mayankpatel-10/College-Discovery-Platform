export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date | string;
}

export interface Course {
  id: string;
  collegeId: string;
  courseName: string;
  duration: string;
  fees: number;
}

export interface Review {
  id: string;
  collegeId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
  user: {
    name: string;
  };
}

export interface College {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  averagePackage: number;
  highestPackage: number;
  image: string;
  description: string;
  contactEmail: string;
  createdAt: Date | string;
  courses?: Course[];
  reviews?: Review[];
}

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  college: College;
}

export interface CollegesApiResponse {
  data: College[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
