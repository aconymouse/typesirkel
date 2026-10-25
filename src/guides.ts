import type { Lang } from './lang'
import { langOf } from './lang'
import { promptsIn } from './prompts'

// The words of the welcome tour and the two guides, in every language the
// app speaks. The editor itself is in English, so its buttons keep their
// English names inside the translated text.

export type Guide = 'welcome' | 'connect' | 'prompts'

export type Step = { type: string; pace?: number } | { slash: string; query: string }

export type Script = { file: string; label: string; steps: Step[]; words?: boolean }

const aco = '[Aco](https://aconymous.com) ([Hafidz Nc](https://aconymous.com))'
const repo = 'https://github.com/aconymouse/typesirkel'
const chat = '[aconymous.com/chat](https://aconymous.com/chat)'

type Welcome = { title: string; hi: string; slash: string; map: string; quote: string; list: string; turn: string }

const welcomeWords: Record<Lang, Welcome> = {
  en: {
    title: 'Hello, typeSirkel',
    hi: `Hi, I'm ${aco}. Thanks for giving typeSirkel a try. I built it for writing that stays yours: plain markdown, saved as files on your own disk. It's free and open source, so if it earns a place in your day, a star on [GitHub](${repo}) helps other writers find it.`,
    slash: 'Type / whenever you forget a mark.',
    map: 'Headings become a map\nEvery heading is a stop on the trail in the sidebar.',
    quote: 'Quotes start with a greater-than sign.',
    list: '**Bold**, *italic* and [links](https://sirkel.asia) work as you type',
    turn: 'Your turn: press + in the sidebar for a new note.',
  },
  id: {
    title: 'Halo, typeSirkel',
    hi: `Hai, aku ${aco}. Makasih udah nyobain typeSirkel. Aku bikin ini supaya tulisanmu tetap jadi milikmu: markdown biasa, tersimpan sebagai file di disk sendiri. Gratis dan open source, jadi kalau dia mulai kepakai tiap hari, kasih bintang di [GitHub](${repo}) biar penulis lain ikut nemu.`,
    slash: 'Ketik / kapan pun kamu lupa tandanya.',
    map: 'Heading jadi peta\nTiap heading jadi pemberhentian di jalur sidebar.',
    quote: 'Kutipan diawali tanda lebih besar.',
    list: '**Tebal**, *miring*, dan [tautan](https://sirkel.asia) langsung jalan sambil mengetik',
    turn: 'Giliranmu: tekan + di sidebar untuk catatan baru.',
  },
  'pt-BR': {
    title: 'Olá, typeSirkel',
    hi: `Oi, eu sou o ${aco}. Obrigado por experimentar o typeSirkel. Eu fiz ele para uma escrita que continua sendo sua: markdown simples, salvo como arquivos no seu próprio disco. É gratuito e de código aberto, então, se ele ganhar um lugar no seu dia, uma estrela no [GitHub](${repo}) ajuda outros escritores a encontrá-lo.`,
    slash: 'Digite / sempre que esquecer uma marcação.',
    map: 'Títulos viram um mapa\nCada título é uma parada na trilha da barra lateral.',
    quote: 'Citações começam com o sinal de maior.',
    list: '**Negrito**, *itálico* e [links](https://sirkel.asia) funcionam enquanto você digita',
    turn: 'Sua vez: aperte + na barra lateral para criar uma nota.',
  },
  ko: {
    title: '안녕하세요, typeSirkel',
    hi: `안녕하세요, 저는 ${aco}입니다. typeSirkel을 써 주셔서 고마워요. 쓴 글이 온전히 내 것으로 남도록 만들었어요. 평범한 마크다운이 내 디스크에 파일로 저장됩니다. 무료이자 오픈 소스이니, 매일 쓰는 도구가 된다면 [GitHub](${repo})에 별을 남겨 주세요. 다른 작가들이 찾는 데 큰 도움이 돼요.`,
    slash: '표시가 기억나지 않으면 언제든 / 를 입력하세요.',
    map: '제목은 지도가 됩니다\n모든 제목은 사이드바 길 위의 정류장이 돼요.',
    quote: '인용은 > 기호로 시작해요.',
    list: '**굵게**, *기울임*, [링크](https://sirkel.asia)가 입력하는 대로 적용돼요',
    turn: '이제 당신 차례예요. 사이드바의 + 를 눌러 새 노트를 만드세요.',
  },
  th: {
    title: 'สวัสดี typeSirkel',
    hi: `สวัสดีครับ ผม ${aco} ขอบคุณที่ลองใช้ typeSirkel ผมสร้างมันขึ้นมาเพื่องานเขียนที่ยังเป็นของคุณ เป็นมาร์กดาวน์ธรรมดา บันทึกเป็นไฟล์ในเครื่องของคุณเอง ใช้ฟรีและเป็นโอเพนซอร์ส ถ้ามันได้เป็นส่วนหนึ่งในวันของคุณ ช่วยกดดาวให้บน [GitHub](${repo}) เพื่อให้นักเขียนคนอื่นได้เจอด้วยนะครับ`,
    slash: 'พิมพ์ / ได้ทุกเมื่อที่จำเครื่องหมายไม่ได้',
    map: 'หัวข้อกลายเป็นแผนที่\nทุกหัวข้อคือจุดแวะบนเส้นทางในแถบด้านข้าง',
    quote: 'คำพูดที่ยกมาเริ่มด้วยเครื่องหมายมากกว่า',
    list: '**ตัวหนา**, *ตัวเอียง* และ[ลิงก์](https://sirkel.asia) ใช้ได้ทันทีขณะพิมพ์',
    turn: 'ถึงตาคุณแล้ว กด + ที่แถบด้านข้างเพื่อสร้างโน้ตใหม่',
  },
  'zh-Hans': {
    title: '你好，typeSirkel',
    hi: `你好，我是 ${aco}。感谢你试用 typeSirkel。我做它，是为了让你写下的东西始终属于你：普通的 Markdown，作为文件保存在你自己的硬盘上。它免费且开源，如果它成了你每天都会打开的工具，请在 [GitHub](${repo}) 上点个星，帮助更多写作者找到它。`,
    slash: '忘了标记怎么写？随时输入 /。',
    map: '标题就是地图\n每个标题都是侧边栏小路上的一站。',
    quote: '引用以大于号开头。',
    list: '**粗体**、*斜体* 和 [链接](https://sirkel.asia) 边写边生效',
    turn: '轮到你了：点侧边栏里的 + 新建笔记。',
  },
}

