# 部署手册

按照下面步骤执行即可完成 TSLH Official Website 的 Node.js 服务器部署。

## 1. 准备服务器环境

1. 安装 Node.js 20.19.0 或更高版本（也支持 22.12.0 或更高版本）。
2. 安装 npm 10 或更高版本。
3. 确认版本：
   ```bash
   node -v
   npm -v
   ```

## 2. 获取项目代码

```bash
git clone https://github.com/JusterZhu/TSLH.Officialwebsite.git
cd TSLH.Officialwebsite
```

如果代码已经上传到服务器，只需要进入项目目录即可。

## 3. 安装依赖

```bash
npm ci
```

## 4. 压缩帧图片（首次部署必须执行）

网站使用帧动画，原始 PNG 帧图片体积较大。首次部署前需将其压缩为 WebP 格式：

```bash
node scripts/compress-frames.mjs
```

此脚本将 `frames/` 目录中的 PNG 图片压缩为 WebP 格式（分辨率从 4252×2160 降至 1920×975，大小从约 1.4GB 降至约 30MB）。压缩完成后可删除原始 PNG 文件：

```bash
rm frames/*.png
```

> **注意：** 后续部署中如果 `frames/` 目录中已有 WebP 文件，可跳过此步骤。

## 5. 修改运行地址和端口

打开项目根目录下的 `web.config.json`：

```json
{
  "host": "0.0.0.0",
  "port": 3000
}
```

- `host`：Web 服务监听地址。服务器部署通常保持 `0.0.0.0`，表示允许外部访问；只允许本机访问时改成 `127.0.0.1`。
- `port`：Web 服务端口号。按服务器开放的端口修改，例如 `3000`、`8080`。

修改后保存文件，并确保服务器防火墙或安全组已经放行该端口。

## 6. 编译生产版本

```bash
npm run build
```

编译成功后会生成 `.next` 目录。生产环境运行时，请保留项目根目录下的 `frames/` 目录，因为网站运行时会读取其中的 WebP 图片帧。

## 7. 启动网站

```bash
npm run start
```

启动成功后，在浏览器访问：

```text
http://服务器IP:端口号
```

例如端口保持 `3000` 时：

```text
http://服务器IP:3000
```

## 8. 后台运行（可选）

如果需要关闭 SSH 后网站仍然运行，可以使用：

```bash
nohup npm run start > tslh-web.log 2>&1 &
```

查看日志：

```bash
tail -f tslh-web.log
```

停止服务时，先查询进程号：

```bash
ps -ef | grep "scripts/start-web.mjs"
```

再停止对应进程：

```bash
kill 进程号
```

## 9. 每次更新代码后的部署流程

```bash
git pull
npm ci
npm run build
npm run start
```

如果只修改了 `web.config.json` 的端口或地址，需要重启 `npm run start` 后配置才会生效。
