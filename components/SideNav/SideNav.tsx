"use client";
import React, { useEffect, useState } from "react";
import { NavConstant } from "../constant";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";

const SideNav = () => {
	const path = usePathname();
	const router = useRouter();
	const [userData, setUserData] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		(async function () {
			const supabase = await createClient();

			const {
				data: { user }
			} = await supabase.auth.getUser();

			console.log(user);
			if (user) {
				setIsAuthenticated(true);
			}
			setUserData(user);
		})();
	}, []);

	const handleLogout = async () => {
		try {
			const supabase = await createClient();

			const { error } = await supabase.auth.signOut();

			if (error) {
				console.log(error);
			}

			return router.push("/register");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<div className="hidden sm:block h-full border-r-1 border-gray-50 relative overflow-hidden">
				<div className="h-[100px] flex items-center p-[1rem] ">
					<h1>
						Upload <span className="text-blue-500">Master</span>
					</h1>
				</div>

				<div>
					<div className="max-w-[90%]   mx-auto flex flex-col gap-[.9rem]">
						{NavConstant.map((item) => {
							const isActive = item.path === path;
							return (
								<Link className={`flex items-center gap-[.7rem] text-gray-500 p-[.8rem] rounded-md ${isActive ? "bg-blue-500 text-white" : ""}`} href={`${item.path}`} key={item.id}>
									{item.icon}
									<p className="text-[.8rem]">{item.text}</p>
								</Link>
							);
						})}
					</div>
				</div>

				<div className="absolute outline-none bottom-[1rem] border p-[.6rem] bg-gray-50 rounded-lg text-[.8rem]">
					<DropdownMenu>
						<DropdownMenuTrigger>{userData?.email}</DropdownMenuTrigger>
						<DropdownMenuContent className="z-10">
							<DropdownMenuLabel>{userData?.email}</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<hr />
							<Button onClick={handleLogout}>Logout</Button>
							<Link href="/profile"></Link>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</>
	);
};

export default SideNav;
