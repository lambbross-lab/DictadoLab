import { supabase } from '../lib/supabase';

export interface DictationRequest {
  rule: string;
  difficulty: "fácil" | "media" | "avanzada";
  length: "corto" | "medio" | "largo";
  textType: "frases" | "narrativo" | "descriptivo" | "diálogo";
  theme?: string;
  count: number;
  includeTitle: boolean;
  includeSolution: boolean;
  includeObservations: boolean;
  includeFinalActivity?: boolean;
  generatePT?: boolean;
  generateAL?: boolean;
}

export interface FinalActivity {
  title: string;
  instruction: string;
  content: string;
}

export interface PTAdaptation {
  title: string;
  instructions: string[];
  sentences: string[];
  hint: string;
}

export interface ALAdaptation {
  title: string;
  instructions: string;
  words: string[];
}

export interface DictationResult {
  title?: string;
  rule: string;
  difficulty: string;
  keywords: string[];
  preExercise: string;
  content: string;
  solution?: string;
  observations?: string;
  length?: string;
  finalActivity?: FinalActivity;
  ptAdaptation?: PTAdaptation;
  alAdaptation?: ALAdaptation;
}

export async function generateDictations(config: DictationRequest): Promise<DictationResult[]> {
  const { data: { session } } = await supabase.auth.getSession();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };

  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  console.log("SESSION USER:", session?.user?.id || null);
  console.log("HAS TOKEN:", !!session?.access_token);

  const response = await fetch(
    'https://rdjfdbaxhwptybbcngop.supabase.co/functions/v1/generate-dictado',
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ config }),
    }
  );

  const rawText = await response.text();

  console.log("EDGE STATUS:", response.status);
  console.log("EDGE BODY:", rawText);

  if (!response.ok) {
    throw new Error(`Edge ${response.status}: ${rawText}`);
  }

  let data: unknown;
  try {
    data = rawText ? JSON.parse(rawText) : [];
  } catch {
    throw new Error(`Respuesta no JSON: ${rawText}`);
  }

  if (!Array.isArray(data)) {
    throw new Error('La respuesta del servidor no es válida');
  }

  return data as DictationResult[];
}