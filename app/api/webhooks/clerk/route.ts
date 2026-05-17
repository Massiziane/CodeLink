import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const payload = await req.text();

  console.log("Webhook received:", payload);

  return NextResponse.json({ received: true });
}