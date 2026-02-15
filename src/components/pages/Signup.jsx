// dashboard/src/components/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../sections/auth/AuthCard";
import AuthInput from "../sections/auth/AuthInput";
import { api } from "../../api/client";

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

      // اگر بک پیام یا data داد، مشکلی نیست
      void res;

      setOk("User created");
      setTimeout(() => nav("/login"), 400);
    } catch (e2) {
      setErr(e2?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4 py-10 bg-white">
      <AuthCard title="Sign up">
        <form onSubmit={submit} className="space-y-5">
          <AuthInput
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <AuthInput
            placeholder="Role (admin / employee)"
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
            {loading ? "Loading..." : "Sign up"}
          </button>

          <p className="text-center text-[18px] pt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              Go to Login
            </Link>
          </p>
        </form>
      </AuthCard>
    </section>
  );
}
