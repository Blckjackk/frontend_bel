import { NextRequest, NextResponse } from "next/server";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlists/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to remove wishlist" }, { status: 500 });
  }
}