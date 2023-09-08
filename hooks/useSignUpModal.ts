import { create } from "zustand";

interface SignUpModalStore {
    isOpenSignUp: boolean;
    onOpenSignUp: () => void;
    onCloseSignUp: () => void;
}

const useSignUpModal = create<SignUpModalStore>((set) => ({
    isOpenSignUp: false,
    onOpenSignUp: () => set({ isOpenSignUp: true }),
    onCloseSignUp: () => set({ isOpenSignUp: false }),
}))

export default useSignUpModal;