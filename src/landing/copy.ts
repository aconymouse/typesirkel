import type { Lang } from '../lang'

export type Copy = {
  meta: { title: string; description: string }
  nav: { openEditor: string; star: string; toLight: string; toDark: string; language: string; docs: string; faq: string; about: string; contents: string; maker: string; support: string; menu: string; close: string; light: string; dark: string }
  give: { saweria: string; paypal: string }
  hero: { line1: string; line2: string; lead: string; mac: string; windows: string; browser: string; fine: string }
  lookout: { title: string; body: string; hint: string; stops: string[] }
  features: { title: string; notes: { title: string; body: string }[] }
  agents: { title: string; p1: string; p2: string; folder: string; label: string; created: string; updated: string; done: string; prompts: string[] }
  source: { title: string; body: string; button: string }
}

const en: Copy = {
  meta: {
    title: 'typeSirkel · A quiet markdown editor for Mac, Windows and the browser',
    description: 'typeSirkel is a free, open source markdown editor. Plain files in your own folders, a live preview, and an outline that follows you through your headings.',
  },
  nav: { openEditor: 'Open editor', star: 'Star', toLight: 'Switch to light theme', toDark: 'Switch to dark theme', language: 'Language', docs: 'Docs', faq: 'FAQ', about: 'About', contents: 'On this page', maker: 'Maker of typeSirkel', support: 'Support', menu: 'Menu', close: 'Close menu', light: 'Light', dark: 'Dark' },
  give: { saweria: 'QRIS and e-wallets, for Indonesia', paypal: 'Cards or PayPal, from anywhere' },
  hero: {
    line1: 'Every work in the world',
    line2: 'starts as writing.',
    lead: 'Pour everything into your writing. typeSirkel is easy to use, and it connects to your own AI agents.',
    mac: 'Download for Mac',
    windows: 'Download for Windows',
    browser: 'Try it in your browser →',
    fine: 'macOS 11 or newer, Windows 10 or newer, Linux, or any Chromium browser. MIT licensed.',
  },
  lookout: {
    title: 'Always know where you are in a long draft.',
    body: 'Your headings become stops on a trail. As you write or scroll, the marker walks to the section you are in. The road behind you is drawn in, the road ahead is still dotted. Click any stop to jump there.',
    hint: 'Go on, click a heading.',
    stops: ['Chapter one', 'Arrival', 'The harbour', 'The market', 'Nightfall', 'A letter home', 'Morning'],
  },
  features: {
    title: 'Small on purpose.',
    notes: [
      { title: 'Plain files', body: 'Point it at a folder. Every note stays a .md file you can open in anything, back up anywhere, and keep forever.' },
      { title: 'Write and read at once', body: 'The editor and the preview sit side by side and keep their place together. Or hide either one when you need the room.' },
      { title: 'Bring your own AI', body: 'Plug in a key from Anthropic, OpenAI or OpenRouter, or a local Ollama. Continue, tighten, fix or translate a passage without leaving the page.' },
      { title: 'Write together', body: 'Share a link and edit the same draft live, cursors and all. Everything is sealed in your browser before it travels, so the relay never reads a word.' },
      { title: 'Works with your agents', body: 'A small MCP server lets Claude, Cursor or any MCP client read and write your folder. The desktop app picks up their edits as they land.' },
      { title: 'A shelf of prompts', body: 'Horror, fantasy, straight news, a rewrite that never touches quotes or names, SEO articles and storyboards. Copy one, or hand it to Quill.' },
    ],
  },
  agents: {
    title: 'Let your AI work in your folder.',
    p1: 'typeSirkel ships a small MCP server. Point Claude, Cursor or any other MCP client at your notes folder and it can search, read, outline and write markdown there, while you keep writing in the same files.',
    p2: 'Ask it to summarize a week of meetings, keep a changelog, or pull scattered notes into one outline. The desktop app picks up its edits as they land, so you never copy and paste between windows.',
    folder: 'Notes',
    label: 'Works with any MCP client',
    created: 'Created',
    updated: 'Updated',
    done: 'Done.',
    prompts: ["Turn this week's meeting notes into one summary.", 'Add what I shipped today to the changelog.', 'Find everything I wrote about Lisbon and outline a guide.'],
  },
  source: {
    title: 'Read the code. Change it. Make it yours.',
    body: 'typeSirkel is MIT licensed and small enough to understand in an afternoon. The editor is CodeMirror, the desktop shell is Tauri, and everything else is a handful of small React files named after things on a writing desk, like Desk, Sheet and Shelf.',
    button: 'View on GitHub',
  },
}

