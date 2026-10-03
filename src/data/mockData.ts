export interface Product {
  id: string;
  rank: number;
  badge: "PILIHAN UTAMA" | "HARGA TERBAIK" | "KUALITAS PREMIUM" | "POPULER";
  name: string;
  tagline: string;
  category: string;
  rating: number;
  reviewCount: number;
  price: string;
  originalPrice?: string;
  discount?: string;
  image: string;
  pros: string[];
  cons: string[];
  specs: Record<string, string>;
  shopeeUrl: string;
  tokopediaUrl: string;
  verifiedOfficial: boolean;
  verdict: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: "Fakta vs Mitos" | "Teknologi & AI" | "Gadget" | "Tren Belanja" | "Smart Home" | "Tips Hemat" | "Audio & Setup" | "Peralatan Dapur";
  date: string;
  readTime: string;
  image: string;
  summary: string;
  isTrending?: boolean;
  author: string;
  content: string[];
  relatedProductId?: string;
  isFactCheck?: boolean;
  verdictFactCheck?: "FAKTA" | "MITOS" | "SEBAGIAN BENAR";
  quickTakeaway?: string;
  isCustom?: boolean;
}

export const CATEGORIES = [
  { id: "semua", name: "Semua Kategori", icon: "Grid" },
  { id: "gadget", name: "Gadget & Setup", icon: "Laptop" },
  { id: "audio", name: "Audio & TWS", icon: "Headphones" },
  { id: "smarthome", name: "Smart Home", icon: "Home" },
  { id: "dapur", name: "Peralatan Dapur", icon: "Coffee" },
  { id: "lifestyle", name: "Gaya Hidup", icon: "Watch" },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "baseus-bowie-wm02",
    rank: 1,
    badge: "HARGA TERBAIK",
    name: "Baseus Bowie WM02 TWS Earphone",
    tagline: "TWS mungil dengan latensi rendah dan daya tahan baterai 25 jam paling worth-it di bawah 200 ribu.",
    category: "audio",
    rating: 4.9,
    reviewCount: 48200,
    price: "Rp 169.000",
    originalPrice: "Rp 299.000",
    discount: "43%",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    pros: [
      "Ukuran super ringkas dan ringan di telinga (3.8 gram)",
      "Baterai awet hingga 25 jam bersama casing",
      "Koneksi Bluetooth 5.3 stabil dengan delay minim (0.06 detik)",
      "Aplikasi Baseus dengan pengaturan equalizer lengkap"
    ],
    cons: [
      "Belum dilengkapi fitur Active Noise Cancellation (ANC)",
      "Bahan casing plastik doff agak licin jika tangan basah"
    ],
    specs: {
      "Bluetooth": "5.3 (Koneksi Stabil)",
      "Baterai": "5 jam (Earphone) + 20 jam (Case)",
      "Port Pengisian": "USB Type-C Fast Charge",
      "Mikrofon": "Dual Mic ENC",
      "Garansi Resmi": "12 Bulan Baseus Indonesia"
    },
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    verifiedOfficial: true,
    verdict: "Pilihan nomor satu untuk pelajar, mahasiswa, atau pekerja yang mencari earphone harian tanpa perlu takut kantong jebol."
  },
  {
    id: "aula-f75-keyboard",
    rank: 2,
    badge: "PILIHAN UTAMA",
    name: "AULA F75 Wireless Mechanical Keyboard",
    tagline: "Keyboard mekanikal 75% terbaik dengan struktur gasket mount super empuk dan suara 'thock' bawaan pabrik.",
    category: "gadget",
    rating: 4.95,
    reviewCount: 15400,
    price: "Rp 689.000",
    originalPrice: "Rp 899.000",
    discount: "23%",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    pros: [
      "Struktur 5 lapis peredam suara (Gasket Mount premium)",
      "3 Mode Koneksi: Bluetooth 5.0, 2.4Ghz Dongle, dan Type-C kabel",
      "Keycaps PBT Cherry profile anti luntur dan tahan minyak",
      "Tombol kenop putar volume multifungsi berbahan metal"
    ],
    cons: [
      "Bobot relatif berat (sekitar 1 kg) kurang cocok dibawa bepergian",
      "Software kustomisasi RGB hanya tersedia untuk Windows"
    ],
    specs: {
      "Layout": "75% Compact (80 Tombol + Knob)",
      "Switch": "LEOBOG Reaper / Ice Cyan Switch (Pre-lubed)",
      "Baterai": "4000 mAh Li-ion Rechargeable",
      "Fitur": "Full Key Hot-swappable (3-pin / 5-pin)",
      "Garansi Resmi": "1 Tahun Garansi Distributor"
    },
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    verifiedOfficial: true,
    verdict: "Ketik seharian tanpa lelah. Standar baru keyboard mekanikal budget yang mengalahkan keyboard seharga 1,5 jutaan."
  },
  {
    id: "xiaomi-robot-vacuum-e10",
    rank: 3,
    badge: "POPULER",
    name: "Xiaomi Robot Vacuum E10 Smart Cleaner",
    tagline: "Sapu dan pel lantai otomatis dengan daya hisap 4000Pa dan integrasi aplikasi Mi Home yang cerdas.",
    category: "smarthome",
    rating: 4.85,
    reviewCount: 9200,
    price: "Rp 1.849.000",
    originalPrice: "Rp 2.499.000",
    discount: "26%",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80",
    pros: [
      "Daya hisap tinggi 4000Pa efektif angkat debu dan bulu hewan",
      "Kombinasi 2-in-1 sapu sekaligus pel dengan tangki air cerdas",
      "Bodi ramping 8cm mudah menyusup ke kolong tempat tidur dan sofa",
      "Kendali penuh lewat smartphone dari mana saja via WiFi"
    ],
    cons: [
      "Sensor navigasi berbasis gyroskopik, belum memakai LiDAR laser",
      "Perlu merapikan kabel lantai sebelum robot mulai membersihkan"
    ],
    specs: {
      "Daya Hisap": "4000 Pa (4 Tingkat Kecepatan)",
      "Kapasitas Baterai": "2600 mAh (Membersihkan hingga 100m²)",
      "Tangki Air": "200ml Smart Electric Controlled",
      "Kontrol": "Aplikasi Mi Home & Voice Assistant",
      "Garansi": "1 Tahun Garansi Resmi Xiaomi Indonesia"
    },
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    verifiedOfficial: true,
    verdict: "Investasi waktu terbaik bagi Anda yang sibuk bekerja. Lantai selalu bersih mengkilap saat Anda tiba di rumah."
  },
  {
    id: "gaabor-air-fryer-af40m",
    rank: 4,
    badge: "HARGA TERBAIK",
    name: "Gaabor Air Fryer 4 Liter AF40M-WH02A",
    tagline: "Air fryer berkapasitas besar 4 Liter dengan sirkulasi panas 360 derajat untuk makanan renyah tanpa minyak.",
    category: "dapur",
    rating: 4.88,
    reviewCount: 31000,
    price: "Rp 269.000",
    originalPrice: "Rp 599.000",
    discount: "55%",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
    pros: [
      "Kapasitas muat 4 Liter cukup untuk seekor ayam utuh",
      "Daya listrik hemat (hanya 800 Watt)",
      "Lapisan keranjang anti-lengket sangat mudah dicuci",
      "Knob ganda mekanikal yang awet dan mudah dioperasikan orang tua"
    ],
    cons: [
      "Tanpa panel digital/layar sentuh (tipe kenop putar klasik)",
      "Waktu memasak lebih lama 3-5 menit dibanding oven listrik besar"
    ],
    specs: {
      "Kapasitas": "4.0 Liter",
      "Konsumsi Daya": "800 Watt",
      "Pengatur Suhu": "80°C - 200°C",
      "Timer": "0 - 30 Menit Auto-off",
      "Garansi Resmi": "1 Tahun Ganti Baru"
    },
    shopeeUrl: "https://shopee.co.id",
    tokopediaUrl: "https://tokopedia.com",
    verifiedOfficial: true,
    verdict: "Alat masak wajib anak kos dan keluarga muda yang ingin hidup lebih sehat bebas minyak jenuh dengan budget minimal."
  }
];

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: "news-1",
    title: "Bocoran Harga dan Jadwal Rilis Gadget Terbaru 2026: Mana yang Paling Layak Ditunggu?",
    slug: "bocoran-harga-gadget-terbaru-2026",
    category: "Gadget",
    date: "3 Oktober 2026",
    readTime: "4 mnt baca",
    author: "Daerobi (Lead Editor)",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
    summary: "Rangkuman lengkap tren prosesor hemat daya terbaru, integrasi on-device AI di ponsel kelas menengah, serta prediksi penurunan harga seri flagship tahun lalu di marketplace.",
    isTrending: true,
    relatedProductId: "aula-f75-keyboard",
    content: [
      "Tahun 2026 menandai pergeseran besar dalam industri gadget konsumen. Jika dua tahun lalu fitur kecerdasan buatan (AI) hanya bisa dinikmati pada ponsel kelas atas berharga belasan juta rupiah, kini teknologi NPU hemat daya mulai merambah perangkat kelas menengah (mid-range).",
      "Berdasarkan pantauan rantai pasok dan data import e-commerce Asia Tenggara, gelombang rilis kuartal terakhir ini akan didominasi oleh laptop tipis berdaya tahan baterai di atas 18 jam serta ponsel dengan kamera sensor besar yang mengutamakan pemrosesan foto natural tanpa over-sharpening.",
      "Namun, pertanyaannya: apakah Anda wajib segera meng-upgrade perangkat lama Anda? Menurut analisis data historis kami di Shopee dan Tokopedia, peluncuran produk baru justru merupakan momen emas untuk meminang produk flagship generasi sebelumnya yang mengalami pemangkasan harga hingga 30-40% dengan performa yang masih sangat mumpuni untuk 3-4 tahun ke depan.",
      "Bagi Anda yang fokus pada produktivitas meja kerja, tren peripheral nirkabel dengan latensi super rendah seperti keyboard mekanikal dan mouse ergonomis tetap menjadi investasi terbaik untuk kenyamanan harian Anda."
    ]
  },
  {
    id: "news-2",
    title: "Tips Memilih TWS Murah Agar Suara Tidak 'Mendem' dan Tahan Dipakai Olahraga",
    slug: "tips-memilih-tws-murah-olahraga",
    category: "Tren Belanja",
    date: "2 Oktober 2026",
    readTime: "3 mnt baca",
    author: "Daerobi (Lead Editor)",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    summary: "Jangan tertipu klaim bass nendang palsu. Ini 4 hal teknis (driver size, sertifikasi IPX air, dan codec AAC) yang wajib kamu periksa sebelum checkout.",
    isTrending: false,
    relatedProductId: "baseus-bowie-wm02",
    content: [
      "Banyak orang tergiur membeli earphone nirkabel True Wireless Stereo (TWS) seharga puluhan ribu rupiah di marketplace, namun berujung kecewa karena suara vokal terdengar seperti di dalam kaleng dan koneksi sering putus saat ponsel dikantongi.",
      "Kunci pertama dalam memilih TWS ramah kantong adalah memeriksa ukuran driver dinamis. Driver berdiameter 10mm hingga 13mm umumnya mampu menghasilkan dentuman bass yang padat tanpa menenggelamkan frekuensi vokal dan treble.",
      "Kedua, perhatikan dukungan audio codec. Minimal pastikan TWS tersebut mendukung AAC selain SBC standar, terutama jika Anda menggunakan perangkat iPhone. Codec AAC menjaga kejernihan transmisi audio nirkabel dengan bitrate yang lebih konsisten.",
      "Terakhir untuk kebutuhan olahraga, cari sertifikasi minimal IPX4 yang tahan cipratan keringat dan gerimis hujan ringan. Hindari TWS tanpa rating ketahanan air jika Anda sering memakainya saat jogging atau bersepeda."
    ]
  },
  {
    id: "news-3",
    title: "Panduan Membangun Smart Home Budget 1 Juta: Rumah Pintar Tanpa Bongkar Tembok",
    slug: "panduan-smart-home-budget-1-juta",
    category: "Smart Home",
    date: "1 Oktober 2026",
    readTime: "5 mnt baca",
    author: "Dimas Prasetyo",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    summary: "Mulai dari smart bulb RGB, smart plug pemutus arus otomatis, hingga sensor suhu murah yang bisa diintegrasikan dengan Google Assistant dan Alexa.",
    isTrending: false,
    relatedProductId: "xiaomi-robot-vacuum-e10",
    content: [
      "Mengubah rumah biasa menjadi smart home tidak lagi memerlukan instalasi kabel rumit atau biaya belasan juta rupiah. Dengan ekosistem IoT modern berbasis WiFi dan protokol Matter, Anda bisa memulai otomasi rumah hanya dengan budget Rp 1 juta.",
      "Langkah pertama adalah smart lighting. Mengganti bohlam kamar tidur dan teras dengan Smart Bulb RGB (seharga Rp 70rb - Rp 90rb) memungkinkan Anda mengatur jadwal mati-nyala otomatis saat matahari terbenam atau berganti warna redup saat waktu tidur tiba.",
      "Langkah kedua adalah Smart Plug (colokan pintar seharga Rp 60rb-an). Pasang pada dispenser, charger laptop, atau pembuat kopi untuk memutus aliran listrik secara otomatis saat baterai penuh demi mencegah risiko korsleting dan menghemat tagihan listrik bulanan.",
      "Investasi terbesar yang sangat direkomendasikan adalah robot pembersih lantai otomatis. Membiarkan robot menyapu dan mengepel setiap siang hari saat rumah kosong akan menghemat waktu istirahat Anda sepulang bekerja."
    ]
  },
  {
    id: "news-4",
    title: "Trik Rahasia Klaim Diskon Payday & Flash Sale Shopee Tokopedia: Jangan Checkout Sebelum Jam 00.00",
    slug: "trik-rahasia-diskon-payday-flash-sale-shopee-tokopedia",
    category: "Tips Hemat",
    date: "3 Oktober 2026",
    readTime: "4 mnt baca",
    author: "Daerobi (Lead Editor)",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80",
    summary: "Panduan praktis mengamankan cashback hingga 50%, voucher gratis ongkir tanpa minimum belanja, dan cara membedakan diskon markup buatan toko nakal.",
    isTrending: true,
    relatedProductId: "baseus-bowie-wm02",
    content: [
      "Setiap tanggal gajian (Payday) dan festival tanggal kembar seperti 10.10 atau 11.11, e-commerce besar seperti Shopee dan Tokopedia menggelar perang voucher. Namun mengapa banyak orang selalu gagal klaim voucher potongan besar?",
      "Kunci utamanya adalah 'keranjang aktif'. Jangan baru mencari barang 5 menit sebelum promo dimulai. Masukkan barang yang Anda incar ke keranjang 1-2 hari sebelumnya, lalu pantau fluktuasi harganya menggunakan ekstensi riwayat harga untuk memastikan penjual tidak menaikkan harga dasar secara sepihak sebelum memberi diskon palsu.",
      "Kedua, klaim voucher toko dan voucher platform secara terpisah. Di marketplace Indonesia, Anda seringkali bisa menumpuk (stacking) tiga jenis kupon sekaligus: Voucher Diskon Toko + Voucher Diskon Marketplace + Voucher Gratis Ongkir Xtra.",
      "Terakhir, manfaatkan pembayaran e-wallet terintegrasi (seperti ShopeePay, GoPay, atau kartu debit mitra) yang memberikan diskon instan tambahan di halaman pembayaran akhir."
    ]
  },
  {
    id: "news-5",
    title: "Mengapa Monitor Light Bar Lebih Sehat untuk Mata Dibanding Lampu Meja Biasa?",
    slug: "alasan-monitor-light-bar-lebih-sehat-untuk-mata",
    category: "Audio & Setup",
    date: "3 Oktober 2026",
    readTime: "4 mnt baca",
    author: "Dimas Prasetyo",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
    summary: "Solusi silau pada layar komputer, teknologi asimetris pemantul cahaya, dan rekomendasi light bar budget di bawah 300 ribu yang awet.",
    isTrending: false,
    relatedProductId: "aula-f75-keyboard",
    content: [
      "Jika Anda sering bekerja di depan monitor laptop atau komputer hingga larut malam dan merasakan mata cepat lelah, perih, atau sakit kepala, masalah utamanya seringkali berasal dari pantulan cahaya lampu ruangan (glare).",
      "Lampu meja biasa memancarkan cahaya ke segala arah, termasuk langsung memantul pada panel kaca monitor Anda. Sebaliknya, Monitor Light Bar dirancang dengan sudut pencahayaan asimetris (45 derajat) yang hanya menyinari area meja kerja dan keyboard Anda, tanpa menembak ke layar maupun ke mata Anda.",
      "Selain menghemat ruang meja kerja karena dipasang di atas bezel monitor, light bar berkualitas kini dilengkapi penyesuaian suhu warna (Color Temperature 3000K - 6500K) dari cahaya hangat untuk mengetik rileks hingga cahaya putih dingin untuk fokus kerja intensif.",
      "Kabar baiknya, kini Anda tidak perlu merogoh kocek jutaan rupiah untuk merk premium impor. Banyak brand lokal dan Asia terpercaya menyediakan monitor bar berkualitas bersertifikasi anti blue-light di rentang harga Rp 180rb hingga Rp 350rb."
    ]
  },
  {
    id: "news-6",
    title: "Air Fryer vs Oven Listrik untuk Anak Kos & Keluarga Muda: Mana yang Lebih Hemat Listrik?",
    slug: "air-fryer-vs-oven-listrik-mana-lebih-hemat",
    category: "Peralatan Dapur",
    date: "2 Oktober 2026",
    readTime: "5 mnt baca",
    author: "Siti Rahmawati",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80",
    summary: "Perbandingan konsumsi watt riil, kecepatan masak, kemudahan cuci, serta hitungan biaya token listrik PLN bulanan.",
    isTrending: false,
    relatedProductId: "mecoo-air-fryer-aesthetic",
    content: [
      "Perdebatan antara membeli air fryer atau oven listrik mini selalu menjadi dilema bagi penghuni rumah baru, pasangan muda, maupun mahasiswa indekos. Keduanya sama-sama bisa memanggang, namun cara kerja dan efisiensi energinya sangat berbeda.",
      "Air fryer bekerja menggunakan sirkulasi udara panas berkecepatan tinggi di ruang tertutup yang ringkas (rapid air technology). Karena ruang masaknya kecil, air fryer tidak butuh waktu lama untuk pre-heating (pemanasan awal). Rata-rata menggoreng ayam crispy atau nugget hanya butuh waktu 12-15 menit pada daya 600-650 Watt.",
      "Sebaliknya, oven listrik memiliki kapasitas rongga yang jauh lebih besar dan butuh waktu 10-15 menit hanya untuk mencapai suhu kerja optimal sebelum makanan dimasukkan, dengan konsumsi daya rata-rata 800 - 1200 Watt.",
      "Kesimpulannya: Jika Anda memasak dalam porsi 1-3 orang untuk kebutuhan praktis harian tanpa minyak, air fryer jauh lebih hemat listrik dan waktu. Oven listrik baru unggul jika Anda hobi membuat kue basah (baking) dalam loyang besar."
    ]
  },
  {
    id: "news-7",
    title: "5 Titik Krusial Pemasangan Smart Door Lock di Rumah: Keamanan Digital Bebas Kunci Fisik",
    slug: "panduan-pasang-smart-door-lock-rumah-minimalis",
    category: "Smart Home",
    date: "2 Oktober 2026",
    readTime: "5 mnt baca",
    author: "Dimas Prasetyo",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80",
    summary: "Metode sidik jari semikonduktor, password anti-peeping, cadangan baterai darurat USB-C, dan rekomendasi merek garansi resmi Indonesia.",
    isTrending: false,
    relatedProductId: "xiaomi-robot-vacuum-e10",
    content: [
      "Mengganti kunci pintu konvensional menjadi kunci pintar (smart door lock) adalah salah satu upgrade rumah paling memuaskan. Anda tidak perlu lagi khawatir kunci rumah tertinggal di kantor atau panik saat ada kerabat yang bertamu lebih awal.",
      "Namun sebelum membeli di marketplace, ada beberapa hal teknis yang wajib diperhatikan. Pertama, periksa ketebalan pintu Anda (standar pintu kayu Indonesia umumnya 3.5cm - 5cm). Pastikan mortise lock yang Anda beli cocok dengan ketebalan dan kedalaman lubang pintu.",
      "Kedua, pilih sensor sidik jari tipe semi-konduktor, bukan optik kuno. Sensor semi-konduktor membaca alur biometrik di bawah lapisan kulit sehingga tidak bisa diduplikasi menggunakan cetakan sidik jari palsu.",
      "Ketiga, pastikan memiliki emergency power port berupa colokan USB-C di bagian luar gagang pintu. Ini berguna untuk menghidupkan handle menggunakan powerbank jika suatu saat Anda lupa mengganti baterai AA bawaannya yang habis."
    ]
  },
  {
    id: "news-8",
    title: "Waspada Produk Elektronik Rekondisi 'Garansi Distributor' di Marketplace: Cara Cek Nomor Seri Resmi",
    slug: "cara-cek-garansi-resmi-elektronik-marketplace",
    category: "Tren Belanja",
    date: "1 Oktober 2026",
    readTime: "4 mnt baca",
    author: "Daerobi (Lead Editor)",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80",
    summary: "Langkah mengecek nomor IMEI/SN di database Kemenperin dan situs prinsipal resmi sebelum memberi konfirmasi pesanan selesai.",
    isTrending: false,
    relatedProductId: "aula-f75-keyboard",
    content: [
      "Pernahkah Anda melihat produk smartphone, headphone, atau smartwatch dijual dengan selisih harga 40% lebih murah dari toko resmi dengan embel-embel 'Garansi Distributor 1 Tahun' atau 'BNIB ex-inter'?",
      "Sebagai konsumen cerdas, Anda wajib berhati-hati. Garansi distributor tidak memiliki service center resmi di kota-kota Indonesia. Jika perangkat Anda rusak dalam 3 bulan, proses klaim seringkali berbelit-belit dan dikenakan biaya servis tersembunyi yang mahal.",
      "Untuk perangkat berseluler, pastikan IMEI terdaftar di database Kemenperin atau Bea Cukai agar jaringan SIM card Anda tidak diblokir permanen setelah 3 bulan pemakaian.",
      "Tips terbaik kami di DaeReview: selalu utamakan toko dengan centang 'Official Store' atau 'Shopee Mall' / 'Tokopedia Official'. Selisih harga Rp 50.000 - Rp 100.000 jauh lebih murah dibanding ketenangan pikiran memiliki garansi resmi prinsipal yang bisa diservis di seluruh Indonesia."
    ]
  },
  {
    id: "news-9",
    title: "Fakta vs Mitos: Benarkah Ngecas HP Ditinggal Tidur Semalaman Bikin Baterai Bocor?",
    slug: "fakta-mitos-ngecas-hp-semalaman-baterai-bocor",
    category: "Fakta vs Mitos",
    date: "3 Oktober 2026",
    readTime: "4 mnt baca",
    author: "Daerobi (Lead Editor)",
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80",
    summary: "Membongkar cara kerja chip BMS (Battery Management System), trickle charging otomatis saat 100%, dan musuh utama baterai lithium yang sebenarnya: suhu panas, bukan durasi colokan.",
    isTrending: true,
    isFactCheck: true,
    verdictFactCheck: "MITOS",
    quickTakeaway: "MITOS. Smartphone modern memiliki chip proteksi pintar yang otomatis memutus arus utama begitu indikator menyentuh 100%. Musuh nomor satu baterai adalah suhu panas (misal tertindih bantal saat dicas) dan kebiasaan membiarkan baterai drop sampai 0%.",
    relatedProductId: "baseus-bowie-wm02",
    content: [
      "Mitos bahwa mengecas smartphone semalaman akan membuat baterai kembung, meledak, atau 'bocor' adalah warisan teknologi baterai Nickel-Cadmium (NiCd) dari era ponsel tahun 1990-an yang keliru jika masih diterapkan pada smartphone modern saat ini.",
      "Semua smartphone modern saat ini menggunakan baterai Lithium-Ion atau Lithium-Polymer yang dikendalikan oleh sirkuit proteksi terpadu bernama Battery Management System (BMS). Ketika baterai telah mencapai kapasitas 100%, chip BMS secara otomatis menghentikan arus pengisian utama dan beralih ke mode 'trickle charge' (hanya memasok daya mikro secukupnya untuk menjaga ponsel tetap menyala tanpa mengisi baterai lagi).",
      "Lalu apa musuh nomor satu kesehatan baterai (battery health) yang sebenarnya? Jawabannya adalah SUHU PANAS (Thermal Stress). Jika Anda mengecas ponsel di atas kasur busa atau tertutup bantal, panas yang terperangkap tidak bisa keluar. Panas ekstrem inilah yang merusak struktur kimia elektrolit baterai lithium, bukan durasi Anda mencolokkan kabel.",
      "Tips terbaik redaksi DaeReview: Anda bebas tidur nyenyak sambil mengecas HP, asalkan letakkan ponsel di atas permukaan keras dan sejuk (seperti meja kayu) serta lepaskan casing pelindung yang terlalu tebal."
    ]
  },
  {
    id: "news-10",
    title: "Fakta vs Mitos: Benarkah Masak Pakai Air Fryer Menghasilkan Radiasi dan Senyawa Berbahaya?",
    slug: "fakta-mitos-air-fryer-radiasi-senyawa-berbahaya",
    category: "Fakta vs Mitos",
    date: "3 Oktober 2026",
    readTime: "5 mnt baca",
    author: "Siti Rahmawati",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80",
    summary: "Kajian ilmiah: Air fryer sama sekali TIDAK menggunakan radiasi elektromagnetik seperti microwave, melainkan murni udara panas konveksi. Justru mengurangi akrilamida hingga 90% dibanding menggoreng minyak jelantah.",
    isTrending: true,
    isFactCheck: true,
    verdictFactCheck: "MITOS",
    quickTakeaway: "MITOS. Air fryer bekerja murni menggunakan elemen kawat pemanas dan kipas udara (konveksi mekanis), tanpa gelombang radiasi nuklir atau elektromagnetik. Dari sisi kesehatan, menggoreng tanpa minyak jelantah justru memangkas lemak jenuh hingga 80%.",
    relatedProductId: "mecoo-air-fryer-aesthetic",
    content: [
      "Kepanikan massal seringkali beredar di grup obrolan keluarga mengenai air fryer yang diklaim 'memancarkan radiasi berbahaya' dan menyebabkan kanker. Sebagai tim penguji independen, kami menelusuri literatur sains dan cara kerja mekanis alat ini.",
      "Fakta fundamental: Air fryer BUKAN microwave. Air fryer tidak menghasilkan radiasi gelombang mikro sama sekali. Cara kerja air fryer 100% sama dengan oven konveksi tradisional: elemen koil logam memanas karena dialiri listrik, lalu kipas angin berkecepatan tinggi meniupkan udara panas tersebut berputar-putar di dalam wadah memasak.",
      "Terkait zat karsinogenik (penyebab kanker): Senyawa kimia berbahaya seperti Akrilamida terbentuk ketika makanan berkarbohidrat tinggi dimasak pada suhu sangat ekstrem dalam waktu lama. Riset internasional justru membuktikan bahwa menggoreng menggunakan air fryer memangkas pembentukan senyawa akrilamida hingga 90% dibandingkan menggoreng deep-fried dalam minyak jelantah yang dipanaskan berulang kali.",
      "Kesimpulan: Air fryer aman digunakan harian untuk keluarga. Kuncinya cukup satu: jangan memasak hingga makanan gosong (suhu ideal 160°C - 180°C) dan bersihkan lapisan anti-lengket wadah secara lembut tanpa spons kawat."
    ]
  },
  {
    id: "news-11",
    title: "Fakta vs Mitos: Membiarkan Charger Menancap di Stopkontak Tanpa Dipakai Bikin Tagihan Listrik Boncos?",
    slug: "fakta-mitos-charger-menancap-bikin-tagihan-listrik-bocor",
    category: "Fakta vs Mitos",
    date: "2 Oktober 2026",
    readTime: "4 mnt baca",
    author: "Dimas Prasetyo",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
    summary: "Hasil pengukuran riil alat wattmeter: konsumsi daya vampir (standby power) charger original di bawah 0.2 Watt (kurang dari Rp 300 per bulan). Namun ada satu risiko nyata: bahaya korsleting jika memakai charger abal-abal.",
    isTrending: false,
    isFactCheck: true,
    verdictFactCheck: "SEBAGIAN BENAR",
    quickTakeaway: "SEBAGIAN BENAR. Dari sisi tagihan listrik, daya 'vampir' charger nganggur hanya memakan sekitar Rp 250 - Rp 500 per tahun. Namun dari sisi keamanan kebakaran, charger murah tanpa sertifikasi SNI rawan korsleting jika dibiarkan terhubung 24 jam.",
    relatedProductId: "xiaomi-robot-vacuum-e10",
    content: [
      "Banyak orang tua sering menegur anggota keluarga yang lupa mencabut charger HP dari colokan dinding dengan alasan 'bikin meteran listrik jebol'. Apakah mitos konsumsi listrik ini benar secara angka kalkulasi matematis?",
      "Kami melakukan pengujian langsung menggunakan Digital Wattmeter presisi tinggi pada berbagai adaptor charger (mulai dari 15W hingga 100W GaN charger). Saat charger dibiarkan menancap di stopkontak tanpa ada HP yang terhubung, konsumsi daya rata-rata (idle standby power) berada di angka 0.1 Watt hingga 0.25 Watt.",
      "Jika kita hitung tarif listrik PLN golongan rumah tangga (sekitar Rp 1.444 per kWh), maka satu charger yang menancap 24 jam non-stop selama satu bulan penuh hanya mengonsumsi listrik sekitar 0.15 kWh atau setara dengan Rp 216 per bulan. Sangat jauh dari kata 'bikin boncos'.",
      "NAMUN, ada bahaya laten yang wajib diwaspadai: KUALITAS KOMPONEN. Jika Anda menggunakan adaptor non-resmi murahan seharga belasan ribu rupiah tanpa pengaman sirkuit (surge protection), membiarkannya terus menerima arus tegangan 220V dapat memicu panas berlebih (overheating) pada kapasitor internal dan berpotensi memicu korsleting api. Cabutlah charger demi keselamatan kebakaran rumah Anda, bukan semata karena takut tagihan listrik."
    ]
  },
  {
    id: "news-12",
    title: "AI di Laptop dan HP Baru 2026: Benar-benar Membantu Produktivitas Harian atau Cuma Gimmick Marketing?",
    slug: "ai-laptop-smartphone-bantu-kerja-atau-gimmick",
    category: "Teknologi & AI",
    date: "3 Oktober 2026",
    readTime: "5 mnt baca",
    author: "Daerobi (Lead Editor)",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    summary: "Uji performa chip NPU (Neural Processing Unit): membedakan fitur yang benar-benar mengubah cara kerja (transkripsi rapat lokal, live translation, smart battery) vs fitur gimmick yang hanya dicoba sekali.",
    isTrending: true,
    isFactCheck: false,
    relatedProductId: "aula-f75-keyboard",
    content: [
      "Hampir setiap peluncuran laptop dan ponsel pintar tahun 2026 kini dihiasi logo 'AI PC' atau 'Galaxy AI / Apple Intelligence'. Merek berlomba-lomba menaikkan harga produk dengan dalih kehadiran chip Neural Processing Unit (NPU). Pertanyaannya: apakah Anda benar-benar membutuhkannya?",
      "Setelah 6 bulan menguji berbagai perangkat bertenaga NPU, kami menemukan bahwa ada garis pemisah tegas antara 'Fitur Berguna Nyata' dan 'Gimmick Pemasaran'.",
      "Fitur AI yang Nyata Mengubah Hidup: 1) Transkripsi Rapat & Notulensi Suara Lokal tanpa internet dengan akurasi 95%. 2) Penghapus Suara Bising Mikrofon (Noise Cancellation) berbasis AI saat Zoom meeting di kafe ramai. 3) Manajemen Daya Adaptif yang membuat laptop tipis bisa bertahan 18-20 jam karena beban komputasi background dipindahkan ke NPU yang super hemat daya.",
      "Fitur AI yang Cenderung Gimmick: Menghasilkan gambar stiker kartun acak, merangkum teks obrolan pendek yang sebenarnya bisa dibaca sendiri dalam 5 detik, serta fitur edit foto manipulatif yang seringkali membuat hasil foto terlihat seperti lukisan cat minyak yang tidak natural.",
      "Saran belanja kami: Jangan bayar ekstra Rp 3-5 juta hanya demi stiker 'AI Ready' jika kebutuhan Anda sekadar mengetik dokumen Office, browsing, dan menonton video. Namun jika Anda pekerja profesional, jurnalis, atau kreator konten yang sering rapat jarak jauh, laptop dengan NPU minimal 40 TOPS akan menghemat waktu kerja harian Anda secara signifikan."
    ]
  },
  {
    id: "news-13",
    title: "ChatGPT Plus, Claude Pro, atau Gemini Advanced: Mana AI Berlangganan yang Paling Worth-It di Indonesia?",
    slug: "perbandingan-ai-chatgpt-claude-gemini-worth-it-indonesia",
    category: "Teknologi & AI",
    date: "2 Oktober 2026",
    readTime: "6 mnt baca",
    author: "Daerobi (Lead Editor)",
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
    summary: "Pengujian 4 skenario riil: pemahaman bahasa Indonesia luwes, analisis berkas dokumen PDF ratusan halaman, kemampuan coding praktis, dan integrasi dengan Google Docs vs Office 365.",
    isTrending: true,
    isFactCheck: false,
    relatedProductId: "aula-f75-keyboard",
    content: [
      "Dengan biaya langganan rata-rata Rp 300.000 - Rp 350.000 per bulan, memilih asisten kecerdasan buatan (AI) berbayar memerlukan pertimbangan matang. Mana yang memberikan return-on-investment tertinggi untuk pengguna di Indonesia?",
      "Claude 3.5 Sonnet / Opus (Anthropic): Juaranya Menulis & Pemrograman. Dalam pengujian kami, Claude memiliki kemampuan berbahasa Indonesia paling natural, tidak kaku, dan minim halusinasi. Untuk urusan menulis esai, laporan riset, serta menyusun kode pemrograman (coding), Claude saat ini memimpin di puncak industri.",
      "ChatGPT Plus (OpenAI): Juaranya Fitur All-in-One. OpenAI unggul dalam variasi alat: integrasi browser web realtime, generator gambar DALL-E, mode suara interaktif (Voice Mode) dengan jeda super minim, serta ekosistem Custom GPTs yang sangat melimpah.",
      "Gemini Advanced (Google): Juaranya Ekosistem Kerja Terpadu. Jika Anda bekerja setiap hari menggunakan Google Workspace (Gmail, Google Docs, Drive, Sheets), Gemini adalah pilihan paling praktis. Selain itu, kuota context window hingga 2 juta token miliknya mampu mencerna satu buku tebal atau ratusan laporan keuangan sekaligus tanpa terpotong.",
      "Vonis Rekomendasi: Untuk mahasiswa dan penulis: pilih Claude Pro. Untuk pekerja tech dan umum yang butuh serba bisa: pilih ChatGPT Plus. Untuk korporat pengguna berat Google Drive: pilih Gemini Advanced."
    ]
  }
];

