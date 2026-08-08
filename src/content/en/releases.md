---
eyebrow: Release Notes
title: GeneralUpdate v10.5.0-rc.1
summary: Zero-config initialization, manifest auto-discovery, extension hooks, and configuration support — making GeneralUpdate easier to integrate than ever.
metrics: Zero-config SetSource() API|manifest.json auto-discovery|IUpdateHooks extension points|appsettings.json LoadFromConfiguration()
image: juster
---
### What's New in v10.5.0-rc.1
This release focuses on developer experience, reducing the boilerplate required to integrate GeneralUpdate while adding powerful new extension points.

- [Zero-config SetSource()](https://github.com/GeneralLibrary/GeneralUpdate): Automatically discovers update source URL from manifest.json — no more hardcoded URLs in your bootstrap code.
- manifest.json auto-discovery: GeneralUpdate now scans for manifest.json to resolve update configuration, simplifying multi-environment deployments.
- IUpdateHooks extension points: New lifecycle hooks let you inject custom logic at key stages (before/after download, before/after install, on error) without modifying GeneralUpdate internals.
- LoadFromConfiguration() support: Read update settings directly from appsettings.json, enabling environment-aware configuration with zero code changes.
- SSL/HttpClient lifecycle fixes: Resolved HttpClient socket exhaustion and SSL certificate validation issues in long-running update processes.
- OSS update flow improvements: More reliable OSS-based update delivery with better error recovery and progress reporting.
- Chain-to-full fallback strategy: Replaced the 80% size threshold with a count-first heuristic — when too many delta patches are needed, GeneralUpdate intelligently falls back to a full package install.
- Bowl → BowlBootstrap rename: Clarified the crash daemon naming to better reflect its bootstrap role in the process lifecycle.
- CI/CD reliability fixes: Normalized version input handling, fixed fetch-depth in publish workflow, and improved test stability on Linux runners.
