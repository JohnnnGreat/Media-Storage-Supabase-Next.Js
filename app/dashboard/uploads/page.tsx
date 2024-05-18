"use client";
import React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Upload from "@/components/UploadContainer/Upload";
import { createClient } from "@/utils/supabase/client";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useGetAllUserUploadedFiles } from "@/utils/tanstack/tanstackQueries";
import { FileMinus, FileText, LoaderCircle } from "lucide-react";
import { customToastNotifier, formatFileSize } from "@/utils/shared";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { toast, useToast } from "@/components/ui/use-toast";
import { message } from "antd";

dayjs.extend(utc);

const DashboardHome = () => {
	const router = useRouter();

	const { data, isPending } = useGetAllUserUploadedFiles();
	const userFiles = data as { data: any[] };
	const [openUpload, setOpenUpload] = useState(false);

	const videos = userFiles?.data?.filter((item) => {
		return item.extension === "mp4";
	});

	const images = userFiles?.data?.filter((item) => {
		return item.extension === "jpg" || item.extension === "png";
	});

	const pdf = userFiles?.data?.filter((item) => {
		return item.extension === "pdf";
	});

	useEffect(() => {
		(async function () {
			const supabase = await createClient();

			const registeredUser = await supabase.auth.getUser();
			console.log(registeredUser);
		})();
	}, []);

	const downloadFile = async (fileUrl: string, fileName: string) => {
		try {
			const response = await fetch(fileUrl);
			const blob = await response.blob();
			saveAs(blob, fileName);
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	const formatDate = (dateString: string) => {
		const date = dayjs(dateString).utc();
		return date.format("MMM D, YYYY - h:mm:ss A");
	};

	const [searchInput, setSearchInput] = useState("");
	const handleSearchFile = async (e: any) => {
		const value = e.target.value;
		setSearchInput(value);

		// Handle auto complete
		try {
		} catch (error) {
			console.log(error);
		}
	};

	const handleSearchFunction = () => {
		if (!searchInput) {
			return customToastNotifier("message", "error", message, {
				title: "Input value cant be empty"
			});
		}
		return router.push(`/dashboard/search?query=${searchInput}`);
	};
	return (
		<>
			<Head>
				<title>Upload</title>
				<meta
					name="description"
					content="This is a client-side component with metadata"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="p-[1rem] w-full">
				<div className="h-[100px] w-full flex items-center gap-[1rem]">
					<Input
						type="text"
						placeholder="Enter a file name"
						className="w-[80%]"
						onChange={handleSearchFile}
					/>

					<Button className="border" onClick={handleSearchFunction}>
						Search
					</Button>
				</div>
				<Button
					className="text-blue bg-blue-500 text-white"
					onClick={() => {
						setOpenUpload(true);
					}}
				>
					Upload a File
				</Button>
				{openUpload && <Upload openUpload={setOpenUpload} />}
				{isPending ? (
					<div className="w-full h-full flex items-center justify-center">
						<LoaderCircle className=" h-[50px] w-[50px] animate-spin" />
					</div>
				) : (
					<div>
						<Tabs defaultValue="all" className="w-full">
							<TabsList>
								<TabsTrigger value="all">All</TabsTrigger>
								<TabsTrigger value="images">IMAGES</TabsTrigger>
								<TabsTrigger value="videos">VIDEOS</TabsTrigger>
								<TabsTrigger value="pdfs">PDFS</TabsTrigger>
								<TabsTrigger value="others">OTHERS</TabsTrigger>
							</TabsList>
							<TabsContent className="w-full" value="all">
								<div className="flex flex-wrap justify-center gap-[1rem]">
									{userFiles?.data?.map(
										(file: {
											size: number;
											url: string;
											file_name: string;
											created_at: string;
											extension: string;
										}) => {
											return (
												<div className="w-[300px]   p-[.6rem] border border-[1px] border-gray-300 rounded-lg">
													{file?.extension === "mp3" && (
														<audio controls className="w-full h-[200px]">
															<source src={file?.url} type="audio/mpeg" />
															Your browser does not support the audio element.
														</audio>
													)}
													{file?.extension === "mp4" && (
														<video className="w-full h-[200px]" controls>
															<source src={file?.url} type="video/mp4" />
															Your browser does not support the video tag.
														</video>
													)}

													{file?.extension === "jpg" ||
													file?.extension === "png" ||
													file?.extension === "jpeg" ? (
														<img
															src={file?.url}
															className="w-full h-[200px] object-cover rounded-md"
														/>
													) : null}

													{file?.extension === "doc" || file?.extension === "docx" ? (
														<div className="w-full flex items-center justify-center">
															<FileMinus color="blue" size={50} strokeWidth={1.25} />{" "}
														</div>
													) : null}

													{file?.extension === "pdf" ? (
														<div className="w-full flex items-center justify-center">
															<FileText color="red" size={50} strokeWidth={1.25} />
														</div>
													) : null}

													<h1 className="whitespace-nowrap overflow-hidden text-ellipsis text-[.9rem] text-gray-800 mt-[.8rem]">
														{file?.file_name}
													</h1>

													<div className="text-[.7rem] text-gray-500 flex mb-[.8rem] mt-[.6rem] gap-[.8rem] ">
														<p>{formatFileSize(file.size)}</p>
														<div className="w-[1px] h-[10px] bg-gray-300"></div>
														<p className="mr-2">{formatDate(file?.created_at)}</p>
													</div>

													<Button
														className="bg-blue-500 w-full py-[.8rem] rounded-md text-white"
														onClick={() => downloadFile(file.url, file.file_name)}
													>
														Download
													</Button>
												</div>
											);
										}
									)}
								</div>
							</TabsContent>
							<TabsContent value="videos">
								<div className="flex flex-wrap items-center gap-[1rem]">
									{videos.map(
										(file: {
											size: number;
											url: string;
											file_name: string;
											created_at: string;
											extension: string;
										}) => {
											return (
												<div className="w-[300px]  p-[.6rem] border  border-gray-300 rounded-lg">
													{file?.extension === "mp4" && (
														<video className="w-full h-[200px]" controls>
															<source src={file?.url} type="video/mp4" />
															Your browser does not support the video tag.
														</video>
													)}

													<h1 className="whitespace-nowrap overflow-hidden text-ellipsis text-[.9rem] text-gray-800 mt-[.8rem]">
														{file?.file_name}
													</h1>

													<div className="text-[.7rem] text-gray-500 flex mb-[.8rem] mt-[.6rem] gap-[.8rem] ">
														<p>{formatFileSize(file.size)}</p>
														<div className="w-[1px] h-[10px] bg-gray-300"></div>
														<p className="mr-2">{formatDate(file?.created_at)}</p>
													</div>

													<Button
														className="bg-blue-500 w-full py-[.8rem] rounded-md text-white"
														onClick={() => downloadFile(file.url, file.file_name)}
													>
														Download
													</Button>
												</div>
											);
										}
									)}
								</div>
							</TabsContent>
							<TabsContent value="images">
								<div className="flex flex-wrap items-center gap-[1rem]">
									{images.map(
										(file: {
											size: number;
											url: string;
											file_name: string;
											created_at: string;
											extension: string;
										}) => {
											return (
												<div className="w-[300px]  p-[.6rem] border border-[1px] border-gray-300 rounded-lg">
													<img
														src={file?.url}
														className="w-full h-[200px] object-cover rounded-md"
													/>

													<h1 className="whitespace-nowrap overflow-hidden text-ellipsis text-[.9rem] text-gray-800 mt-[.8rem]">
														{file?.file_name}
													</h1>

													<div className="text-[.7rem] text-gray-500 flex mb-[.8rem] mt-[.6rem] gap-[.8rem] ">
														<p>{formatFileSize(file.size)}</p>
														<div className="w-[1px] h-[10px] bg-gray-300"></div>
														<p className="mr-2">{formatDate(file?.created_at)}</p>
													</div>

													<Button
														className="bg-blue-500 w-full py-[.8rem] rounded-md text-white"
														onClick={() => downloadFile(file.url, file.file_name)}
													>
														Download
													</Button>
												</div>
											);
										}
									)}
								</div>
							</TabsContent>
						</Tabs>
					</div>
				)}
			</div>
		</>
	);
};

export default DashboardHome;
