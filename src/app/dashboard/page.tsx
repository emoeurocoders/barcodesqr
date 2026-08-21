import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { QrCode } from "lucide-react";

import { auth } from "@/auth";
import { logoutUser } from "@/app/actions/auth";
import { Header } from "@/components/layout/Header";
import { SlimFooter } from "@/components/layout/SlimFooter";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Dashboard — BarcodesQR",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const greeting = session.user.name || session.user.email;

  return (
    <>
      <Header user={session.user} />
      <main className="flex-1 bg-bg">
        <div className="container-page py-12 md:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-ink">
                Welcome{greeting ? `, ${greeting}` : ""}
              </h1>
              <p className="mt-2 text-muted">
                Your QR codes and analytics will appear here.
              </p>
            </div>

            <form action={logoutUser}>
              <Button type="submit" variant="outline">
                Log out
              </Button>
            </form>
          </div>

          <div className="mt-10 rounded-2xl border border-line bg-white p-10 text-center shadow-soft">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft text-primary">
              <QrCode className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-lg font-bold text-ink">
              No QR codes yet
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
              Saving codes to your account arrives with the next slice of work.
              For now, create one and download it straight away.
            </p>
            <Link className="mt-6 inline-block" href="/create">
              <Button size="lg">Create your first QR code</Button>
            </Link>
          </div>
        </div>
      </main>
      <SlimFooter />
    </>
  );
}
