# Study Group EISD Laboratory

Website landing page untuk program Study Group EISD Laboratory. Project ini berisi halaman informasi divisi, route map kegiatan, dokumentasi, serta fitur pengecekan hasil seleksi berdasarkan NIM.

## Tech Stack

- Next.js 16 dengan App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React untuk ikon
- Canvas Confetti untuk efek interaktif

## Fitur Utama

- Landing page Study Group EISD Laboratory.
- Navigasi responsif untuk desktop dan mobile.
- Halaman detail untuk 4 divisi:
  - Software Development
  - UI/UX Design
  - Technopreneur
  - Intelligence System
- Form pengecekan hasil seleksi berdasarkan NIM.
- Halaman pengumuman dengan status kelulusan dan tombol join group untuk peserta yang lolos.
- Section route map kegiatan study group.
- Marquee dokumentasi kegiatan.
- Asset logo, gambar divisi, dokumentasi, dan video animasi logo.

## Prasyarat

Pastikan sudah terpasang:

- Node.js 20 atau lebih baru
- npm

Project ini menggunakan `package-lock.json`, jadi npm menjadi package manager utama yang direkomendasikan.

## Instalasi

Clone repository, lalu install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Buka browser ke:

```text
http://localhost:3000
```

## Script

| Command | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan development server Next.js |
| `npm run build` | Membuat build production |
| `npm run start` | Menjalankan hasil build production |
| `npm run lint` | Menjalankan ESLint |

## Struktur Project

```text
.
|-- public/
|   |-- images/              # Logo, gambar divisi, tools, route map, dokumentasi
|   `-- video/               # Video animasi logo
|-- src/
|   |-- app/                 # Route dan halaman Next.js App Router
|   |-- components/          # Komponen UI reusable
|   |-- data/results/        # Data hasil seleksi peserta
|   `-- lib/                 # Utility helper
|-- next.config.ts
|-- package.json
`-- tsconfig.json
```

## Route Aplikasi

| Route | Deskripsi |
| --- | --- |
| `/` | Landing page utama |
| `/software-development` | Detail divisi Software Development |
| `/ui-ux-design` | Detail divisi UI/UX Design |
| `/technopreneur` | Detail divisi Technopreneur |
| `/intelligence-system` | Detail divisi Intelligence System |
| `/announcement?nim=<NIM>` | Halaman hasil seleksi berdasarkan NIM |

## Mengubah Data Pengumuman

Data hasil seleksi ada di folder:

```text
src/data/results/
```

Setiap divisi memiliki file masing-masing:

- `softdev.ts`
- `uiux.ts`
- `technopreneur.ts`
- `intelligence-system.ts`

Format data peserta:

```ts
{
  name: "Nama Peserta",
  nim: "1234567890",
  division: "Software Development",
  status: "Passed",
}
```

Nilai `division` harus sesuai salah satu tipe berikut:

- `UI/UX Design`
- `Software Development`
- `Technopreneur`
- `Intelligence System`

Nilai `status` hanya mendukung:

- `Passed`
- `Failed`

Link grup WhatsApp untuk peserta yang lolos diatur di:

```text
src/data/results/index.ts
```

## Mengubah Konten Utama

- Hero section: `src/components/Hero.tsx`
- Navbar: `src/components/Navbar.tsx`
- Footer: `src/components/Footer.tsx`
- Card divisi: `src/components/Divisions.tsx`
- Route map: `src/components/RouteMap.tsx`
- Dokumentasi kegiatan: `src/components/Documentation.tsx`
- Background visual: `src/components/DreamyBackground.tsx`

## Mengubah Asset

Asset utama berada di:

```text
public/images/
```

Beberapa asset penting:

- Logo EISD: `public/images/logo-eisd.png`
- Logo vertikal EISD: `public/images/logo-vertical-eisd.png`
- Route map: `public/images/route-map.png`
- Dokumentasi kegiatan: `public/images/dokum-sg/`
- Video animasi logo: `public/video/animasi-logo-eisd.webm`

Setelah mengganti nama atau lokasi asset, pastikan path di komponen terkait ikut diperbarui.

## Pendaftaran Study Group

Tombol pendaftaran di hero saat ini menampilkan pesan bahwa pendaftaran sedang ditutup. Untuk mengaktifkan kembali pendaftaran:

1. Buka `src/components/Hero.tsx`.
2. Aktifkan import `Link` dari `next/link`.
3. Isi konstanta `REGISTRATION_LINK` dengan link form pendaftaran.
4. Ganti button disabled dengan komponen `Link` yang sudah disediakan di komentar file tersebut.

## Build Production

Pastikan lint dan build berhasil sebelum deploy:

```bash
npm run lint
npm run build
```

Untuk menjalankan build production secara lokal:

```bash
npm run start
```

## Deployment

Project ini siap dideploy ke platform yang mendukung Next.js, seperti Vercel.

Langkah umum deployment:

1. Push project ke repository Git.
2. Import repository ke Vercel.
3. Gunakan command build default Next.js:

```bash
npm run build
```

4. Deploy aplikasi.

## Lisensi

Project ini dikembangkan untuk kebutuhan Study Group EISD Laboratory.
