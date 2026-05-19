# BakuHitung

BakuHitung adalah eksperimen edutech berupa aplikasi web **adu tangkas matematika mental** real-time. Proyek ini lahir dari kebutuhan praktis membimbing siswa sekolah dasar mencintai matematika melalui kompetisi yang sehat dan interaktif.

Aplikasi memakai **split-screen** yang dioptimalkan untuk tablet dan smartphone: dua pemain bisa bertanding tatap muka dalam satu perangkat, atau berlatih solo dalam mode latihan.

---

## Fitur utama

| Area | Deskripsi |
|------|-----------|
| **Lobby** | Nama pemain, bahasa (ID/EN), mode duel/latihan, kurikulum, skor (lembut/kompetitif), timer opsional, aksesibilitas |
| **Duel** | Layar 50/50 horizontal; Pemain 1 diputar 180°; momentum ±5 (tug-of-war) |
| **Latihan** | Solo tanpa UI momentum; tetap ada progres level & soal adaptif |
| **Soal adaptif** | Generator algoritmik + bias ~70% ke tag skill yang lemah (dari riwayat sesi) |
| **Kurikulum** | Preset: Kelas 3 (perkalian 1–9), Kelas 4 (penjumlahan 2 digit), atau bebas |
| **Keypad kustom** | Tanpa keyboard OS; anti-spam & leading-zero guard |
| **Feedback** | Pesan motivasi growth mindset (quotes saat ini **Bahasa Indonesia** — lihat [F4.2](./POST-ROADMAP.md)) |
| **Ekspor sesi** | Unduh JSON event belajar dari duel/latihan (untuk guru) |
| **Dashboard guru** | `/teacher` — unggah JSON ekspor atau muat dari cloud (opsional) |
| **Tantangan async** | `/challenge/:seed` — 10 soal deterministik; bandingkan skor via perangkat yang sama atau impor/ekspor JSON |
| **PWA** | Instal dari browser; cache aset via Workbox |
| **Aksesibilitas** | Kontras tinggi, font dyslexia-friendly, hormati `prefers-reduced-motion` |

---

## Rute aplikasi

| Path | Fungsi |
|------|--------|
| `/` | Lobby → duel atau latihan |
| `/teacher` | Ringkasan statistik dari file JSON sesi (atau Supabase jika dikonfigurasi) |
| `/challenge/:seed` | Mode tantangan berbasis seed (link bisa dibagikan) |

---

## Mode tantangan (async)

1. Di lobby, pilih **Buat tantangan** — link `/challenge/<seed>` disalin ke clipboard.
2. Setiap pemain membuka link yang sama, mengerjakan **10 soal identik** (seed sama).
3. **Perangkat yang sama:** hasil disimpan di `localStorage` per seed; papan peringkat tampil otomatis setelah beberapa pemain main di browser yang sama.
4. **Perangkat berbeda:** setelah selesai, **Ekspor hasil** → kirim file JSON ke rival → rival **Impor lawan** di layar hasil untuk membandingkan waktu dan akurasi.

Tidak ada WebSocket; sinkronisasi sengaja offline-first.

---

## Tech stack

- **Vue 3** (Composition API) + **Vue Router**
- **Vite** + **Vitest**
- **Tailwind CSS**
- **vue-i18n** (Indonesia & English)
- **Lucide Vue Next**
- **vite-plugin-pwa**
- Deploy: **Netlify** ([`netlify.toml`](./netlify.toml))

---

## Instalasi & pengembangan

**Persyaratan:** Node.js 20+ (sama dengan CI).

```bash
git clone https://github.com/kahlilzulmi/baku-hitung.git
cd baku-hitung
npm install
npm run dev
```

| Perintah | Kegunaan |
|----------|----------|
| `npm run dev` | Server pengembangan (host terbuka untuk uji di tablet/HP di LAN) |
| `npm run build` | Build produksi |
| `npm run preview` | Preview build lokal |
| `npm test` | Unit test (domain engine) |

Ingin berkontribusi? Lihat **[CONTRIBUTING.md](./CONTRIBUTING.md)**. Backlog lanjutan: **[POST-ROADMAP.md](./POST-ROADMAP.md)**.

---

## Variabel lingkungan (opsional)

Tanpa file `.env`, aplikasi **sepenuhnya offline** (event belajar di `sessionStorage`).

Untuk sinkronisasi cloud ke Supabase, salin [`.env.example`](./.env.example) ke `.env` dan isi:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Tabel yang diharapkan (ringkas):

- `sessions` — `id`, `started_at`, `play_mode`, `curriculum_id`, `scoring_mode`
- `events` — `session_id`, `player`, `level`, `question_text`, `expected_answer`, `skill_tags`, `response_ms`, `correct`, `attempt`, `created_at`

Setelah deploy, dashboard `/teacher` menampilkan opsi muat sesi berdasarkan `sessionId` (UUID dari ekspor JSON).

---

## Ekspor data belajar

Selama duel atau latihan, setiap jawaban dicatat sebagai `LearningEvent` (maks. 500 event di `sessionStorage`).

- Tombol **Ekspor sesi** mengunduh JSON berisi `sessionId`, metadata, dan array event.
- Guru membuka **`/teacher`** → unggah file tersebut untuk melihat agregat (akurasi per skill, waktu respons, dll.).

> **Catatan:** Beberapa filter per-`sessionId` masih dalam perbaikan — lihat [F1.x](./POST-ROADMAP.md) di backlog.

---

## PWA

Setelah `npm run build` dan deploy, pengguna dapat **Add to Home Screen** / instal aplikasi. Manifest: nama `BakuHitung`, locale default `id`, theme biru (`#2563eb`).

---

## Human–AI collaboration

Proyek ini juga dokumentasi kolaborasi manusia–AI dalam pengembangan modern:

- **Brainstorming & konsep** — Kahlil Gibran Al Zulmi × Google Gemini (mekanik tug-of-war, tingkat kesulitan inklusif, branding).
- **Arsitektur & scaffolding** — struktur kode & state dengan GitHub Copilot.
- **Optimasi & integrasi** — penyempurnaan lanjutan dengan bantuan alat AI (Antigravity dll.).

Kontributor manusia dan AI dipersilakan; lihat panduan transparansi di [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](./LICENSE).

Copyright © 2026 Kahlil Gibran Al Zulmi
