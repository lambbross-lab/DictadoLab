import { DictationResult } from "./gemini";
import { supabase } from "../lib/supabase";

export interface HistoryItem extends DictationResult {
  id: string;
  date: string;
  length: string;
}

type HistoryRow = {
  id: string;
  user_id: string;
  titulo: string | null;
  regla: string | null;
  nivel: string | null;
  contenido: string;
  created_at: string;
  length: string | null;
  difficulty: string | null;
  keywords: string[] | null;
  pre_exercise: string | null;
  solution: string | null;
  observations: string | null;
  final_activity: any | null;
  pt_adaptation: string | null;
  al_adaptation: string | null;
};

function mapRowToHistoryItem(row: HistoryRow): HistoryItem {
  return {
    id: row.id,
    date: row.created_at,
    length: row.length || "medio",
    title: row.titulo || "",
    rule: row.regla || "",
    difficulty: row.difficulty || row.nivel || "",
    content: row.contenido,
    keywords: row.keywords || [],
    preExercise: row.pre_exercise || "",
    solution: row.solution || "",
    observations: row.observations || "",
    finalActivity: row.final_activity || undefined,
    ptAdaptation: row.pt_adaptation || undefined,
    alAdaptation: row.al_adaptation || undefined,
  };
}

export const historyService = {
  async getHistory(): Promise<HistoryItem[]> {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return [];
    }

    const { data, error } = await supabase
      .from("dictados_guardados")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading history from Supabase", error);
      return [];
    }

    return (data as HistoryRow[]).map(mapRowToHistoryItem);
  },

  async saveDictation(dictation: DictationResult, length: string): Promise<HistoryItem | null> {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      throw new Error("Usuario no autenticado");
    }

    const payload = {
      user_id: userData.user.id,
      titulo: dictation.title || "",
      regla: dictation.rule || "",
      nivel: dictation.difficulty || "",
      difficulty: dictation.difficulty || "",
      contenido: dictation.content,
      length,
      keywords: dictation.keywords || [],
      pre_exercise: dictation.preExercise || "",
      solution: dictation.solution || "",
      observations: dictation.observations || "",
      final_activity: dictation.finalActivity || null,
      pt_adaptation: dictation.ptAdaptation || "",
      al_adaptation: dictation.alAdaptation || "",
    };

    const { data, error } = await supabase
      .from("dictados_guardados")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      console.error("Error saving dictation to Supabase", error);
      throw error;
    }

    return mapRowToHistoryItem(data as HistoryRow);
  },

  async deleteDictation(id: string): Promise<void> {
    const { error } = await supabase
      .from("dictados_guardados")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting dictation from Supabase", error);
      throw error;
    }
  },

  async clearHistory(): Promise<void> {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return;
    }

    const { error } = await supabase
      .from("dictados_guardados")
      .delete()
      .eq("user_id", userData.user.id);

    if (error) {
      console.error("Error clearing history from Supabase", error);
      throw error;
    }
  }
};