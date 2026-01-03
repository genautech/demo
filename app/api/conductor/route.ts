import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const CONDUCTOR_PATH = path.join(process.cwd(), "conductor")
const TRACKS_PATH = path.join(CONDUCTOR_PATH, "tracks")

function readMarkdownFiles(dir: string): { name: string; path: string; content: string; lastModified: string }[] {
  const files: { name: string; path: string; content: string; lastModified: string }[] = []
  
  if (!fs.existsSync(dir)) {
    return files
  }
  
  const entries = fs.readdirSync(dir)
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry)
    const stat = fs.statSync(fullPath)
    
    if (stat.isFile() && entry.endsWith(".md")) {
      files.push({
        name: entry,
        path: fullPath,
        content: fs.readFileSync(fullPath, "utf-8"),
        lastModified: stat.mtime.toISOString(),
      })
    }
  }
  
  return files.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
}

function readTracks(): { name: string; plan: string; lastModified: string }[] {
  const tracks: { name: string; plan: string; lastModified: string }[] = []
  
  if (!fs.existsSync(TRACKS_PATH)) {
    return tracks
  }
  
  const trackDirs = fs.readdirSync(TRACKS_PATH)
  
  for (const trackDir of trackDirs) {
    const trackPath = path.join(TRACKS_PATH, trackDir)
    const stat = fs.statSync(trackPath)
    
    if (stat.isDirectory()) {
      const planPath = path.join(trackPath, "plan.md")
      if (fs.existsSync(planPath)) {
        const planStat = fs.statSync(planPath)
        tracks.push({
          name: trackDir,
          plan: fs.readFileSync(planPath, "utf-8"),
          lastModified: planStat.mtime.toISOString(),
        })
      }
    }
  }
  
  return tracks.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  try {
    if (action === "list") {
      const files = readMarkdownFiles(CONDUCTOR_PATH)
      const tracks = readTracks()
      
      return NextResponse.json({
        success: true,
        files,
        tracks,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Conductor API",
      availableActions: ["list"],
    })
  } catch (error: any) {
    console.error("Conductor API error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
