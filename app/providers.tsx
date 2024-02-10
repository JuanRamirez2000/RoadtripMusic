"use client";
import { SessionProvider } from "next-auth/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { themeChange } from "theme-change";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    themeChange(false);
  }, []);
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
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
