import crypto from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type PaystackEvent = {
  event?: string;
  data?: {
    customer?: {
      customer_code?: string;
    };
    subscription_code?: string;
    status?: string;
    next_payment_date?: string;
    start?: string;
    invoice?: {
      customer?: {
        customer_code?: string;
      };
    };
  };
};

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

    const event = JSON.parse(rawBody) as PaystackEvent;
    const eventName = event.event;
    const data = event.data;

    console.log("Paystack webhook received:", eventName);

    const customerCode =
      data?.customer?.customer_code ??
      data?.invoice?.customer?.customer_code;

    if (!customerCode) {
      return NextResponse.json({ received: true });
    }

    const admin = createAdminClient();

    if (eventName === "subscription.create") {
      if (data?.subscription_code) {
        const { error } = await admin
          .from("billing_subscriptions")
          .update({
            paystack_customer_code: customerCode,
            paystack_subscription_code: data.subscription_code,
            status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("paystack_customer_code", customerCode);

        if (error) {
          console.error("Subscription create update error:", error);

          return NextResponse.json(
            { error: "Unable to save subscription." },
            { status: 500 },
          );
        }
      }
    }

    if (eventName === "charge.success") {
      const { error } = await admin
        .from("billing_subscriptions")
        .update({
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("paystack_customer_code", customerCode);

      if (error) {
        console.error("Charge success update error:", error);

        return NextResponse.json(
          { error: "Unable to update subscription status." },
          { status: 500 },
        );
      }
    }

    if (eventName === "invoice.payment_failed") {
      console.warn(
        "Paystack invoice payment failed for customer:",
        customerCode,
      );

      return NextResponse.json({ received: true });
    }

    if (eventName === "subscription.not_renew") {
      const { error } = await admin
        .from("billing_subscriptions")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("paystack_customer_code", customerCode);

      if (error) {
        console.error("Subscription cancellation update error:", error);

        return NextResponse.json(
          { error: "Unable to update subscription status." },
          { status: 500 },
        );
      }
    }

    if (eventName === "subscription.disable") {
      const { error } = await admin
        .from("billing_subscriptions")
        .update({
          status: "expired",
          updated_at: new Date().toISOString(),
        })
        .eq("paystack_customer_code", customerCode);

      if (error) {
        console.error("Subscription disable update error:", error);

        return NextResponse.json(
          { error: "Unable to expire subscription." },
          { status: 500 },
        );
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
