import type { Lang } from '../lang'

export type Copy = {
  meta: { title: string; description: string }
  nav: { openEditor: string; star: string; toLight: string; toDark: string; language: string }
  hero: { kicker: string; line1: string; line2: string; lead: string; mac: string; windows: string; browser: string; fine: string }
  demoNote: string
  lookout: { kicker: string; title: string; body: string; hint: string; stops: string[] }
  features: { kicker: string; title: string; notes: { title: string; body: string }[] }
  agents: { kicker: string; title: string; p1: string; p2: string; folder: string; label: string; created: string; updated: string; done: string; prompts: string[] }
  source: { kicker: string; title: string; body: string; button: string }
}

const en: Copy = {
  meta: {
    title: 'typeSirkel · A quiet markdown editor for Mac, Windows and the browser',
    description: 'typeSirkel is a free, open source markdown editor. Plain files in your own folders, a live preview, and an outline that follows you through your headings.',
  },
  nav: { openEditor: 'Open editor', star: 'Star', toLight: 'Switch to light theme', toDark: 'Switch to dark theme', language: 'Language' },
  hero: {
    kicker: 'Free and open source markdown editor',
    line1: 'Write in folders.',
    line2: 'Read as you go.',
    lead: 'typeSirkel keeps your notes as plain markdown files on your own disk, shows a live preview beside you, and lets a small marker follow you through your headings.',
    mac: 'Download for Mac',
    windows: 'Download for Windows',
    browser: 'Try it in your browser →',
    fine: 'macOS 11 or newer, Windows 10 or newer, or any Chromium browser. MIT licensed.',
  },
  demoNote: 'This is the real editor. Type in it, switch notes, click a heading.',
  lookout: {
    kicker: 'The lookout',
    title: 'Always know where you are in a long draft.',
    body: 'Your headings become stops on a trail. As you write or scroll, the marker walks to the section you are in. The road behind you is drawn in, the road ahead is still dotted. Click any stop to jump there.',
    hint: 'Go on, click a heading.',
    stops: ['Chapter one', 'Arrival', 'The harbour', 'The market', 'Nightfall', 'A letter home', 'Morning'],
  },
  features: {
    kicker: 'What it does',
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
    kicker: 'MCP',
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
    kicker: 'Open source',
    title: 'Read the code. Change it. Make it yours.',
    body: 'typeSirkel is MIT licensed and small enough to understand in an afternoon. The editor is CodeMirror, the desktop shell is Tauri, and everything else is a few calm React files named after things on a writing desk.',
    button: 'View on GitHub',
  },
}

const id: Copy = {
  meta: {
    title: 'typeSirkel · Editor markdown yang tenang untuk Mac, Windows, dan browser',
    description: 'typeSirkel adalah editor markdown gratis dan open source. File biasa di folder sendiri, pratinjau langsung, dan outline yang mengikuti kamu di setiap heading.',
  },
  nav: { openEditor: 'Buka editor', star: 'Star', toLight: 'Ganti ke tema terang', toDark: 'Ganti ke tema gelap', language: 'Bahasa' },
  hero: {
    kicker: 'Editor markdown gratis dan open source',
    line1: 'Menulis di folder.',
    line2: 'Membaca sambil jalan.',
    lead: 'typeSirkel menyimpan catatanmu sebagai file markdown biasa di disk sendiri, menampilkan pratinjau langsung di sebelahnya, dan punya penanda kecil yang mengikutimu di setiap heading.',
    mac: 'Unduh untuk Mac',
    windows: 'Unduh untuk Windows',
    browser: 'Coba langsung di browser →',
    fine: 'macOS 11 ke atas, Windows 10 ke atas, atau browser berbasis Chromium. Lisensi MIT.',
  },
  demoNote: 'Ini editor aslinya. Coba ketik, pindah catatan, atau klik heading.',
  lookout: {
    kicker: 'Penunjuk arah',
    title: 'Selalu tahu posisimu di draf yang panjang.',
    body: 'Heading jadi pemberhentian di sepanjang jalur. Saat kamu menulis atau scroll, penanda berjalan ke bagian yang sedang kamu baca. Jalur di belakang sudah terisi, jalur di depan masih putus-putus. Klik pemberhentian mana saja untuk melompat ke sana.',
    hint: 'Ayo, klik salah satu heading.',
    stops: ['Bab satu', 'Tiba', 'Pelabuhan', 'Pasar', 'Malam tiba', 'Surat untuk rumah', 'Pagi'],
  },
  features: {
    kicker: 'Fiturnya',
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
    kicker: 'MCP',
    title: 'Biarkan AI bekerja di foldermu.',
    p1: 'typeSirkel menyertakan server MCP kecil. Arahkan Claude, Cursor, atau klien MCP lain ke folder catatanmu, dan ia bisa mencari, membaca, membuat outline, dan menulis markdown di sana, sementara kamu tetap menulis di file yang sama.',
    p2: 'Minta ia merangkum rapat seminggu, mengisi changelog, atau mengumpulkan catatan yang tercecer jadi satu outline. Aplikasi desktop langsung menampilkan perubahannya, jadi tidak perlu salin tempel antarjendela.',
    folder: 'Catatan',
    label: 'Bisa dengan klien MCP apa pun',
    created: 'Membuat',
    updated: 'Memperbarui',
    done: 'Selesai.',
    prompts: ['Rangkum catatan rapat minggu ini jadi satu.', 'Tambahkan yang aku rilis hari ini ke changelog.', 'Cari semua tulisanku soal Lisbon dan buat outline panduannya.'],
  },
  source: {
    kicker: 'Open source',
    title: 'Baca kodenya. Ubah. Jadikan milikmu.',
    body: 'typeSirkel berlisensi MIT dan cukup kecil untuk dipahami dalam satu sore. Editornya CodeMirror, aplikasi desktopnya Tauri, sisanya beberapa file React tenang yang dinamai seperti benda di meja tulis.',
    button: 'Lihat di GitHub',
  },
}

