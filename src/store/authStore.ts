import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeStorage } from "../utils/storage";

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

interface PendingSignup {
  name: string;
  email: string;
  mobile: string;
  otp: string;
}

interface PendingLogin {
  userId: string;
  otp: string;
}

interface AuthStore {
  users: User[];
  currentUserId: string | null;
  hasHydrated: boolean;
  pendingSignup: PendingSignup | null;
  pendingLogin: PendingLogin | null;
  currentUser: () => User | null;
  setHasHydrated: (value: boolean) => void;
  requestSignupOtp: (payload: Omit<PendingSignup, "otp">) => { success: boolean; message: string };
  verifySignupOtp: (otp: string) => { success: boolean; message: string };
  requestLoginOtp: (identifier: string) => { success: boolean; message: string };
  verifyLoginOtp: (otp: string) => { success: boolean; message: string };
  logout: () => void;
}

const DEFAULT_OTP = "123456";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,
      hasHydrated: false,
      pendingSignup: null,
      pendingLogin: null,
      currentUser: () => get().users.find((user) => user.id === get().currentUserId) ?? null,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      requestSignupOtp: ({ name, email, mobile }) => {
        const alreadyExists = get().users.some((user) => user.email === email || user.mobile === mobile);
        if (alreadyExists) return { success: false, message: "User already exists. Please login." };
        set({ pendingSignup: { name, email, mobile, otp: DEFAULT_OTP } });
        return { success: true, message: "Signup OTP sent. Use 123456 for demo." };
      },
      verifySignupOtp: (otp) => {
        const pending = get().pendingSignup;
        if (!pending) return { success: false, message: "Please request OTP first." };
        if (pending.otp !== otp) return { success: false, message: "Invalid OTP." };
        const user: User = {
          id: `U-${Date.now().toString().slice(-6)}`,
          name: pending.name,
          email: pending.email,
          mobile: pending.mobile,
        };
        set((state) => ({
          users: [...state.users, user],
          currentUserId: user.id,
          pendingSignup: null,
        }));
        return { success: true, message: "Signup successful." };
      },
      requestLoginOtp: (identifier) => {
        const user = get().users.find((item) => item.email === identifier || item.mobile === identifier);
        if (!user) return { success: false, message: "User not found. Please signup." };
        set({ pendingLogin: { userId: user.id, otp: DEFAULT_OTP } });
        return { success: true, message: "Login OTP sent. Use 123456 for demo." };
      },
      verifyLoginOtp: (otp) => {
        const pending = get().pendingLogin;
        if (!pending) return { success: false, message: "Please request login OTP first." };
        if (pending.otp !== otp) return { success: false, message: "Invalid OTP." };
        set({ currentUserId: pending.userId, pendingLogin: null });
        return { success: true, message: "Login successful." };
      },
      logout: () => set({ currentUserId: null, pendingLogin: null }),
    }),
    {
      name: "instant-cart-auth",
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        users: state.users,
        currentUserId: state.currentUserId,
      }),
    },
  ),
);