const id: Copy = {
  meta: {
    title: 'typeSirkel · Editor markdown yang tenang untuk Mac, Windows, dan browser',
    description: 'typeSirkel adalah editor markdown gratis dan open source. File biasa di folder sendiri, pratinjau langsung, dan outline yang mengikuti kamu di setiap heading.',
  },
  nav: { openEditor: 'Buka editor', star: 'Star', toLight: 'Ganti ke tema terang', toDark: 'Ganti ke tema gelap', language: 'Bahasa', docs: 'Dokumentasi', faq: 'FAQ', about: 'Tentang', contents: 'Di halaman ini', maker: 'Pembuat typeSirkel', support: 'Dukung', menu: 'Menu', close: 'Tutup menu', light: 'Terang', dark: 'Gelap' },
  give: { saweria: 'QRIS dan e-wallet, dari Indonesia', paypal: 'Kartu atau PayPal, dari mana saja' },
  hero: {
    line1: 'Semua karya di dunia,',
    line2: 'berawal dari tulisan.',
    lead: 'Tumpahkan semua yang ada di kepalamu ke dalam tulisan. typeSirkel gampang dipakai, dan bisa langsung tersambung ke AI agent milikmu.',
    mac: 'Unduh untuk Mac',
    windows: 'Unduh untuk Windows',
    browser: 'Coba langsung di browser →',
    fine: 'macOS 11 ke atas, Windows 10 ke atas, Linux, atau browser berbasis Chromium. Lisensi MIT.',
  },
  lookout: {
    title: 'Selalu tahu posisimu di draf yang panjang.',
    body: 'Heading jadi pemberhentian di sepanjang jalur. Saat kamu menulis atau scroll, penanda berjalan ke bagian yang sedang kamu baca. Jalur di belakang sudah terisi, jalur di depan masih putus-putus. Klik pemberhentian mana saja untuk melompat ke sana.',
    hint: 'Ayo, klik salah satu heading.',
    stops: ['Bab satu', 'Tiba', 'Pelabuhan', 'Pasar', 'Malam tiba', 'Surat untuk rumah', 'Pagi'],
  },
  features: {
    title: 'Sengaja dibuat ringkas.',
    notes: [
      { title: 'File biasa', body: 'Arahkan ke sebuah folder. Setiap catatan tetap file .md yang bisa dibuka di aplikasi apa pun, dicadangkan di mana saja, dan disimpan selamanya.' },
      { title: 'Menulis dan membaca sekaligus', body: 'Editor dan pratinjau berdampingan dan selalu sejajar. Sembunyikan salah satunya kalau butuh ruang lebih.' },
      { title: 'Pakai AI sendiri', body: 'Pasang key dari Anthropic, OpenAI, OpenRouter, atau Ollama di komputer sendiri. Lanjutkan, rapikan, perbaiki, atau terjemahkan paragraf tanpa pindah halaman.' },
      { title: 'Menulis bareng', body: 'Bagikan tautan dan sunting draf yang sama secara langsung, lengkap dengan kursor tiap orang. Semua dienkripsi di browser sebelum dikirim, jadi relay tidak pernah bisa membacanya.' },
      { title: 'Akrab dengan agen AI', body: 'Server MCP kecil membuat Claude, Cursor, atau klien MCP lain bisa membaca dan menulis di foldermu. Aplikasi desktop langsung menampilkan perubahannya.' },
      { title: 'Etalase prompt', body: 'Horor, fantasi, berita lugas, penulisan ulang yang tidak mengubah kutipan atau nama, artikel SEO, dan storyboard. Salin, atau serahkan ke Quill.' },
    ],
  },
  agents: {
    title: 'Biarkan AI bekerja di foldermu.',
    p1: 'typeSirkel menyertakan server MCP kecil. Arahkan Claude, Cursor, atau klien MCP lain ke folder catatanmu, dan dia bisa mencari, membaca, membuat outline, dan menulis markdown di sana, sementara kamu tetap menulis di file yang sama.',
    p2: 'Minta dia merangkum rapat seminggu, mengisi changelog, atau mengumpulkan catatan yang tercecer jadi satu outline. Aplikasi desktop langsung menampilkan perubahannya, jadi tidak perlu salin tempel antarjendela.',
    folder: 'Catatan',
    label: 'Bisa dengan klien MCP apa pun',
    created: 'Membuat',
    updated: 'Memperbarui',
    done: 'Selesai.',
    prompts: ['Rangkum catatan rapat minggu ini jadi satu.', 'Tambahkan yang aku rilis hari ini ke changelog.', 'Cari semua tulisanku soal Lisbon dan buat outline panduannya.'],
  },
  source: {
    title: 'Baca kodenya. Ubah. Jadikan milikmu.',
    body: 'typeSirkel berlisensi MIT dan cukup kecil buat dipahami dalam satu sore. Editornya pakai CodeMirror, aplikasi desktopnya Tauri, sisanya cuma segelintir file React kecil yang namanya diambil dari barang-barang di meja kerja, kayak Desk, Sheet, dan Shelf.',
    button: 'Lihat di GitHub',
  },
}

