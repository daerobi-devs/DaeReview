import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.redirect("https://daereview.daeroom.my.id/rss.xml", 301);
}
