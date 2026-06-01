'use client';

import { AuthProvider } from "@/src/features/auth/context/AuthContext";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  return (
    <AuthProvider>
      <Navbar />
    </AuthProvider>
  );
}