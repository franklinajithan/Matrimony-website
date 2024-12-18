import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import signIn from "../utils/auth";
import InputField from "../components/elements/InputField";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setGeneralError("");
    setIsLoading(true);
    try {
      const user = await signIn(data.email, data.password);
      console.log("User signed in:", user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (error: any) {
      setGeneralError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 px-4">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-white p-6 md:p-8 rounded-lg shadow-lg"
        aria-labelledby="login-form-title"
      >
        <h1 id="login-form-title" className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome to Matrimony!
        </h1>

        {/* Email Field */}
        <div className="mb-4">
          <InputField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
          />
        </div>

        {/* Password Field */}
        <div className="mb-6">
          <InputField
            control={form.control}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-70"
          aria-busy={isLoading}
          aria-live="polite"
        >
          {isLoading ? (
            <span className="flex items-center justify-center space-x-2">
              <Loader2 size={20} className="animate-spin" />
              <span>Logging in...</span>
            </span>
          ) : (
            "Login"
          )}
        </button>

        {/* General Error */}
        {generalError && (
          <p className="text-red-500 text-sm text-center mt-4">{generalError}</p>
        )}

        {/* Sign Up Link */}
        <p className="text-sm text-gray-600 text-center mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-600 hover:underline"
            aria-label="Sign up for an account"
          >
            Sign Up
          </a>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;
