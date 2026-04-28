import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("x-api-key");
    const companyId = request.headers.get("x-company-id");
    const password = request.headers.get("x-password");

    let company;
    if (apiKey) {
      company = await prisma.company.findUnique({ where: { apiKey } });
    } else if (companyId && password) {
      company = await prisma.company.findUnique({ where: { id: companyId } });
      if (company && company.password !== password) company = null;
    }

    if (!company) {
      return NextResponse.json({ error: "Unauthorized access." }, { status: 403 });
    }

    const body = await request.json();
    const { decisions } = body;

    if (!Array.isArray(decisions) || decisions.length === 0) {
      return NextResponse.json({ error: "No data provided." }, { status: 400 });
    }

    // Validate and format the data
    const formattedDecisions = decisions.map((d: any) => ({
      companyId: company.id,
      gender: String(d.gender).toLowerCase(),
      decision: String(d.decision).toLowerCase(),
      timestamp: d.timestamp ? new Date(d.timestamp) : new Date(),
    })).filter(d => 
      ["male", "female"].includes(d.gender) && 
      ["selected", "rejected"].includes(d.decision)
    );

    if (formattedDecisions.length === 0) {
      return NextResponse.json({ error: "No valid decisions found in upload." }, { status: 400 });
    }

    // Bulk insert
    const result = await prisma.decision.createMany({
      data: formattedDecisions,
      skipDuplicates: false,
    });

    return NextResponse.json({
      message: `Successfully uploaded ${result.count} decisions.`,
      count: result.count,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error during upload." }, { status: 500 });
  }
}
