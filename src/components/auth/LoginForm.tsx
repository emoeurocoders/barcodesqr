"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field } from "./Field";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginUser, undefined);

  return (
    <form action={action} className="space-y-4">
      <Field
        name="email"
        label="Email"
        type="email"
        required
        autoComplete="email"
      />

      <Field
        name="password"
        label="Password"
        type="password"
        required
        autoComplete="current-password"
        action={
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        }
      />

      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger"
        >
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" fullWidth disabled={pending}>
        {pending ? "Signing in…" : "Log in"}
      </Button>

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
