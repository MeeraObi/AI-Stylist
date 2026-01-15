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

    setUserBlob: (userBlob) => set({ userBlob }),
    setUserInfo: (info) => set((state) => ({ userInfo: { ...state.userInfo, ...info } })),
    setPreliminaryResults: (preliminaryResults) => set({ preliminaryResults }),
    setComprehensiveResults: (comprehensiveResults) => set({ comprehensiveResults }),
    setQuizSelections: (quizSelections) => set({ quizSelections }),
    setScreen: (currentScreen) => set({ currentScreen }),
    setLoading: (isLoading, loadingMessage = 'Processing...') => set({ isLoading, loadingMessage }),
}));