type Connect = {
  label: string
  title: string
  intro: string
  open: string
  claude: [string, string, string]
  gpt: [string, string]
  rest: [string, string]
  offline: [string, string]
  stuck: string
}

const connectWords: Record<Lang, Connect> = {
  en: {
    label: 'Connect AI',
    title: 'Connect your AI',
    intro:
      'Quill is the writing assistant inside typeSirkel. It works with the AI you already pay for: you bring your own key, and it stays on your device. The desktop app keeps it in your system keychain. In the browser it lasts until you close the tab, unless you tick **Remember on this device**.',
    open: 'Open Quill with **⌘J** on a Mac or **Ctrl J** on Windows, or click **Quill** at the bottom right.',
    claude: [
      'Sign in to the [Claude Console](https://platform.claude.com/settings/keys) and open **API keys**.',
      'Click **Create key**, give it a name and pick a workspace.',
      'In Quill, choose **Anthropic**, paste the key, then pick a model.',
    ],
    gpt: ['Create a key on the [OpenAI API keys page](https://platform.openai.com/api-keys).', 'In Quill, choose **OpenAI**, paste the key, then pick a model.'],
    rest: [
      'Gemini, Llama and the rest',
      '[OpenRouter](https://openrouter.ai/keys) gives you one key for hundreds of models, Gemini included. Choose **OpenRouter** in Quill and paste it. Any other OpenAI-compatible service works under **Other**: paste its base URL and its key.',
    ],
    offline: [
      'Offline, on your own machine',
      'Install [Ollama](https://ollama.com), run `ollama pull llama3.2`, then choose **Ollama** in Quill. No key, and nothing leaves your computer. In the browser, start it with `OLLAMA_ORIGINS=https://sirkel.asia ollama serve` so this page is allowed to reach it.',
    ],
    stuck: `Still stuck? Ping Aco at ${chat}.`,
  },
  id: {
    label: 'Hubungkan AI',
    title: 'Hubungkan AI kamu',
    intro:
      'Quill adalah asisten menulis di dalam typeSirkel. Dia jalan dengan AI yang sudah kamu langganan: kamu pakai key sendiri, dan key itu tetap di perangkatmu. Di aplikasi desktop, key disimpan di keychain sistem. Di browser, key hilang saat tab ditutup, kecuali kamu centang **Remember on this device**.',
    open: 'Buka Quill dengan **⌘J** di Mac atau **Ctrl J** di Windows, atau klik **Quill** di kanan bawah.',
    claude: [
      'Masuk ke [Claude Console](https://platform.claude.com/settings/keys) lalu buka **API keys**.',
      'Klik **Create key**, kasih nama, lalu pilih workspace.',
      'Di Quill, pilih **Anthropic**, tempel key-nya, lalu pilih model.',
    ],
    gpt: ['Bikin key di [halaman API keys OpenAI](https://platform.openai.com/api-keys).', 'Di Quill, pilih **OpenAI**, tempel key-nya, lalu pilih model.'],
    rest: [
      'Gemini, Llama, dan lainnya',
      '[OpenRouter](https://openrouter.ai/keys) kasih satu key untuk ratusan model, termasuk Gemini. Pilih **OpenRouter** di Quill lalu tempel key-nya. Layanan lain yang kompatibel dengan OpenAI bisa lewat **Other**: isi base URL dan key-nya.',
    ],
    offline: [
      'Offline, di komputer sendiri',
      'Pasang [Ollama](https://ollama.com), jalankan `ollama pull llama3.2`, lalu pilih **Ollama** di Quill. Tanpa key, dan gak ada yang keluar dari komputermu. Di browser, nyalakan dengan `OLLAMA_ORIGINS=https://sirkel.asia ollama serve` supaya halaman ini boleh mengaksesnya.',
    ],
    stuck: `Masih bingung? Colek Aco di ${chat}.`,
  },
  'pt-BR': {
    label: 'Conectar IA',
    title: 'Conecte sua IA',
    intro:
      'Quill é o assistente de escrita do typeSirkel. Ele funciona com a IA que você já paga: você usa a sua própria chave, e ela fica no seu dispositivo. No app de desktop, ela vai para o chaveiro do sistema. No navegador, ela dura até você fechar a aba, a menos que marque **Remember on this device**.',
    open: 'Abra o Quill com **⌘J** no Mac ou **Ctrl J** no Windows, ou clique em **Quill** no canto inferior direito.',
    claude: [
      'Entre no [Claude Console](https://platform.claude.com/settings/keys) e abra **API keys**.',
      'Clique em **Create key**, dê um nome e escolha um workspace.',
      'No Quill, escolha **Anthropic**, cole a chave e depois escolha um modelo.',
    ],
    gpt: ['Crie uma chave na [página de API keys da OpenAI](https://platform.openai.com/api-keys).', 'No Quill, escolha **OpenAI**, cole a chave e depois escolha um modelo.'],
    rest: [
      'Gemini, Llama e o resto',
      'O [OpenRouter](https://openrouter.ai/keys) dá uma chave só para centenas de modelos, Gemini incluído. Escolha **OpenRouter** no Quill e cole a chave. Qualquer outro serviço compatível com a OpenAI funciona em **Other**: cole a URL base e a chave.',
    ],
    offline: [
      'Offline, na sua própria máquina',
      'Instale o [Ollama](https://ollama.com), rode `ollama pull llama3.2` e escolha **Ollama** no Quill. Sem chave, e nada sai do seu computador. No navegador, inicie com `OLLAMA_ORIGINS=https://sirkel.asia ollama serve` para que esta página possa acessá-lo.',
    ],
    stuck: `Ainda com dúvida? Chame o Aco em ${chat}.`,
  },
  ko: {
    label: 'AI 연결',
    title: 'AI 연결하기',
    intro:
      'Quill은 typeSirkel 안의 글쓰기 도우미예요. 이미 쓰고 있는 AI와 함께 작동해요. 내 키를 직접 넣고, 그 키는 내 기기에만 남아요. 데스크톱 앱은 시스템 키체인에 보관하고, 브라우저에서는 **Remember on this device**를 체크하지 않으면 탭을 닫을 때 사라져요.',
    open: 'Mac에서는 **⌘J**, Windows에서는 **Ctrl J**로 Quill을 열거나, 오른쪽 아래의 **Quill**을 누르세요.',
    claude: [
      '[Claude Console](https://platform.claude.com/settings/keys)에 로그인하고 **API keys**를 여세요.',
      '**Create key**를 누르고 이름을 정한 뒤 워크스페이스를 고르세요.',
      'Quill에서 **Anthropic**을 고르고 키를 붙여 넣은 다음 모델을 고르세요.',
    ],
    gpt: ['[OpenAI API keys 페이지](https://platform.openai.com/api-keys)에서 키를 만드세요.', 'Quill에서 **OpenAI**를 고르고 키를 붙여 넣은 다음 모델을 고르세요.'],
    rest: [
      'Gemini, Llama 그리고 나머지',
      '[OpenRouter](https://openrouter.ai/keys)는 키 하나로 Gemini를 포함한 수백 개 모델을 쓰게 해 줘요. Quill에서 **OpenRouter**를 고르고 키를 붙여 넣으세요. OpenAI와 호환되는 다른 서비스는 **Other**에서 base URL과 키를 넣으면 돼요.',
    ],
    offline: [
      '오프라인, 내 컴퓨터에서',
      '[Ollama](https://ollama.com)를 설치하고 `ollama pull llama3.2`를 실행한 뒤 Quill에서 **Ollama**를 고르세요. 키도 필요 없고, 아무것도 컴퓨터 밖으로 나가지 않아요. 브라우저에서는 이 페이지가 접근할 수 있도록 `OLLAMA_ORIGINS=https://sirkel.asia ollama serve`로 실행하세요.',
    ],
    stuck: `그래도 막히면 ${chat}에서 Aco를 불러 주세요.`,
  },
  th: {
    label: 'เชื่อมต่อ AI',
    title: 'เชื่อมต่อ AI ของคุณ',
    intro:
      'Quill คือผู้ช่วยเขียนใน typeSirkel ใช้ได้กับ AI ที่คุณจ่ายอยู่แล้ว คุณใส่คีย์ของคุณเอง และคีย์จะอยู่ในเครื่องของคุณ แอปเดสก์ท็อปเก็บไว้ในคีย์เชนของระบบ ส่วนในเบราว์เซอร์ คีย์จะหายไปเมื่อปิดแท็บ เว้นแต่คุณติ๊ก **Remember on this device**',
    open: 'เปิด Quill ด้วย **⌘J** บน Mac หรือ **Ctrl J** บน Windows หรือคลิก **Quill** ที่มุมขวาล่าง',
    claude: [
      'ลงชื่อเข้าใช้ [Claude Console](https://platform.claude.com/settings/keys) แล้วเปิด **API keys**',
      'คลิก **Create key** ตั้งชื่อ แล้วเลือก workspace',
      'ใน Quill เลือก **Anthropic** วางคีย์ แล้วเลือกโมเดล',
    ],
    gpt: ['สร้างคีย์ที่[หน้า API keys ของ OpenAI](https://platform.openai.com/api-keys)', 'ใน Quill เลือก **OpenAI** วางคีย์ แล้วเลือกโมเดล'],
    rest: [
      'Gemini, Llama และอื่น ๆ',
      '[OpenRouter](https://openrouter.ai/keys) ให้คีย์เดียวใช้ได้กับโมเดลนับร้อย รวมถึง Gemini เลือก **OpenRouter** ใน Quill แล้ววางคีย์ บริการอื่นที่รองรับรูปแบบ OpenAI ใช้ได้ผ่าน **Other** โดยใส่ base URL และคีย์',
    ],
    offline: [
      'ออฟไลน์ บนเครื่องของคุณเอง',
      'ติดตั้ง [Ollama](https://ollama.com) รัน `ollama pull llama3.2` แล้วเลือก **Ollama** ใน Quill ไม่ต้องใช้คีย์ และไม่มีอะไรออกจากเครื่องของคุณ ในเบราว์เซอร์ ให้เริ่มด้วย `OLLAMA_ORIGINS=https://sirkel.asia ollama serve` เพื่อให้หน้านี้เข้าถึงได้',
    ],
    stuck: `ยังติดอยู่ใช่ไหม ทักหา Aco ได้ที่ ${chat}`,
  },
  'zh-Hans': {
    label: '连接 AI',
    title: '连接你的 AI',
    intro:
      'Quill 是 typeSirkel 里的写作助手。它使用你已经在付费的 AI：你填入自己的密钥，密钥只留在你的设备上。桌面应用把它存进系统钥匙串；在浏览器里，除非勾选 **Remember on this device**，关闭标签页后就会清除。',
    open: '在 Mac 上按 **⌘J**，在 Windows 上按 **Ctrl J**，或点击右下角的 **Quill** 打开它。',
    claude: [
      '登录 [Claude Console](https://platform.claude.com/settings/keys)，打开 **API keys**。',
      '点击 **Create key**，起个名字并选择一个 workspace。',
      '在 Quill 里选择 **Anthropic**，粘贴密钥，再选一个模型。',
    ],
    gpt: ['在 [OpenAI API keys 页面](https://platform.openai.com/api-keys)创建密钥。', '在 Quill 里选择 **OpenAI**，粘贴密钥，再选一个模型。'],
    rest: [
      'Gemini、Llama 和其他模型',
      '[OpenRouter](https://openrouter.ai/keys) 用一个密钥就能使用数百个模型，包括 Gemini。在 Quill 里选择 **OpenRouter** 并粘贴密钥。其他兼容 OpenAI 的服务可以用 **Other**，填入它的 base URL 和密钥。',
    ],
    offline: [
      '离线，在你自己的电脑上',
      '安装 [Ollama](https://ollama.com)，运行 `ollama pull llama3.2`，然后在 Quill 里选择 **Ollama**。不需要密钥，也没有任何内容离开你的电脑。在浏览器里使用时，请用 `OLLAMA_ORIGINS=https://sirkel.asia ollama serve` 启动，这个页面才能访问它。',
    ],
    stuck: `还是卡住了？到 ${chat} 找 Aco。`,
  },
}

