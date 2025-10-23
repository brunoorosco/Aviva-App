import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import ButtonSubmit from "../ButtonSubmit";
import Image from "next/image";
import { Input } from "../ui/input";

type FormValues = {
  email: string;
  password: string;
};

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const router = useRouter();
  const { status, data: session } = useSession();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/app");
    }
  }, [status, router]);

  const onSubmit = handleSubmit(async ({ email, password }) => {
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
  });

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[#393E46]">
      <div className="w-full max-w-md bg-[#434a53] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col items-center">
          <Image src="/logo-preto.png" alt="Logo" width={260} height={200} className="mb-12" />

          {/* Login Social Google */}
          {/* <button
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center mb-4 px-4 py-2 text-sm font-medium text-[#DB4437] border border-gray-300 rounded-lg shadow hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 488 512" fill="currentColor">
              <path d="M488 261.8C488 403.3 391.1..." />
            </svg>
            Entrar com Google
          </button> */}

          <form onSubmit={onSubmit} className="w-full space-y-4">
            <div>
              <Input
                {...register("email", { required: "E-mail é obrigatório" })}
                type="email"
                placeholder="E-mail"
                className="text-base  bg-slate-300"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <Input
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
                type="password"
                placeholder="Senha"
                className="text-base  bg-slate-300"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>

            <ButtonSubmit text="Entrar" type="submit" loading={isLoading} />
          </form>

          {/* <p className="text-sm text-gray-500 mt-6">
            Ainda não tem conta?{' '}
            <a href="/sign-up" className="text-lime-400 hover:underline">
              Cadastre-se
            </a>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
