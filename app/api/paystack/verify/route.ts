import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

    const searchParams = new URL(request.url).searchParams;
    const reference =
      searchParams.get("reference") || searchParams.get("trxref");

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

    if (!["starter", "pro"].includes(metadata?.plan)) {
      return NextResponse.json(
        { error: "Invalid billing plan in payment metadata." },
        { status: 400 },
      );
    }

    if (!["monthly", "annually"].includes(metadata?.interval)) {
      return NextResponse.json(
        { error: "Invalid billing interval in payment metadata." },
        { status: 400 },
      );
    }

    const admin = createAdminClient();

    const { error: subscriptionError } = await admin
      .from("billing_subscriptions")
      .upsert(
        {
          user_id: user.id,
          plan_code: metadata.plan,
          status: "active",
          billing_interval: metadata.interval,
          paystack_customer_code: data.data?.customer?.customer_code || null,
          paystack_subscription_code:
            data.data?.subscription?.subscription_code || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      );

    if (subscriptionError) {
      console.error(
        "Billing subscription upsert error:",
        subscriptionError,
      );

      return NextResponse.json(
        { error: "Payment verified, but subscription could not be saved." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      verified: true,
      saved: true,
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