type Prompts = {
  label: string
  title: string
  intro: string
  find: [string, string]
  use: [string, string]
  try: [string, [string, string, string]]
  own: [string, string]
  langs: string
}

const promptWords: Record<Lang, Prompts> = {
  en: {
    label: 'Using prompts',
    title: 'Using prompts',
    intro: 'Prompts are ready-made instructions for Quill: horror, fantasy, straight news, a rewrite that never touches quotes or names, SEO articles, tutorials and storyboards.',
    find: ['Find one', 'Open **Prompts** in the sidebar. The small tag beside it, **{tag}** right now, switches the shelf between {langs}.'],
    use: ['Use it', 'Click a prompt to read it. **Copy** puts it on your clipboard for any AI you like. **Use in Quill** pins it as the style for everything Quill writes, shown as a chip you can clear at any time.'],
    try: ['Try one now', ['Click **{news}** in the sidebar, then **Use in Quill**.', 'Paste a press release into a new note.', 'Ask Quill to turn it into a news piece.']],
    own: ['Make your own', `Every prompt is a plain markdown file in [prompts/ on GitHub](${repo}/tree/main/prompts). Have a better one? A pull request is welcome.`],
    langs: 'English, Indonesian, Portuguese, Korean, Thai and Chinese',
  },
  id: {
    label: 'Pakai prompt',
    title: 'Cara pakai prompt',
    intro: 'Prompt adalah instruksi siap pakai untuk Quill: horor, fantasi, berita lugas, tulis ulang yang gak menyentuh kutipan atau nama, artikel SEO, tutorial, dan storyboard.',
    find: ['Cari prompt', 'Buka **Prompts** di sidebar. Label kecil di sebelahnya, sekarang **{tag}**, mengganti bahasa etalase ke {langs}.'],
    use: ['Pakai', 'Klik prompt untuk membacanya. **Copy** menyalinnya ke clipboard untuk AI mana pun. **Use in Quill** memasangnya sebagai gaya untuk semua tulisan Quill, tampil sebagai chip yang bisa kamu hapus kapan saja.'],
    try: ['Coba sekarang', ['Klik **{news}** di sidebar, lalu **Use in Quill**.', 'Tempel siaran pers ke catatan baru.', 'Minta Quill mengubahnya jadi berita.']],
    own: ['Bikin sendiri', `Tiap prompt adalah file markdown biasa di [folder prompts/ di GitHub](${repo}/tree/main/prompts). Punya yang lebih bagus? Pull request dipersilakan.`],
    langs: 'Inggris, Indonesia, Portugis, Korea, Thailand, dan Mandarin',
  },
  'pt-BR': {
    label: 'Usando prompts',
    title: 'Usando prompts',
    intro: 'Prompts são instruções prontas para o Quill: terror, fantasia, notícia objetiva, uma reescrita que nunca mexe em citações ou nomes, artigos de SEO, tutoriais e storyboards.',
    find: ['Encontre um', 'Abra **Prompts** na barra lateral. A etiqueta ao lado, **{tag}** agora, troca a estante entre {langs}.'],
    use: ['Use', 'Clique num prompt para ler. **Copy** copia para a área de transferência, para qualquer IA. **Use in Quill** fixa o prompt como estilo de tudo o que o Quill escreve, num chip que você pode tirar quando quiser.'],
    try: ['Teste agora', ['Clique em **{news}** na barra lateral e depois em **Use in Quill**.', 'Cole um release numa nota nova.', 'Peça ao Quill para transformá-lo numa notícia.']],
    own: ['Crie o seu', `Cada prompt é um arquivo markdown simples em [prompts/ no GitHub](${repo}/tree/main/prompts). Tem um melhor? Pull requests são bem-vindos.`],
    langs: 'inglês, indonésio, português, coreano, tailandês e chinês',
  },
  ko: {
    label: '프롬프트 사용법',
    title: '프롬프트 사용법',
    intro: '프롬프트는 Quill을 위한 준비된 지시문이에요. 호러, 판타지, 스트레이트 뉴스, 인용과 이름은 건드리지 않는 리라이트, SEO 글, 튜토리얼, 스토리보드가 있어요.',
    find: ['찾기', '사이드바에서 **Prompts**를 여세요. 옆의 작은 태그(지금은 **{tag}**)로 {langs} 사이를 바꿀 수 있어요.'],
    use: ['사용하기', '프롬프트를 누르면 내용을 볼 수 있어요. **Copy**는 어떤 AI에서든 쓰도록 클립보드에 복사하고, **Use in Quill**은 Quill이 쓰는 모든 글의 스타일로 고정해요. 칩으로 표시되고 언제든 지울 수 있어요.'],
    try: ['지금 해 보기', ['사이드바에서 **{news}**를 누르고 **Use in Quill**을 누르세요.', '보도자료를 새 노트에 붙여 넣으세요.', 'Quill에게 기사로 바꿔 달라고 하세요.']],
    own: ['직접 만들기', `모든 프롬프트는 [GitHub의 prompts/ 폴더](${repo}/tree/main/prompts)에 있는 평범한 마크다운 파일이에요. 더 좋은 게 있다면 풀 리퀘스트를 환영해요.`],
    langs: '영어, 인도네시아어, 포르투갈어, 한국어, 태국어, 중국어',
  },
  th: {
    label: 'การใช้พรอมต์',
    title: 'การใช้พรอมต์',
    intro: 'พรอมต์คือคำสั่งสำเร็จรูปสำหรับ Quill มีทั้งสยองขวัญ แฟนตาซี ข่าวตรงไปตรงมา การเรียบเรียงใหม่ที่ไม่แตะคำพูดหรือชื่อ บทความ SEO บทเรียน และสตอรี่บอร์ด',
    find: ['หาพรอมต์', 'เปิด **Prompts** ที่แถบด้านข้าง ป้ายเล็ก ๆ ข้าง ๆ (ตอนนี้คือ **{tag}**) ใช้สลับภาษาระหว่าง{langs}'],
    use: ['ใช้งาน', 'คลิกพรอมต์เพื่ออ่าน **Copy** คัดลอกไปใช้กับ AI ตัวไหนก็ได้ **Use in Quill** ตั้งให้เป็นสไตล์ของทุกอย่างที่ Quill เขียน แสดงเป็นชิปที่ลบออกได้ทุกเมื่อ'],
    try: ['ลองเลย', ['คลิก **{news}** ที่แถบด้านข้าง แล้วกด **Use in Quill**', 'วางข่าวประชาสัมพันธ์ลงในโน้ตใหม่', 'ขอให้ Quill เรียบเรียงเป็นข่าว']],
    own: ['สร้างเอง', `ทุกพรอมต์คือไฟล์มาร์กดาวน์ธรรมดาใน[โฟลเดอร์ prompts/ บน GitHub](${repo}/tree/main/prompts) มีอันที่ดีกว่านี้ไหม ส่ง pull request มาได้เลย`],
    langs: 'อังกฤษ อินโดนีเซีย โปรตุเกส เกาหลี ไทย และจีน',
  },
  'zh-Hans': {
    label: '使用提示词',
    title: '使用提示词',
    intro: '提示词是给 Quill 的现成指令：恐怖、奇幻、纯新闻、绝不改动引语和名字的改写、SEO 文章、教程和分镜脚本。',
    find: ['找到一个', '打开侧边栏里的 **Prompts**。旁边的小标签（现在是 **{tag}**）可以在{langs}之间切换。'],
    use: ['使用它', '点击一个提示词查看内容。**Copy** 把它复制到剪贴板，用在任何 AI 上。**Use in Quill** 把它设为 Quill 所有写作的风格，显示为一个随时可以清除的标签。'],
    try: ['现在试试', ['点击侧边栏里的 **{news}**，再点 **Use in Quill**。', '把一篇新闻稿粘贴到新笔记里。', '让 Quill 把它改写成一篇新闻。']],
    own: ['自己写一个', `每个提示词都是 [GitHub 上 prompts/ 文件夹](${repo}/tree/main/prompts)里的普通 Markdown 文件。有更好的？欢迎提交 pull request。`],
    langs: '英语、印尼语、葡萄牙语、韩语、泰语和中文',
  },
}

