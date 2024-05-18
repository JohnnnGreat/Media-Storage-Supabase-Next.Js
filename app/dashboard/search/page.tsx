"use client";
import { Input } from "@/components/ui/input";
import { customToastNotifier, formatFileSize } from "@/utils/shared";
import { useGetAllUserUploadedFiles } from "@/utils/tanstack/tanstackQueries";
import { message } from "antd";
import dayjs from "dayjs";
import { FileMinus, FileText } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import utc from "dayjs/plugin/utc";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";

dayjs.extend(utc);
const SearchPage = () => {
	const query = useSearchParams().get("query");
	console.log(query);
	const { data, isPending } = useGetAllUserUploadedFiles();
	const userFiles = data as { data: any[] };

	const [searchData, setSearchData] = useState<any>([]);

	// Return files bases search query
	const response = userFiles?.data?.filter((item): any[] => {
		const res = item?.file_name?.toLowerCase().includes(query?.toLowerCase());
		return res;
	});

	const [searchInput, setSearchInput] = useState("");
	const handleSearchFile = async (e: any) => {
		// Handle auto complete
		try {
			const value = e.target.value;
			setSearchInput(value);
		} catch (error) {
			console.log(error);
		}
	};

	// Utility Functions
	const formatDate = (dateString: string) => {
		const date = dayjs(dateString).utc();
		return date.format("MMM D, YYYY - h:mm:ss A");
	};

	const downloadFile = async (fileUrl: string, fileName: string) => {
		try {
			const response = await fetch(fileUrl);
			const blob = await response.blob();
			saveAs(blob, fileName);
		} catch (error) {
			console.error("Error downloading file:", error);
		}
	};
	const handleSearchFunction = () => {
		if (!searchInput) {
			return customToastNotifier("message", "error", message, {
				title: "Input value cant be empty"
			});
		}
	};
	return (
		<div className="p-[1rem]">
			<div className="border-b py-[2rem]">
				<h1 className="font-bold py-[.5rem]">Search</h1>
				<Input
					type="text"
					placeholder="Enter a file name"
					className="w-[50%]"
					onChange={() => {
						handleSearchFile;
					}}
				/>
				<Button
					className="text-blue bg-blue-500 text-white mt-[.8rem]"
					onClick={() => {
						handleSearchFunction();
					}}
				>
					Search
				</Button>
			</div>

			<div className="flex flex-wrap justify-center gap-[1rem] p-[3rem]">
				{response?.map(
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
									className="bg-blue-500 w-full py-[.8rem] rounded-md text-white hover:bg-blue-300"
									onClick={() => downloadFile(file.url, file.file_name)}
								>
									Download
								</Button>
							</div>
						);
					}
				)}
			</div>
		</div>
	);
};

export default SearchPage;
