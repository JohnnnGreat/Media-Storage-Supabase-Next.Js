"use client";
import SideNav from "@/components/SideNav/SideNav";
import { getCurrentSession } from "@/utils/supabase/supabaseRequest";
import React, { useEffect, useState } from "react";

const DashobardLayout = ({ children }: { children: React.ReactNode }) => {
	useEffect(() => {
		getCurrentSession().then((value: any) => {
			// if (!value) window.location.href = "/register";
		});
	}, []);
	return (
		<div className="bg-background text-foreground w-full h-screen overflow-hidden grid grid-tem-nav">
			<SideNav />
			<div className="overflow-scroll">{children}</div>
		</div>
	);
};

export default DashobardLayout;
