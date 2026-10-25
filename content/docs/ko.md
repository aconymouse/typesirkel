---
title: typeSirkel 문서
description: typeSirkel 사용법이에요. 폴더 열기, 마크다운 쓰기, 슬래시 메뉴와 단축키, Quill에 AI 연결, 초안 공유, MCP 연결까지 담았어요.
---

## 시작하기 {#start}

typeSirkel은 두 곳에서 실행되고, 둘 다 같은 앱이에요.

- **브라우저에서** [sirkel.asia/write](/write/)로 바로 쓸 수 있어요. 설치할 건 없어요.
- **데스크톱에서** macOS 11 이상과 Windows 10 이상을 지원하고, [릴리스 페이지](https://github.com/aconymouse/typesirkel/releases)에서 받을 수 있어요.

처음 열면 **Scratch**에서 시작해요. 브라우저 안에 보관되는 작은 메모장이에요. 간단한 메모에는 이걸로 충분해요. 제대로 작업하려면 사이드바 아래쪽의 **Open folder**를 눌러 디스크에 있는 폴더를 고르세요. 그 안의 모든 노트는 다른 어떤 앱에서도 읽을 수 있는 평범한 `.md` 파일이 돼요.

브라우저에서 폴더 전체를 열려면 Chrome, Edge, Brave, Arc 같은 Chromium 기반 브라우저가 필요해요. Safari와 Firefox에서는 한 번에 파일 하나씩 열려요.

macOS 빌드는 아직 공증을 받지 않았어요. 처음 실행할 때는 앱을 오른쪽 클릭하고 **Open**을 선택하세요.

## 쓰기 {#writing}

평범한 마크다운으로 쓰면 돼요. 입력을 멈추고 잠시 지나면 typeSirkel이 알아서 저장하고, 왼쪽 아래의 점이 저장이 끝났는지 알려 줘요.

창 아래쪽에서 세 가지 보기를 오갈 수 있어요.

- **Write**는 편집기만 보여 줘요.
- **Split**은 편집기와 미리보기를 나란히 보여 주고, 스크롤도 함께 움직여요.
- **Read**는 미리보기만 보여 줘요.

**Quiet**는 여러분의 글만 남기고 나머지를 모두 숨겨요. 다시 누르거나 **Cmd/Ctrl + .**을 누르면 원래대로 돌아와요.

파일 목록 옆의 **+**를 누르면 새 노트를 시작할 수 있어요. 노트는 폴더별로 정리되고, 지금 열려 있는 노트에는 표시가 돼요.

## 슬래시 메뉴 {#slash}

줄 맨 앞이나 공백 뒤에서 `/`를 입력하면 서식 메뉴가 열려요. 이어서 입력하면 목록이 좁혀지니까 `/h2`, `/quote`, `/todo`처럼 입력한 다음 Enter를 누르면 돼요. 항목마다 어떤 마크다운이 입력되는지 보여 주기 때문에, 쓰다 보면 문법도 자연스럽게 익숙해져요.

| 서식 | 마크다운 |
| --- | --- |
| 제목 1, 2, 3 | `#`, `##`, `###` |
| 굵게, 기울임, 취소선 | `**text**`, `*text*`, `~~text~~` |
| 글머리 기호 목록, 번호 목록, 할 일 | `-`, `1.`, `- [ ]` |
| 인용 | `>` |
| 링크, 이미지 | `[text](url)`, `![alt](url)` |
| 인라인 코드, 코드 블록 | `` `code` ``, ```` ``` ```` |
| 표, 구분선 | `| a | b |`, `---` |

링크의 텍스트와 주소처럼 채워야 할 빈칸이 있는 서식에서는 Tab을 눌러 다음 빈칸으로 넘어갈 수 있어요.

## 단축키 {#shortcuts}

| 키 | 기능 |
| --- | --- |
| `/` | 서식 메뉴 |
| Cmd/Ctrl + S | 지금 저장 |
| Cmd/Ctrl + O | 폴더 열기 |
| Cmd/Ctrl + B, I, E | 굵게, 기울임, 인라인 코드 |
| Cmd/Ctrl + K | 링크 |
| Cmd/Ctrl + F | 찾기 |
| Cmd/Ctrl + 1, 2, 3 | Write, Split, Read |
| Cmd/Ctrl + J | Quill |
| Cmd/Ctrl + Shift + D | 받아쓰기 |
| Cmd/Ctrl + . | Quiet 모드 |
| Cmd/Ctrl + P | 인쇄 또는 PDF로 저장 |

## 음성 받아쓰기 {#dictate}

오른쪽 아래의 마이크를 누르거나 **Cmd/Ctrl + Shift + D**를 누르고 말하기 시작하세요. 말하는 대로 커서 위치에 글이 적혀요. 회의 내용을 대략 받아 두고 나중에 직접 또는 Quill로 다듬기에 좋아요. 아래의 작은 바에서 말하는 언어를 고르고, 끝나면 **Stop**을 누르세요.

받아쓰기는 브라우저에 내장된 음성 인식을 사용해서 인터넷 연결이 필요하고, 브라우저가 음성을 자체 음성 서비스로 보내요. Chrome, Edge, Safari에서 작동해요. 마이크 버튼은 받아쓰기를 쓸 수 있는 곳에서만 보여요.

## 개요 {#outline}

노트의 모든 제목은 사이드바의 **On this page** 아래에 이어진 길 위의 정류장이 돼요. 글을 쓰거나 스크롤하면 작은 표시가 지금 있는 섹션으로 따라 움직여요. 정류장을 클릭하면 그 위치로 바로 이동해요.

사이드바 섹션 사이의 얇은 선을 끌어서 각 섹션의 공간을 넓히거나 줄일 수 있어요. 선을 더블클릭하면 원래대로 돌아가요.

## Quill, 여러분의 AI {#quill}

Quill은 typeSirkel 안에 있는 글쓰기 도우미예요. **Cmd/Ctrl + J**를 누르거나 오른쪽 아래의 **Quill** 버튼으로 열 수 있어요. 키는 직접 가져와서 쓰고, 그 키는 제공업체에 연결할 때 말고는 기기 밖으로 나가지 않아요.

### 제공업체 연결하기

- **Anthropic**은 Claude용이에요. [Claude Console](https://platform.claude.com/settings/keys)에서 키를 만드세요.
- **OpenAI**는 ChatGPT용이에요. [OpenAI API 키 페이지](https://platform.openai.com/api-keys)에서 키를 만드세요.
- **OpenRouter**는 Gemini를 포함한 수백 가지 모델용이에요. [openrouter.ai/keys](https://openrouter.ai/keys)에서 키를 만드세요.
- **Ollama**는 내 컴퓨터에서 돌리는 모델용이고, 키가 전혀 필요 없어요. 브라우저에서 쓸 때는 `OLLAMA_ORIGINS=https://sirkel.asia ollama serve`로 실행하세요.
- **Other**는 OpenAI 채팅 형식을 지원하는 모든 서비스용이에요. 해당 서비스의 기본 URL과 키를 붙여 넣으세요.

제공업체를 고르고, 키를 붙여 넣고, 목록에서 모델을 선택하세요. 데스크톱 앱은 키를 시스템 키체인에 보관해요. 브라우저에서는 **Remember on this device**를 체크하지 않으면 탭을 닫을 때까지만 키가 유지돼요.

### 도움 요청하기

문단을 선택하거나 커서를 문단 안에 둔 채로 Continue, Tighten, Fix, Summarize, Translate 중 하나를 고르세요. 먼저 답을 확인한 다음 **Replace**, **Insert**, **Replace all** 중에서 고르면 돼요. 그냥 편하게 말로 물어보고 대화를 이어 갈 수도 있어요.

### 여러 파일을 한 번에 쓰기

폴더가 열려 있으면 **Brief**에서 하고 싶은 작업을 설명하고, Quill이 제안하는 파일 계획을 검토하고, 원하지 않는 파일은 빼고, 나머지를 하나씩 쓰게 할 수 있어요. 기존 파일을 덮어쓰는 일은 절대 없어요.

## 프롬프트 {#prompts}

사이드바의 **Prompts**는 바로 쓸 수 있는 지시문을 모아 둔 책장이에요. 공포, 판타지, 스트레이트 뉴스, 인용문이나 이름은 절대 건드리지 않는 리라이트, SEO 기사, 튜토리얼, 스토리보드가 있어요. 제목 옆의 작은 태그를 누르면 책장의 언어가 바뀌어요.

프롬프트를 클릭하면 내용을 읽을 수 있어요. **Copy**를 누르면 클립보드에 복사돼서 어떤 AI에든 쓸 수 있어요. **Use in Quill**을 누르면 지울 때까지 Quill이 쓰는 모든 글에 그 프롬프트가 스타일로 고정돼요.

## 함께 쓰기 {#share}

**Share**를 누른 다음 **Start sharing**을 누르세요. 링크가 있는 사람이라면 누구나 여러분과 함께 초안을 편집하고, 각자 어디에서 입력하고 있는지 볼 수 있어요. 초안이 폴더 안의 파일이라면, 다른 사람이 입력하는 내용이 바로바로 여러분의 파일에 반영돼요.

공유된 초안은 종단 간 암호화돼요. 키는 링크의 `#` 뒤에 들어 있고, 브라우저는 이 부분을 서버로 절대 보내지 않아요. 그래서 중계 서버는 읽을 수 없는 바이트를 전달하기만 해요. 링크 하나에 최대 24명이 함께할 수 있어요. 30일 동안 아무도 건드리지 않은 방은 삭제돼요. 공유할 때마다 새 링크가 만들어지고, 다른 파일로 옮기면 공유가 끝나요.

## AI 에이전트를 위한 MCP {#mcp}

typeSirkel에는 작은 MCP 서버가 함께 들어 있어요. 이 서버를 쓰면 Claude Desktop, Claude Code, Cursor 같은 MCP 클라이언트가 폴더 하나 안의 노트를 목록으로 보고, 읽고, 검색하고, 개요를 확인하고, 쓸 수 있어요. 그 폴더 밖으로는 접근하지 않아요. 데스크톱 앱은 이들이 수정한 내용을 바로바로 반영해요.

패키지가 배포되기 전까지는 저장소에서 직접 빌드하세요.

```bash
git clone https://github.com/aconymouse/typesirkel
cd typesirkel/mcp
pnpm install && pnpm build
```

그다음 클라이언트가 이 서버를 가리키도록 설정하세요. 예를 들어 Claude Desktop 설정 파일에서는 이렇게 해요.

```json
{
  "mcpServers": {
    "typesirkel": {
      "command": "node",
      "args": ["/path/to/typesirkel/mcp/dist/index.js", "/Users/you/Notes"]
    }
  }
}
```

## 내보내기 {#export}

오른쪽 아래의 **Export**로 깔끔한 단독 HTML 페이지, 인쇄 대화상자를 통한 PDF, 마크다운 사본을 얻을 수 있어요. 노트는 이미 평범한 파일이라서 따로 내보낼 건 없어요.

## 아직 막히셨나요? {#help}

[GitHub 이슈](https://github.com/aconymouse/typesirkel/issues)에 물어보거나 [aconymous.com/chat](https://aconymous.com/chat)에서 Aco에게 연락해 주세요.
