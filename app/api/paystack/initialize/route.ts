import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be signed in to upgrade your plan." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const plan = body?.plan;
    const interval = body?.interval;

    if (
      !["starter", "pro"].includes(plan) ||
      !["monthly", "annually"].includes(interval)
    ) {
      return NextResponse.json(
        { error: "Invalid plan or billing interval." },
        { status: 400 },
      );
    }

    const planCodeMap = {
      starter: {
        monthly: process.env.PAYSTACK_STARTER_MONTHLY_PLAN_CODE,
        annually: process.env.PAYSTACK_STARTER_ANNUAL_PLAN_CODE,
      },
      pro: {
        monthly: process.env.PAYSTACK_PRO_MONTHLY_PLAN_CODE,
        annually: process.env.PAYSTACK_PRO_ANNUAL_PLAN_CODE,
      },
    } as const;

    const planCode = planCodeMap[plan as "starter" | "pro"][
      interval as "monthly" | "annually"
    ];

    if (!planCode) {
      return NextResponse.json(
        { error: "The selected billing plan is not configured." },
        { status: 500 },
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack is not configured." },
        { status: 500 },
      );
    }

    const origin = new URL(request.url).origin;

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          plan: planCode,
          callback_url: `${origin}/dashboard?payment=success`,
          metadata: {
            user_id: user.id,
            plan,
            interval,
          },
        }),
      },
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return NextResponse.json(
        {
          error: data.message || "Unable to initialize Paystack checkout.",
        },
        { status: response.status || 502 },
      );
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error("Paystack initialization error:", error);

    return NextResponse.json(
      { error: "Unable to start the payment process." },
      { status: 500 },
    );
  }
}