const ptBR: Copy = {
  meta: {
    title: 'typeSirkel · Um editor de markdown tranquilo para Mac, Windows e navegador',
    description: 'typeSirkel é um editor de markdown gratuito e de código aberto. Arquivos simples nas suas pastas, pré-visualização ao vivo e um sumário que acompanha você pelos títulos.',
  },
  nav: { openEditor: 'Abrir editor', star: 'Star', toLight: 'Mudar para tema claro', toDark: 'Mudar para tema escuro', language: 'Idioma' },
  hero: {
    kicker: 'Editor de markdown gratuito e de código aberto',
    line1: 'Escreva em pastas.',
    line2: 'Leia enquanto escreve.',
    lead: 'O typeSirkel guarda suas notas como arquivos markdown simples no seu próprio disco, mostra uma pré-visualização ao lado e tem um pequeno marcador que acompanha você pelos títulos.',
    mac: 'Baixar para Mac',
    windows: 'Baixar para Windows',
    browser: 'Experimente no navegador →',
    fine: 'macOS 11 ou mais recente, Windows 10 ou mais recente, ou qualquer navegador Chromium. Licença MIT.',
  },
  demoNote: 'Este é o editor de verdade. Digite, troque de nota, clique em um título.',
  lookout: {
    kicker: 'O mirante',
    title: 'Saiba sempre onde você está num texto longo.',
    body: 'Seus títulos viram paradas de uma trilha. Enquanto você escreve ou rola a página, o marcador caminha até a seção em que você está. O caminho percorrido fica preenchido, o que falta continua pontilhado. Clique em qualquer parada para ir até lá.',
    hint: 'Vá em frente, clique num título.',
    stops: ['Capítulo um', 'Chegada', 'O porto', 'O mercado', 'Anoitecer', 'Uma carta para casa', 'Manhã'],
  },
  features: {
    kicker: 'O que ele faz',
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
    kicker: 'MCP',
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
    kicker: 'Código aberto',
    title: 'Leia o código. Mude. Faça do seu jeito.',
    body: 'O typeSirkel tem licença MIT e é pequeno o bastante para entender numa tarde. O editor é CodeMirror, o app de desktop é Tauri, e o resto são alguns arquivos React tranquilos com nomes de objetos de uma escrivaninha.',
    button: 'Ver no GitHub',
  },
}

const ko: Copy = {
  meta: {
    title: 'typeSirkel · Mac, Windows, 브라우저를 위한 조용한 마크다운 에디터',
    description: 'typeSirkel은 무료 오픈소스 마크다운 에디터입니다. 내 폴더 속 평범한 파일, 실시간 미리보기, 그리고 제목을 따라 움직이는 목차.',
  },
  nav: { openEditor: '에디터 열기', star: 'Star', toLight: '라이트 테마로 전환', toDark: '다크 테마로 전환', language: '언어' },
  hero: {
    kicker: '무료 오픈소스 마크다운 에디터',
    line1: '폴더에서 쓰고,',
    line2: '쓰면서 읽으세요.',
    lead: 'typeSirkel은 노트를 내 디스크에 평범한 마크다운 파일로 저장하고, 옆에 실시간 미리보기를 보여 주며, 작은 표시가 제목을 따라 함께 움직입니다.',
    mac: 'Mac용 다운로드',
    windows: 'Windows용 다운로드',
    browser: '브라우저에서 바로 써 보기 →',
    fine: 'macOS 11 이상, Windows 10 이상, 또는 Chromium 기반 브라우저. MIT 라이선스.',
  },
  demoNote: '실제 에디터입니다. 직접 입력하고, 노트를 바꾸고, 제목을 눌러 보세요.',
  lookout: {
    kicker: '전망대',
    title: '긴 글에서도 지금 어디쯤인지 늘 알 수 있어요.',
    body: '제목은 길 위의 정류장이 됩니다. 글을 쓰거나 스크롤하면 표시가 지금 있는 부분으로 걸어갑니다. 지나온 길은 채워지고 남은 길은 점선으로 남습니다. 정류장을 누르면 바로 이동합니다.',
    hint: '제목을 하나 눌러 보세요.',
    stops: ['1장', '도착', '항구', '시장', '해 질 녘', '집으로 보내는 편지', '아침'],
  },
  features: {
    kicker: '하는 일',
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
    kicker: 'MCP',
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
    kicker: '오픈소스',
    title: '코드를 읽고, 바꾸고, 내 것으로.',
    body: 'typeSirkel은 MIT 라이선스이며 오후 한나절이면 이해할 만큼 작습니다. 에디터는 CodeMirror, 데스크톱 셸은 Tauri, 나머지는 책상 위 물건 이름을 딴 차분한 React 파일 몇 개입니다.',
    button: 'GitHub에서 보기',
  },
}

