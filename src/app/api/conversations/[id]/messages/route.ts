import { NextRequest } from 'next/server';
import { getAllMessages } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = getAllMessages(id);
    return Response.json({ messages });
  } catch (err) {
    console.error('[/api/conversations/[id]/messages]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