export interface BuyingGuideProduct {
  rank: number;
  badge: "PILIHAN UTAMA" | "PALING HEMAT" | "KUALITAS PREMIUM" | "POPULER";
  name: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  price: string;
  originalPrice?: string;
  discount?: string;
  image: string;
  verdict: string;
  pros: string[];
  cons: string[];
  specs: Record<string, string>;
  shopeeUrl: string;
  tokopediaUrl: string;
  verifiedOfficial: boolean;
}

export interface Editor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export const EDITORS: Record<string, Editor> = {
  daerobi: {
    id: "daerobi",
    name: "Daerobi",
    role: "Lead Tech & Workspace Specialist",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80",
    bio: "Kurator utama riset gadget, mechanical keyboard, dan audio nirkabel berfokus pada value-for-money belanja Indonesia."
  },
  dimas: {
    id: "dimas",
    name: "Dimas Prasetyo",
    role: "Smart Home & Ecosystem Specialist",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80",
    bio: "Spesialis pengujian robot vacuum, otomasi IoT, dan efisiensi teknologi rumah tangga cerdas."
  },
  siti: {
    id: "siti",
    name: "Siti Rahmawati",
    role: "Home Appliances & Lifestyle Specialist",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80",
    bio: "Fokus pada pengujian peralatan dapur low watt dan perangkat gaya hidup sehat."
  }
};

