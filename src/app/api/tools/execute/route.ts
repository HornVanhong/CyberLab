import { NextRequest, NextResponse } from "next/server";
import { DETAILED_TOOLS } from "@/data/toolsData";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { toolId, command } = body;

    if (!command) {
      return NextResponse.json({ error: "Command is required" }, { status: 400 });
    }

    const tool = DETAILED_TOOLS.find((t) => t.id === toolId);

    // Simulated execution payload
    const executionLogs = [
      `[+] Initializing execution environment: ${tool ? tool.name : "CLI Tool"}`,
      `[+] Executing: ${command}`,
      `[+] Connecting to target target.lab...`,
      tool?.tutorialSteps[0]?.expectedOutputSnippet || "[+] Command finished successfully. 0 errors.",
    ].join("\n");

    return NextResponse.json({
      success: true,
      command,
      output: executionLogs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Tool execution API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
