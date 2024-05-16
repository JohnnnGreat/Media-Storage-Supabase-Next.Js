import Link from "next/link";
import React from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";

const TopBarNav: React.FC = () => {
	return (
		<div className="absolute top-0 w-full md:w-[1200px] mx-auto flex justify-between items-center h-[80px]">
			<Link href="/register" className="flex items-center justify-center gap-2 p-[.5rem] px-[.8rem] hover:bg-slate-100 transition-all rounded-md">
				<ArrowLeft size={16} />
				<p className="text-[.85rem]">Home</p>
			</Link>
			<Link href="/login" className="flex items-center justify-center gap-2 p-[.5rem] px-[.8rem] hover:bg-slate-100 transition-all rounded-md">
				<p className="text-[.85rem]">Login</p>
				<ArrowRight size={16} />
			</Link>
		</div>
	);
};

export default TopBarNav;