const ptBR: Copy = {
  meta: {
    title: 'typeSirkel · Um editor de markdown tranquilo para Mac, Windows e navegador',
    description: 'typeSirkel é um editor de markdown gratuito e de código aberto. Arquivos simples nas suas pastas, pré-visualização ao vivo e um sumário que acompanha você pelos títulos.',
  },
  nav: { openEditor: 'Abrir editor', star: 'Star', toLight: 'Mudar para tema claro', toDark: 'Mudar para tema escuro', language: 'Idioma', docs: 'Documentação', faq: 'FAQ', about: 'Sobre', contents: 'Nesta página', maker: 'Criador do typeSirkel', support: 'Apoie', menu: 'Menu', close: 'Fechar menu', light: 'Claro', dark: 'Escuro' },
  give: { saweria: 'QRIS e carteiras digitais, na Indonésia', paypal: 'Cartão ou PayPal, de qualquer lugar' },
  hero: {
    line1: 'Toda obra no mundo',
    line2: 'começa pela escrita.',
    lead: 'Coloque tudo para fora na escrita. O typeSirkel é fácil de usar e se conecta aos seus próprios agentes de IA.',
    mac: 'Baixar para Mac',
    windows: 'Baixar para Windows',
    browser: 'Experimente no navegador →',
    fine: 'macOS 11 ou mais recente, Windows 10 ou mais recente, Linux ou qualquer navegador Chromium. Licença MIT.',
  },
  lookout: {
    title: 'Saiba sempre onde você está num texto longo.',
    body: 'Seus títulos viram paradas de uma trilha. Enquanto você escreve ou rola a página, o marcador caminha até a seção em que você está. O caminho percorrido fica preenchido, o que falta continua pontilhado. Clique em qualquer parada para ir até lá.',
    hint: 'Vá em frente, clique num título.',
    stops: ['Capítulo um', 'Chegada', 'O porto', 'O mercado', 'Anoitecer', 'Uma carta para casa', 'Manhã'],
  },
  features: {
    title: 'Pequeno de propósito.',
    notes: [
      { title: 'Arquivos simples', body: 'Aponte para uma pasta. Cada nota continua sendo um arquivo .md que abre em qualquer lugar, faz backup em qualquer serviço e dura para sempre.' },
      { title: 'Escreva e leia ao mesmo tempo', body: 'Editor e pré-visualização ficam lado a lado e andam juntos. Ou esconda um deles quando precisar de espaço.' },
      { title: 'Use a sua própria IA', body: 'Conecte uma chave da Anthropic, OpenAI, OpenRouter ou um Ollama local. Continue, enxugue, corrija ou traduza um trecho sem sair da página.' },
      { title: 'Escreva junto', body: 'Compartilhe um link e editem o mesmo texto ao vivo, com cursores e tudo. Tudo é criptografado no navegador antes de sair, então o servidor nunca lê uma palavra.' },
      { title: 'Funciona com seus agentes', body: 'Um pequeno servidor MCP deixa o Claude, o Cursor ou qualquer cliente MCP ler e escrever na sua pasta. O app de desktop mostra as mudanças na hora.' },
      { title: 'Uma estante de prompts', body: 'Terror, fantasia, notícia objetiva, uma reescrita que nunca mexe em citações ou nomes, artigos de SEO e storyboards. Copie um ou entregue ao Quill.' },
    ],
  },
  agents: {
    title: 'Deixe a sua IA trabalhar na sua pasta.',
    p1: 'O typeSirkel vem com um pequeno servidor MCP. Aponte o Claude, o Cursor ou outro cliente MCP para a sua pasta de notas e ele pode buscar, ler, montar sumários e escrever markdown ali, enquanto você continua escrevendo nos mesmos arquivos.',
    p2: 'Peça para resumir uma semana de reuniões, manter um changelog ou juntar anotações espalhadas num só roteiro. O app de desktop mostra as mudanças na hora, sem copiar e colar entre janelas.',
    folder: 'Notas',
    label: 'Funciona com qualquer cliente MCP',
    created: 'Criado',
    updated: 'Atualizado',
    done: 'Pronto.',
    prompts: ['Transforme as notas das reuniões desta semana num resumo.', 'Adicione ao changelog o que entreguei hoje.', 'Encontre tudo o que escrevi sobre Lisboa e monte um roteiro de guia.'],
  },
  source: {
    title: 'Leia o código. Mude. Faça do seu jeito.',
    body: 'O typeSirkel tem licença MIT e é pequeno o bastante para entender numa tarde. O editor é CodeMirror, o app de desktop é Tauri, e o resto são alguns arquivos React pequenos com nomes de coisas de uma escrivaninha, como Desk, Sheet e Shelf.',
    button: 'Ver no GitHub',
  },
}

