# ⚽ LiveScore PNL

LiveScore PNL merupakan aplikasi web livescore dan statistik sepak bola berbasis cloud computing yang dirancang untuk menyediakan informasi pertandingan secara cepat, terintegrasi, dan mudah dikembangkan.

Sistem dibangun menggunakan arsitektur terdistribusi yang terdiri dari Frontend, Backend Service, Data Engine Service, Database Cloud, dan Infrastruktur Cloud Deployment.

---

# 📖 Gambaran Umum

LiveScore PNL menyediakan berbagai informasi sepak bola, antara lain:

* Live Score pertandingan
* Informasi tim
* Informasi pemain
* Klasemen liga
* Statistik pertandingan
* Prediksi pertandingan
* Football Insight Generator

Sistem memanfaatkan layanan cloud untuk mendukung akses data yang terpusat, fleksibel, dan mudah dikembangkan.

---

# 🏗 Arsitektur Sistem

```text
                     API FOOTBALL
                           │
                           ▼

               ┌─────────────────────┐
               │     SUPABASE        │
               │ PostgreSQL Database │
               └──────────┬──────────┘
                          │
                          ▼

               ┌─────────────────────┐
               │  Data Engine Service │
               │                     │
               │ - Scheduler         │
               │ - Sync Jobs         │
               │ - Data Processing   │
               │ - Data Validation   │
               └──────────┬──────────┘
                          │
                          ▼

               ┌─────────────────────┐
               │  Express Backend    │
               │     REST API        │
               │     Socket.IO       │
               └──────────┬──────────┘
                          │
                          ▼

               ┌─────────────────────┐
               │   React Frontend    │
               └─────────────────────┘
```

---

# ☁ Arsitektur Cloud Deployment

```text
                    INTERNET
                        │
                        ▼

┌──────────────────────────────────────┐
│            Railway Cloud             │
├──────────────────────────────────────┤
│                                      │
│ Frontend Service (React)             │
│ Backend Service (Express.js)         │
│ Data Engine Service                  │
│                                      │
└──────────────────┬───────────────────┘
                   │
                   ▼

      ┌────────────────────────────┐
      │ Supabase PostgreSQL Cloud  │
      └────────────────────────────┘
```

---

# 🔄 Alur Data Sistem

```text
API Football
      │
      ▼
Supabase PostgreSQL
      │
      ▼
Data Engine Service
      │
      ▼
Backend Service
      │
      ▼
Frontend
```

### Penjelasan

1. Data pertandingan diperoleh dari API Football.
2. Data disimpan pada database Supabase PostgreSQL.
3. Data Engine membaca dan mengelola data yang tersimpan di Supabase.
4. Backend menyediakan API untuk frontend.
5. Frontend menampilkan informasi kepada pengguna.

---

# ⚙ Data Engine Service

Data Engine Service bertugas mengelola data yang tersimpan pada Supabase PostgreSQL agar selalu siap digunakan oleh backend dan frontend.

### Tanggung Jawab

* Integrasi database Supabase
* Scheduler Automation
* Sync Jobs
* Data Processing
* Data Validation
* Data Persistence
* Monitoring proses sinkronisasi

---

# ⏰ Jadwal Sinkronisasi

| Proses                    | Frekuensi      |
| ------------------------- | -------------- |
| Sinkronisasi Pertandingan | Setiap 1 Menit |
| Sinkronisasi Klasemen     | Setiap 1 Jam   |
| Sinkronisasi Tim          | Harian         |
| Sinkronisasi Pemain       | Harian         |

---

# 🗄 Struktur Database

Database menggunakan PostgreSQL yang dikelola melalui Supabase.

Tabel utama:

* event
* favorites
* fixtures
* league
* live_matches
* player_stats
* players
* standings
* teams

---

# 🚀 Fitur Utama

### Live Score

* Pembaruan skor pertandingan
* Monitoring pertandingan berlangsung
* Informasi status pertandingan

### Informasi Tim

* Profil klub
* Informasi stadion
* Data liga

### Informasi Pemain

* Data pemain
* Posisi pemain
* Statistik pemain

### Klasemen Liga

* Posisi klasemen
* Jumlah poin
* Statistik pertandingan

### Prediction League

* Prediksi hasil pertandingan
* Perhitungan skor prediksi

### Football Insight Generator

* Ringkasan dan insight pertandingan
* Analisis statistik sepak bola

---

# 🛠 Teknologi yang Digunakan

## Frontend

* React
* TypeScript
* Vite

## Backend Service

* Express.js
* Node.js
* Socket.IO

## Data Engine Service

* Scheduler Jobs
* Data Processing Service
* Database Integration

## Database

* PostgreSQL
* Supabase

## Cloud Platform

* Railway

## Sumber Data

* API Football (API-Sports)

---

# 👥 Pembagian Tugas Tim

## API & Database Engineer

* Integrasi API Football
* Desain Database PostgreSQL
* Pembuatan tabel dan relasi database
* Konfigurasi Supabase
* Penyediaan API Database

---

## Data Engineer

* Integrasi Database Supabase
* Scheduler Automation
* Sync Jobs
* Data Processing
* Data Validation
* Data Persistence
* Monitoring Sinkronisasi Data

---

## Backend Engineer

* REST API
* Business Logic
* Socket.IO
* Integrasi Data

---

## Frontend Engineer

* User Interface
* Dashboard Live Score
* Halaman Statistik
* User Experience

---

## Cloud Engineer

* Deployment Railway
* Konfigurasi Environment
* Monitoring Infrastruktur
* Manajemen Service Cloud

---

# ✅ Kelebihan Sistem

* Arsitektur cloud yang fleksibel dan mudah dikembangkan.
* Sinkronisasi data otomatis melalui scheduler.
* Pemisahan layanan frontend, backend, data engine, dan database.
* Mendukung pembaruan informasi secara cepat.
* Memiliki fitur tambahan seperti Prediction League dan Football Insight Generator.

---

# ⚠ Keterbatasan Sistem

* Bergantung pada ketersediaan API Football.
* Pembaruan data dipengaruhi oleh batas request (rate limit) API.
* Menggunakan layanan cloud versi gratis/trial yang memiliki keterbatasan sumber daya.
* Konfigurasi dan integrasi multi-service relatif lebih kompleks.

---

# 🎯 Tujuan Proyek

* Menyediakan informasi sepak bola secara cepat dan terintegrasi.
* Mengimplementasikan konsep cloud computing pada aplikasi web.
* Menerapkan arsitektur layanan yang terpisah dan mudah dikembangkan.
* Mendukung pengelolaan data secara otomatis dan efisien.

---

# 📌 Kesimpulan

LiveScore PNL merupakan aplikasi livescore dan statistik sepak bola berbasis cloud computing yang mengintegrasikan Supabase PostgreSQL, Data Engine Service, Backend Service, dan Frontend dalam satu ekosistem layanan terdistribusi. Sistem mampu menyediakan informasi pertandingan secara cepat, terintegrasi, dan mudah dikembangkan melalui pemanfaatan teknologi cloud dan mekanisme sinkronisasi data otomatis.
