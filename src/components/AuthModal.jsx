import { useState } from "react";
import { X, Mail, User as UserIcon, Lock } from "lucide-react";
import { C } from "../lib/theme";
import { useApp } from "../context/AppContext";

export default function AuthModal() {
  const { authOpen, setAuthOpen, login } = useApp();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  if (!authOpen) return null;
  const close = () => setAuthOpen(false);

  const submit = (e) => {
    e.preventDefault();
    if (!email || !pw || (mode === "signup" && !name)) return;
    login(mode === "signup" ? name : email.split("@")[0], email);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" onClick={close}>
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} />
      <div className="relative w-full max-w-sm rounded-3xl p-7 animate-fadeUp" style={{ backgroundColor: C.card }} onClick={(e) => e.stopPropagation()}>
        <button onClick={close} className="absolute top-4 right-4"><X size={17} style={{ color: C.charcoal }} /></button>
        <span style={{ fontFamily: "Playfair Display", fontSize: "1.5rem", color: C.terracotta }}>Mitti-Desh</span>
        <h2 className="mt-2 mb-1" style={{ fontFamily: "Playfair Display", fontSize: "1.2rem", color: C.charcoal }}>
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-xs mb-6" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>
          {mode === "login" ? "Sign in to continue to checkout." : "Join the circle for artisan stories & offers."}
        </p>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-full" style={{ border: `1px solid ${C.line}` }}>
              <UserIcon size={15} style={{ color: C.charcoal, opacity: 0.5 }} />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="bg-transparent outline-none text-sm w-full" style={{ color: C.charcoal }} />
            </div>
          )}
          <div className="flex items-center gap-2 px-4 py-3 rounded-full" style={{ border: `1px solid ${C.line}` }}>
            <Mail size={15} style={{ color: C.charcoal, opacity: 0.5 }} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="bg-transparent outline-none text-sm w-full" style={{ color: C.charcoal }} />
          </div>
          <div className="flex items-center gap-2 px-4 py-3 rounded-full" style={{ border: `1px solid ${C.line}` }}>
            <Lock size={15} style={{ color: C.charcoal, opacity: 0.5 }} />
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Password" className="bg-transparent outline-none text-sm w-full" style={{ color: C.charcoal }} />
          </div>
          <button type="submit" className="w-full py-3 rounded-full text-white text-sm mt-2" style={{ backgroundColor: C.terracotta, fontFamily: "Manrope", fontWeight: 600 }}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button className="w-full mt-3 py-3 rounded-full text-sm flex items-center justify-center gap-2" style={{ border: `1px solid ${C.line}`, fontFamily: "Manrope", fontWeight: 600, color: C.charcoal }}
          onClick={() => login("Google User", "you@gmail.com")}>
          Continue with Google
        </button>

        <p className="text-xs text-center mt-5" style={{ fontFamily: "Inter", color: C.charcoal, opacity: 0.6 }}>
          {mode === "login" ? "New to Mitti-Desh?" : "Already have an account?"}{" "}
          <button onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ color: C.terracotta, fontWeight: 600 }}>
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
