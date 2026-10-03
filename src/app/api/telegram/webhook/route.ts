import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { NewsArticle } from "@/data/mockData";
import { supabaseAdmin } from "@/lib/supabase";
import {
  getPendingDispatch,
  getStoredConversationId,
  saveStoredConversationId,
  clearStoredConversationId,
  savePendingDispatch
} from "@/lib/dispatchStore";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8810761979:AAFTbAVxgfarUaqN7JBPmVc9liWFKjPMR4o";
const AUTHORIZED_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "7045828398";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://daereview.daeroom.my.id";
const DIFY_SERVER_URL = process.env.DIFY_SERVER_URL || "https://dify.daeroom.my.id";
const DIFY_PM_API_KEY = process.env.DIFY_PM_API_KEY || process.env.DIFY_CHATBOT_API_KEY || "";
const DIFY_NEWSROOM_API_KEY = process.env.DIFY_NEWSROOM_API_KEY || "";
const DIFY_PRODUCT_LAB_API_KEY = process.env.DIFY_PRODUCT_LAB_API_KEY || "";
const DATA_FILE = path.join(process.cwd(), "src", "data", "custom_news.json");

function readCustomNews(): NewsArticle[] {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeCustomNews(data: NewsArticle[]): boolean {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

async function sendTelegramMessage(chatId: string | number, text: string, replyMarkup?: any) {
  try {
    const payload: any = {
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
    };
    if (replyMarkup) payload.reply_markup = replyMarkup;

    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      delete payload.parse_mode;
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
  } catch (err) {
    console.error("Gagal kirim pesan Telegram:", err);
  }
}

async function editTelegramMessage(chatId: string | number, messageId: number, text: string, replyMarkup?: any) {
  try {
    const payload: any = {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: "Markdown",
    };
    if (replyMarkup) payload.reply_markup = replyMarkup;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Gagal edit pesan Telegram:", err);
  }
}

async function answerCallbackQuery(callbackQueryId: string, text: string, showAlert = false) {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert,
      }),
    });
  } catch (err) {
    console.error("Gagal answerCallbackQuery:", err);
  }
}

// 5 Topik Brainstorming Kurasi
const TRENDING_TOPICS = [
  {
    id: "1",
    type: "news",
    title: "Kebijakan Sertifikasi AI & Watermark Kominfo untuk Pemilu & Konten Digital",
    summary: "Aturan baru pelabelan konten AI di Indonesia serta sanksi bagi penyebar misinformasi.",
  },
  {
    id: "2",
    type: "product",
    title: "Infinix Note 50 Pro vs Redmi Note 14 5G di Kelas 2 Jutaan",
    summary: "Uji jeroan chipset, stabilitas kamera 108MP, dan kompromi suhu saat gaming harian.",
  },
  {
    id: "3",
    type: "news",
    title: "Gelombang PHK dan Pivot Startup AI Global ke Model Edge Computing Lokal",
    summary: "Pergeseran infrastruktur cloud AI ke komputasi on-device di smartphone dan laptop 2026.",
  },
  {
    id: "4",
    type: "product",
    title: "TWS ANC Murah di Bawah Rp 250 Ribu: Realita Desibel vs Klaim Brosur",
    summary: "Audit 3 TWS terlaris di Shopee/Tokopedia: apakah benar mampu meredam bising kendaraan?",
  },
  {
    id: "5",
    type: "news",
    title: "Perang Chipset 3nm: Apple M4, Snapdragon X Elite, dan Intel Lunar Lake di Indonesia",
    summary: "Analisis performa baterai 20 jam dan efisiensi kerja nyata programmer & kreator lokal.",
  },
];

async function sendChatAction(chatId: string | number, action = "typing") {
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendChatAction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, action }),
    });
  } catch {
    // Ignore
  }
}

