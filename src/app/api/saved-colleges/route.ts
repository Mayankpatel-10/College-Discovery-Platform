import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const saveCollegeSchema = z.object({
  collegeId: z.string().min(1, "College ID is required"),
});

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: {
        college: true,
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(savedColleges);
  } catch (error) {
    console.error("Fetch saved colleges error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    const validation = saveCollegeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation error", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { collegeId } = validation.data;

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const existingSave = await prisma.savedCollege.findUnique({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId: collegeId,
        },
      },
    });

    if (existingSave) {
      return NextResponse.json(
        { error: "College already saved" },
        { status: 400 }
      );
    }

    const savedCollege = await prisma.savedCollege.create({
      data: {
        userId: session.user.id,
        collegeId: collegeId,
      },
      include: {
        college: true,
      },
    });

    return NextResponse.json(savedCollege, { status: 201 });
  } catch (error) {
    console.error("Save college error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId");

    if (!collegeId || collegeId.trim() === "") {
      return NextResponse.json({ error: "College ID is required" }, { status: 400 });
    }

    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
    });

    return NextResponse.json({ message: "Removed from saved colleges" });
  } catch (error: any) {
    if (error && typeof error === "object" && "code" in error && error.code === 'P2025') {
      return NextResponse.json({ error: "Not found in saved colleges" }, { status: 404 });
    }
    console.error("Delete saved college error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
