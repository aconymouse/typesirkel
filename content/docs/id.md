---
title: Dokumentasi typeSirkel
description: Cara pakai typeSirkel: buka folder, menulis markdown, menu slash dan shortcut, hubungkan AI di Quill, berbagi draf, dan memasang MCP.
---

## Mulai {#start}

typeSirkel bisa dipakai di dua tempat, dan keduanya aplikasi yang sama.

- **Di browser** lewat [sirkel.asia/write](/write/). Gak perlu pasang apa-apa.
- **Di desktop** untuk macOS 11 ke atas, Windows 10 ke atas, dan Linux (AppImage atau .deb), dari [halaman rilis](https://github.com/aconymouse/typesirkel/releases).

Saat pertama dibuka, kamu masuk ke **Scratch**, buku catatan kecil yang tersimpan di browser. Cocok untuk catatan cepat. Untuk kerja beneran, tekan **Open folder** di bawah sidebar lalu pilih folder di disk-mu. Setiap catatan di dalamnya jadi file `.md` biasa yang bisa dibaca aplikasi lain.

Membuka satu folder utuh di browser butuh browser berbasis Chromium seperti Chrome, Edge, Brave, atau Arc. Safari dan Firefox membuka satu file sekaligus.

### Membuka aplikasi desktop {#first-open}

typeSirkel dibuat satu orang dan open source, dan belum ditandatangani sertifikat Apple Developer yang berbayar. Karena itu, saat pertama dibuka di Mac, macOS bakal bilang aplikasinya "Not Opened" karena Apple belum bisa memverifikasinya. Ini wajar, dan seluruh kodenya bisa kamu cek sendiri di [GitHub](https://github.com/aconymouse/typesirkel).

1. Buka file `.dmg`, lalu seret typeSirkel ke folder Applications.
2. Buka typeSirkel. Saat peringatan muncul, klik **Done**.
3. Buka **System Settings → Privacy & Security**, lalu scroll ke bagian Security.
4. Di samping tulisan "typeSirkel was blocked to protect your Mac", klik **Open Anyway**.
5. Klik **Open Anyway** sekali lagi, lalu konfirmasi pakai Touch ID atau password.

Cukup sekali ini saja. Setelahnya typeSirkel kebuka seperti aplikasi biasa.

Di Windows, kalau SmartScreen menampilkan "Windows protected your PC", klik **More info** lalu **Run anyway**.

## Menulis {#writing}

Tulis pakai markdown biasa. typeSirkel menyimpan sendiri sesaat setelah kamu berhenti mengetik, dan titik di kiri bawah memberi tahu kapan selesai.

Di bawah jendela ada tiga tampilan:

- **Write** hanya menampilkan editor.
- **Split** menampilkan editor dan pratinjau berdampingan, bergulir bersama.
- **Read** hanya menampilkan pratinjau.

**Quiet** menyembunyikan semuanya kecuali tulisanmu. Tekan lagi, atau **Cmd/Ctrl + .**, untuk mengembalikannya.

Tekan **+** di sebelah daftar file untuk membuat catatan baru. Catatan dikelompokkan per folder, dan catatan yang sedang dibuka diberi tanda.

## Menu slash {#slash}

Ketik `/` di awal baris, atau setelah spasi, untuk membuka menu format. Terus ketik untuk menyaringnya, misalnya `/h2`, `/quote`, atau `/todo`, lalu tekan Enter. Setiap pilihan menampilkan markdown yang ditulisnya, jadi kamu ikut hafal sintaksnya sambil jalan.

| Format | Markdown |
| --- | --- |
| Heading 1, 2, 3 | `#`, `##`, `###` |
| Tebal, miring, coret | `**text**`, `*text*`, `~~text~~` |
| Daftar poin, daftar bernomor, tugas | `-`, `1.`, `- [ ]` |
| Kutipan | `>` |
| Tautan, gambar | `[text](url)`, `![alt](url)` |
| Kode sebaris, blok kode | `` `code` ``, ```` ``` ```` |
| Tabel, pemisah | `| a | b |`, `---` |

Kalau sebuah format punya isian, seperti teks dan alamat tautan, tekan Tab untuk pindah ke isian berikutnya.

## Shortcut {#shortcuts}

| Tombol | Fungsi |
| --- | --- |
| `/` | Menu format |
| Cmd/Ctrl + S | Simpan sekarang |
| Cmd/Ctrl + O | Buka folder |
| Cmd/Ctrl + B, I, E | Tebal, miring, kode sebaris |
| Cmd/Ctrl + K | Tautan |
| Cmd/Ctrl + F | Cari |
| Cmd/Ctrl + 1, 2, 3 | Write, Split, Read |
| Cmd/Ctrl + J | Quill |
| Cmd/Ctrl + Shift + D | Dikte suara |
| Cmd/Ctrl + . | Mode Quiet |
| Cmd/Ctrl + P | Cetak atau simpan sebagai PDF |

## Dikte suara {#dictate}

Tekan ikon mikrofon di kanan bawah, atau **Cmd/Ctrl + Shift + D**, lalu mulai bicara. Kata-katamu muncul di posisi kursor sambil kamu bicara, cocok untuk menangkap inti rapat lalu merapikannya nanti, manual atau lewat Quill. Pilih bahasa yang kamu ucapkan di bar kecil di bawah, lalu tekan **Stop** kalau sudah selesai.

Dikte memakai pengenal suara bawaan browser, jadi butuh koneksi internet, dan browser mengirim suaramu ke layanan suaranya sendiri. Fitur ini jalan di Chrome, Edge, dan Safari. Tombol mikrofon hanya muncul di tempat yang mendukung dikte.

## Outline {#outline}

Setiap heading di catatanmu jadi pemberhentian di jalur **On this page** pada sidebar. Saat kamu menulis atau scroll, penanda kecil berjalan ke bagian yang sedang kamu baca. Klik pemberhentian mana saja untuk melompat ke sana.

Garis tipis di antara bagian sidebar bisa ditarik untuk memberi ruang lebih atau kurang. Klik dua kali sebuah garis untuk mengembalikannya.

## Quill, AI kamu {#quill}

Quill adalah asisten menulis di dalam typeSirkel. Buka dengan **Cmd/Ctrl + J**, atau tombol **Quill** di kanan bawah. Kamu pakai key sendiri, dan key itu gak pernah keluar dari perangkatmu kecuali untuk menghubungi penyedia AI-mu.

### Menghubungkan penyedia

- **Anthropic** untuk Claude. Bikin key di [Claude Console](https://platform.claude.com/settings/keys).
- **OpenAI** untuk ChatGPT. Bikin key di [halaman API keys OpenAI](https://platform.openai.com/api-keys).
- **OpenRouter** untuk ratusan model, termasuk Gemini. Bikin key di [openrouter.ai/keys](https://openrouter.ai/keys).
- **Ollama** untuk model di komputermu sendiri, tanpa key sama sekali. Di browser, nyalakan dengan `OLLAMA_ORIGINS=https://sirkel.asia ollama serve`.
- **Other** untuk layanan apa pun yang memakai format chat OpenAI. Isi base URL dan key-nya.

Pilih penyedianya, tempel key-nya, lalu pilih model dari daftar. Aplikasi desktop menyimpan key di keychain sistem. Di browser, key hilang saat tab ditutup, kecuali kamu centang **Remember on this device**.

### Minta bantuan

Pilih sebuah paragraf, atau taruh kursor di dalamnya, lalu pilih aksi: Continue, Tighten, Fix, Summarize, atau Translate. Kamu lihat jawabannya dulu, baru pilih **Replace**, **Insert**, atau **Replace all**. Kamu juga bisa bertanya dengan kata-katamu sendiri dan lanjut ngobrol.

### Menulis banyak file sekaligus

Saat folder terbuka, **Brief** memungkinkan kamu menjelaskan sebuah pekerjaan, melihat rencana file yang diusulkan Quill, membuang yang gak kamu mau, lalu membiarkannya menulis satu per satu. Quill gak pernah menimpa file yang sudah ada.

## Prompt {#prompts}

**Prompts** di sidebar adalah etalase instruksi siap pakai: horor, fantasi, berita lugas, tulis ulang yang gak menyentuh kutipan atau nama, artikel SEO, tutorial, dan storyboard. Label kecil di sebelah judulnya mengganti bahasa etalase.

Klik sebuah prompt untuk membacanya. **Copy** menyalinnya ke clipboard untuk AI mana pun. **Use in Quill** memasangnya sebagai gaya untuk semua tulisan Quill, sampai kamu menghapusnya.

## Menulis bareng {#share}

Tekan **Share**, lalu **Start sharing**. Siapa pun yang punya tautannya bisa menyunting draf bersamamu dan melihat di mana setiap orang mengetik. Kalau drafnya file dari foldermu, perubahan mereka langsung masuk ke file-mu.

Draf yang dibagikan terenkripsi end-to-end. Key-nya ada setelah tanda `#` di tautan, yang gak pernah dikirim browser ke server, jadi relay cuma meneruskan data yang gak bisa dibacanya. Satu tautan bisa dipakai sampai 24 orang. Ruang yang gak disentuh selama 30 hari akan dihapus. Setiap kali berbagi kamu dapat tautan baru, dan pindah ke file lain menghentikan berbagi.

## MCP untuk agen AI {#mcp}

typeSirkel punya server MCP kecil yang membuat Claude Desktop, Claude Code, Cursor, atau klien MCP lain bisa melihat daftar, membaca, mencari, membuat outline, dan menulis catatan di satu folder, dan gak di tempat lain. Aplikasi desktop langsung menampilkan perubahan mereka.

Selama paketnya belum dirilis, bangun dari repositori:

```bash
git clone https://github.com/aconymouse/typesirkel
cd typesirkel/mcp
pnpm install && pnpm build
```

Lalu arahkan klienmu ke sana, misalnya di konfigurasi Claude Desktop:

```json
{
  "mcpServers": {
    "typesirkel": {
      "command": "node",
      "args": ["/path/to/typesirkel/mcp/dist/index.js", "/Users/kamu/Notes"]
    }
  }
}
```

## Ekspor {#export}

**Export** di kanan bawah memberimu halaman HTML mandiri yang rapi, PDF lewat dialog cetak, atau salinan markdown-nya. Catatanmu sudah berupa file biasa, jadi gak ada lagi yang perlu diekspor.

## Masih bingung? {#help}

Tanya di [GitHub issues](https://github.com/aconymouse/typesirkel/issues), atau colek Aco di [aconymous.com/chat](https://aconymous.com/chat).
