"use client";
import { ThemeProvider } from "next-themes";
import { ToastContainer } from "react-toastify";
import { ClerkProvider } from "@clerk/nextjs";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute="class">
        <ClerkProvider>{children}</ClerkProvider>
      </ThemeProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}
