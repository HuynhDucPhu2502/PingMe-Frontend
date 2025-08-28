import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoginForm from "./components/LoginForm.tsx";
import RegisterForm from "./components/RegisterForm.tsx";
import { useAppSelector } from "@/features/hooks";

export default function AuthPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const mode = params.get("mode");

  const { isLogin } = useAppSelector((state) => state.auth);

  const loginRef = useRef<HTMLDivElement | null>(null);
  const registerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mode !== "login" && mode !== "register") {
      navigate("/auth?mode=login");
    }
  }, [mode, navigate]);

  useEffect(() => {
    if (isLogin) {
      navigate("/home", { replace: true });
    }
  }, [isLogin, navigate]);

  useEffect(() => {
    if (mode === "login" && loginRef.current) {
      loginRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (mode === "register" && registerRef.current) {
      registerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mode]);

  return (
    <>
      {mode === "login" && (
        <div ref={loginRef}>
          <LoginForm />
        </div>
      )}
      {mode === "register" && (
        <div ref={registerRef}>
          <RegisterForm />
        </div>
      )}
    </>
  );
}
