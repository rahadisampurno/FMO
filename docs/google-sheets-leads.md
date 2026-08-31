# Google Sheets lead integration

Website mengirim brief konsultasi ke spreadsheet `Data Lead Traffic Website FMO` melalui Google Apps Script Web App.

## Aktivasi satu kali

1. Buka spreadsheet tujuan dan pilih **Extensions > Apps Script**.
2. Salin seluruh isi `scripts/google-sheets-webhook.gs` ke editor Apps Script, lalu simpan.
3. Pilih **Deploy > New deployment > Web app**.
4. Gunakan **Execute as: Me** dan akses **Anyone** agar formulir publik dapat mengirim data tanpa meminta login Google.
5. Salin URL deployment yang berakhir dengan `/exec`.
6. Buat `.env.local` di root project dan isi:

   ```env
   VITE_FMO_LEADS_ENDPOINT=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
   ```

7. Restart service Vite setelah mengubah environment variable.

Tombol **Masuk ke website** hanya membuka website setelah Google Sheets mengonfirmasi bahwa data sudah tersimpan. Waktu submit dicatat otomatis oleh server, nomor WhatsApp tersimpan di kolom F, dan Submission ID pada kolom H mencegah duplikasi saat pengguna mencoba kembali.
