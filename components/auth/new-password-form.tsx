"use client";
import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useState } from "react";
import { NewPasswordSchema } from "@/schemas/index";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login, LoginResponse } from "@/actions/login";
import { useTransition } from "react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { newPassword } from "@/actions/new-password";
import { useSearchParams } from "next/navigation";

type LoginError = LoginResponse extends { success: boolean; error: infer E }
  ? E
  : never;

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | undefined>("");
  const [errorMessage, setErrorMessage] = useState<LoginError | null>(null);
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setErrorMessage(null);
    setSuccess("");
    console.log(values);
    startTransition(async () => {
      const response = await newPassword(values, token);
      setSuccess(response.success);
      setErrorMessage(response.error);
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <FormError message={errorMessage} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Reset password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
