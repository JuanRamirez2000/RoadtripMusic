"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Wrapper } from "@googlemaps/react-wrapper";
import { env } from "env.mjs";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Wrapper apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS} libraries={["places"]}>
        <SessionProvider>{children}</SessionProvider>
      </Wrapper>
    </QueryClientProvider>
  );
}
