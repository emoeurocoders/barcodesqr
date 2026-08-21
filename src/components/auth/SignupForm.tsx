"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field } from "./Field";

export function SignupForm() {
  const [state, action, pending] = useActionState(registerUser, undefined);

  return (
    <form action={action} className="space-y-4">
      <Field name="name" label="Name" autoComplete="name" />

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
        autoComplete="new-password"
      />

      <p className="text-xs text-muted">Use at least 8 characters.</p>

      {state?.error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger"
        >
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" fullWidth disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