const ko: Copy = {
  meta: {
    title: 'typeSirkel · Mac, Windows, 브라우저를 위한 조용한 마크다운 에디터',
    description: 'typeSirkel은 무료 오픈소스 마크다운 에디터입니다. 내 폴더 속 평범한 파일, 실시간 미리보기, 그리고 제목을 따라 움직이는 목차.',
  },
  nav: { openEditor: '에디터 열기', star: 'Star', toLight: '라이트 테마로 전환', toDark: '다크 테마로 전환', language: '언어', docs: '문서', faq: 'FAQ', about: '소개', contents: '이 페이지에서', maker: 'typeSirkel 제작자', support: '후원', menu: '메뉴', close: '메뉴 닫기', light: '라이트', dark: '다크' },
  give: { saweria: 'QRIS·전자지갑, 인도네시아에서', paypal: '카드 또는 PayPal, 어디서나' },
  hero: {
    line1: '세상의 모든 작품은',
    line2: '글에서 시작됩니다.',
    lead: '머릿속의 모든 것을 글로 쏟아내세요. typeSirkel은 쓰기 쉽고, 내가 쓰는 AI 에이전트와 바로 연결됩니다.',
    mac: 'Mac용 다운로드',
    windows: 'Windows용 다운로드',
    browser: '브라우저에서 바로 써 보기 →',
    fine: 'macOS 11 이상, Windows 10 이상, Linux, 또는 Chromium 기반 브라우저. MIT 라이선스.',
  },
  lookout: {
    title: '긴 글에서도 지금 어디쯤인지 늘 알 수 있어요.',
    body: '제목은 길 위의 정류장이 됩니다. 글을 쓰거나 스크롤하면 표시가 지금 있는 부분으로 걸어갑니다. 지나온 길은 채워지고 남은 길은 점선으로 남습니다. 정류장을 누르면 바로 이동합니다.',
    hint: '제목을 하나 눌러 보세요.',
    stops: ['1장', '도착', '항구', '시장', '해 질 녘', '집으로 보내는 편지', '아침'],
  },
  features: {
    title: '일부러 작게 만들었습니다.',
    notes: [
      { title: '평범한 파일', body: '폴더를 지정하세요. 모든 노트는 어디서나 열 수 있고, 어디에나 백업할 수 있고, 영원히 남는 .md 파일로 남습니다.' },
      { title: '쓰면서 동시에 읽기', body: '에디터와 미리보기가 나란히 붙어 같은 위치를 유지합니다. 공간이 필요하면 하나를 숨기세요.' },
      { title: '내 AI 그대로', body: 'Anthropic, OpenAI, OpenRouter 키나 로컬 Ollama를 연결하세요. 페이지를 떠나지 않고 이어 쓰고, 다듬고, 고치고, 번역합니다.' },
      { title: '함께 쓰기', body: '링크를 공유하면 같은 글을 실시간으로 함께 편집합니다. 모든 내용은 브라우저에서 암호화된 뒤 전송되어 중계 서버는 한 글자도 읽을 수 없습니다.' },
      { title: 'AI 에이전트와 함께', body: '작은 MCP 서버로 Claude, Cursor 등 MCP 클라이언트가 내 폴더를 읽고 쓸 수 있습니다. 데스크톱 앱은 변경 사항을 바로 보여 줍니다.' },
      { title: '프롬프트 진열장', body: '호러, 판타지, 스트레이트 뉴스, 인용과 이름은 건드리지 않는 리라이트, SEO 글, 스토리보드. 복사하거나 Quill에 맡기세요.' },
    ],
  },
  agents: {
    title: 'AI가 내 폴더에서 일하게 하세요.',
    p1: 'typeSirkel에는 작은 MCP 서버가 들어 있습니다. Claude, Cursor 같은 MCP 클라이언트를 노트 폴더에 연결하면 검색하고, 읽고, 목차를 만들고, 마크다운을 씁니다. 그동안 나는 같은 파일에서 계속 쓰면 됩니다.',
    p2: '일주일 치 회의 요약, 변경 기록 정리, 흩어진 메모를 하나의 개요로 묶는 일을 맡겨 보세요. 데스크톱 앱이 변경 사항을 바로 보여 주니 창 사이에서 복사해 붙일 필요가 없습니다.',
    folder: '노트',
    label: '모든 MCP 클라이언트와 호환',
    created: '생성',
    updated: '수정',
    done: '완료.',
    prompts: ['이번 주 회의 노트를 하나로 요약해 줘.', '오늘 배포한 내용을 변경 기록에 추가해 줘.', '리스본에 대해 쓴 글을 모두 찾아 가이드 개요를 만들어 줘.'],
  },
  source: {
    title: '코드를 읽고, 바꾸고, 내 것으로.',
    body: 'typeSirkel은 MIT 라이선스이며 오후 한나절이면 이해할 만큼 작습니다. 에디터는 CodeMirror, 데스크톱 셸은 Tauri, 나머지는 Desk, Sheet, Shelf처럼 책상 위 물건 이름을 딴 작은 React 파일 몇 개뿐입니다.',
    button: 'GitHub에서 보기',
  },
}

