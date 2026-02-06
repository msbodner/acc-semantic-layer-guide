import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const { fileName, content } = await request.json()

    if (!fileName || !content) {
      return NextResponse.json(
        { error: "Missing fileName or content" },
        { status: 400 }
      )
    }

    // Save to downloads/aiofiles directory relative to project root
    const outputDir = join(process.cwd(), "downloads", "aiofiles")

    // Create directory if it doesn't exist
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true })
    }

    const filePath = join(outputDir, fileName)
    await writeFile(filePath, content, "utf-8")

    return NextResponse.json({
      success: true,
      path: `downloads/aiofiles/${fileName}`,
      fullPath: filePath,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json(
      { error: `Failed to save file: ${message}` },
      { status: 500 }
    )
  }
}
