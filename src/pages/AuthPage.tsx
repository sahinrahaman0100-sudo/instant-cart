import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GlassCard } from "../components/ui";
import { useAuthStore } from "../store/authStore";

type Mode = "login" | "signup";

export default function AuthPage() {
  const navigate = useNavigate();
  const { requestSignupOtp, verifySignupOtp, requestLoginOtp, verifyLoginOtp } = useAuthStore();
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const [mode, setMode] = useState<Mode>("login");
  const [identifier, setIdentifier] = useState("");
  const [signupForm, setSignupForm] = useState({ name: "", email: "", mobile: "" });
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);

  useEffect(() => {
    if (currentUserId) {
      navigate("/profile", { replace: true });
    }
  }, [currentUserId, navigate]);

  const requestOtp = () => {
    if (mode === "signup") {
      if (!signupForm.name || !signupForm.email || !signupForm.mobile) {
        toast.error("Please fill name, email and mobile.");
        return;
      }
      const result = requestSignupOtp(signupForm);
      if (result.success) {
        setOtpRequested(true);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      return;
    }
    if (!identifier) {
      toast.error("Please enter email or mobile.");
      return;
    }
    const result = requestLoginOtp(identifier);
    if (result.success) {
      setOtpRequested(true);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const verifyOtp = () => {
    if (otp.length !== 6) {
      toast.error("Enter 6-digit OTP.");
      return;
    }
    const result = mode === "signup" ? verifySignupOtp(otp) : verifyLoginOtp(otp);
    if (result.success) {
      toast.success(result.message);
      navigate("/profile", { replace: true });
      return;
    }
    toast.error(result.message);
  };

  return (
    <GlassCard className="mx-auto max-w-xl space-y-4 p-6">
      <h2 className="text-2xl font-semibold">User Account</h2>
      <div className="flex gap-2">
        <button type="button" onClick={() => { setMode("login"); setOtpRequested(false); setOtp(""); }} className={`rounded-lg px-4 py-2 ${mode === "login" ? "bg-[#7C6FE9]" : "bg-white/10"}`}>
          Login
        </button>
        <button type="button" onClick={() => { setMode("signup"); setOtpRequested(false); setOtp(""); }} className={`rounded-lg px-4 py-2 ${mode === "signup" ? "bg-[#7C6FE9]" : "bg-white/10"}`}>
          Signup
        </button>
      </div>

      {!otpRequested && mode === "login" && (
        <input
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email or mobile number"
          className="w-full rounded-lg border border-white/20 bg-white/10 p-3 outline-none focus:border-[#7C6FE9]"
        />
      )}

      {!otpRequested && mode === "signup" && (
        <div className="space-y-3">
          <input value={signupForm.name} onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Full name" className="w-full rounded-lg border border-white/20 bg-white/10 p-3 outline-none focus:border-[#7C6FE9]" />
          <input value={signupForm.email} onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" className="w-full rounded-lg border border-white/20 bg-white/10 p-3 outline-none focus:border-[#7C6FE9]" />
          <input value={signupForm.mobile} onChange={(e) => setSignupForm((prev) => ({ ...prev, mobile: e.target.value }))} placeholder="Mobile number" className="w-full rounded-lg border border-white/20 bg-white/10 p-3 outline-none focus:border-[#7C6FE9]" />
        </div>
      )}

      {!otpRequested ? (
        <button type="button" onClick={requestOtp} className="w-full rounded-lg bg-[#7C6FE9] px-4 py-3 font-semibold">
          Send OTP
        </button>
      ) : (
        <div className="space-y-3">
          <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter 6-digit OTP" className="w-full rounded-lg border border-white/20 bg-white/10 p-3 outline-none focus:border-[#7C6FE9]" />
          <button type="button" onClick={verifyOtp} className="w-full rounded-lg bg-[#34D399] px-4 py-3 font-semibold text-slate-900">
            Verify OTP
          </button>
        </div>
      )}
    </GlassCard>
  );
}
