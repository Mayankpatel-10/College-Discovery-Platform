import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

const querySchema = z.object({
  search: z.string().optional().default(""),
  location: z.string().optional().default(""),
  minFees: z.string()
    .optional()
    .refine(val => !val || /^\d+$/.test(val), "minFees must be a positive integer")
    .transform(val => (val ? parseInt(val, 10) : undefined)),
  maxFees: z.string()
    .optional()
    .refine(val => !val || /^\d+$/.test(val), "maxFees must be a positive integer")
    .transform(val => (val ? parseInt(val, 10) : undefined)),
  minRating: z.string()
    .optional()
    .refine(val => !val || /^\d+(\.\d+)?$/.test(val), "minRating must be a valid number")
    .transform(val => (val ? parseFloat(val) : undefined)),
  sortBy: z.enum(["rating", "fees", "averagePackage"]).optional().default("rating"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.string()
    .optional()
    .default("1")
    .refine(val => /^\d+$/.test(val), "page must be a positive integer")
    .transform(val => parseInt(val, 10)),
  limit: z.string()
    .optional()
    .default("10")
    .refine(val => /^\d+$/.test(val), "limit must be a positive integer")
    .transform(val => parseInt(val, 10)),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paramsObject = Object.fromEntries(searchParams.entries());

    const validation = querySchema.safeParse(paramsObject);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const query = validation.data;

    const where: Prisma.CollegeWhereInput = {};

    if (query.search) {
      where.name = { contains: query.search, mode: "insensitive" };
    }
    if (query.location && query.location.toLowerCase() !== "all") {
      where.location = { equals: query.location, mode: "insensitive" };
    }
    if (query.minFees !== undefined || query.maxFees !== undefined) {
      where.fees = {};
      if (query.minFees !== undefined) where.fees.gte = query.minFees;
      if (query.maxFees !== undefined) where.fees.lte = query.maxFees;
    }
    if (query.minRating !== undefined) {
      where.rating = { gte: query.minRating };
    }

    const orderBy: Prisma.CollegeOrderByWithRelationInput = {};
    if (query.sortBy === "fees") {
      orderBy.fees = query.sortOrder as Prisma.SortOrder;
    } else if (query.sortBy === "averagePackage") {
      orderBy.averagePackage = query.sortOrder as Prisma.SortOrder;
    } else {
      orderBy.rating = query.sortOrder as Prisma.SortOrder;
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        orderBy,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      data: colleges,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error("Fetch colleges error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
