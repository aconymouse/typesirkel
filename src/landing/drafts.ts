import type { Lang } from '../lang'

// The three notes in the live demo, written in each language the site speaks.
// They are the first thing most visitors type into, so they sound like a
// person, not a product sheet. Nothing here is saved.

export type Draft = { name: string; text: string }

export const drafts: Record<Lang, Draft[]> = {
  en: [
    {
      name: 'story.md',
      text: `# Why I made this

I'm Aco. Not a big team, not a funded startup, just one person who loves to write and kept losing his own notes.

## Where it started

Every video I watched began as a script. Every song began as a lyric. Even the code I write for a living is, in the end, writing. So I wanted a quiet place to put the words down first.

### What I left out

Accounts, sync servers, an export button. Your notes stay plain \`.md\` files in your own folder, still readable long after this app is gone.

## The little marker

Long drafts get lost in the middle. So do I, honestly. The marker in the outline always knows which section you are in.

### Try it

Scroll this note, or tap a heading in the outline.

## Thank you

If you read this far, thank you. Type anything here; the preview and the outline follow along.
`,
    },
    {
      name: 'today.md',
      text: `# Monday, slowly

## Before work

Coffee, ten minutes of writing, no phone. Most days I only manage five.

## To finish

- Reply to the email I have been avoiding since Friday
- Fix the bug that only shows up during a demo
- Write one honest paragraph

### Note to self

Small is still progress.

## After

Nothing planned. That is the plan.
`,
    },
    {
      name: 'ideas.md',
      text: `# Ideas

## For typeSirkel

- A calmer way to share a draft
- Whatever you tell me is missing

## For me

> Write the thing you wish you could read.

**Bold** and *italic* work the way you expect.
`,
    },
  ],
  id: [
    {
      name: 'cerita.md',
      text: `# Kenapa aku bikin ini

Aku Aco. Bukan tim besar, bukan startup yang didanai, cuma satu orang yang suka nulis dan sering kehilangan catatannya sendiri.

## Awalnya dari sini

Tiap video yang aku tonton berawal dari naskah. Tiap lagu berawal dari lirik. Bahkan kode yang aku tulis buat cari makan, ujung-ujungnya juga tulisan. Jadi aku pengin punya tempat yang tenang buat numpahin kata-kata duluan.

### Yang sengaja aku tinggalin

Akun, server sinkron, tombol ekspor. Catatanmu tetap file \`.md\` biasa di foldermu sendiri, dan tetap bisa dibaca lama setelah aplikasi ini gak ada.

## Penanda kecil itu

Draf panjang gampang bikin nyasar di tengah. Jujur, aku juga sering. Penanda di outline selalu tahu kamu lagi di bagian mana.

### Coba deh

Scroll catatan ini, atau ketuk salah satu heading di outline.

## Makasih

Kalau kamu baca sampai sini, makasih ya. Ketik apa aja di sini, pratinjau dan outline-nya ikut jalan.
`,
    },
    {
      name: 'hari-ini.md',
      text: `# Senin, pelan-pelan

## Sebelum kerja

Kopi, sepuluh menit nulis, tanpa HP. Kebanyakan hari aku cuma kuat lima menit.

## Yang harus beres

- Balas email yang aku hindarin dari Jumat
- Benerin bug yang cuma muncul pas lagi demo
- Nulis satu paragraf yang jujur

### Catatan buat diri sendiri

Kecil juga tetap maju.

## Habis itu

Gak ada rencana. Itu rencananya.
`,
    },
    {
      name: 'ide.md',
      text: `# Ide

## Buat typeSirkel

- Cara berbagi draf yang lebih tenang
- Apa pun yang menurutmu masih kurang

## Buat aku sendiri

> Tulis hal yang kamu sendiri pengin baca.

**Tebal** dan *miring* jalan seperti yang kamu kira.
`,
    },
  ],
  'pt-BR': [
    {
      name: 'historia.md',
      text: `# Por que eu fiz isto

Eu sou o Aco. Não sou uma equipe grande nem uma startup com investimento, só uma pessoa que adora escrever e vivia perdendo as próprias anotações.

## Onde começou

Todo vídeo que eu assisti começou como roteiro. Toda música começou como letra. Até o código que escrevo para viver é, no fim, escrita. Então eu quis um lugar tranquilo para colocar as palavras no papel primeiro.

### O que eu deixei de fora

Contas, servidores de sincronização, um botão de exportar. Suas notas continuam sendo arquivos \`.md\` simples na sua própria pasta, legíveis muito depois de este app sumir.

## O pequeno marcador

Rascunhos longos se perdem no meio. Eu também, para ser sincero. O marcador no roteiro sempre sabe em que seção você está.

### Experimente

Role esta nota ou toque em um título no roteiro.

## Obrigado

Se você leu até aqui, obrigado. Digite qualquer coisa; a pré-visualização e o roteiro acompanham.
`,
    },
    {
      name: 'hoje.md',
      text: `# Segunda, devagar

## Antes do trabalho

Café, dez minutos de escrita, sem celular. Na maioria dos dias eu só aguento cinco.

## Para terminar

- Responder o e-mail que eu evito desde sexta
- Corrigir o bug que só aparece na hora da demo
- Escrever um parágrafo sincero

### Nota para mim

Pequeno ainda é progresso.

## Depois

Nada planejado. Esse é o plano.
`,
    },
    {
      name: 'ideias.md',
      text: `# Ideias

## Para o typeSirkel

- Um jeito mais calmo de compartilhar um rascunho
- O que você me disser que está faltando

## Para mim

> Escreva aquilo que você gostaria de ler.

**Negrito** e *itálico* funcionam como você espera.
`,
    },
  ],
  ko: [
    {
      name: '이야기.md',
      text: `# 제가 이걸 만든 이유

저는 Aco입니다. 큰 팀도, 투자받은 스타트업도 아니에요. 글쓰기를 좋아하면서도 제 메모를 자꾸 잃어버리던 한 사람일 뿐이에요.

## 시작은 여기서

제가 본 모든 영상은 대본에서 시작했어요. 모든 노래는 가사에서 시작했고요. 제가 먹고살려고 쓰는 코드도 결국은 글이에요. 그래서 말을 먼저 내려놓을 조용한 곳이 있었으면 했어요.

### 일부러 뺀 것들

계정, 동기화 서버, 내보내기 버튼. 노트는 내 폴더 안의 평범한 \`.md\` 파일로 남고, 이 앱이 사라진 뒤에도 그대로 읽을 수 있어요.

## 작은 표시

긴 초안은 중간에서 길을 잃기 쉬워요. 솔직히 저도 그래요. 개요의 표시는 지금 어느 섹션에 있는지 늘 알고 있어요.

### 해 보세요

이 노트를 스크롤하거나 개요의 제목을 눌러 보세요.

## 고마워요

여기까지 읽어 주셨다면 정말 고마워요. 아무거나 입력해 보세요. 미리보기와 개요가 따라옵니다.
`,
    },
    {
      name: '오늘.md',
      text: `# 월요일, 천천히

## 일하기 전에

커피, 10분 글쓰기, 휴대폰 없이. 대부분은 5분이 한계예요.

## 끝낼 일

- 금요일부터 미뤄 둔 이메일 답장하기
- 데모할 때만 나타나는 버그 고치기
- 솔직한 문단 하나 쓰기

### 나에게 쓰는 메모

작아도 앞으로 가는 거예요.

## 그다음

계획 없음. 그게 계획이에요.
`,
    },
    {
      name: '아이디어.md',
      text: `# 아이디어

## typeSirkel을 위해

- 초안을 더 차분하게 나누는 방법
- 부족하다고 알려 주시는 모든 것

## 나를 위해

> 내가 읽고 싶은 글을 쓰자.

**굵게**와 *기울임*은 생각한 대로 동작해요.
`,
    },
  ],
  th: [
    {
      name: 'เรื่องเล่า.md',
      text: `# ทำไมผมถึงสร้างสิ่งนี้

ผมชื่อ Aco ไม่ใช่ทีมใหญ่ ไม่ใช่สตาร์ทอัปที่มีทุน แค่คนคนหนึ่งที่ชอบเขียนและทำโน้ตตัวเองหายอยู่บ่อย ๆ

## จุดเริ่มต้น

ทุกวิดีโอที่ผมดูเริ่มจากบท ทุกเพลงเริ่มจากเนื้อร้อง แม้แต่โค้ดที่ผมเขียนหาเลี้ยงชีพก็คืองานเขียนเหมือนกัน ผมเลยอยากมีที่เงียบ ๆ สำหรับวางถ้อยคำลงไปก่อน

### สิ่งที่ผมตั้งใจไม่ใส่

บัญชี เซิร์ฟเวอร์ซิงก์ ปุ่มส่งออก โน้ตของคุณยังเป็นไฟล์ \`.md\` ธรรมดาในโฟลเดอร์ของคุณเอง และยังอ่านได้แม้แอปนี้จะไม่อยู่แล้ว

## เครื่องหมายเล็ก ๆ

ร่างยาว ๆ มักหลงทางตรงกลาง บอกตรง ๆ ผมก็เป็น เครื่องหมายในโครงร่างรู้เสมอว่าคุณอยู่ส่วนไหน

### ลองดู

เลื่อนโน้ตนี้ หรือแตะหัวข้อในโครงร่าง

## ขอบคุณ

ถ้าอ่านมาถึงตรงนี้ ขอบคุณมากครับ ลองพิมพ์อะไรก็ได้ พรีวิวและโครงร่างจะตามไปด้วย
`,
    },
    {
      name: 'วันนี้.md',
      text: `# วันจันทร์ แบบช้า ๆ

## ก่อนทำงาน

กาแฟ เขียนสิบนาที ไม่จับมือถือ ส่วนใหญ่ผมไหวแค่ห้านาที

## ต้องทำให้เสร็จ

- ตอบอีเมลที่เลี่ยงมาตั้งแต่วันศุกร์
- แก้บั๊กที่โผล่มาแค่ตอนเดโม
- เขียนย่อหน้าที่จริงใจสักหนึ่งย่อหน้า

### บันทึกถึงตัวเอง

เล็กแค่ไหนก็ยังคือการเดินหน้า

## หลังจากนั้น

ไม่มีแผน นั่นแหละคือแผน
`,
    },
    {
      name: 'ไอเดีย.md',
      text: `# ไอเดีย

## สำหรับ typeSirkel

- วิธีแชร์ร่างที่สงบกว่านี้
- อะไรก็ตามที่คุณบอกว่ายังขาด

## สำหรับตัวเอง

> เขียนสิ่งที่คุณอยากอ่านเอง

**ตัวหนา** และ *ตัวเอียง* ใช้ได้อย่างที่คิด
`,
    },
  ],
  'zh-Hans': [
    {
      name: '故事.md',
      text: `# 我为什么做这个

我是 Aco。不是大团队，也不是拿了投资的创业公司，只是一个喜欢写东西、又总是弄丢自己笔记的人。

## 从这里开始

我看过的每个视频都始于一份脚本，每首歌都始于一段歌词。就连我赖以为生的代码，说到底也是文字。所以我想要一个安静的地方，先把字写下来。

### 我故意没做的

账号、同步服务器、导出按钮。你的笔记一直是你自己文件夹里普通的 \`.md\` 文件，哪怕这个应用不在了也照样能读。

## 那个小标记

长稿子很容易在中间迷路。说实话，我也是。大纲里的标记总知道你正在哪一节。

### 试试看

滚动这篇笔记，或者点一下大纲里的标题。

## 谢谢

如果你读到了这里，谢谢你。随便写点什么，预览和大纲都会跟上。
`,
    },
    {
      name: '今天.md',
      text: `# 周一，慢慢来

## 上班前

咖啡，写十分钟，不碰手机。大多数时候我只能坚持五分钟。

## 要做完的

- 回那封从周五就一直在躲的邮件
- 修好只在演示时出现的 bug
- 写一段真诚的话

### 给自己的便条

再小也是进步。

## 之后

没有计划。这就是计划。
`,
    },
    {
      name: '想法.md',
      text: `# 想法

## 给 typeSirkel

- 更从容地分享草稿
- 你告诉我还缺的任何东西

## 给自己

> 写下你自己也想读的东西。

**粗体** 和 *斜体* 和你想的一样好用。
`,
    },
  ],
}
