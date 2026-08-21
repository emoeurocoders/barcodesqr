import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { SlimFooter } from "@/components/layout/SlimFooter";

export const metadata: Metadata = {
  title: "Log in — BarcodesQR",
  description: "Log in to manage your QR codes and analytics.",
};

export default async function LoginPage() {
  if (await auth()) redirect("/dashboard");

  return (
    <>
      <AuthCard
        title="Welcome back"
        subtitle="Log in to manage your QR codes and analytics."
      >
        <LoginForm />
      </AuthCard>
      <SlimFooter />
    </>
  );
}
