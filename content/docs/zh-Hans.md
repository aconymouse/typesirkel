---
title: typeSirkel 使用文档
description: typeSirkel 怎么用：打开文件夹、用 markdown 写作、使用斜杠菜单和快捷键、在 Quill 里连接 AI、共享草稿以及接入 MCP。
kicker: 文档
---

## 快速上手 {#start}

typeSirkel 可以在两个地方运行，两者是同一个应用。

- **在浏览器里**，打开 [sirkel.asia/write](/write/) 就能用，什么都不用安装。
- **在桌面上**，支持 macOS 11 及以上和 Windows 10 及以上，从[发布页面](https://github.com/aconymouse/typesirkel/releases)下载。

第一次打开时，你会进入 **Scratch**，这是一个保存在浏览器里的小笔记本，随手记点东西没问题。要正经干活的话，点侧边栏底部的 **Open folder**，选择硬盘上的一个文件夹。里面的每篇笔记都会是一个普通的 `.md` 文件，任何其他应用都能读取。

在浏览器里打开整个文件夹，需要基于 Chromium 的浏览器，比如 Chrome、Edge、Brave 或 Arc。Safari 和 Firefox 一次只能打开一个文件。

macOS 版本暂时还没有经过公证。第一次打开时，请右键点击应用，然后选择 **Open**。

## 写作 {#writing}

用普通的 markdown 写就行。你停下打字片刻之后，typeSirkel 会自己保存，左下角的小圆点会告诉你什么时候保存好了。

在窗口底部，你可以在三种视图之间切换：

- **Write** 只显示编辑器。
- **Split** 把编辑器和预览并排显示，两边一起滚动。
- **Read** 只显示预览。

**Quiet** 会隐藏除了文字之外的一切。再按一次，或者按 **Cmd/Ctrl + .**，其他部分就会回来。

点文件列表旁边的 **+** 新建一篇笔记。笔记按文件夹列出，你当前打开的那篇会有标记。

## 斜杠菜单 {#slash}

在一行开头，或者在空格之后输入 `/`，就会打开格式菜单。继续输入可以筛选，比如 `/h2`、`/quote` 或 `/todo`，然后按 Enter。每一项都会显示它要写入的 markdown，用着用着你就把语法学会了。

| 格式 | Markdown |
| --- | --- |
| 一级、二级、三级标题 | `#`, `##`, `###` |
| 粗体、斜体、删除线 | `**text**`, `*text*`, `~~text~~` |
| 无序列表、有序列表、任务 | `-`, `1.`, `- [ ]` |
| 引用 | `>` |
| 链接、图片 | `[text](url)`, `![alt](url)` |
| 行内代码、代码块 | `` `code` ``, ```` ``` ```` |
| 表格、分隔线 | `| a | b |`, `---` |

当一个格式里有需要填写的空位，比如链接的文字和地址，按 Tab 就能跳到下一个。

## 快捷键 {#shortcuts}

| 按键 | 作用 |
| --- | --- |
| `/` | 格式菜单 |
| Cmd/Ctrl + S | 立即保存 |
| Cmd/Ctrl + O | 打开文件夹 |
| Cmd/Ctrl + B, I, E | 粗体、斜体、行内代码 |
| Cmd/Ctrl + K | 链接 |
| Cmd/Ctrl + F | 查找 |
| Cmd/Ctrl + 1, 2, 3 | Write、Split、Read |
| Cmd/Ctrl + J | Quill |
| Cmd/Ctrl + Shift + D | 语音输入 |
| Cmd/Ctrl + . | Quiet 模式 |
| Cmd/Ctrl + P | 打印或另存为 PDF |

## 语音输入 {#dictate}

点击右下角的麦克风，或按 **Cmd/Ctrl + Shift + D**，然后开始说话。你说的话会随说随写在光标处，很适合先记下会议要点，之后再手动或让 Quill 整理。在底部的小条里选择你说的语言，说完点 **Stop**。

语音输入使用浏览器自带的语音识别，所以需要联网，浏览器会把音频发送到它自己的语音服务。它可以在 Chrome、Edge 和 Safari 中使用。只有在支持语音输入的地方才会出现麦克风按钮。

## 大纲 {#outline}

笔记里的每个标题，都会变成侧边栏 **On this page** 下面那条小路上的一个站点。你写作或滚动时，小标记会跟着走到你所在的段落。点击任意一个站点就能跳过去。

你可以拖动侧边栏各部分之间的细线，给每一部分多留点或少留点空间。双击细线可以恢复原样。

## Quill，你的 AI {#quill}

Quill 是 typeSirkel 内置的写作助手。按 **Cmd/Ctrl + J**，或者点右下角的 **Quill** 按钮就能打开它。密钥由你自己提供，除了发往你的服务商之外，它永远不会离开你的设备。

### 连接服务商

- **Anthropic**，用于 Claude。在 [Claude Console](https://platform.claude.com/settings/keys) 创建密钥。
- **OpenAI**，用于 ChatGPT。在 [OpenAI API 密钥页面](https://platform.openai.com/api-keys)创建密钥。
- **OpenRouter**，可以用数百个模型，Gemini 也在其中。在 [openrouter.ai/keys](https://openrouter.ai/keys) 创建密钥。
- **Ollama**，用于你自己电脑上的模型，完全不需要密钥。在浏览器里使用时，用 `OLLAMA_ORIGINS=https://sirkel.asia ollama serve` 启动它。
- **Other**，用于任何支持 OpenAI 聊天格式的服务。粘贴它的 base URL 和密钥即可。

选好服务商，粘贴密钥，再从列表里选一个模型。桌面应用会把密钥存进系统钥匙串。在浏览器里，密钥只保留到你关闭标签页为止，除非你勾选 **Remember on this device**。

### 请它帮忙

选中一段文字，或者把光标停在某个段落里，然后选一个操作：Continue、Tighten、Fix、Summarize 或 Translate。你会先看到回答，再决定选 **Replace**、**Insert** 还是 **Replace all**。你也可以直接用自己的话提问，然后接着聊下去。

### 一次写很多文件

打开文件夹后，可以用 **Brief** 描述一项工作，查看 Quill 建议的文件计划，删掉你不想要的，然后让它一个一个写出来。它从不会覆盖已有的文件。

## 提示词 {#prompts}

侧边栏里的 **Prompts** 是一个摆满现成指令的书架：恐怖、奇幻、纯新闻、绝不改动引语和人名的改写、SEO 文章、教程和分镜脚本。标题旁边的小标签可以切换书架的语言。

点击一个提示词就能阅读。**Copy** 会把它复制到剪贴板，拿去给任何 AI 用。**Use in Quill** 会把它固定为 Quill 写作时的风格，直到你清除为止。

## 一起写作 {#share}

点 **Share**，再点 **Start sharing**。拿到链接的人都可以和你一起编辑草稿，还能看到每个人正在哪里打字。如果草稿是你文件夹里的文件，他们边打字，修改就边写进你的文件。

共享的草稿采用端到端加密。密钥放在链接里 `#` 之后，浏览器从不会把这部分发给服务器，所以中转服务器只是在传递一些它读不懂的字节。一个链接最多可以有 24 人加入。30 天没人动过的房间会被删除。每次共享都会生成一个新链接，切换到另一个文件就会结束共享。

## 给 AI 代理用的 MCP {#mcp}

typeSirkel 自带一个小小的 MCP 服务器，让 Claude Desktop、Claude Code、Cursor 或任何其他 MCP 客户端可以列出、读取、搜索、提取大纲并写入某一个文件夹里的笔记，除此之外哪里都碰不到。它们一改完，桌面应用马上就能看到。

在软件包正式发布之前，请从仓库自行构建：

```bash
git clone https://github.com/aconymouse/typesirkel
cd typesirkel/mcp
pnpm install && pnpm build
```

然后让你的客户端指向它，比如在 Claude Desktop 的配置里：

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

## 导出 {#export}

右下角的 **Export** 可以给你一个干净的独立 HTML 页面、一份通过打印对话框生成的 PDF，或者一份 markdown 副本。你的笔记本来就是普通文件，所以也没有别的需要导出了。

## 还是没解决？ {#help}

可以在 [GitHub issues](https://github.com/aconymouse/typesirkel/issues) 里提问，或者到 [aconymous.com/chat](https://aconymous.com/chat) 找 Aco。