const th: Copy = {
  meta: {
    title: 'typeSirkel · โปรแกรมเขียนมาร์กดาวน์ที่เงียบสงบ สำหรับ Mac, Windows และเบราว์เซอร์',
    description: 'typeSirkel คือโปรแกรมเขียนมาร์กดาวน์ฟรีและโอเพนซอร์ส ไฟล์ธรรมดาในโฟลเดอร์ของคุณเอง พรีวิวสด และสารบัญที่เดินตามหัวข้อไปกับคุณ',
  },
  nav: { openEditor: 'เปิดโปรแกรม', star: 'Star', toLight: 'เปลี่ยนเป็นธีมสว่าง', toDark: 'เปลี่ยนเป็นธีมมืด', language: 'ภาษา', docs: 'เอกสาร', faq: 'คำถามที่พบบ่อย', about: 'เกี่ยวกับ', contents: 'ในหน้านี้', maker: 'ผู้สร้าง typeSirkel', support: 'สนับสนุน', menu: 'เมนู', close: 'ปิดเมนู', light: 'สว่าง', dark: 'มืด' },
  give: { saweria: 'QRIS และวอลเล็ต สำหรับอินโดนีเซีย', paypal: 'บัตรหรือ PayPal จากทุกที่' },
  hero: {
    line1: 'ทุกผลงานบนโลก',
    line2: 'เริ่มต้นจากการเขียน',
    lead: 'เทความคิดทั้งหมดลงในงานเขียนของคุณ typeSirkel ใช้ง่าย และเชื่อมต่อกับ AI agent ของคุณเองได้ทันที',
    mac: 'ดาวน์โหลดสำหรับ Mac',
    windows: 'ดาวน์โหลดสำหรับ Windows',
    browser: 'ลองใช้ในเบราว์เซอร์ →',
    fine: 'macOS 11 ขึ้นไป, Windows 10 ขึ้นไป, Linux หรือเบราว์เซอร์ที่ใช้ Chromium สัญญาอนุญาต MIT',
  },
  lookout: {
    title: 'รู้เสมอว่ากำลังอยู่ตรงไหนของงานเขียนยาว ๆ',
    body: 'หัวข้อของคุณกลายเป็นป้ายจอดบนเส้นทาง ขณะที่คุณเขียนหรือเลื่อนหน้า เครื่องหมายจะเดินไปยังส่วนที่คุณอยู่ ทางที่ผ่านมาจะถูกเติมเต็ม ส่วนทางข้างหน้ายังเป็นเส้นประ คลิกป้ายไหนก็ได้เพื่อกระโดดไปที่นั่น',
    hint: 'ลองคลิกหัวข้อสักอันดูสิ',
    stops: ['บทที่หนึ่ง', 'มาถึง', 'ท่าเรือ', 'ตลาด', 'พลบค่ำ', 'จดหมายถึงบ้าน', 'รุ่งเช้า'],
  },
  features: {
    title: 'ตั้งใจทำให้เล็ก',
    notes: [
      { title: 'ไฟล์ธรรมดา', body: 'เลือกโฟลเดอร์ แล้วโน้ตทุกอันจะเป็นไฟล์ .md ที่เปิดได้ทุกที่ สำรองไว้ที่ไหนก็ได้ และอยู่กับคุณตลอดไป' },
      { title: 'เขียนและอ่านไปพร้อมกัน', body: 'ตัวเขียนกับพรีวิวอยู่เคียงข้างกันและเลื่อนไปด้วยกัน หรือซ่อนอันใดอันหนึ่งเมื่อต้องการพื้นที่' },
      { title: 'ใช้ AI ของคุณเอง', body: 'ใส่คีย์จาก Anthropic, OpenAI, OpenRouter หรือ Ollama ในเครื่อง แล้วเขียนต่อ เกลา แก้ หรือแปลย่อหน้าได้โดยไม่ต้องออกจากหน้า' },
      { title: 'เขียนด้วยกัน', body: 'แชร์ลิงก์แล้วแก้ไขงานเดียวกันแบบสด ๆ เห็นเคอร์เซอร์ของทุกคน ทุกอย่างถูกเข้ารหัสในเบราว์เซอร์ก่อนส่ง เซิร์ฟเวอร์กลางจึงอ่านไม่ได้แม้แต่คำเดียว' },
      { title: 'ทำงานกับเอเจนต์ AI', body: 'เซิร์ฟเวอร์ MCP ตัวเล็กทำให้ Claude, Cursor หรือไคลเอนต์ MCP อื่น อ่านและเขียนในโฟลเดอร์ของคุณได้ แอปเดสก์ท็อปแสดงการแก้ไขทันที' },
      { title: 'ชั้นวางพรอมต์', body: 'สยองขวัญ แฟนตาซี ข่าวตรงไปตรงมา การเรียบเรียงใหม่ที่ไม่แตะคำพูดหรือชื่อ บทความ SEO และสตอรี่บอร์ด คัดลอกไปใช้ หรือส่งให้ Quill' },
    ],
  },
  agents: {
    title: 'ให้ AI ทำงานในโฟลเดอร์ของคุณ',
    p1: 'typeSirkel มาพร้อมเซิร์ฟเวอร์ MCP ตัวเล็ก ชี้ Claude, Cursor หรือไคลเอนต์ MCP อื่นไปที่โฟลเดอร์โน้ตของคุณ มันจะค้นหา อ่าน ทำสารบัญ และเขียนมาร์กดาวน์ในนั้น ขณะที่คุณยังเขียนในไฟล์เดียวกันได้ตามปกติ',
    p2: 'ให้สรุปการประชุมทั้งสัปดาห์ จดบันทึกการเปลี่ยนแปลง หรือรวมโน้ตที่กระจัดกระจายเป็นโครงเรื่องเดียว แอปเดสก์ท็อปแสดงการแก้ไขทันที ไม่ต้องคัดลอกวางข้ามหน้าต่าง',
    folder: 'โน้ต',
    label: 'ใช้ได้กับไคลเอนต์ MCP ทุกตัว',
    created: 'สร้าง',
    updated: 'อัปเดต',
    done: 'เสร็จแล้ว',
    prompts: ['สรุปโน้ตการประชุมสัปดาห์นี้รวมเป็นอันเดียว', 'เพิ่มสิ่งที่ปล่อยวันนี้ลงในบันทึกการเปลี่ยนแปลง', 'หาทุกอย่างที่เคยเขียนเรื่องลิสบอน แล้วทำโครงคู่มือ'],
  },
  source: {
    title: 'อ่านโค้ด แก้ไข แล้วทำให้เป็นของคุณ',
    body: 'typeSirkel ใช้สัญญาอนุญาต MIT และเล็กพอจะเข้าใจได้ในบ่ายเดียว ตัวเขียนคือ CodeMirror แอปเดสก์ท็อปคือ Tauri ที่เหลือคือไฟล์ React เล็ก ๆ ไม่กี่ไฟล์ ตั้งชื่อตามของบนโต๊ะทำงาน อย่าง Desk, Sheet และ Shelf',
    button: 'ดูบน GitHub',
  },
}

