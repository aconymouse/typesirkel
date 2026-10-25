---
title: Documentação do typeSirkel
description: Como usar o typeSirkel: abrir uma pasta, escrever em markdown, usar o menu de barra e atalhos, conectar sua IA no Quill, compartilhar e usar MCP.
---

## Primeiros passos {#start}

O typeSirkel roda em dois lugares, e os dois são o mesmo app.

- **No navegador**, em [sirkel.asia/write](/write/). Nada para instalar.
- **No desktop**, para macOS 11 ou mais recente, Windows 10 ou mais recente e Linux (AppImage ou .deb), pela [página de releases](https://github.com/aconymouse/typesirkel/releases).

Na primeira vez que você abre, cai no **Scratch**, um caderninho guardado no seu navegador. Ele serve bem para anotações rápidas. Para trabalho de verdade, aperte **Open folder** na parte de baixo da barra lateral e escolha uma pasta no seu disco. Cada nota nela vira um arquivo `.md` simples que qualquer outro app consegue ler.

Para abrir uma pasta inteira no navegador, você precisa de um navegador baseado em Chromium, como Chrome, Edge, Brave ou Arc. Safari e Firefox abrem um arquivo por vez.

Os apps de desktop ainda não são assinados. No Mac, abra o app uma vez, depois vá em **System Settings → Privacy & Security** e escolha **Open Anyway**. No Windows, quando o SmartScreen aparecer, escolha **More info** e depois **Run anyway**.

## Escrevendo {#writing}

Escreva em markdown puro. O typeSirkel salva sozinho um instante depois que você para de digitar, e o ponto no canto inferior esquerdo avisa quando terminou.

Na parte de baixo da janela, você alterna entre três visualizações:

- **Write** mostra só o editor.
- **Split** mostra o editor e a pré-visualização lado a lado, rolando juntos.
- **Read** mostra só a pré-visualização.

**Quiet** esconde tudo, menos as suas palavras. Aperte de novo, ou **Cmd/Ctrl + .**, para trazer o resto de volta.

Aperte **+** ao lado da lista de arquivos para começar uma nota nova. As notas aparecem agrupadas por pasta, e a que está aberta fica marcada.

## O menu de barra {#slash}

Digite `/` no começo de uma linha, ou depois de um espaço, para abrir um menu de formatos. Continue digitando para filtrar, por exemplo `/h2`, `/quote` ou `/todo`, e aperte Enter. Cada item mostra o markdown que ele escreve, então você vai aprendendo a sintaxe pelo caminho.

| Formato | Markdown |
| --- | --- |
| Título 1, 2, 3 | `#`, `##`, `###` |
| Negrito, itálico, tachado | `**text**`, `*text*`, `~~text~~` |
| Lista com marcadores, lista numerada, tarefa | `-`, `1.`, `- [ ]` |
| Citação | `>` |
| Link, imagem | `[text](url)`, `![alt](url)` |
| Código inline, bloco de código | `` `code` ``, ```` ``` ```` |
| Tabela, divisor | `| a | b |`, `---` |

Quando um formato tem um campo para preencher, como o texto e o endereço de um link, aperte Tab para pular para o próximo.

## Atalhos {#shortcuts}

| Teclas | O que faz |
| --- | --- |
| `/` | Menu de formatos |
| Cmd/Ctrl + S | Salvar agora |
| Cmd/Ctrl + O | Abrir uma pasta |
| Cmd/Ctrl + B, I, E | Negrito, itálico, código inline |
| Cmd/Ctrl + K | Link |
| Cmd/Ctrl + F | Buscar |
| Cmd/Ctrl + 1, 2, 3 | Write, Split, Read |
| Cmd/Ctrl + J | Quill |
| Cmd/Ctrl + Shift + D | Ditado |
| Cmd/Ctrl + . | Modo Quiet |
| Cmd/Ctrl + P | Imprimir ou salvar como PDF |

## Ditado {#dictate}

Clique no microfone no canto inferior direito, ou use **Cmd/Ctrl + Shift + D**, e comece a falar. As palavras aparecem no cursor enquanto você fala, o que ajuda a registrar o essencial de uma reunião e arrumar depois, à mão ou com o Quill. Escolha o idioma em que está falando na barrinha embaixo e clique em **Stop** quando terminar.

O ditado usa o reconhecimento de voz do próprio navegador, então precisa de internet, e o navegador envia o áudio para o serviço de voz dele. Funciona no Chrome, no Edge e no Safari. O botão de microfone só aparece onde o ditado está disponível.

## O sumário {#outline}

Cada título da sua nota vira uma parada na trilha em **On this page**, na barra lateral. Conforme você escreve ou rola a página, o marcadorzinho vai andando até a seção em que você está. Clique em qualquer parada para pular até ela.

Você pode arrastar as linhas finas entre as seções da barra lateral para dar mais ou menos espaço a cada uma. Dê um clique duplo numa linha para voltar ao tamanho original.

## Quill, sua IA {#quill}

O Quill é o assistente de escrita do typeSirkel. Abra com **Cmd/Ctrl + J** ou pelo botão **Quill** no canto inferior direito. Você usa a sua própria chave, e ela nunca sai do seu dispositivo, a não ser para chegar ao seu provedor.

### Conectando um provedor

- **Anthropic** para o Claude. Crie uma chave no [Claude Console](https://platform.claude.com/settings/keys).
- **OpenAI** para o ChatGPT. Crie uma chave na [página de chaves de API da OpenAI](https://platform.openai.com/api-keys).
- **OpenRouter** para centenas de modelos, incluindo o Gemini. Crie uma chave em [openrouter.ai/keys](https://openrouter.ai/keys).
- **Ollama** para modelos na sua própria máquina, sem chave nenhuma. No navegador, inicie com `OLLAMA_ORIGINS=https://sirkel.asia ollama serve`.
- **Other** para qualquer serviço que use o formato de chat da OpenAI. Cole a URL base e a chave.

Escolha o provedor, cole a chave e selecione um modelo da lista. O app de desktop guarda as chaves no chaveiro do sistema. No navegador, uma chave dura até você fechar a aba, a menos que você marque **Remember on this device**.

### Pedindo ajuda

Selecione um trecho, ou deixe o cursor num parágrafo, e escolha uma ação: Continue, Tighten, Fix, Summarize ou Translate. Você vê a resposta primeiro e depois escolhe **Replace**, **Insert** ou **Replace all**. Também dá para simplesmente pedir com as suas próprias palavras e seguir a conversa.

### Escrevendo vários arquivos de uma vez

Com uma pasta aberta, o **Brief** deixa você descrever um trabalho, revisar o plano de arquivos que o Quill sugere, tirar os que você não quer e deixar ele escrever um por um. Ele nunca sobrescreve um arquivo que já existe.

## Prompts {#prompts}

**Prompts**, na barra lateral, é uma prateleira de instruções prontas: terror, fantasia, notícia direta, uma reescrita que nunca mexe em citações nem em nomes, artigos de SEO, tutoriais e storyboards. A etiquetinha ao lado do título troca o idioma da prateleira.

Clique num prompt para ler. **Copy** copia ele para a área de transferência, para usar em qualquer IA. **Use in Quill** fixa ele como o estilo de tudo o que o Quill escrever, até você remover.

## Escrevendo juntos {#share}

Aperte **Share** e depois **Start sharing**. Qualquer pessoa com o link pode editar o rascunho com você e ver onde cada um está digitando. Se o rascunho for um arquivo da sua pasta, as alterações dos outros entram no seu arquivo enquanto eles digitam.

Rascunhos compartilhados têm criptografia de ponta a ponta. A chave fica depois do `#` no link, parte que os navegadores nunca enviam a um servidor, então o servidor de retransmissão só repassa bytes que não consegue ler. Até 24 pessoas podem entrar pelo mesmo link. Uma sala sem atividade por 30 dias é apagada. Cada vez que você compartilha, recebe um link novo, e mudar para outro arquivo encerra o compartilhamento.

## MCP para agentes de IA {#mcp}

O typeSirkel vem com um pequeno servidor MCP que permite ao Claude Desktop, Claude Code, Cursor ou qualquer outro cliente MCP listar, ler, buscar, ver a estrutura e escrever as notas de uma pasta, e de nenhum outro lugar. O app de desktop mostra as edições deles assim que chegam.

Enquanto o pacote não é publicado, compile a partir do repositório:

```bash
git clone https://github.com/aconymouse/typesirkel
cd typesirkel/mcp
pnpm install && pnpm build
```

Depois aponte o seu cliente para ele, por exemplo na configuração do Claude Desktop:

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

## Exportar {#export}

**Export**, no canto inferior direito, gera uma página HTML limpa e independente, um PDF pela janela de impressão ou uma cópia do markdown. As suas notas já são arquivos simples, então não tem mais nada para exportar.

## Ainda precisa de ajuda? {#help}

Pergunte nas [issues do GitHub](https://github.com/aconymouse/typesirkel/issues) ou chame o Aco em [aconymous.com/chat](https://aconymous.com/chat).
