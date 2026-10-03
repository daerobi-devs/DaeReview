import { NextResponse } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8810761979:AAFTbAVxgfarUaqN7JBPmVc9liWFKjPMR4o";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://daereview.daeroom.my.id";

export async function GET() {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
    const data = await res.json();
    return NextResponse.json({
      success: true,
      currentWebhook: data,
      targetWebhookUrl: `${SITE_URL}/api/telegram/webhook`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const webhookUrl = `${SITE_URL}/api/telegram/webhook`;
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}&drop_pending_updates=true`,
      { method: "POST" }
    );
    const data = await res.json();
    return NextResponse.json({
      success: true,
      result: data,
      registeredUrl: webhookUrl,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
