import { create } from "zustand";

export type ActiveTab = "chat" | "knowledge" | "stateless";

interface UIState {
  selectedConversationId: string | null;
  activeTab: ActiveTab;
  showPipelineStats: boolean;
  showSources: boolean;
  setSelectedConversationId: (id: string | null) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setShowPipelineStats: (show: boolean) => void;
  togglePipelineStats: () => void;
  setShowSources: (show: boolean) => void;
  toggleSources: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedConversationId: null,
  activeTab: "chat",
  showPipelineStats: true,
  showSources: true,

  setSelectedConversationId: (id: string | null) => set({ selectedConversationId: id }),
  setActiveTab: (tab: ActiveTab) => set({ activeTab: tab }),
  setShowPipelineStats: (show: boolean) => set({ showPipelineStats: show }),
  togglePipelineStats: () => set((state) => ({ showPipelineStats: !state.showPipelineStats })),
  setShowSources: (show: boolean) => set({ showSources: show }),
  toggleSources: () => set((state) => ({ showSources: !state.showSources })),
}));

