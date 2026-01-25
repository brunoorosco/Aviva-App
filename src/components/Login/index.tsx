import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoLlaranja from "@/public/logo-laranja.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { status, data: session } = useSession();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/app");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);
    if (res?.error) {
      setError("Email ou senha inválidos");
    } else {
      router.replace("/app");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, hsl(0 0% 4%) 0%, hsl(0 0% 8%) 50%, hsl(0 0% 4%) 100%)",
      }}
    >
      {/* Animated glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px] animate-glow-pulse" />
      <div
        className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[120px] animate-glow-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-400 hover:text-orange-500 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao início
        </Link>

        {/* Card */}
        <div
          className="backdrop-blur-xl rounded-2xl p-8"
          style={{
            backgroundColor: "hsl(0 0% 7% / 0.6)",
            border: "1px solid hsl(0 0% 18% / 0.5)",
            boxShadow: "0 0 80px hsl(24 95% 53% / 0.1)",
          }}
        >
          {/* Header */}
          <div className="items-center flex flex-col mb-8">
            <div className="mb-6 items-center">
              <Image
                src={logoLlaranja}
                alt="Logo"
                width={150} // Ajuste conforme necessário
                height={70}
                className="object-contain"
              />
            </div>
            <h1
              className="text-3xl font-bold mb-2 bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(45 93% 75%) 100%)",
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Bem-vindo de volta
            </h1>
            <p style={{ color: "hsl(0 0% 65%)" }}>Entre com suas credenciais para acessar</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: "hsl(0 0% 98%)" }}
              >
                E-mail
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "hsl(0 0% 65%)" }}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12"
                  style={{
                    backgroundColor: "hsl(0 0% 4% / 0.5)",
                    border: "1px solid hsl(0 0% 18% / 0.5)",
                    color: "hsl(0 0% 98%)",
                  }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
                style={{ color: "hsl(0 0% 98%)" }}
              >
                Senha
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: "hsl(0 0% 65%)" }}
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12"
                  style={{
                    backgroundColor: "hsl(0 0% 4% / 0.5)",
                    border: "1px solid hsl(0 0% 18% / 0.5)",
                    color: "hsl(0 0% 98%)",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "hsl(0 0% 65%)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(0 0% 98%)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(0 0% 65%)")}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <Link
                href="/esqueci-senha"
                className="text-sm transition-colors"
                style={{ color: "hsl(24 95% 53%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(24 95% 53% / 0.8)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(24 95% 53%)")}
              >
                Esqueceu a senha?
              </Link>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold transition-all duration-300 hover:scale-[1.02] disabled:opacity-70"
              style={{
                backgroundColor: "hsl(24 95% 53%)",
                color: "hsl(0 0% 100%)",
                boxShadow: "0 0 40px hsl(24 95% 53% / 0.3)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>

          {/* Register link */}
          {/* <p className="text-center text-muted-white mt-6">
            Não tem uma conta?{" "}
            <Link to="/cadastro" className="text-orange-500 hover:text-orange-500/80 transition-colors font-medium">
              Cadastre-se
            </Link>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
