// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}
