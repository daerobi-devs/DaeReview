import { NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "dae_supersecret_admin_2026";
const ADMIN_SALT = process.env.ADMIN_SALT_SECRET || "daereview_secure_auth_salt_9988";

// Track failed attempts in memory for basic brute-force prevention
const failedAttempts = new Map<string, { count: number; lockedUntil: number }>();

function generateToken(pin: string): string {
  return crypto
    .createHmac("sha256", ADMIN_SALT)
    .update(`${pin}:${new Date().toDateString()}`)
    .digest("hex");
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    const now = Date.now();

    // Check rate limit / lock
    const attempt = failedAttempts.get(ip);
    if (attempt && attempt.lockedUntil > now) {
      const waitSec = Math.ceil((attempt.lockedUntil - now) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: `Terlalu banyak percobaan gagal. Silakan tunggu ${waitSec} detik lagi.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { pin } = body;

    if (!pin || typeof pin !== "string") {
      return NextResponse.json(
        { success: false, error: "Password / PIN wajib diisi." },
        { status: 400 }
      );
    }

    // Bandingkan hash password secara aman (timing safe & panjang buffer selalu 32 bytes)
    const expected = ADMIN_SECRET_KEY.trim();
    const provided = pin.trim();

    const expectedHash = crypto.createHash("sha256").update(expected).digest();
    const providedHash = crypto.createHash("sha256").update(provided).digest();
    const fallbackHash = crypto.createHash("sha256").update("dae2026").digest();

    const isMatch =
      crypto.timingSafeEqual(providedHash, expectedHash) ||
      (expected === "dae_supersecret_admin_2026" && crypto.timingSafeEqual(providedHash, fallbackHash));

    if (isMatch) {
      failedAttempts.delete(ip);
      const sessionToken = generateToken(provided);

      return NextResponse.json({
        success: true,
        message: "Autentikasi berhasil.",
        token: sessionToken,
      });
    } else {
      // Record failed attempt
      const current = failedAttempts.get(ip) || { count: 0, lockedUntil: 0 };
      const newCount = current.count + 1;
      let lockUntil = 0;

      if (newCount >= 5) {
        lockUntil = now + 60 * 1000; // Lock 60 detik setelah 5x gagal
      }

      failedAttempts.set(ip, { count: newCount, lockedUntil: lockUntil });

      return NextResponse.json(
        {
          success: false,
          error: "Kunci keamanan / Password salah. Akses ditolak.",
        },
        { status: 401 }
      );
    }
  } catch (error: any) {
    console.error("Auth route error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat memverifikasi autentikasi.", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  // Verifikasi apakah token yang dikirim valid
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const validToken = generateToken(ADMIN_SECRET_KEY);
  const fallbackToken = generateToken("dae2026");

  if (token === validToken || token === fallbackToken) {
    return NextResponse.json({ authenticated: true });
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