async function chatWithDifyPM(
  query: string,
  chatId: string | number
): Promise<{ answer: string; conversationId: string } | null> {
  if (!DIFY_PM_API_KEY) return null;
  try {
    const prevConvId = getStoredConversationId(chatId);
    const payload: any = {
      inputs: {},
      query,
      response_mode: "blocking",
      user: `telegram-${chatId}`,
    };
    if (prevConvId) payload.conversation_id = prevConvId;

    const res = await fetch(`${DIFY_SERVER_URL}/v1/chat-messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIFY_PM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.warn("Dify chat-messages error:", await res.text());
      return null;
    }

    const data = await res.json();
    if (data.conversation_id) {
      saveStoredConversationId(chatId, data.conversation_id);
    }
    return {
      answer: data.answer || "",
      conversationId: data.conversation_id || "",
    };
  } catch (err) {
    console.error("Gagal chat dengan Dify PM:", err);
    return null;
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    bot: "@daereview_editorial_bot",
    service: "DaeReview Assignment Desk (Tim 0: Project Manager)",
    authorizedChatId: AUTHORIZED_CHAT_ID ? `${AUTHORIZED_CHAT_ID.slice(0, 3)}***` : "unset",
  });
}

export async function POST(request: Request) {
  try {
    const update = await request.json();

    // 1. Tangani Callback Query (Tombol Ditekan)
    if (update.callback_query) {
      const cq = update.callback_query;
      const cqId = cq.id;
      const data = cq.data || "";
      const chatId = cq.message?.chat?.id;
      const messageId = cq.message?.message_id;

      // Verifikasi hak akses CEO
      if (String(chatId) !== String(AUTHORIZED_CHAT_ID)) {
        await answerCallbackQuery(cqId, "Akses ditolak. Khusus pimpinan redaksi.", true);
        return NextResponse.json({ ok: true });
      }

      // Action: Approve News Article
      if (data.startsWith("approve_news:")) {
        const slug = data.replace("approve_news:", "").trim();
        const current = readCustomNews();
        const index = current.findIndex((a) => a.slug === slug);

        if (index >= 0) {
          current[index].status = "published";
          writeCustomNews(current);
        }

        // Update di Supabase
        try {
          await supabaseAdmin
            .from("articles")
            .update({ status: "published", updated_at: new Date().toISOString() })
            .eq("slug", slug);
        } catch (dbErr) {
          console.warn("Update Supabase status:", dbErr);
        }

        await answerCallbackQuery(cqId, "✅ Artikel Resmi Disetujui & Diterbitkan!", true);

        const articleTitle = current[index]?.title || slug;
        const editedText = [
          `🟢 *[ARTIKEL RESMI TELAH DITERBITKAN OLEH CEO]*`,
          ``,
          `📌 *Judul:* ${articleTitle}`,
          `📊 *Status:* DITERBITKAN (LIVE DI PORTAL)`,
          ``,
          `🌐 *Tautan Portal Publik:*`,
          `${SITE_URL}/berita/${slug}`,
        ].join("\n");

        await editTelegramMessage(chatId, messageId, editedText, {
          inline_keyboard: [
            [
              { text: "🌐 Buka di Portal", url: `${SITE_URL}/berita/${slug}` },
              { text: "✏️ Kelola di Admin", url: `${SITE_URL}/admin/berita` },
            ],
          ],
        });

        return NextResponse.json({ ok: true });
      }

      // Action: Reject News Article
      if (data.startsWith("reject_news:")) {
        const slug = data.replace("reject_news:", "").trim();
        const current = readCustomNews();
        const updated = current.filter((a) => a.slug !== slug);
        writeCustomNews(updated);

        try {
          await supabaseAdmin.from("articles").delete().eq("slug", slug);
        } catch (dbErr) {
          console.warn("Delete Supabase article:", dbErr);
        }

        await answerCallbackQuery(cqId, "❌ Draf Berhasil Ditolak & Dihapus.", true);

        await editTelegramMessage(
          chatId,
          messageId,
          `❌ *[DRAF DITOLAK & DIHAPUS OLEH CEO]*\n\nArtikel dengan slug \`${slug}\` telah dihapus dari antrean draf dan tidak akan diterbitkan.`,
          {
            inline_keyboard: [
              [{ text: "✏️ Cek Draf Lain di Admin", url: `${SITE_URL}/admin/berita` }],
            ],
          }
        );

        return NextResponse.json({ ok: true });
      }

      // Action: Dispatch Topic to Tim 1 (Newsroom)
      if (data.startsWith("disp_news:") || data.startsWith("dispatch_news:")) {
        let topic = "";
        let angle = "";
        if (data.startsWith("disp_news:")) {
          const id = data.replace("disp_news:", "").trim();
          const pending = getPendingDispatch(id);
          topic = pending?.topic || `Topik Penugasan #${id}`;
          angle = pending?.angle || "";
        } else {
          const topicRaw = data.replace("dispatch_news:", "").trim();
          topic = decodeURIComponent(topicRaw);
        }

        await answerCallbackQuery(cqId, "🚀 Menugaskan Tim 1: Newsroom...");

        // Opsional: Otomatis picu workflow Dify jika API Key disetel
        if (DIFY_NEWSROOM_API_KEY) {
          try {
            await fetch(`${DIFY_SERVER_URL}/v1/workflows/run`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${DIFY_NEWSROOM_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                inputs: {
                  news_topic: topic,
                  target_audience: "Pembaca Indonesia & Konsumen Cerdas",
                  depth_level: "Investigatif & Mendalam",
                },
                response_mode: "streaming",
                user: `telegram-${chatId}`,
              }),
            });
          } catch (difyErr) {
            console.error("Gagal auto-trigger Dify Newsroom:", difyErr);
          }
        }

        await sendTelegramMessage(
          chatId,
          [
            `🚀 *(TIM 1: DAEREVIEW NEWSROOM DITUGASKAN)*`,
            ``,
            `📌 *Topik Berita:*`,
            `${topic}`,
            angle ? `🎯 *Sudut Pandang:* ${angle}` : "",
            ``,
            `🤖 *Tahapan Redaksi Otomatis Sedang Berjalan:*`,
            `1️⃣ *Trend & Fact Scout:* Riset DuckDuckGo fakta terkini`,
            `2️⃣ *Investigative Reporter:* Menulis narasi tajam & mengalir`,
            `3️⃣ *Managing Editor:* Uji format Swiss, no-cliché & sanitasi`,
            `4️⃣ *Status:* Akan dikirim ke sini sebagai *DRAFT* untuk persetujuan Anda!`,
            ``,
            `💡 *Info:* Buka Dify di ${DIFY_SERVER_URL} untuk memonitor jalannya agen.`,
          ].filter(Boolean).join("\n")
        );

        return NextResponse.json({ ok: true });
      }

      // Action: Dispatch Topic to Tim 2 (Product Lab)
      if (data.startsWith("disp_lab:") || data.startsWith("dispatch_product:")) {
        let topic = "";
        let angle = "";
        if (data.startsWith("disp_lab:")) {
          const id = data.replace("disp_lab:", "").trim();
          const pending = getPendingDispatch(id);
          topic = pending?.topic || `Produk Penugasan #${id}`;
          angle = pending?.angle || "";
        } else {
          const topicRaw = data.replace("dispatch_product:", "").trim();
          topic = decodeURIComponent(topicRaw);
        }

        await answerCallbackQuery(cqId, "🔬 Menugaskan Tim 2: Product Lab...");

        // Opsional: Otomatis picu workflow Dify jika API Key disetel
        if (DIFY_PRODUCT_LAB_API_KEY) {
          try {
            await fetch(`${DIFY_SERVER_URL}/v1/workflows/run`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${DIFY_PRODUCT_LAB_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                inputs: {
                  product_name: topic,
                  primary_category: "Gadget & Teknologi",
                  comparison_benchmark: "Standar Pasar",
                },
                response_mode: "streaming",
                user: `telegram-${chatId}`,
              }),
            });
          } catch (difyErr) {
            console.error("Gagal auto-trigger Dify Product Lab:", difyErr);
          }
        }

        await sendTelegramMessage(
          chatId,
          [
            `🔬 *(TIM 2: DAEREVIEW PRODUCT LAB DITUGASKAN)*`,
            ``,
            `📦 *Target Produk / Barang:*`,
            `${topic}`,
            angle ? `🎯 *Fokus Uji Lab:* ${angle}` : "",
            ``,
            `⚙️ *Tahapan Pengujian Lab Sedang Berjalan:*`,
            `1️⃣ *Hardware Auditor:* Uji klaim brosur vs realita benchmark`,
            `2️⃣ *The Catch Finder:* Membongkar kelemahan tersembunyi & kompromi`,
            `3️⃣ *Lead Reviewer:* Tabel komparasi, Siapa yang Beli vs Skip`,
            `4️⃣ *Status:* Akan dikirim ke sini sebagai *DRAFT* untuk persetujuan Anda!`,
            ``,
            `💡 *Info:* Buka Dify di ${DIFY_SERVER_URL} untuk memonitor jalannya agen.`,
          ].filter(Boolean).join("\n")
        );

        return NextResponse.json({ ok: true });
      }

      // Action: Brainstorm Topic Pick
      if (data.startsWith("pick_trend:")) {
        const idx = parseInt(data.replace("pick_trend:", ""), 10);
        const item = TRENDING_TOPICS[idx] || TRENDING_TOPICS[0];

        await answerCallbackQuery(cqId, `Memilih: ${item.title.slice(0, 30)}...`);

        const isNews = item.type === "news";
        const replyText = [
          `💡 *Topik Terpilih:*`,
          `*${item.title}*`,
          ``,
          `📝 *Konteks:* ${item.summary}`,
          ``,
          `Saran Assignment Desk: Ditugaskan ke *${isNews ? "Tim 1 (Newsroom)" : "Tim 2 (Product Lab)"}*.`,
          `Silakan konfirmasi tombol di bawah untuk mengeksekusi:`,
        ].join("\n");

        await sendTelegramMessage(chatId, replyText, {
          inline_keyboard: [
            [
              {
                text: isNews ? "📰 Gas Tim 1 (Newsroom)" : "🔬 Gas Tim 2 (Product Lab)",
                callback_data: isNews
                  ? `dispatch_news:${encodeURIComponent(item.title)}`
                  : `dispatch_product:${encodeURIComponent(item.title)}`,
              },
            ],
            [
              {
                text: isNews ? "🔬 Alihkan ke Tim 2 (Lab)" : "📰 Alihkan ke Tim 1 (Berita)",
                callback_data: isNews
                  ? `dispatch_product:${encodeURIComponent(item.title)}`
                  : `dispatch_news:${encodeURIComponent(item.title)}`,
              },
            ],
          ],
        });

        return NextResponse.json({ ok: true });
      }

      // Action: Reset Chat Session
      if (data === "reset_chat") {
        clearStoredConversationId(chatId);
        await answerCallbackQuery(cqId, "Sesi percakapan direset.");
        await sendTelegramMessage(chatId, "🔄 *Sesi percakapan direset.* Silakan ketik ide atau topik baru untuk berdiskusi dengan AI Project Manager!");
        return NextResponse.json({ ok: true });
      }
    }

    // 2. Tangani Pesan Teks Masuk dari CEO
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat?.id;
      const text = (msg.text || "").trim();

      // Guard: Hanya pemilik yang diizinkan berinteraksi
      if (String(chatId) !== String(AUTHORIZED_CHAT_ID)) {
        await sendTelegramMessage(
          chatId,
          "🔒 *Pusat Komando Redaksi Tertutup.*\nBot ini adalah asisten internal pimpinan redaksi DaeReview."
        );
        return NextResponse.json({ ok: true });
      }

      // Command /start atau /help
      if (text === "/start" || text === "/help" || text.toLowerCase() === "menu") {
        const welcomeText = [
          `👑 *Selamat Datang di DaeReview Assignment Desk!*`,
          ``,
          `Halo Pak CEO, saya *Project Manager (Tim 0)* ruang redaksi AI DaeReview didukung *Gemini 3.1 Flash-Lite*. Saya siap membantu mengarahkan liputan dan mengeksekusi ke 2 divisi:`,
          ``,
          `📰 *Tim 1: DaeReview Newsroom* (Berita & Investigasi)`,
          `🔬 *Tim 2: DaeReview Product Lab* (Review Mendalam & Uji Gadget)`,
          ``,
          `🛠️ *Fitur & Cara Interaksi:*`,
          `• 💬 *Ngobrol Bebas:* Ketik apa saja, link berita, atau ide gadget, kita bisa brainstorming langsung seperti chat biasa.`,
          `• 💡 Kirim */trend*: Saya akan riset live via DuckDuckGo untuk mencari topik terhangat hari ini.`,
          `• 🔄 Kirim */reset*: Menghapus memori sesi obrolan saat ini untuk memulai topik baru.`,
          `• 🛡️ *Draft-First Guard:* Semua tulisan agen masuk sebagai *DRAFT*. Anda yang menentukan persetujuan terbit!`,
        ].join("\n");

        await sendTelegramMessage(chatId, welcomeText, {
          inline_keyboard: [
            [{ text: "💡 Brainstorm 5 Ide Tren Hari Ini", callback_data: "pick_trend:0" }],
            [
              { text: "✏️ Kelola Draf di Admin", url: `${SITE_URL}/admin/berita` },
              { text: "🌐 Buka Portal DaeReview", url: SITE_URL },
            ],
          ],
        });
        return NextResponse.json({ ok: true });
      }

      // Command /reset atau /clear
      if (text === "/reset" || text === "/clear" || text === "/new") {
        clearStoredConversationId(chatId);
        await sendTelegramMessage(chatId, "🔄 *Sesi percakapan telah direset.*\nSilakan ketik ide, link berita, atau pertanyaan baru!");
        return NextResponse.json({ ok: true });
      }

      // Tampilkan indikator "sedang mengetik..."
      await sendChatAction(chatId, "typing");

      // Tentukan query yang akan dikirim ke Dify AI Project Manager
      let queryForDify = text;
      if (text === "/trend") {
        queryForDify = "Tolong cari dan berikan 5 tren berita atau gadget teknologi terhangat hari ini menggunakan DuckDuckGo. Berikan ringkasan singkat dan rekomendasi apakah topik tersebut lebih cocok untuk Tim 1 (Newsroom) atau Tim 2 (Product Lab).";
      }

      // Coba chat dengan Dify Chatbot jika API Key disetel
      const difyAnswer = await chatWithDifyPM(queryForDify, chatId);

      if (difyAnswer && difyAnswer.answer) {
        const topicSnippet = text === "/trend" ? "Tren Terkini Hari Ini" : (text.length > 80 ? text.slice(0, 80) + "..." : text);
        const dispatchId = savePendingDispatch({
          topic: topicSnippet,
          angle: "Arahan CEO & Diskusi Project Manager",
        });

        await sendTelegramMessage(chatId, difyAnswer.answer, {
          inline_keyboard: [
            [
              { text: "🚀 Gas Tim 1 (Newsroom)", callback_data: `disp_news:${dispatchId}` },
              { text: "🔬 Gas Tim 2 (Product Lab)", callback_data: `disp_lab:${dispatchId}` },
            ],
            [
              { text: "🔄 Reset Chat", callback_data: "reset_chat" },
              { text: "✏️ Kelola Draf", url: `${SITE_URL}/admin/berita` },
            ],
          ],
        });

        return NextResponse.json({ ok: true });
      }

      // Fallback jika Dify PM belum disetel atau offline
      if (text === "/trend") {
        const listText = [
          `💡 *5 Ide Tren Kurasi Editorial Hari Ini:*`,
          ``,
          ...TRENDING_TOPICS.map(
            (t, i) => `${i + 1}. *[${t.type === "news" ? "BERITA" : "PRODUK"}]* ${t.title}\n_${t.summary}_\n`
          ),
          `Silakan pilih topik di bawah untuk menugaskan tim:`,
        ].join("\n");

        await sendTelegramMessage(chatId, listText, {
          inline_keyboard: TRENDING_TOPICS.map((t, i) => [
            {
              text: `${i + 1}. ${t.type === "news" ? "📰" : "🔬"} ${t.title.slice(0, 36)}...`,
              callback_data: `pick_trend:${i}`,
            },
          ]),
        });
        return NextResponse.json({ ok: true });
      }

      // Respons cerdas untuk teks/link biasa saat Dify API Key belum disetel
      const isLikelyProduct = /(review|spesifikasi|spek|laptop|hp|tws|keyboard|mouse|headset|gadget|shopee|tokopedia)/i.test(text);
      const fallbackDispatchId = savePendingDispatch({
        topic: text,
        angle: "Instruksi Langsung CEO via Telegram",
      });

      const fallbackMsg = [
        `🤖 *[Tim 0: DaeReview Project Manager]*`,
        ``,
        `Menerima ide/topik:`,
        `*${text}*`,
        ``,
        `🎯 *Rekomendasi Analisis Awal:*`,
        `Topik ini cocok digarap oleh *${isLikelyProduct ? "Tim 2: Product Lab" : "Tim 1: Newsroom"}*.`,
        ``,
        `💡 *Info AI:* Untuk mengaktifkan obrolan interaktif penuh dengan Gemini 3.1 Flash-Lite, pastikan variabel \`DIFY_PM_API_KEY\` sudah disetel di environment.`,
        ``,
        `Klik tombol di bawah untuk langsung menugaskan:`,
      ].join("\n");

      await sendTelegramMessage(chatId, fallbackMsg, {
        inline_keyboard: [
          [
            {
              text: isLikelyProduct ? "🔬 Gas Tim 2 (Product Lab)" : "🚀 Gas Tim 1 (Newsroom)",
              callback_data: isLikelyProduct ? `disp_lab:${fallbackDispatchId}` : `disp_news:${fallbackDispatchId}`,
            },
            {
              text: isLikelyProduct ? "🚀 Alihkan ke Tim 1 (News)" : "🔬 Alihkan ke Tim 2 (Lab)",
              callback_data: isLikelyProduct ? `disp_news:${fallbackDispatchId}` : `disp_lab:${fallbackDispatchId}`,
            },
          ],
          [
            { text: "💡 Brainstorm Tren", callback_data: "pick_trend:0" },
            { text: "✏️ Kelola Draf", url: `${SITE_URL}/admin/berita` },
          ],
        ],
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true, status: "ignored" });
  } catch (error: any) {
    console.error("Kesalahan Telegram Webhook:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
