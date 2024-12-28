import { create } from 'zustand';

export const models = [
  { id: 'glm-4', name: 'GLM-4' },
  { id: 'glm-3-turbo', name: 'GLM-3-Turbo' },
];

interface ModelStore {
  currentModel: string;
  setModel: (modelId: string) => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  currentModel: 'glm-4',
  setModel: (modelId) => set({ currentModel: modelId }),
})); 