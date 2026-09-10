import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 },
      );
    }

    const reference = new URL(request.url).searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Payment reference is required." },
        { status: 400 },
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack is not configured." },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok || !data.status || data.data?.status !== "success") {
      return NextResponse.json(
        { error: data.message || "Payment verification failed." },
        { status: 400 },
      );
    }

    const metadata = data.data?.metadata;

    if (metadata?.user_id !== user.id) {
      return NextResponse.json(
        { error: "Payment does not belong to the signed-in user." },
        { status: 403 },
      );
    }

    return NextResponse.json({
      verified: true,
      reference: data.data.reference,
      status: data.data.status,
      amount: data.data.amount,
      plan: metadata.plan,
      interval: metadata.interval,
    });
  } catch (error) {
    console.error("Paystack verification error:", error);

    return NextResponse.json(
      { error: "Unable to verify the payment." },
      { status: 500 },
    );
  }
}
