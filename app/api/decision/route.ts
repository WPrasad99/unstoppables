import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Validate API key
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

    // Validate body
    const body = await request.json();
    const { gender, decision, timestamp } = body;

    if (!gender || !["male", "female"].includes(gender)) {
      return NextResponse.json(
        { error: 'Invalid gender. Must be "male" or "female".' },
        { status: 400 }
      );
    }

    if (!decision || !["selected", "rejected"].includes(decision)) {
      return NextResponse.json(
        { error: 'Invalid decision. Must be "selected" or "rejected".' },
        { status: 400 }
      );
    }

    // Store decision
    const decisionRecord = await prisma.decision.create({
      data: {
        companyId: company.id,
        gender,
        decision,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Decision recorded successfully.",
        id: decisionRecord.id,
        company_id: company.id,
        timestamp: decisionRecord.timestamp,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Decision error:", error);
    return NextResponse.json(
      { error: "Failed to record decision." },
      { status: 500 }
    );
  }
}
