"use client";

import Link from "next/link";
import HeroImage from "./Homepage.jpg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCurrentSession } from "@/utils/supabase/supabaseRequest";

export default function Index() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	useEffect(() => {
		getCurrentSession().then((value: any) => {
			setIsAuthenticated(true);
		});
	}, []);
	return (
		<div className="p-[1rem] w-full md:h-screen ">
			<div className="absolute w-full top-[1rem] flex items-center justify-center">
				<div className="w-[70%] flex justify-between bg-[#ffffffb9] backdrop-blur-md rounded-full border left-0 p-[1rem] px-[3rem]">
					<h1>FileUp</h1>
					<nav>
						<ul className="flex gap-2 items-center">
							<li>
								<Link href="/">Home</Link>
							</li>
							{isAuthenticated && (
								<li>
									<Link href="/dashboard">Dashboard</Link>
								</li>
							)}
						</ul>
					</nav>
				</div>
			</div>
			<div className="max-w-full md:max-w-[1100px] mx-auto h-full">
				<div className="grid-hero h-full">
					<div className="flex items-center h-full  ">
						<div>
							<h1 className="text-[2rem] font-bold my-[.9rem]">
								Simple and Secure File Uploads
							</h1>
							<p className="text-gray-500 mb-[.9rem]">
								Easily upload files of any type and size to the cloud with our intuitive
								file uploader. Whether you need to share documents, images, videos, or
								other files, our platform provides a fast and secure way to transfer
								your data.
							</p>
							<div className="flex gap-[.9rem]">
								<Link
									href={"/register"}
									className="bg-blue-500 text-white py-[.8rem] px-[1.6rem] inline-block rounded-md"
								>
									Get Started
								</Link>
								{isAuthenticated && (
									<Link
										className="bg-black text-white py-[.8rem] px-[1.6rem] inline-block rounded-md"
										href="/dashboard"
									>
										Go to Dashboard
									</Link>
								)}
							</div>
						</div>
					</div>
					<div className="flex items-center justify-center">
						<Image src={HeroImage} alt="hero text" />
					</div>
				</div>
			</div>
		</div>
	);
}
