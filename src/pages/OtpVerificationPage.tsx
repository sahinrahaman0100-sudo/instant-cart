import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { GlassCard } from "../components/ui";
import { useI18n } from "../hooks/useI18n";
import { apiService } from "../services/api";

export default function OtpVerificationPage() {
  const { orderRef = "" } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(30);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const onChange = (value: string, idx: number) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[idx] = value;
    setOtp(next);
    if (value && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const verify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return toast.error("Enter 6-digit OTP.");
    const res = await apiService.verifyOrder(orderRef, code);
    if (res.verified) {
      toast.success("Order verified");
      navigate(`/track/${orderRef}`);
      return;
    }
    toast.error("Invalid OTP");
  };

  const resend = async () => {
    await apiService.resendOtp(orderRef);
    toast.success("OTP resent");
    setCooldown(30);
  };

  return (
    <GlassCard className="mx-auto max-w-lg space-y-4 p-6 text-center">
      <h2 className="text-xl font-semibold">{t.verifyOtp}</h2>
      <div className="flex justify-center gap-2">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputsRef.current[idx] = el;
            }}
            maxLength={1}
            value={digit}
            onChange={(e) => onChange(e.target.value, idx)}
            className="h-12 w-10 rounded-lg border border-white/20 bg-white/10 text-center text-lg outline-none focus:border-[#7C6FE9]"
          />
        ))}
      </div>
      <button className="w-full rounded-lg bg-[#34D399] px-4 py-3 font-semibold text-slate-900" onClick={verify} type="button">
        {t.verifyOtp}
      </button>
      <button disabled={cooldown > 0} className="text-sm text-slate-300 disabled:opacity-60" onClick={resend} type="button">
        {t.resendOtp} {cooldown > 0 ? `(${cooldown}s)` : ""}
      </button>
    </GlassCard>
  );
}
