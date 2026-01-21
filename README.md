

Berikut adalah contoh file `README.md` yang komprehensif untuk project EOQ System Anda. File ini mencakup deskripsi, struktur folder, cara instalasi, dan fitur utama (termasuk integrasi Excel yang kita buat).

Anda bisa membuat file ini di root masing-masing folder (`eoq-system/README.md` dan `eoq-backend/README.md`) atau gabungkan di root project.

```markdown
# EOQ System (Economic Order Quantity)

Sistem manajemen stok, pengiriman, dan analisis EOQ berbasis web. Sistem ini dirancang untuk memudahkan manajemen gudang dengan fitur import/export data Excel massal dan pelacakan riwayat stok (In/Out).

## Tech Stack

### Frontend (`eoq-system`)
- **Framework:** Vue 3 (Composition API)
- **Styling:** Tailwind CSS
- **Icons:** FontAwesome
- **Excel Handling:** ExcelJS (Export & Import with Styling)
- **HTTP Client:** Axios
- **Architecture:** MVVM Pattern (View/Presenter/Model)

### Backend (`eoq-backend`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Google Cloud Firestore
- **Storage:** Google Cloud Storage
- **Security:** Helmet, Rate Limiting, JWT Authentication
- **Deployment:** Google Cloud Run

---

## Prerequisites

- Node.js (v18 atau lebih tinggi)
- NPM atau Yarn
- Akun Google Cloud (Firestore & Storage)
- Gcloud CLI (untuk deployment opsional)

---

## Project Structure

### Frontend Structure
```text
eoq-system/src
├───assets
│       index.css
├───components
│   ├───Layout (TheHeader, TheLayout, TheSidebar)
│   └───UI (TheModal, TheToast)
├───features
│   ├───auth (Login/Register)
│   ├───dashboard (Overview)
│   ├───eoq-analysis (Analisis EOQ)
│   ├───inventory (Manajemen Barang, Stock In/Out, History)
│   ├───shipping (Data Pengiriman)
│   └───profile (Pengaturan Profil)
├───services (Auth Service)
└───utils (API Helper, Storage, Toastify)
```

### Backend Structure
```text
eoq-backend/src
├───middlewares (Auth, Role, Upload)
├───models (Schemas definition)
├───routes (API Endpoints)
├───services (Business Logic: Inventory, Shipping, Auth)
└───utils (Firestore & Storage Connectors)
```

---

## Installation & Setup

### 1. Backend Setup (`eoq-backend`)

1.  **Install Dependencies:**
    ```bash
    cd eoq-backend
    npm install
    ```

2.  **Environment Variables:**
    Buat file `.env` di root folder backend dan isi dengan:

    ```env
    PORT=3000
    GCLOUD_PROJECT_ID=eoq-analysis
    FIRESTORE_PROJECT_ID=eoq-analysis
    GCLOUD_STORAGE_BUCKET=eoqbucket
    JWT_SECRET=r4h4s14k3cr3tkey
    JWT_EXPIRES_IN=24h
    ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
    ```

    *Catatan: Jika menggunakan Google Cloud Client Libraries (Firestore/Storage), pastikan Anda sudah login di gcloud atau set `GOOGLE_APPLICATION_CREDENTIALS`.*

3.  **Run Backend:**
    ```bash
    npm start
    # atau
    node index.js
    ```

---

### 2. Frontend Setup (`eoq-system`)

1.  **Install Dependencies:**
    ```bash
    cd eoq-system
    npm install
    ```

2.  **Configuration:**
    Buka file `src/utils/api.js` dan pastikan `baseURL` mengarah ke backend Anda.

    ```javascript
    const api = axios.create({
      baseURL: 'http://localhost:3000', // Untuk Local Development
      // baseURL: 'https://eoq-backend-xxxxx.a.run.app', // Untuk Production
    });
    ```

3.  **Run Frontend:**
    ```bash
    npm run dev
    ```

---

## Key Features

### 1. Inventory Management (Manajemen Barang)
- **Auto Code Generation:** Kode barang (BRG-001) otomatis dibuat oleh sistem.
- **Stock In/Out:** Upload data barang masuk dan keluar dengan validasi stok.
- **History Tracking:** Melihat riwayat pergerakan stok per barang.
- **Excel Integration:**
  - **Import:** Upload Excel (`.xlsx`) untuk mass input stock in/out.
  - **Export:** Export data barang dengan format Header Berwarna, Border, dan Font Times New Roman.
  - **Logic:** Kolom Total Masuk & Total Keluar dihitung secara real-time dari database.

### 2. Shipping Management (Data Pengiriman)
- **Auto Code Generation:** Kode pengiriman (SHP-001) otomatis.
- **CRUD Operations:** Tambah, Edit, Hapus data pengiriman.
- **Date Validation:** Tanggal pengiriman tidak boleh lebih dari hari ini.
- **Excel Integration:**
  - **Import:** Parsing harga dengan format Indonesia (95.000 dianggap 95000).
  - **Export:** Format Rupiah otomatis (`Rp 10.000`) dengan Header berwarna.

### 3. Security & Access Control
- **Authentication:** JWT Token based authentication.
- **Role Management:** Middleware untuk membedakan akses antara `admin` dan `karyawan`.
- **Rate Limiting:** Proteksi dari spam request.

### 4. User Experience
- **Progress Loading:** Modal loading bar saat upload massal data agar user mengetahui progress.
- **Responsive UI:** Desain adaptif menggunakan Tailwind CSS.
- **Toast Notification:** Feedback visual sukses/gagal pada setiap aksi.

---

## Deployment to Google Cloud Run

### Backend Deployment
1.  Pastikan file `.gcloudignore` sudah dibuat (tidak upload `node_modules`).
2.  Jalankan perintah:
    ```bash
    gcloud run deploy eoq-backend --source . --allow-unauthenticated --region asia-southeast1
    ```
3.  Set **Environment Variables** di Google Cloud Console (Cloud Run > Variables and Secrets) sesuai isi file `.env` lokal.

### Frontend Deployment
Dapat dengan mudah di-deploy ke Vercel, Netlify, atau Firebase Hosting karena ini adalah aplikasi Vue.js SPA (Single Page Application).

## Troubleshooting

### Error: `GCLOUD_PROJECT_ID not found`
- Pastikan file `.env` sudah dibuat di root folder backend.
- Jika di Cloud Run, pastikan variabel sudah di-set di tab "Variables and Secrets".

### Error: `Module "fs" externalized` (Import Excel)
- Ganti library `xlsx` dengan `exceljs` untuk kompatibilitas Vite/Browser.
- Import: `import ExcelJS from 'exceljs';`

---

## License

Copyright © 2024 EOQ Analysis. All rights reserved.
```