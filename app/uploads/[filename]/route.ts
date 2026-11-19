import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

/**
 * Serve photos uploaded at runtime.
 *
 * `next start` builds its list of public files when the server boots, so files
 * written to `public/uploads` afterwards would 404 until a restart. This route
 * reads them from disk on demand instead.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const match = /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/.exec(filename);
  if (!match) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const file = await readFile(
      path.join(process.cwd(), "public", "uploads", filename),
    );
    return new NextResponse(new Uint8Array(file), {
      headers: {
        "Content-Type": TYPES[match[1].toLowerCase()] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
