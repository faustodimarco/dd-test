import { NextRequest } from 'next/server';
import { getAllMessages, clearMessages } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = getAllMessages(id);
    return Response.json({ messages });
  } catch (err) {
    console.error('[/api/conversations/[id]/messages GET]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    clearMessages(id);
    return Response.json({ ok: true });
  } catch (err) {
    console.error('[/api/conversations/[id]/messages DELETE]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
