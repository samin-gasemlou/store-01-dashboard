import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../sections/auth/AuthCard";
import AuthInput from "../sections/auth/AuthInput";
import { api } from "../../lib/apiClient";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("employee");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setOk("");
    setLoading(true);

    try {
      const res = await api("/admin/auth/register", {
        method: "POST",
        body: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: pass,
          role: (role?.trim() || "employee").toLowerCase(),
        },
      });

      void res;

      setOk("هەژمار درووست کرا");
      setTimeout(() => nav("/login"), 400);
    } catch (e2) {
      setErr(e2?.message || "درووستکردنی هەژمار سەرکەوتوو نەبوو");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-white">
      <AuthCard title="درووستکردنی هەژمار">
        <form onSubmit={submit} className="space-y-5">
          <AuthInput
            placeholder="ناو"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <AuthInput
            placeholder="ئیمەیڵ"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthInput
            placeholder="وشەی نهێنی"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <AuthInput
            placeholder="ڕۆڵ (admin / employee)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          {err ? (
            <p className="text-red-600 text-[14px] text-center">{err}</p>
          ) : null}

          {ok ? (
            <p className="text-green-600 text-[14px] text-center">{ok}</p>
          ) : null}

          <button
            disabled={loading}
            type="submit"
            className="
              w-full
              mt-2
              bg-[#2B4168]
              text-white
              rounded-[14px]
              py-5
              text-[20px]
              disabled:opacity-60
            "
          >
            {loading ? "لە حال درووستکردن..." : "درووستکردنی هەژمار"}
          </button>

          <p className="text-center text-[18px] pt-2">
            پێشتر هەژمارت هەیە؟{" "}
            <Link to="/login" className="text-blue-600">
              بڕۆ بۆ چوونەژوورەوە
            </Link>
          </p>
        </form>
      </AuthCard>
    </section>
  );
}
