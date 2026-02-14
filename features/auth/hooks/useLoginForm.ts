"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/AuthProvider";
import { loginFormSchema, LoginFormData } from "../schemas/loginFormSchema";
import { AUTH_MESSAGES } from "../lib/messages";
import { extractApiError } from "../lib/error";

export const useLoginForm = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const clearRootError = () => {
    if (form.formState.errors.root) {
      form.clearErrors("root");
    }
  };

  const onSubmit = async (values: LoginFormData) => {
    try {
      await login(values);

      toast.success(AUTH_MESSAGES.LOGIN_SUCCESS);

      router.refresh();
    } catch (error: any) {
      const { message, issues } = extractApiError(error);

      toast.error(AUTH_MESSAGES.LOGIN_ERROR, {
        description: message,
      });

      // 🔥 Handle field errors
      issues.forEach((issue) => {
        form.setError(issue.path as any, {
          message: issue.message,
        });
      });

      // Optional: fallback root error
      if (issues.length === 0) {
        form.setError("root", { message });
      }
    }
  };

  return {
    form,
    passwordVisible,
    togglePasswordVisibility: () => setPasswordVisible((prev) => !prev),
    onSubmit: form.handleSubmit(onSubmit),
    clearRootError,
  };
};
