// dashboard/src/components/pages/Login.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthCard from "../sections/auth/AuthCard";
import AuthInput from "../sections/auth/AuthInput";
import { api } from "../../api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const nav = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await api("/admin/auth/login", {
        method: "POST",
        body: {
          email: email.trim().toLowerCase(),
          password: pass,
        },
      });

      // ✅ ساپورت چند شکل مختلف پاسخ بک
      const payload = res?.data ?? res ?? {};
      const accessToken = payload?.accessToken;
      const refreshToken = payload?.refreshToken;
      const user = payload?.user || payload?.admin || {};

      if (!accessToken) {
        throw new Error("توکن از بک برنگشت (accessToken خالیه)");
      }

      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("adminUser", JSON.stringify(user || {}));

      const redirectTo = location.state?.from || "/";
      nav(redirectTo, { replace: true });
    } catch (e2) {
      setErr(e2?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-white">
      <AuthCard title="Sign in">
        <form onSubmit={submit} className="space-y-5">
          <AuthInput
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <AuthInput
            placeholder="Password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <div className="pt-2">
            <Link to="/forgot" className="text-blue-600 text-[18px]">
              Forget Password?
            </Link>
          </div>

          {err ? (
            <p className="text-red-600 text-[14px] text-center">{err}</p>
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
            {loading ? "Loading..." : "Sign in"}
          </button>

          <p className="text-center text-[18px] pt-2">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-blue-600">
              Go to Sign Up
            </Link>
          </p>
        </form>
      </AuthCard>
    </section>
  );
}
