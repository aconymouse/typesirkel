---
title: typeSirkel 常见问题
description: 关于免费 markdown 编辑器 typeSirkel 的解答：笔记存在哪里、能用哪些 AI、共享如何保持私密，以及怎样参与帮忙。
kicker: 常见问题
---

## typeSirkel 免费吗？

是的。typeSirkel 免费且开源，采用 MIT 许可证。没有付费方案，不需要账号，也没有试用期。如果你在里面使用 AI，就用你自己的密钥，直接向 AI 服务商付费。

## 我的笔记存在哪里？

存在你自己的硬盘上。打开一个文件夹后，每篇笔记都是这个文件夹里的普通 `.md` 文件，任何其他应用都能读取。Scratch 里的笔记保存在浏览器的存储中，直到你把它们移进某个文件夹为止，所以它们只会留在那一个浏览器里。

## 我需要账号吗？

不需要。打开编辑器就能开始写。没有任何地方会要你注册或登录。

## 能离线使用吗？

桌面应用完全可以离线使用。网页版编辑器加载时需要联网，加载完之后就能继续处理你的文件。AI 需要联网，除非你用 Ollama 运行本地模型。

## 我能用哪些 AI？

通过 Anthropic 使用 Claude，通过 OpenAI 使用 ChatGPT，通过 OpenRouter 使用包括 Gemini 在内的数百个模型，通过 Ollama 使用本地模型，还有任何支持 OpenAI 聊天格式的服务。[文档](/zh/docs/#quill)里逐一介绍了怎么连接。

## 我的 API 密钥安全吗？

你的密钥只留在你的设备上。桌面应用会把它存进系统钥匙串。在浏览器里，它只保留到你关闭标签页为止，除非你勾选 **Remember on this device**。请求会直接发到你的服务商，中间不经过任何 typeSirkel 服务器。

## 一起写作是私密的吗？

是的。共享的草稿采用端到端加密。密钥放在链接里 `#` 之后的部分，浏览器从不会把这部分发给服务器，所以中转服务器只是在传递一些它读不懂的字节。一个链接最多可以有 24 人加入，30 天没人动过的房间会被删除。

## 哪些浏览器可以打开文件夹？

基于 Chromium 的浏览器，比如 Chrome、Edge、Brave 和 Arc，可以打开整个文件夹。Safari 和 Firefox 一次只能打开一个文件。桌面应用在任何系统上都能打开文件夹。

## 可以在手机上用吗？

可以，在浏览器里用。在手机上，你可以在 Scratch 里写，或者打开单个文件，侧边栏收在顶部的菜单按钮里。

## 我能怎么帮忙？

在 [GitHub](https://github.com/aconymouse/typesirkel) 上给项目点个 Star，报告 bug，推荐一个提示词，翻译一个页面，或者提交一个 pull request。[贡献指南](https://github.com/aconymouse/typesirkel/blob/main/CONTRIBUTING.md)里写了具体怎么做。

## typeSirkel 是谁做的？

[Hafidz Nc](https://aconymous.com)，大家也叫他 Aco。你可以在[关于页面](/zh/about/)读到他为什么做它，或者到 [aconymous.com/chat](https://aconymous.com/chat) 跟他打个招呼。
