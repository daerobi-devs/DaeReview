# 📘 Panduan Setup 1-Klik Dify AI Agent untuk DaeReview

Dokumen ini berisi panduan praktis untuk memasang **DaeReview Autonomous Journalist Workflow** di instans Dify AI mandirimu (`https://dify.daeroom.my.id`).

---

## 🚀 Cara Import 1-Klik File DSL ke Dify Studio

1. Buka browser dan login ke dashboard Dify kamu:  
   👉 **`https://dify.daeroom.my.id`**
2. Masuk ke menu **Studio** (ikon kuas di sidebar kiri atas).
3. Klik tombol **Create from Blank** (atau dropdown di sampingnya) ➔ pilih **Import DSL file**.
4. Upload file yang sudah disiapkan:  
   📁 `D:\daereview\dify_workflow_dsl.yml`
5. Beri nama: **`DaeReview Autonomous Journalist`** dan klik **Create**.

Workflow lengkap dengan 5 node (Input, Swiss LLM, Python Sanitizer, Direct Publisher, dan Output) akan langsung tersusun rapi di canvas Dify kamu!

---

## 🔑 Konfigurasi Environment Variables di Dify

Di canvas Dify Workflow, klik ikon **Env** di pojok kanan atas:

1. **`DAEREVIEW_API_URL`**:
   ```text
   https://daereview.daeroom.my.id/api/dify/publish
   ```
2. **`DIFY_WEBHOOK_SECRET`**:
   ```text
   dae_dify_autonomous_webhook_secret_key
   ```

---

## 🧪 Cara Menjalankan & Menguji Workflow

Klik tombol **Preview / Run** di kanan atas Dify:

1. **Uji Kasus 1: Ulas Link TikTok / Shopee**:
   - `input_mode`: `ULASAN_PRODUK_TUNGGAL`
   - `topic_or_link`: `https://vt.tiktok.com/ZSjabc123/ TWS Baseus WM02 Bluetooth 5.3`
   - `category`: `Audio & TWS`
   - Klik **Run** ➔ Dalam 5 detik artikel akan langsung tayang di portal!

2. **Uji Kasus 2: Kurasi 5 Barang Terbaik**:
   - `input_mode`: `TOP_5_BARANG_TERBAIK`
   - `topic_or_link`: `Smartwatch Murah Baterai Awet di Bawah 300 Ribu`
   - `category`: `Gadget & Setup`
   - Klik **Run** ➔ Dify akan meracik komparasi 5 jam tangan dengan link pembelian Shopee & Tokopedia.

3. **Uji Kasus 3: Cek Fakta & Bongkar Mitos**:
   - `input_mode`: `FAKTA_VS_MITOS`
   - `topic_or_link`: `Benarkah Fast Charging 120W Bikin Baterai HP Meledak?`
   - `category`: `Fakta vs Mitos`
   - Klik **Run** ➔ Dify menghasilkan artikel Cek Fakta dengan kotak **Vonis Redaksi** (*MITOS*).

---

## 🛡️ Standar Jurnalistik yang Dijamin oleh Agent:
- ❌ **Zero Fake Stars**: Agen tidak akan pernah memakai emotikon bintang (★). Semua rating berupa angka murni (`4.8 / 5`).
- ⚖️ **The Catch**: Agen wajib mencantumkan titik lemah atau kekurangan barang untuk transparansi pembaca.
- 🇮🇩 **Bahasa Indonesia Baku & Mengalir**: Menghindari frasa robotik klise AI.
- ⚡ **Auto-Publish**: Tidak perlu copas manual, artikel langsung live di database Next.js.
