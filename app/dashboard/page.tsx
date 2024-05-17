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
import { LoaderCircle } from "lucide-react";

dayjs.extend(utc);
const DashboardHome = () => {
	const { data, isPending } = useGetAllUserUploadedFiles();
	const [openUpload, setOpenUpload] = useState(false);

	useEffect(() => {
		(async function () {
			const supabase = await createClient();

			const registeredUser = await supabase.auth.getUser();
			console.log(registeredUser);
		})();
	}, []);

	const [files, setFiles] = useState(data?.data);
	const downloadFile = async (fileUrl: string, fileName: string) => {
		try {
			const response = await fetch(fileUrl);
			const blob = await response.blob();
			saveAs(blob, fileName);
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};

	const formatFileSize = (size: unknown) => {
		const units = ["B", "KB", "MB", "GB", "TB"];
		let i = 0;
		while (size >= 1024 && i < units.length - 1) {
			size /= 1024;
			i++;
		}
		return `${size.toFixed(2)} ${units[i]}`;
	};

	const formatDate = (dateString: string) => {
		const date = dayjs(dateString).utc();
		return date.format("MMM D, YYYY - h:mm:ss A");
	};

	return (
		<div className="p-[1rem] w-full">
			<div className="h-[100px] w-full flex items-center">
				<Input type="text" placeholder="Enter a file name" className="w-[80%]" />

				<Button
					onClick={() => {
						setOpenUpload(true);
					}}
				>
					Upload a File
				</Button>
			</div>

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
							<div className="flex flex-wrap items-center justify-center gap-[1rem]">
								{data?.data?.map((file: { url: string; file_name: string; created_at: string }) => {
									return (
										<div className="w-[300px]  p-[.6rem] border border-[1px] border-gray-300 rounded-lg">
											<img src={file?.url} className="w-full h-[200px] object-cover rounded-md" />
											<h1 className="whitespace-nowrap overflow-hidden text-ellipsis text-[.9rem] text-gray-800 mt-[.8rem]">{file?.file_name}</h1>

											<div className="text-[.7rem] text-gray-500 flex mb-[.8rem] mt-[.6rem] gap-[.8rem] ">
												<p>{formatFileSize(file.size)}</p>
												<div className="w-[1px] h-[10px] bg-gray-300"></div>
												<p className="mr-2">{formatDate(file?.created_at)}</p>
											</div>

											<Button className="bg-blue-500 w-full py-[.8rem] rounded-md text-white" onClick={() => downloadFile(file.url, file.file_name)}>
												Download
											</Button>
										</div>
									);
								})}
							</div>
						</TabsContent>
						<TabsContent value="videos">This is videos section.</TabsContent>
					</Tabs>
				</div>
			)}
		</div>
	);
};

export default DashboardHome;