const zh: Copy = {
  meta: {
    title: 'typeSirkel · 适用于 Mac、Windows 和浏览器的安静 Markdown 编辑器',
    description: 'typeSirkel 是一款免费开源的 Markdown 编辑器。笔记就是你自己文件夹里的普通文件，带实时预览，还有一个跟着你在标题间移动的大纲。',
  },
  nav: { openEditor: '打开编辑器', star: 'Star', toLight: '切换到浅色主题', toDark: '切换到深色主题', language: '语言', docs: '文档', faq: '常见问题', about: '关于', contents: '本页内容', maker: 'typeSirkel 作者', support: '支持', menu: '菜单', close: '关闭菜单', light: '浅色', dark: '深色' },
  give: { saweria: 'QRIS 和电子钱包，适用于印度尼西亚', paypal: '银行卡或 PayPal，全球可用' },
  hero: {
    line1: '世界上的每一部作品，',
    line2: '都始于文字。',
    lead: '把脑海里的一切都倾注到文字里。typeSirkel 简单好用，还能直接连接你自己的 AI 智能体。',
    mac: '下载 Mac 版',
    windows: '下载 Windows 版',
    browser: '在浏览器中试用 →',
    fine: '支持 macOS 11 及以上、Windows 10 及以上、Linux，或任意 Chromium 浏览器。MIT 许可。',
  },
  lookout: {
    title: '在长稿里，永远知道自己在哪儿。',
    body: '标题变成一条小路上的站点。你写作或滚动时，标记会走到你所在的章节。走过的路是实线，前面的路还是虚线。点击任意站点即可跳过去。',
    hint: '来，点一个标题试试。',
    stops: ['第一章', '抵达', '港口', '集市', '入夜', '一封家书', '清晨'],
  },
  features: {
    title: '刻意保持小巧。',
    notes: [
      { title: '普通文件', body: '指向一个文件夹即可。每条笔记都是 .md 文件，任何软件都能打开，随处备份，永久保存。' },
      { title: '边写边读', body: '编辑器和预览并排，滚动时始终对齐。需要空间时，也可以隐藏其中一个。' },
      { title: '用你自己的 AI', body: '填入 Anthropic、OpenAI 或 OpenRouter 的密钥，或使用本地的 Ollama。续写、精简、修正或翻译段落，都不用离开页面。' },
      { title: '一起写', body: '分享一个链接，多人实时编辑同一份草稿，每个人的光标都看得见。所有内容在浏览器里加密后才发送，中继服务器读不到一个字。' },
      { title: '与 AI 智能体协作', body: '一个小小的 MCP 服务器，让 Claude、Cursor 或任意 MCP 客户端读写你的文件夹。桌面应用会即时显示它们的修改。' },
      { title: '提示词书架', body: '恐怖、奇幻、纯新闻、绝不改动引语和名字的改写、SEO 文章和分镜脚本。复制一个，或交给 Quill。' },
    ],
  },
  agents: {
    title: '让 AI 在你的文件夹里工作。',
    p1: 'typeSirkel 自带一个小型 MCP 服务器。把 Claude、Cursor 或其他 MCP 客户端指向你的笔记文件夹，它就能在里面搜索、阅读、生成大纲和写 Markdown，而你照样在同一批文件里写作。',
    p2: '让它总结一周的会议、维护更新日志，或把零散的笔记整理成一份大纲。桌面应用会即时显示它的修改，不用在窗口之间来回复制粘贴。',
    folder: '笔记',
    label: '兼容任意 MCP 客户端',
    created: '已创建',
    updated: '已更新',
    done: '完成。',
    prompts: ['把这周的会议记录整理成一份总结。', '把我今天发布的内容加到更新日志里。', '找出我写过的所有关于里斯本的内容，列一份指南大纲。'],
  },
  source: {
    title: '读代码，改代码，让它成为你的。',
    body: 'typeSirkel 采用 MIT 许可，小到一个下午就能读懂。编辑器是 CodeMirror，桌面外壳是 Tauri，其余只是几个小小的 React 文件，名字取自书桌上的东西，比如 Desk、Sheet 和 Shelf。',
    button: '在 GitHub 上查看',
  },
}

export const copies: Record<Lang, Copy> = { en, id, 'pt-BR': ptBR, ko, th, 'zh-Hans': zh }