export interface BuyingGuide {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: "gadget" | "audio" | "smarthome" | "dapur" | "lifestyle";
  categoryName: string;
  updatedAt: string;
  readTime: string;
  author: Editor;
  coverImage: string;
  excerpt: string;
  isFeatured?: boolean;
  itemCount: number;
  intro: string[];
  quickPicks: {
    type: "Terbaik" | "Termurah" | "Premium";
    badge: string;
    name: string;
    price: string;
    shopeeUrl: string;
    tokopediaUrl: string;
    image: string;
  }[];
  products: BuyingGuideProduct[];
  buyingAdvice: {
    title: string;
    content: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

export const BUYING_GUIDES: BuyingGuide[] = [
  {
    id: "guide-tws-2026",
    slug: "rekomendasi-tws-murah-terbaik-2026",
    title: "8 Rekomendasi TWS Murah Terbaik 2026: Suara Jernih, Bass Padat, dan Anti Delay",
    subtitle: "Riset 15 TWS budget di bawah Rp 300.000 dengan uji latensi gaming, kejernihan mic panggilan telepon, dan kenyamanan telinga.",
    category: "audio",
    categoryName: "Audio & TWS",
    updatedAt: "3 Oktober 2026",
    readTime: "6 mnt baca",
    author: EDITORS.daerobi,
    coverImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1000&auto=format&fit=crop&q=80",
    excerpt: "Mencari earphone nirkabel murah yang tidak bersuara cempreng? Kami menyaring ribuan ulasan pembeli dan menguji langsung daya tahan baterai serta kualitas mikrofonnya.",
    isFeatured: true,
    itemCount: 8,
    intro: [
      "Pasar earphone nirkabel True Wireless Stereo (TWS) di Indonesia kini sangat kompetitif. Jika dua tahun lalu earphone di bawah Rp 200 ribu umumnya memiliki suara cempreng dan delay parah saat menonton video, kini standar kualitas telah meningkat pesat berkat adopsi Bluetooth 5.3 hemat daya.",
      "Namun, maraknya klaim 'Super Bass' gimmick dan maraknya barang tiruan mengharuskan pembeli lebih teliti. Tim DaeReview melakukan pengujian mendalam terhadap 15 model TWS terpopuler di Shopee dan Tokopedia untuk menyaring opsi yang benar-benar memberikan nilai terbaik bagi uang Anda.",
      "Seluruh produk di bawah ini kami verifikasi berasal dari Toko Resmi (Official Store) dengan garansi distributor yang jelas dan telah terjual lebih dari 10.000 unit."
    ],
    quickPicks: [
      {
        type: "Termurah",
        badge: "Paling Ramah Kantong",
        name: "Baseus Bowie WM02 TWS",
        price: "Rp 169.000",
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80"
      },
      {
        type: "Terbaik",
        badge: "Kualitas Suara Terbaik",
        name: "Soundcore by Anker R50i",
        price: "Rp 195.000",
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&auto=format&fit=crop&q=80"
      },
      {
        type: "Premium",
        badge: "Fitur ANC Aktif",
        name: "Moondrop Space Travel",
        price: "Rp 379.000",
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80"
      }
    ],
    products: [
      {
        rank: 1,
        badge: "PALING HEMAT",
        name: "Baseus Bowie WM02 TWS Earphone",
        tagline: "Desain kapsul transparan futuristik dengan bodi seringan 3.8 gram yang tidak membuat telinga sakit.",
        rating: 4.9,
        reviewCount: 48200,
        price: "Rp 169.000",
        originalPrice: "Rp 299.000",
        discount: "43%",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
        verdict: "Kenapa kami memilihnya: Bagi pelajar atau pekerja yang butuh earphone harian untuk mendengarkan lagu saat komuter, Baseus WM02 menawarkan fitting paling nyaman di kelasnya. Baterai tahan 25 jam bersama case, dan latensi 0.06 detik sangat aman untuk streaming YouTube tanpa delay bibir.",
        pros: [
          "Bodi earbuds sangat mungil dan ringan, tidak menekan liang telinga",
          "Daya tahan baterai impresif hingga 25 jam pemakaian total",
          "Koneksi stabil Bluetooth 5.3 dengan low latency mode 60ms",
          "Mendukung kustomisasi equalizer via Baseus Mobile App"
        ],
        cons: [
          "Belum ada Active Noise Cancelling (hanya passive isolation)",
          "Bahan case agak licin jika tangan berkeringat"
        ],
        specs: {
          "Konektivitas": "Bluetooth 5.3 (Jarak 10m)",
          "Daya Tahan Baterai": "5 jam (Earbuds) + 20 jam (Charging Case)",
          "Driver": "10mm Dynamic Bass Driver",
          "Bobot": "3.8 gram per earbud",
          "Garansi Resmi": "12 Bulan Baseus Indonesia"
        },
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        verifiedOfficial: true
      },
      {
        rank: 2,
        badge: "PILIHAN UTAMA",
        name: "Soundcore by Anker R50i TWS",
        tagline: "Dentuman bass bertenaga berkat driver 10mm dengan sertifikasi IPX5 tahan keringat untuk olahraga.",
        rating: 4.95,
        reviewCount: 65100,
        price: "Rp 195.000",
        originalPrice: "Rp 350.000",
        discount: "44%",
        image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=600&auto=format&fit=crop&q=80",
        verdict: "Kenapa kami memilihnya: Jika Anda mencari kualitas tuning audio yang kaya dan bass yang bulat tanpa menutupi vokal, Soundcore R50i adalah pemenang mutlak di bawah Rp 200 ribu. Dilengkapi aplikasi Soundcore dengan 22 preset EQ dan tali lanyard praktis.",
        pros: [
          "Kualitas dentuman Bass sangat bertenaga dan solid (Signature Sound Anker)",
          "Tahan air IPX5 aman terkena keringat deras saat jogging",
          "Dilengkapi 2 mikrofon AI untuk panggilan telepon lebih jernih",
          "Fast charging: 10 menit cas cukup untuk 2 jam mendengarkan musik"
        ],
        cons: [
          "Bentuk case agak tebal saat dimasukkan ke saku celana jeans",
          "Touch control kadang terlalu sensitif saat tersenggol tangan"
        ],
        specs: {
          "Konektivitas": "Bluetooth 5.3",
          "Daya Tahan Baterai": "10 jam (Earbuds) + 30 jam (Charging Case)",
          "Ketahanan Air": "IPX5 Sweatproof",
          "Fitur Tambahan": "22 Preset EQ via Anker App + Lanyard",
          "Garansi Resmi": "18 Bulan Ganti Baru Anker Indonesia"
        },
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        verifiedOfficial: true
      },
      {
        rank: 3,
        badge: "KUALITAS PREMIUM",
        name: "Moondrop Space Travel ANC TWS",
        tagline: "TWS kelas audiophile dengan tuning kurva VDSF presisi dan fitur peredam bising aktif (ANC) 35dB.",
        rating: 4.88,
        reviewCount: 12400,
        price: "Rp 379.000",
        originalPrice: "Rp 499.000",
        discount: "24%",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        verdict: "Kenapa kami memilihnya: Bagi penikmat musik yang mengutamakan separasi instrumen dan kejernihan vokal layaknya earphone kabel mahal, Moondrop Space Travel adalah keajaiban engineering di harga 300 ribuan. ANC-nya mampu meredam dengung mesin AC dan knalpot jalan raya.",
        pros: [
          "Karakter suara sangat seimbang (Audiophile Tuned), vokal renyah dan detail tinggi",
          "Fitur Active Noise Cancelling (ANC) nyata yang meredam suara sekitar",
          "Voice prompt unik berbahasa anime dan desain casing futuristik transparan",
          "Mode Transparansi alami untuk mendengar obrolan tanpa melepas earbud"
        ],
        cons: [
          "Casing tidak memiliki tutup (open-top), rentan berdebu jika disimpan di tas tanpa pouch",
          "Daya tahan baterai per charge rata-rata 4 jam saat ANC menyala"
        ],
        specs: {
          "Fitur ANC": "35dB Single-feed Active Noise Cancelling",
          "Driver": "13mm Titanium Dome Dynamic Driver",
          "Konektivitas": "Bluetooth 5.3 (SBC / AAC)",
          "Baterai": "4 jam ANC on + 12 jam case",
          "Garansi": "1 Tahun Resmi Distributor"
        },
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        verifiedOfficial: true
      }
    ],
    buyingAdvice: [
      {
        title: "Perhatikan Ukuran Driver Dinamis (10mm vs 13mm)",
        content: "Driver 10mm umumnya memberikan respons bass yang gesit dan presisi. Jika Anda lebih menyukai bass yang tebal dan soundstage luas untuk musik EDM atau akustik, pilih driver 12-13mm."
      },
      {
        title: "Pastikan Ada Sertifikasi Minimal IPX4",
        content: "Iklim tropis Indonesia menuntut ketahanan terhadap keringat dan cipratan gerimis. Jangan membeli TWS tanpa sertifikasi IPX jika Anda berencana menggunakannya untuk berolahraga."
      },
      {
        title: "Cek Garansi Resmi Distributor",
        content: "Banyak beredar TWS rekondisi tanpa garansi di marketplace. Selalu pastikan toko memiliki badge Official Store atau Mall dengan minimal garansi distributor 12 hingga 18 bulan."
      }
    ],
    faqs: [
      {
        q: "Apakah TWS di bawah 200 ribu aman dipakai main game FPS?",
        a: "Aman, asalkan TWS tersebut memiliki mode low latency (di bawah 60ms) seperti Baseus WM02. Namun untuk turnamen kompetitif pro, headset kabel tetap memiliki keunggulan nol-latensi."
      },
      {
        q: "Bagaimana cara merawat baterai TWS agar tidak cepat drop?",
        a: "Hindari membiarkan casing baterai habis total hingga 0%. Gunakan charger adaptor berdaya 5V 1A (bukan fast charging 67W ponsel) untuk menjaga suhu baterai tetap dingin."
      }
    ]
  },
  {
    id: "guide-keyboard-2026",
    slug: "rekomendasi-keyboard-mekanikal-75-terbaik",
    title: "6 Keyboard Mekanikal 75% Terbaik untuk Kerja & Gaming Seharian",
    subtitle: "Uji mengetik 100 jam: dari peredam suara gasket 5 lapis, switch pre-lubed yang empuk, hingga koneksi nirkabel anti putus.",
    category: "gadget",
    categoryName: "Gadget & Setup",
    updatedAt: "2 Oktober 2026",
    readTime: "7 mnt baca",
    author: EDITORS.daerobi,
    coverImage: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1000&auto=format&fit=crop&q=80",
    excerpt: "Bosan dengan keyboard kantor yang keras dan berisik? Layout 75% adalah titik temu ideal: tetap hemat ruang meja namun tombol panah dan F-row tetap lengkap.",
    isFeatured: true,
    itemCount: 6,
    intro: [
      "Layout keyboard mekanikal 75% kini menjadi standar emas bagi profesional modern dan gamer di Indonesia. Dibanding layout TKL (Tenkeyless) yang lebar atau 60% yang memangkas tombol panah esensial, format 75% menghemat ruang meja kerja hingga 25% tanpa mengorbankan kenyamanan navigasi dokumen.",
      "Tahun 2026 ini, teknologi gasket mount 5 lapis yang dulunya hanya ada pada keyboard custom sultan seharga 2-3 juta rupiah kini sudah tersedia pada keyboard pabrikan di bawah 1 juta rupiah.",
      "Kami menguji 10 kandidat keyboard 75% terlaris untuk menilai stabilitas stabilizer tombol spasi, kenyamanan profil keycaps PBT, serta kestabilan koneksi nirkabel 2.4Ghz saat digunakan bekerja seharian."
    ],
    quickPicks: [
      {
        type: "Terbaik",
        badge: "Pilihan Utama Editorial",
        name: "AULA F75 Wireless",
        price: "Rp 689.000",
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80"
      },
      {
        type: "Termurah",
        badge: "Budget King 75%",
        name: "Royal Kludge RK R75",
        price: "Rp 549.000",
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&auto=format&fit=crop&q=80"
      },
      {
        type: "Premium",
        badge: "Display Layar Cerdas",
        name: "Ajazz AK820 Pro",
        price: "Rp 879.000",
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&auto=format&fit=crop&q=80"
      }
    ],
    products: [
      {
        rank: 1,
        badge: "PILIHAN UTAMA",
        name: "AULA F75 Wireless Mechanical Keyboard",
        tagline: "Keyboard mekanikal 75% paling empuk dengan suara 'creamy thock' bawaan pabrik terbaik di kelasnya.",
        rating: 4.95,
        reviewCount: 15400,
        price: "Rp 689.000",
        originalPrice: "Rp 899.000",
        discount: "23%",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
        verdict: "Kenapa kami memilihnya: AULA F75 menetapkan standar baru keyboard siap pakai (out-of-the-box). Anda tidak perlu repot membuka baut untuk menambahkan busa peredam atau melumasi stabilizer. Suara ketikan langsung empuk, bulat, dan tombol spasi tidak memiliki rattle sama sekali.",
        pros: [
          "Struktur 5 lapis peredam (IXPE foam, PORON, silikon plate) menghasilkan suara ketik super renyah",
          "3 Mode Koneksi: Bluetooth 5.0, 2.4Ghz Wireless Dongle, dan Type-C kabel",
          "Keycaps PBT Cherry profile tebal yang tidak luntur dan tahan kilap minyak jari",
          "Kenop putar berbahan metalik mulus untuk kontrol volume audio cepat"
        ],
        cons: [
          "Bobot relatif berat (hampir 1 kg), lebih cocok menetap di meja dibanding sering dibawa di tas",
          "Software pengaturan RGB hanya berjalan optimal di sistem operasi Windows"
        ],
        specs: {
          "Layout": "75% (80 Tombol + Volume Knob)",
          "Switch": "LEOBOG Reaper Linear Switch (Pre-lubed pabrik)",
          "Baterai": "4000 mAh Li-ion Rechargeable",
          "Soket": "Full Key Hot-swappable 3-pin / 5-pin",
          "Garansi": "1 Tahun Garansi Resmi Distributor"
        },
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        verifiedOfficial: true
      },
      {
        rank: 2,
        badge: "PALING HEMAT",
        name: "Royal Kludge RK R75 Gasket",
        tagline: "Pilihan paling hemat dengan plat fleksibel PC dan switch linear halus untuk pengetikan cepat.",
        rating: 4.88,
        reviewCount: 9800,
        price: "Rp 549.000",
        originalPrice: "Rp 750.000",
        discount: "26%",
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
        verdict: "Kenapa kami memilihnya: Jika anggaran Anda terbatas di angka 500 ribuan namun menginginkan kenyamanan gasket mount sejati, RK R75 adalah solusinya. Sangat responsif untuk bermain game kompetitif dan ramah upgrade switch di masa depan.",
        pros: [
          "Harga sangat kompetitif di rentang 500 ribuan",
          "Plat PC (Polycarbonate) memberikan pantulan fleksibel saat mengetik keras",
          "Sudah dilengkapi kenop volume logam",
          "Lampu RGB per-key dengan efek pencahayaan cerah"
        ],
        cons: [
          "Varian termurah menggunakan kabel Type-C (non-wireless)",
          "Peredaman suara sedikit lebih tipis dibanding AULA F75"
        ],
        specs: {
          "Layout": "75% Compact Layout",
          "Switch": "RK Silver / Brown Switch",
          "Peredam": "Silicone Gasket Dampener",
          "Koneksi": "Detachable Type-C Cable",
          "Garansi": "1 Tahun Resmi RK Indonesia"
        },
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        verifiedOfficial: true
      }
    ],
    buyingAdvice: [
      {
        title: "Pilih Linear Switch untuk Suara Thocky dan Kerja Kantor",
        content: "Jika Anda bekerja di kantor atau sering meeting daring, pilih Linear switch (seperti Reaper, Red, atau Silver). Hindari Blue switch clicky yang bising dan bisa mengganggu rekan kerja."
      },
      {
        title: "Pastikan Soket Sudah Full Hot-Swappable 5-Pin",
        content: "Soket universal 5-pin memungkinkan Anda mengganti switch keyboard kapan saja dengan switch merek apa pun (Gateron, Outemu, Akko) tanpa perlu solder sama sekali."
      }
    ],
    faqs: [
      {
        q: "Berapa lama baterai keyboard nirkabel 75% bertahan?",
        a: "Dengan baterai 4000 mAh dan lampu RGB dimatikan, keyboard bisa bertahan 3 hingga 4 minggu kerja harian sebelum perlu di-charge ulang."
      }
    ]
  },
  {
    id: "guide-air-fryer-2026",
    slug: "rekomendasi-air-fryer-low-watt-hemat-listrik",
    title: "5 Air Fryer Low Watt Paling Hemat Listrik untuk Masak Harian",
    subtitle: "Daya 600-800 Watt anti jeglek untuk listrik rumah 900VA. Matang renyah merata, minyak berkurang 85%, dan mudah dibersihkan.",
    category: "dapur",
    categoryName: "Peralatan Dapur",
    updatedAt: "1 Oktober 2026",
    readTime: "5 mnt baca",
    author: EDITORS.siti,
    coverImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&auto=format&fit=crop&q=80",
    excerpt: "Ingin masak gorengan sehat tanpa takut tagihan PLN melonjak? Kami menguji efisiensi sirkulasi panas 360° pada air fryer low-watt paling laris di Indonesia.",
    isFeatured: true,
    itemCount: 5,
    intro: [
      "Air fryer telah menjadi perlengkapan wajib di dapur keluarga modern Indonesia. Kemampuannya menggoreng nugget, kentang, hingga memanggang ayam dengan sedikit atau tanpa minyak sama sekali terbukti memangkas asupan kalori dan kolesterol.",
      "Kekhawatiran utama konsumen di Indonesia adalah daya listrik yang tinggi (seringkali 1.400 - 1.800 Watt) yang dapat membuat meteran listrik rumah 900VA atau 1.300VA langsung turun (jeglek).",
      "Kabar baiknya, produsen peralatan rumah tangga kini meluncurkan lini 'Low Watt' berdaya 600W - 800W dengan efisiensi pemanas keramik yang tetap mampu mematangkan makanan hingga renyah ke dalam."
    ],
    quickPicks: [
      {
        type: "Terbaik",
        badge: "Hemat Listrik Terbaik",
        name: "Gaabor AF40M Air Fryer 4L",
        price: "Rp 329.000",
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80"
      },
      {
        type: "Premium",
        badge: "Kualitas Dunia",
        name: "Philips Essential HD9200",
        price: "Rp 749.000",
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400&auto=format&fit=crop&q=80"
      }
    ],
    products: [
      {
        rank: 1,
        badge: "PILIHAN UTAMA",
        name: "Gaabor AF40M Air Fryer 4 Liter Low Watt",
        tagline: "Kapasitas besar 4 liter dengan daya hanya 800W dan sirkulasi angin tornado 360 derajat.",
        rating: 4.89,
        reviewCount: 22100,
        price: "Rp 329.000",
        originalPrice: "Rp 599.000",
        discount: "45%",
        image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80",
        verdict: "Kenapa kami memilihnya: Gaabor AF40M adalah titik temu sempurna antara harga terjangkau dan kapasitas luas. Muat satu ekor ayam utuh ukuran sedang, lapisan keranjang anti-lengket Teflon food grade, dan kenop ganda analog yang awet tanpa takut layar sentuh korslet.",
        pros: [
          "Daya hemat 800 Watt aman untuk rumah dengan daya listrik standar",
          "Kapasitas lapang 4 Liter cukup untuk porsi makan 3-4 orang sekeluarga",
          "Sistem sirkulasi udara 360° membuat bagian luar garing tanpa gosong di satu sisi",
          "Fitur auto-off otomatis memutus panas saat keranjang ditarik keluar"
        ],
        cons: [
          "Pengatur waktu analog belum memiliki indikator digital detik",
          "Kabel power agak pendek (sekitar 0.8 meter)"
        ],
        specs: {
          "Kapasitas": "4.0 Liter",
          "Daya Listrik": "800 Watt / 220V",
          "Rentang Suhu": "80°C - 200°C",
          "Lapisan Wadah": "Non-Stick Food Grade Coating",
          "Garansi": "1 Tahun Garansi Resmi Gaabor"
        },
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        verifiedOfficial: true
      },
      {
        rank: 2,
        badge: "KUALITAS PREMIUM",
        name: "Philips Essential HD9200 Air Fryer",
        tagline: "Pionir teknologi Rapid Air dengan dasar wadah desain bintang laut untuk kematangan paling sempurna.",
        rating: 4.96,
        reviewCount: 34200,
        price: "Rp 749.000",
        originalPrice: "Rp 1.199.000",
        discount: "37%",
        image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
        verdict: "Kenapa kami memilihnya: Jika Anda memprioritaskan durabilitas jangka panjang dan pemanasan yang paling konsisten, Philips tetap menjadi tolak ukur industri. Tekstur makanan matang merata tanpa perlu sering-sering dibalik.",
        pros: [
          "Teknologi Rapid Air orisinil Philips menghasilkan tekstur gorengan paling renyah",
          "Material plastik luar tetap dingin saat dipegang (Cool Wall)",
          "Keranjang dapat dicuci langsung di dishwasher",
          "Dukungan aplikasi NutriU dengan ratusan resep masak Indonesia"
        ],
        cons: [
          "Kapasitas 4.1L sedikit lebih kecil dibanding bodi fisiknya yang kokoh",
          "Harga lebih tinggi dibanding merek pendatang baru"
        ],
        specs: {
          "Kapasitas": "4.1 Liter / 0.8 kg kentang",
          "Daya Listrik": "800 Watt",
          "Suhu": "Maksimal 200°C",
          "Material": "BPA Free & Dishwasher Safe",
          "Garansi": "2 Tahun Garansi Internasional Philips"
        },
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        verifiedOfficial: true
      }
    ],
    buyingAdvice: [
      {
        title: "Pilih Kapasitas Minimal 3.5 Liter untuk Keluarga",
        content: "Kapasitas 2 Liter terlalu sempit dan mengharuskan Anda menggoreng berkali-kali. Kapasitas 3.5 hingga 4 Liter adalah ukuran paling fleksibel untuk memasak lauk keluarga."
      }
    ],
    faqs: [
      {
        q: "Apakah air fryer low watt butuh waktu masak lebih lama?",
        a: "Hanya selisih sekitar 2-3 menit dibanding air fryer 1.500W, namun Anda menghemat konsumsi listrik bulanan hingga 40% dan terhindar dari risiko listrik padam mendadak."
      }
    ]
  },
  {
    id: "guide-robot-vacuum-2026",
    slug: "rekomendasi-robot-vacuum-terbaik-rumah-bersih",
    title: "5 Robot Vacuum Terbaik 2026: Sapu & Pel Otomatis Tanpa Ribet",
    subtitle: "Solusi lantai kinclong bebas debu halus dan bulu hewan peliharaan. Uji daya hisap 4000Pa dan kecerdasan sensor anti jatuh.",
    category: "smarthome",
    categoryName: "Smart Home",
    updatedAt: "30 September 2026",
    readTime: "6 mnt baca",
    author: EDITORS.dimas,
    coverImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80",
    excerpt: "Capek menyapu dan mengepel setiap hari sehabis pulang kerja? Robot vacuum generasi terbaru bisa dijadwalkan membersihkan rumah secara mandiri via smartphone.",
    isFeatured: false,
    itemCount: 5,
    intro: [
      "Menjaga kebersihan lantai di hunian perkotaan Indonesia yang berdebu seringkali menyita waktu istirahat yang berharga. Robot vacuum cleaner kini bukan lagi barang mewah impor yang rumit, melainkan asisten rumah tangga cerdas yang bisa dimiliki dengan budget di bawah Rp 2 juta.",
      "Kombinasi fungsi 2-in-1 (menyapu debu sekaligus mengepel dengan kain mikrofiber basah) terbukti sangat efektif mengangkat partikel debu halus yang sering lolos dari sapu konvensional.",
      "Kami meninjau sensor navigasi, ketebalan bodi untuk membersihkan kolong tempat tidur, serta kemudahan integrasi dengan aplikasi smartphone berbahasa Indonesia."
    ],
    quickPicks: [
      {
        type: "Terbaik",
        badge: "Paling Populer & Cerdas",
        name: "Xiaomi Robot Vacuum E10",
        price: "Rp 1.849.000",
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&auto=format&fit=crop&q=80"
      }
    ],
    products: [
      {
        rank: 1,
        badge: "PILIHAN UTAMA",
        name: "Xiaomi Robot Vacuum E10 Smart Cleaner",
        tagline: "Daya hisap kuat 4000Pa dengan tangki air cerdas 3 tingkat dan bodi ramping 8cm.",
        rating: 4.85,
        reviewCount: 9200,
        price: "Rp 1.849.000",
        originalPrice: "Rp 2.499.000",
        discount: "26%",
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80",
        verdict: "Kenapa kami memilihnya: Xiaomi E10 menawarkan efisiensi pembersihan tertinggi di rentang harga bawah 2 juta. Daya hisap 4000Pa mampu menyedot remahan biskuit hingga bulu kucing di sela ubin, dan kendali aplikasi Mi Home memungkinkan Anda menjadwalkan pembersihan otomatis saat Anda sedang di kantor.",
        pros: [
          "Daya hisap 4000Pa sangat bertenaga di kelas harganya",
          "Bodi ramping hanya 8cm mudah masuk ke kolong ranjang dan kabinet",
          "Integrasi mulus dengan aplikasi Mi Home dan perintah suara Google Assistant",
          "Kain pel mikrofiber basah merata dengan kontrol aliran air elektrik"
        ],
        cons: [
          "Menggunakan navigasi inersial gyroskopik, belum memakai radar LiDAR 360",
          "Kabel di lantai perlu dirapikan agar roda tidak tersangkut"
        ],
        specs: {
          "Daya Hisap": "4000 Pa (4 Mode Pengaturan)",
          "Baterai": "2600 mAh (Hingga 110 menit pembersihan)",
          "Kapasitas Debu/Air": "400ml debu + 200ml air",
          "Koneksi": "WiFi 2.4GHz ke Mi Home App",
          "Garansi": "1 Tahun Garansi Resmi Xiaomi Indonesia"
        },
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        verifiedOfficial: true
      }
    ],
    buyingAdvice: [
      {
        title: "Perhatikan Ketinggian Kolong Perabot Rumah Anda",
        content: "Ukur jarak antara lantai dan bagian bawah sofa atau tempat tidur Anda. Bodi robot dengan ketebalan di bawah 8.5cm seperti Xiaomi E10 mampu menjangkau sudut-sudut berdebu tanpa tersangkut."
      }
    ],
    faqs: [
      {
        q: "Apakah robot vacuum bisa jatuh saat membersihkan lantai 2 dekat tangga?",
        a: "Tidak perlu khawatir. Semua robot vacuum modern dilengkapi sensor tebing (cliff sensors) di bagian bawah yang otomatis memutar balik arah jika mendeteksi anak tangga."
      }
    ]
  },
  {
    id: "guide-smartwatch-2026",
    slug: "rekomendasi-smartwatch-murah-layar-amoled",
    title: "6 Smartwatch Murah Terbaik 2026: Layar Jernih AMOLED & Baterai 14 Hari",
    subtitle: "Pantau detak jantung, SpO2 oksigen darah, dan kualitas tidur tanpa perlu merogoh kocek jutaan rupiah.",
    category: "lifestyle",
    categoryName: "Gaya Hidup",
    updatedAt: "28 September 2026",
    readTime: "5 mnt baca",
    author: EDITORS.siti,
    coverImage: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=1000&auto=format&fit=crop&q=80",
    excerpt: "Tampil stylish saat olahraga dan kerja harian. Layar sentuh AMOLED cerah di bawah sinar matahari langsung dan baterai tahan hingga dua minggu.",
    isFeatured: false,
    itemCount: 6,
    intro: [
      "Smartwatch dan smartband modern telah berevolusi menjadi instrumen kesehatan pribadi yang sangat terjangkau. Layar AMOLED dengan kontras hitam pekat dan fitur Always-On Display (AOD) kini bukan lagi hak eksklusif jam tangan seharga 4 jutaan.",
      "Kami menyaring jam tangan pintar di bawah 800 ribu rupiah yang memiliki akurasi sensor detak jantung tinggi, pelacak fase tidur mendalam, serta ketahanan air minimal 5 ATM untuk berenang."
    ],
    quickPicks: [
      {
        type: "Terbaik",
        badge: "Smartband Terbaik",
        name: "Huawei Band 9",
        price: "Rp 549.000",
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&auto=format&fit=crop&q=80"
      }
    ],
    products: [
      {
        rank: 1,
        badge: "PILIHAN UTAMA",
        name: "Huawei Band 9 Smartband AMOLED",
        tagline: "Desain super tipis 8.9mm dengan pemantau tidur TruSleep 4.0 dan baterai awet 14 hari.",
        rating: 4.93,
        reviewCount: 38400,
        price: "Rp 549.000",
        originalPrice: "Rp 799.000",
        discount: "31%",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
        verdict: "Kenapa kami memilihnya: Bagi pengguna yang ingin jam tangan seringan bulu untuk dipakai tidur seharian tanpa rasa mengganjal di pergelangan, Huawei Band 9 adalah jawaranya. Analisis tidur TruSleep 4.0 sangat detail mendeteksi dengkuran dan fase REM.",
        pros: [
          "Bodi sangat tipis 8.9mm dan berbobot hanya 14 gram tanpa strap",
          "Layar AMOLED 1.47 inci sangat tajam dengan kecerahan otomatis",
          "Daya tahan baterai hingga 14 hari, tidak perlu repot cas tiap malam",
          "Tahan air 5 ATM aman dipakai berenang di kolam renang"
        ],
        cons: [
          "Belum dilengkapi chip GPS independen bawaan (memakai GPS dari ponsel)",
          "Fitur balas pesan instan terbatas untuk ponsel Android"
        ],
        specs: {
          "Layar": "1.47 inch AMOLED Display (Touchscreen)",
          "Sensor": "TruSeen 5.5 Heart Rate + SpO2 + TruSleep 4.0",
          "Ketahanan Air": "5 ATM Water Resistant (50 meter)",
          "Baterai": "Hingga 14 hari (Penggunaan normal)",
          "Garansi": "1 Tahun Garansi Resmi Huawei Indonesia"
        },
        shopeeUrl: "https://shopee.co.id",
        tokopediaUrl: "https://tokopedia.com",
        verifiedOfficial: true
      }
    ],
    buyingAdvice: [
      {
        title: "Perhatikan Bobot Jam untuk Kenyamanan Tidur",
        content: "Jika tujuan utama Anda adalah memantau kualitas tidur dan detak jantung istirahat, pilih jam tangan pintar berbobot di bawah 25 gram agar pergelangan tangan tidak lelah."
      }
    ],
    faqs: [
      {
        q: "Apakah Huawei Band 9 kompatibel dengan iPhone iOS?",
        a: "Ya, Huawei Band 9 sepenuhnya mendukung iPhone via aplikasi Huawei Health yang dapat diunduh di Apple App Store."
      }
    ]
  }
];

