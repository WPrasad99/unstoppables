import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateBiasMetrics } from "@/utils/biasCalculator";

export async function GET(request: NextRequest) {
  try {
    // Validate Company ID and Password
    const companyId = request.headers.get("x-company-id");
    const password = request.headers.get("x-password");

    if (!companyId || !password) {
      return NextResponse.json(
        { error: "Missing x-company-id or x-password header." },
        { status: 401 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company || company.password !== password) {
      return NextResponse.json(
        { error: "Invalid Company ID or password." },
        { status: 403 }
      );
    }

    // Fetch all decisions for this company
    const decisions = await prisma.decision.findMany({
      where: { companyId: company.id },
      orderBy: { timestamp: "desc" },
    });

    // Calculate bias metrics
    const metrics = calculateBiasMetrics(
      decisions.map((d) => ({
        id: d.id,
        gender: d.gender,
        decision: d.decision,
        timestamp: d.timestamp,
      }))
    );

    return NextResponse.json({
      company_id: company.id,
      company_name: company.name,
      ...metrics,
    });
  } catch (error) {
    console.error("Results error:", error);
    return NextResponse.json(
      { error: "Failed to fetch results." },
      { status: 500 }
    );
  }
}
