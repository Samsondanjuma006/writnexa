import crypto from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack is not configured." },
        { status: 500 },
      );
    }

    const signature = request.headers.get("x-paystack-signature");
    const rawBody = await request.text();

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Paystack signature." },
        { status: 401 },
      );
    }

    const expectedSignature = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    if (
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      )
    ) {
      return NextResponse.json(
        { error: "Invalid Paystack signature." },
        { status: 401 },
      );
    }

    const event = JSON.parse(rawBody);

    console.log("Paystack webhook received:", event.event);

    if (event.event === "subscription.create") {
      const subscription = event.data;
      const customerCode = subscription?.customer?.customer_code;

      if (customerCode && subscription?.subscription_code) {
        const admin = createAdminClient();

        const { error } = await admin
          .from("billing_subscriptions")
          .update({
            paystack_customer_code: customerCode,
            paystack_subscription_code:
              subscription.subscription_code,
            updated_at: new Date().toISOString(),
          })
          .eq("paystack_customer_code", customerCode);

        if (error) {
          console.error("Subscription webhook update error:", error);

          return NextResponse.json(
            { error: "Unable to save subscription." },
            { status: 500 },
          );
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);

    return NextResponse.json(
      { error: "Unable to process webhook." },
      { status: 500 },
    );
  }
}