const th: Copy = {
  meta: {
    title: 'typeSirkel · โปรแกรมเขียนมาร์กดาวน์ที่เงียบสงบ สำหรับ Mac, Windows และเบราว์เซอร์',
    description: 'typeSirkel คือโปรแกรมเขียนมาร์กดาวน์ฟรีและโอเพนซอร์ส ไฟล์ธรรมดาในโฟลเดอร์ของคุณเอง พรีวิวสด และสารบัญที่เดินตามหัวข้อไปกับคุณ',
  },
  nav: { openEditor: 'เปิดโปรแกรม', star: 'Star', toLight: 'เปลี่ยนเป็นธีมสว่าง', toDark: 'เปลี่ยนเป็นธีมมืด', language: 'ภาษา' },
  hero: {
    kicker: 'โปรแกรมเขียนมาร์กดาวน์ ฟรีและโอเพนซอร์ส',
    line1: 'เขียนในโฟลเดอร์',
    line2: 'อ่านไปพร้อมกัน',
    lead: 'typeSirkel เก็บโน้ตของคุณเป็นไฟล์มาร์กดาวน์ธรรมดาในเครื่องของคุณเอง แสดงพรีวิวสดอยู่ข้าง ๆ และมีเครื่องหมายเล็ก ๆ ที่เดินตามหัวข้อไปกับคุณ',
    mac: 'ดาวน์โหลดสำหรับ Mac',
    windows: 'ดาวน์โหลดสำหรับ Windows',
    browser: 'ลองใช้ในเบราว์เซอร์ →',
    fine: 'macOS 11 ขึ้นไป, Windows 10 ขึ้นไป หรือเบราว์เซอร์ที่ใช้ Chromium สัญญาอนุญาต MIT',
  },
  demoNote: 'นี่คือโปรแกรมจริง ลองพิมพ์ สลับโน้ต หรือคลิกหัวข้อดู',
  lookout: {
    kicker: 'จุดชมวิว',
    title: 'รู้เสมอว่ากำลังอยู่ตรงไหนของงานเขียนยาว ๆ',
    body: 'หัวข้อของคุณกลายเป็นป้ายจอดบนเส้นทาง ขณะที่คุณเขียนหรือเลื่อนหน้า เครื่องหมายจะเดินไปยังส่วนที่คุณอยู่ ทางที่ผ่านมาจะถูกเติมเต็ม ส่วนทางข้างหน้ายังเป็นเส้นประ คลิกป้ายไหนก็ได้เพื่อกระโดดไปที่นั่น',
    hint: 'ลองคลิกหัวข้อสักอันดูสิ',
    stops: ['บทที่หนึ่ง', 'มาถึง', 'ท่าเรือ', 'ตลาด', 'พลบค่ำ', 'จดหมายถึงบ้าน', 'รุ่งเช้า'],
  },
  features: {
    kicker: 'ทำอะไรได้บ้าง',
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
    kicker: 'MCP',
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
    kicker: 'โอเพนซอร์ส',
    title: 'อ่านโค้ด แก้ไข แล้วทำให้เป็นของคุณ',
    body: 'typeSirkel ใช้สัญญาอนุญาต MIT และเล็กพอจะเข้าใจได้ในบ่ายเดียว ตัวเขียนคือ CodeMirror แอปเดสก์ท็อปคือ Tauri ที่เหลือคือไฟล์ React ไม่กี่ไฟล์ที่ตั้งชื่อตามของบนโต๊ะเขียนหนังสือ',
    button: 'ดูบน GitHub',
  },
}

export const copies: Record<Lang, Copy> = { en, id, 'pt-BR': ptBR, ko, th }
