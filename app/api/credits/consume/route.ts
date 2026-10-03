import { NextRequest, NextResponse } from 'next/server';
import { consumeCredits } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

// Initialiser le client serveur
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * POST /api/credits/consume
 * Consommer des crédits pour un outil
 *
 * Body :
 * {
 *   "tool": "code-assistant",
 *   "quantity": 1
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer l'utilisateur depuis le token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Parser le body
    const body = await request.json();
    const { tool, quantity = 1 } = body;

    if (!tool) {
      return NextResponse.json({ error: 'Missing tool parameter' }, { status: 400 });
    }

    // Consommer les crédits
    const result = await consumeCredits(user.id, tool, quantity);

    if (!result.ok) {
      return NextResponse.json(
        {
          error: result.reason,
          plan_left: result.plan_left,
          pack_left: result.pack_left,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      usage_id: result.usage_id,
      plan_left: result.plan_left,
      pack_left: result.pack_left,
    });
  } catch (error) {
    console.error('Error in consume credits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
