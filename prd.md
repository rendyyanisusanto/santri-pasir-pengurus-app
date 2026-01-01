# PROMPT AI – VUE 3 PWA MOBILE APP (PENGURUS PONDOK)

## PERAN AI
Kamu adalah **Senior Frontend Engineer (Vue.js)** dan **PWA Specialist**.
Tugasmu membangun **Aplikasi Mobile Pengurus Pondok** berbasis **Vue 3 + PWA** yang:
- Ringan untuk HP Android lama
- Bisa dijadikan APK via Trusted Web Activity (TWA)
- Bisa dipasang di iOS via Safari (Add to Home Screen)
- Mudah dikembangkan dan di-maintain jangka panjang

Backend **SUDAH ADA** (Node.js + Express, JWT + Refresh Token, MySQL).

---

## TUJUAN APLIKASI
Aplikasi digunakan oleh pengurus pondok untuk:
- Login
- Melihat data santri
- Mengisi presensi (role tertentu)
- Mengakses dashboard sesuai role

Aplikasi bersifat **internal operasional**, bukan publik.

---

## TECH STACK (WAJIB)
- Vue 3
- Vite
- JavaScript (bukan TypeScript)
- Vue Router
- Pinia
- Axios
- PWA (vite-plugin-pwa)
- Tailwind CSS
- ESLint + Prettier

---

## PRINSIP UTAMA
- Mobile-first
- Fast load
- Low memory usage
- No heavy animation
- No canvas / WebGL
- No large third-party UI library

---

## STRUKTUR FOLDER (WAJIB SAMA)
src/
├── app/
│ ├── router/
│ │ └── index.js
│ ├── store/
│ │ ├── auth.store.js
│ │ └── user.store.js
│ └── bootstrap.js
│
├── components/
│ ├── base/
│ │ ├── BaseButton.vue
│ │ ├── BaseInput.vue
│ │ └── BaseSelect.vue
│ └── layout/
│ ├── AppHeader.vue
│ └── AppBottomNav.vue
│
├── features/
│ ├── auth/
│ │ ├── LoginPage.vue
│ │ └── auth.service.js
│ ├── dashboard/
│ │ └── DashboardPage.vue
│ ├── santri/
│ │ ├── SantriListPage.vue
│ │ └── santri.service.js
│ └── presensi/
│ ├── PresensiPage.vue
│ └── presensi.service.js
│
├── services/
│ ├── api.js
│ ├── auth.interceptor.js
│ └── refresh-token.js
│
├── utils/
│ ├── env.js
│ └── role.js
│
├── App.vue
└── main.js

---

## ENV CONFIG
Gunakan `.env`:

VITE_API_BASE_URL=https://api.domainpondok.id


Akses hanya melalui helper `env.js`.

---

## AUTHENTICATION FLOW
### Login
Endpoint:


POST /api/auth/login


Response:
```json
{
  "accessToken": "jwt_access",
  "refreshToken": "jwt_refresh",
  "user": {
    "id": 1,
    "roles": ["KETUA_KAMAR"],
    "pengurus": {
      "kamar_id": 2,
      "asrama_id": null
    }
  }
}

Refresh Token

Endpoint:

POST /api/auth/refresh


Aturan:

Simpan accessToken & refreshToken di localStorage

Gunakan Axios interceptor

Jika response 401:

otomatis refresh token

retry request

Jika refresh gagal → logout

ROLE & AKSES

Role tersedia:

KETUA_KAMAR

ASRAMA

KAFIL

ASATID

PENGURUS

PAU

Hak akses:

PAU → CRUD data

KETUA_KAMAR → presensi kamar sendiri

ASRAMA → presensi semua kamar di asrama

Role lain → read-only

Menu & halaman harus dinamis berdasarkan role.

PRESENSI LOGIC

Ketua kamar hanya melihat santri di kamarnya

Asrama bisa memilih kamar dalam asrama

Presensi terdiri dari:

presensi_setting

presensi

presensi_detail

UI RULES

Gunakan Tailwind CSS

Tombol besar & mudah ditekan

Gunakan bottom navigation

Selalu tampilkan loading & empty state

Gunakan toast/snackbar untuk feedback

PWA REQUIREMENTS

manifest.json valid

service worker aktif

offline fallback page

icon 192x192 & 512x512

splash screen sederhana

iOS SUPPORT

Deteksi iOS Safari

Tampilkan banner:
“Buka Share → Add to Home Screen”

Jangan paksa auto install (tidak didukung iOS)

ANDROID APK (TWA)

Aplikasi harus siap dibungkus Trusted Web Activity

Tidak menggunakan fitur browser yang dilarang Play Store

Tampilan full screen

API ENDPOINTS

Gunakan dokumentasi API_ENDPOINTS.md sebagai satu-satunya referensi.
❌ Jangan membuat endpoint baru
❌ Jangan mengubah struktur response

OUTPUT YANG DIHARAPKAN

AI harus menghasilkan:

Project Vue 3 + PWA siap jalan

Login page mobile

Dashboard pengurus

Role-based menu

Presensi page

Axios interceptor refresh token

PWA config lengkap

PENUTUP

Bangun aplikasi mobile pengurus pondok yang:

Ringan

Stabil

Mudah diupdate

Cocok untuk Android lama & iOS Safari

Ikuti spesifikasi ini tanpa improvisasi.