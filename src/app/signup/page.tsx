import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";
import { SlimFooter } from "@/components/layout/SlimFooter";

export const metadata: Metadata = {
  title: "Create your account — BarcodesQR",
  description: "Start creating dynamic, trackable QR codes in seconds.",
};

export default async function SignupPage() {
  if (await auth()) redirect("/dashboard");

  return (
    <>
      <AuthCard
        title="Create your account"
        subtitle="Start creating dynamic, trackable QR codes in seconds."
      >
        <SignupForm />
      </AuthCard>
      <SlimFooter />
    </>
  );
}
