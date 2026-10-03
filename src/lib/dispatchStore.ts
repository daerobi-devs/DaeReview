import fs from "fs";
import path from "path";

const DISPATCH_FILE = path.join(process.cwd(), "src", "data", "pending_dispatches.json");

export interface PendingDispatch {
  id: string;
  topic: string;
  angle?: string;
  targetDivision?: string;
  productLink?: string;
  createdAt: number;
}

export function savePendingDispatch(item: Omit<PendingDispatch, "id" | "createdAt">): string {
  try {
    const id = Date.now().toString().slice(-8);
    const dir = path.dirname(DISPATCH_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let data: Record<string, PendingDispatch> = {};
    if (fs.existsSync(DISPATCH_FILE)) {
      try {
        data = JSON.parse(fs.readFileSync(DISPATCH_FILE, "utf-8"));
      } catch {
        data = {};
      }
    }

    data[id] = {
      ...item,
      id,
      createdAt: Date.now(),
    };

    // Simpan maksimal 50 riwayat dispatch agar ukuran file hemat
    const keys = Object.keys(data);
    if (keys.length > 50) {
      for (const k of keys.slice(0, keys.length - 50)) {
        delete data[k];
      }
    }

    fs.writeFileSync(DISPATCH_FILE, JSON.stringify(data, null, 2), "utf-8");
    return id;
  } catch (err) {
    console.error("Gagal simpan pending dispatch:", err);
    return Date.now().toString().slice(-6);
  }
}

export function getPendingDispatch(id: string): PendingDispatch | null {
  try {
    if (!fs.existsSync(DISPATCH_FILE)) return null;
    const data: Record<string, PendingDispatch> = JSON.parse(
      fs.readFileSync(DISPATCH_FILE, "utf-8")
    );
    return data[id] || null;
  } catch {
    return null;
  }
}

const CONV_FILE = path.join(process.cwd(), "src", "data", "telegram_conversations.json");

export function getStoredConversationId(chatId: string | number): string {
  try {
    if (!fs.existsSync(CONV_FILE)) return "";
    const data = JSON.parse(fs.readFileSync(CONV_FILE, "utf-8"));
    return data[String(chatId)] || "";
  } catch {
    return "";
  }
}

export function saveStoredConversationId(chatId: string | number, conversationId: string): void {
  try {
    const dir = path.dirname(CONV_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    let data: Record<string, string> = {};
    if (fs.existsSync(CONV_FILE)) {
      try {
        data = JSON.parse(fs.readFileSync(CONV_FILE, "utf-8"));
      } catch {
        data = {};
      }
    }
    data[String(chatId)] = conversationId;
    fs.writeFileSync(CONV_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Gagal simpan telegram conversation ID:", err);
  }
}

export function clearStoredConversationId(chatId: string | number): void {
  try {
    if (!fs.existsSync(CONV_FILE)) return;
    const data = JSON.parse(fs.readFileSync(CONV_FILE, "utf-8"));
    delete data[String(chatId)];
    fs.writeFileSync(CONV_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Gagal clear telegram conversation ID:", err);
  }
}


