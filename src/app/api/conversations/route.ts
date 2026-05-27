import { getConversationsList } from '@/lib/db';
import { PERSONAS } from '@/lib/personas';

export async function GET() {
  try {
    const rows = getConversationsList();

    const conversations = rows.map((row) => {
      const persona = PERSONAS[row.persona_id];
      return {
        id: row.id,
        personaId: row.persona_id,
        name: persona?.name ?? row.persona_id,
        age: persona?.age ?? 0,
        avatar: persona?.avatar ?? '',
        isGroup: persona?.isGroup ?? false,
        groupAvatars: persona?.groupAvatars ?? null,
        lastMessage: row.last_message ?? null,
        lastRole: row.last_role ?? null,
        updatedAt: row.updated_at,
      };
    });

    return Response.json({ conversations });
  } catch (err) {
    console.error('[/api/conversations]', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
