"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

type LoginFormInputs = {
  loginId: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    const result = await signIn("credentials", {
      redirect: false,
      loginId: data.loginId,
      password: data.password,
      callbackUrl: "/",
    });

    if (result?.ok) {
      window.location.href = result.url || "/";
    } else {
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="w-full max-w-[454px] bg-white p-8 rounded-xl shadow-md">
      <p className="text-[32px] font-bold mb-1 text-left">안녕하세요</p>
      <p className="text-[32px] font-bold mb-1 text-left">
        <span className="text-Primary_heavy">한다글다글</span>입니다.
      </p>
      <p className="text-[16px] text-gray_600 font-semibold mb-4 text-left">
        로그인을 통해 더 많은 기능을 이용하세요.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="아이디를 입력해주세요."
            {...register("loginId", { required: "아이디를 입력해주세요." })}
            className={`w-full h-12 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
              errors.loginId
                ? "border-error focus:ring-error"
                : "focus:ring-blue-400"
            }`}
          />
          {errors.loginId && (
            <p className="text-error text-sm mt-1">{errors.loginId.message}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요."
            {...register("password", { required: "비밀번호를 입력해주세요." })}
            className={`w-full h-12 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-error focus:ring-error"
                : "focus:ring-blue-400"
            }`}
          />
          {errors.password && (
            <p className="text-error text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full h-[59px] bg-black text-white text-[18px] py-2 mt-6 rounded-xl transition"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
