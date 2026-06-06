import { readFile } from "node:fs/promises";
import path from "node:path";

const framePattern = /^(?:00[1-9]|0[1-9]\d|[1-3]\d{2}|4[0-5]\d|460)\.webp$/;

export async function GET(_request, { params }) {
  const { frame } = await params;

  if (!framePattern.test(frame)) {
    return new Response("Frame not found", { status: 404 });
  }

  const filePath = path.join(process.cwd(), "frames", frame);

  try {
    const image = await readFile(filePath);

    return new Response(image, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Frame not found", { status: 404 });
  }
}
