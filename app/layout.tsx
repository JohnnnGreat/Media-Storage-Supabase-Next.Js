"use client";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SideNav from "@/components/SideNav/SideNav";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	useEffect(() => {
		(async function () {
			const supabase = await createClient();

			const {
				data: { user }
			} = await supabase.auth.getUser();

			if (user) {
				setIsAuthenticated(true);
			}
		})();
	}, []);
	return (
		<QueryClientProvider client={queryClient}>
			<html lang="en" className={GeistSans.className}>
				<body className={"bg-background text-foreground w-full h-screen overflow-hidden"}>
					<main className="min-h-screen flex flex-col items-center">{children}</main>
					<Toaster />
				</body>
			</html>
		</QueryClientProvider>
	);
}
