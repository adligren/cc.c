import { create } from "zustand";

type PreferencesStoreType = {
  filter: string;
  setFilter: (filter: string) => void;
};

const usePreferences = create<PreferencesStoreType>()((set) => ({
  filter: "",
  setFilter: (filter: string) => set({ filter }),
}));

export default usePreferences;
