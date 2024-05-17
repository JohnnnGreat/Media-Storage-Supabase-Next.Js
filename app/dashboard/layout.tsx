"use client";
import SideNav from "@/components/SideNav/SideNav";
import { NavConstant } from "@/components/constant";
import { getCurrentSession } from "@/utils/supabase/supabaseRequest";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const DashobardLayout = ({ children }: { children: React.ReactNode }) => {
	const path = usePathname();
	useEffect(() => {
		getCurrentSession().then((value: any) => {
			// if (!value) window.location.href = "/register";
		});
	}, []);
	return (
		<div className="bg-background text-foreground w-full h-screen overflow-hidden grid grid-tem-nav">
			<SideNav />
			<div className="overflow-scroll">{children}</div>
			<footer className=" sm:hidden w-full p-[.8rem] absolute bottom-0 bg-white">
				<div className="w-full  mx-auto flex gap-[.9rem] justify-between">
					{NavConstant.map((item) => {
						const isActive = item.path === path;
						return (
							<Link className={`flex flex-col items-center justify-between gap-[.7rem] text-gray-500 p-[.8rem] rounded-md ${isActive ? "bg-blue-500 text-white" : ""}`} href={`${item.path}`} key={item.id}>
								{item.icon}
								<p className="text-[.8rem]">{item.text}</p>
							</Link>
						);
					})}
				</div>
			</footer>
		</div>
	);
};

export default DashobardLayout;