const welcomeLabel: Record<Lang, string> = { en: 'First note', id: 'First note', 'pt-BR': 'First note', ko: 'First note', th: 'First note', 'zh-Hans': 'First note' }

const connectText = (w: Connect) =>
  [
    `# ${w.title}`,
    w.intro,
    w.open,
    `## Claude\n\n${w.claude.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    `## ChatGPT\n\n${w.gpt.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    `## ${w.rest[0]}\n\n${w.rest[1]}`,
    `## ${w.offline[0]}\n\n${w.offline[1]}`,
    `> ${w.stuck}\n`,
  ].join('\n\n')

const promptsText = (lang: Lang, w: Prompts) => {
  const news = promptsIn(lang).find((p) => p.id === 'straight-news')?.title ?? 'Straight news'
  const fill = (s: string) => s.replace('{tag}', langOf(lang).short).replace('{langs}', w.langs).replace('{news}', news)
  return [
    `# ${w.title}`,
    w.intro,
    `## ${w.find[0]}\n\n${fill(w.find[1])}`,
    `## ${w.use[0]}\n\n${w.use[1]}`,
    `## ${w.try[0]}\n\n${w.try[1].map((s, i) => `${i + 1}. ${fill(s)}`).join('\n')}`,
    `## ${w.own[0]}\n\n${w.own[1]}`,
    `> ${connectWords[lang].stuck}\n`,
  ].join('\n\n')
}

export const scriptFor = (guide: Guide, lang: Lang): Script => {
  if (guide === 'connect') {
    const w = connectWords[lang]
    return { file: `${w.label}.md`, label: w.label, words: true, steps: [{ type: connectText(w) }] }
  }
  if (guide === 'prompts') {
    const w = promptWords[lang]
    return { file: `${w.label}.md`, label: w.label, words: true, steps: [{ type: promptsText(lang, w) }] }
  }
  const w = welcomeWords[lang]
  return {
    file: 'First note.md',
    label: welcomeLabel[lang],
    steps: [
      { slash: 'h1', query: 'h1' },
      { type: `${w.title}\n\n` },
      { type: `${w.hi}\n\n${w.slash}\n\n`, pace: 9 },
      { slash: 'h2', query: 'h2' },
      { type: `${w.map}\n\n` },
      { slash: 'quote', query: 'quo' },
      { type: `${w.quote}\n\n` },
      { slash: 'list', query: 'list' },
      { type: `${w.list}\n\n${w.turn}\n` },
    ],
  }
}
