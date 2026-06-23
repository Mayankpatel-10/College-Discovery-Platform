import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const compareSchema = z.object({
  collegeIds: z
    .array(z.string().min(1, "College ID cannot be empty"))
    .min(2, "Select at least 2 colleges to compare")
    .max(3, "You can compare up to 3 colleges")
    .refine(
      (ids) => new Set(ids).size === ids.length,
      { message: "Duplicate colleges selected for comparison" }
    ),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const validation = compareSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { collegeIds } = validation.data;

    const colleges = await prisma.college.findMany({
      where: {
        id: {
          in: collegeIds,
        },
      },
      include: {
        courses: true,
      },
    });

    // Ensure we found all requested colleges
    if (colleges.length !== collegeIds.length) {
      return NextResponse.json(
        { error: "One or more colleges not found" },
        { status: 404 }
      );
    }

    // Return in the exact order they were requested
    const sortedColleges = collegeIds.map(
      id => colleges.find(c => c.id === id)!
    );

    return NextResponse.json(sortedColleges);
  } catch (error) {
    console.error("Compare colleges error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
