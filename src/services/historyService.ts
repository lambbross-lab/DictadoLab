import { DictationResult } from "./gemini";

export interface HistoryItem extends DictationResult {
  id: string;
  date: string;
  length: string;
}

const STORAGE_KEY = "dictadolab_history";

export const historyService = {
  getHistory(): HistoryItem[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Error parsing history from localStorage", e);
      return [];
    }
  },

  saveDictation(dictation: DictationResult, length: string): HistoryItem {
    const history = this.getHistory();
    const newItem: HistoryItem = {
      ...dictation,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      date: new Date().toISOString(),
      length: length,
    };
    
    const updatedHistory = [newItem, ...history];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return newItem;
  },

  deleteDictation(id: string): void {
    const history = this.getHistory();
    const updatedHistory = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  },

  clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
};
