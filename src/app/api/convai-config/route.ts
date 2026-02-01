import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/convai-config
 * Returns YOUR ElevenLabs agent ID (from .env) for the embed widget.
 * Set ELEVENLABS_AGENT_ID in .env — restart dev server after changing .env.
 */
export async function GET() {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  if (!agentId?.trim()) {
    return NextResponse.json(
      { success: false, error: 'NEXT_PUBLIC_ELEVENLABS_AGENT_ID is not configured' },
      { status: 500 }
    );
  }
  return NextResponse.json({ success: true, agentId: agentId.trim() });
}
