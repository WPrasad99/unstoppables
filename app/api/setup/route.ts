import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Company name is required." },
        { status: 400 }
      );
    }

    const apiKey = `bm_${uuidv4().replace(/-/g, "")}`;

    const company = await prisma.company.create({
      data: {
        name: name.trim(),
        apiKey,
      },
    });

    return NextResponse.json(
      {
        message: "Company registered successfully.",
        company_id: company.id,
        company_name: company.name,
        api_key: company.apiKey,
        created_at: company.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { error: "Failed to register company. Please try again." },
      { status: 500 }
    );
  }
}
