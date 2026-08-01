import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.directorySubmission.update({
      where: { id },
      data: {
        status: body.status,
        listingUrl: body.listingUrl || null,
        screenshotUrl: body.screenshotUrl || null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin Update Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
