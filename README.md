# ⚽ LiveScore PnL Cloud 

Aplikasi LiveScore berbasis cloud yang menyediakan informasi pertandingan sepak bola secara real-time. Sistem ini dibangun menggunakan arsitektur terdistribusi yang terdiri dari Frontend, Backend Service, Data Engine Service, Database Cloud, dan Infrastruktur Cloud Deployment.

Data pertandingan diperoleh dari API Football, disinkronkan secara otomatis ke database cloud, kemudian disajikan kepada pengguna melalui aplikasi web secara real-time.

# 📖 Gambaran Umum

LiveScore PnL Cloud merupakan platform informasi sepak bola yang menyediakan:

* Skor pertandingan secara real-time
* Informasi tim
* Informasi pemain
* Klasemen liga
* Pembaruan pertandingan secara otomatis
* Infrastruktur berbasis cloud

Proyek ini menerapkan pendekatan **Service-Oriented Architecture (SOA)**, di mana setiap komponen memiliki tanggung jawab yang berbeda dan saling terintegrasi.

---

# 🏗 Arsitektur Sistem

```text
                    API FOOTBALL
                          │
                          ▼

            ┌─────────────────────────┐
            │    Data Engine Service  │
            │                         │
            │ - Integrasi API         │
            │ - Sinkronisasi Data     │
            │ - Scheduler Otomatis    │
            └───────────┬─────────────┘
                        │
                        ▼

            ┌─────────────────────────┐
            │ Supabase PostgreSQL     │
            │ Database Cloud          │
            └───────────┬─────────────┘
                        │
                        ▼

            ┌─────────────────────────┐
            │ Express Backend Service │
            │                         │
            │ - REST API              │
            │ - Socket.IO             │
            └───────────┬─────────────┘
                        │
                        ▼

            ┌─────────────────────────┐
            │ React Frontend          │
            │ User Interface          │
            └─────────────────────────┘
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
│ Scheduler & Sync Jobs                │
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

## Sinkronisasi Data

```text
API Football
      │
      ▼
Data Engine Service
      │
      ▼
Supabase PostgreSQL
      │
      ▼
Backend Service
      │
      ▼
Frontend
```

### Penjelasan

1. Data pertandingan diambil dari API Football.
2. Data Engine melakukan sinkronisasi dan validasi data.
3. Data disimpan ke database Supabase PostgreSQL.
4. Backend mengambil data dari database.
5. Frontend menampilkan data kepada pengguna.

# ⏰ Jadwal Sinkronisasi Otomatis

| Proses                    | Frekuensi      |
| ------------------------- | -------------- |
| Sinkronisasi Pertandingan | Setiap 1 Menit |
| Sinkronisasi Klasemen     | Setiap 1 Jam   |
| Sinkronisasi Tim          | Setiap Hari    |
| Sinkronisasi Pemain       | Setiap Hari    |

---

# 🗄 Struktur Data

## Tabel Teams

Menyimpan informasi klub sepak bola:

* ID Tim
* Nama Tim
* Logo
* Negara
* Tahun Berdiri
* Stadion

---

## Tabel Players

Menyimpan informasi pemain:

* ID Pemain
* ID Tim
* Nama
* Posisi
* Kewarganegaraan
* Foto

---

## Tabel Matches

Menyimpan data pertandingan:

* ID Pertandingan
* Liga
* Tim Tuan Rumah
* Tim Tamu
* Tanggal Pertandingan
* Status Pertandingan
* Skor Tuan Rumah
* Skor Tim Tamu

---

## Tabel Standings

Menyimpan data klasemen:

* Tim
* Main
* Menang
* Seri
* Kalah
* Gol Memasukkan
* Gol Kebobolan
* Poin

---

# 🚀 Fitur Utama

### Live Score

* Pembaruan skor secara real-time
* Status pertandingan langsung
* Monitoring pertandingan berlangsung

### Informasi Tim

* Profil klub
* Informasi stadion
* Negara asal

### Informasi Pemain

* Data pemain
* Posisi bermain
* Informasi tim

### Klasemen Liga

* Posisi klasemen
* Jumlah poin
* Statistik pertandingan

### Komunikasi Real-Time

* Socket.IO
* Pembaruan data otomatis
* Sinkronisasi frontend secara langsung

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

* Laravel Framework
* Laravel Scheduler
* Queue Job

## Database

* Supabase PostgreSQL

## Cloud Platform

* Railway

## Sumber Data

* API Football (API-Sports)

---

# 👥 Pembagian Tugas Tim

## 1. API & Database Engineer

Tanggung Jawab:

* Konfigurasi API Football
* Desain Database
* Manajemen Supabase
* Perancangan ERD

---

## 2. Data Engineer

Tanggung Jawab:

* Data Engine Service
* Integrasi API Football
* Sinkronisasi Data
* Scheduler Otomatis
* Validasi Data
* Monitoring Pipeline

---

## 3. Backend Engineer

Tanggung Jawab:

* REST API
* Business Logic
* Socket.IO
* Integrasi Database

---

## 4. Frontend Engineer

Tanggung Jawab:

* User Interface
* Dashboard Live Score
* Halaman Tim dan Pemain
* User Experience

---

## 5. Cloud Engineer

Tanggung Jawab:

* Deployment Railway
* Konfigurasi Environment
* Monitoring Infrastruktur
* Manajemen Service Cloud

---

# 🎯 Tujuan Proyek

* Menyediakan informasi sepak bola secara real-time.
* Mengimplementasikan arsitektur cloud modern.
* Menerapkan sinkronisasi data otomatis.
* Mengintegrasikan berbagai layanan dalam sistem terdistribusi.
* Mengembangkan aplikasi web yang responsif dan scalable.

---

# 📈 Pengembangan Selanjutnya

* Implementasi Redis Cache
* Dukungan Multi-Liga
* Dashboard Analitik Pertandingan
* Sistem Notifikasi
* Event-Driven Architecture
* Prediksi Hasil Pertandingan Berbasis Machine Learning
