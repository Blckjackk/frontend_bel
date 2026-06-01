import type { Metadata } from "next";
import AuthForm from '@/src/features/auth/components/AuthForm';

export const metadata: Metadata = {
  title: "Login | OfficeHub",
  description: "Sign in to your OfficeHub account.",
};

export default function LoginPage() {
  return (
    <main className="bg-[#F7F7FD] min-h-screen">
      <AuthForm />
    </main>
  );
}