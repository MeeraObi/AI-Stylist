import { create } from 'zustand';

interface UserInfo {
    name: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
}

interface StylistStore {
    userBlob: File | null;
    userInfo: UserInfo;
    preliminaryResults: Record<string, string> | null;
    comprehensiveResults: {
        profile_writeup: { summary: string };
        first_looks: { work: string; travel: string; social: string };
        physical_desc: string;
    } | null;
    currentScreen: string;
    isLoading: boolean;
    loadingMessage: string;
    quizSelections: string[];
    selectedDailyLook: { desc: string; img: string | null } | null;
    weeklyLooks: Array<{ day: string; title: string; desc: string }>;
    groomingData: { tip: string; products: string[] } | null;

    setUserBlob: (blob: File | null) => void;
    setUserInfo: (info: Partial<UserInfo>) => void;
    setPreliminaryResults: (results: Record<string, string>) => void;
    setComprehensiveResults: (results: {
        profile_writeup: { summary: string };
        first_looks: { work: string; travel: string; social: string };
        physical_desc: string;
    }) => void;
    setQuizSelections: (selections: string[]) => void;
    setScreen: (screen: string) => void;
    setLoading: (loading: boolean, message?: string) => void;
    setSelectedDailyLook: (look: { desc: string; img: string | null } | null) => void;
    setWeeklyLooks: (looks: Array<{ day: string; title: string; desc: string }>) => void;
    shopTab: string;
    currentLookDescription: string | null;
    setShopTab: (tab: string) => void;
    setCurrentLookDescription: (desc: string | null) => void;
    setGroomingData: (data: { tip: string; products: string[] } | null) => void;
}

export const useStylistStore = create<StylistStore>((set) => ({
    userBlob: null,
    userInfo: {
        name: '',
        age: '',
        gender: '',
        height: '',
        weight: ''
    },
    preliminaryResults: null,
    comprehensiveResults: null,
    currentScreen: 'splash', // splash, onboarding, upload, results, quiz, dashboard, etc.
    isLoading: false,
    loadingMessage: 'Processing...',
    quizSelections: [],
    selectedDailyLook: null,
    weeklyLooks: [],
    groomingData: null,
    shopTab: "Work",
    currentLookDescription: null,

    setUserBlob: (userBlob) => set({ userBlob }),
    setUserInfo: (info) => set((state) => ({ userInfo: { ...state.userInfo, ...info } })),
    setPreliminaryResults: (preliminaryResults) => set({ preliminaryResults }),
    setComprehensiveResults: (comprehensiveResults) => set({ comprehensiveResults }),
    setQuizSelections: (quizSelections) => set({ quizSelections }),
    setScreen: (currentScreen) => set({ currentScreen }),
    setLoading: (isLoading, loadingMessage = 'Processing...') => set({ isLoading, loadingMessage }),
    setSelectedDailyLook: (selectedDailyLook) => set({ selectedDailyLook }),
    setWeeklyLooks: (weeklyLooks) => set({ weeklyLooks }),
    setGroomingData: (groomingData) => set({ groomingData }),
    setShopTab: (shopTab) => set({ shopTab }),
    setCurrentLookDescription: (currentLookDescription) => set({ currentLookDescription }),
}));
