---
eyebrow: 发布日志
title: GeneralUpdate v10.5.0-rc.1
summary: 零配置初始化、清单自动发现、扩展钩子与配置支持——让 GeneralUpdate 的集成比以往更简单。
metrics: 零配置 SetSource() API|manifest.json 自动发现|IUpdateHooks 扩展点|appsettings.json LoadFromConfiguration()
image: juster
---
### v10.5.0-rc.1 更新内容
此版本聚焦开发者体验，大幅减少集成 GeneralUpdate 所需的样板代码，同时提供强大的新扩展能力。

- [零配置 SetSource()](https://github.com/GeneralLibrary/GeneralUpdate): 自动从 manifest.json 中发现更新源地址——不再需要在启动代码中硬编码 URL。
- manifest.json 自动发现: GeneralUpdate 现在会自动扫描 manifest.json 来解析更新配置，简化多环境部署。
- IUpdateHooks 扩展点: 全新的生命周期钩子允许你在关键阶段（下载前后、安装前后、出错时）注入自定义逻辑，无需修改 GeneralUpdate 内部代码。
- LoadFromConfiguration() 支持: 直接从 appsettings.json 读取更新设置，实现零代码变更的环境感知配置。
- SSL/HttpClient 生命周期修复: 解决了长时间运行的更新过程中 HttpClient 套接字耗尽和 SSL 证书验证问题。
- OSS 更新流程改进: 更可靠的 OSS 更新交付，具备更好的错误恢复和进度上报能力。
- 链式转全量回退策略: 用数量优先的启发式算法替代了 80% 体积阈值——当需要的增量补丁过多时，GeneralUpdate 会智能回退到全量包安装。
- Bowl → BowlBootstrap 重命名: 明确化崩溃守护进程的命名，更好地反映其在进程生命周期中的引导角色。
- CI/CD 可靠性修复: 规范化版本号输入处理，修复发布工作流中的 fetch-depth，并提升了 Linux 运行器上的测试稳定性。
