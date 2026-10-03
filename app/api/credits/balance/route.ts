import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialiser le client serveur
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * GET /api/credits/balance
 * Récupérer le solde des crédits de l'utilisateur
 */
export async function GET(request: NextRequest) {
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

    // Récupérer le solde des crédits
    const { data: wallet, error } = await supabase
      .from('credit_wallets')
      .select('plan_credits, pack_credits, updated_at')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching wallet:', error);
      return NextResponse.json({ error: 'Failed to fetch wallet' }, { status: 500 });
    }

    // Récupérer l'abonnement
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_slug, status, current_period_end')
      .eq('user_id', user.id)
      .single();

    return NextResponse.json({
      plan_credits: wallet?.plan_credits || 0,
      pack_credits: wallet?.pack_credits || 0,
      total_credits: (wallet?.plan_credits || 0) + (wallet?.pack_credits || 0),
      subscription: {
        plan: subscription?.plan_slug || 'free',
        status: subscription?.status || 'active',
        current_period_end: subscription?.current_period_end,
      },
      updated_at: wallet?.updated_at,
    });
  } catch (error) {
    console.error('Error in get balance:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
