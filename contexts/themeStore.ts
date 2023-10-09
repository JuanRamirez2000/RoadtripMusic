import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type NightModeStore = {
  nightMode: boolean;
  setNightMode: () => void;
};

const useNightModeStore = create<NightModeStore>()(
  persist(
    (set, get) => ({
      nightMode: true,
      setNightMode: () => set({ nightMode: !get().nightMode }),
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export { useNightModeStore };
