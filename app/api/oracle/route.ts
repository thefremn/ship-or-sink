import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { buildSystemPrompt } from '@/lib/prompts';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import type { OracleRequest } from '@/types/oracle';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body: OracleRequest = await req.json();
  const { dilemma, house, gomJabbar } = body;

  if (!dilemma || !house) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (dilemma.length > 500) {
    return NextResponse.json({ error: 'Dilemma exceeds 500 characters' }, { status: 400 });
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    temperature: 0.85,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: buildSystemPrompt(house, gomJabbar) },
      { role: 'user', content: dilemma },
    ],
  });

  const raw = completion.choices[0].message.content ?? '{}';
  const parsed = JSON.parse(raw);
  const { prophecy, successScore, riskScore, spiceScore, verdict } = parsed;

  const { data, error } = await supabaseAdmin
    .from('consultations')
    .insert({
      user_id: user.id,
      house,
      dilemma,
      prophecy,
      success_score: successScore,
      risk_score: riskScore,
      spice_score: spiceScore,
      verdict,
      gom_jabbar: gomJabbar,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: 'Failed to save consultation' }, { status: 500 });
  }

  return NextResponse.json({ prophecy, successScore, riskScore, spiceScore, verdict, consultationId: data.id });
}
