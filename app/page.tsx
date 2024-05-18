"use client";

import Link from "next/link";
import HeroImage from "./Homepage.jpg";
import Image from "next/image";

export default function Index() {
	return (
		<div className="p-[1rem] w-full md:h-screen ">
			<div className="max-w-full md:max-w-[1100px] mx-auto h-full">
				<div className="grid-hero h-full">
					<div className="flex items-center h-full ">
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
							<Link
								href={"/register"}
								className="bg-blue-500 text-white py-[.8rem] px-[1.6rem] inline-block rounded-md"
							>
								Get Started
							</Link>
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
