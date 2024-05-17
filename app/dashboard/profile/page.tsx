"use client";
import React, { useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteFiles, useGetAllUserUploadedFiles } from "@/utils/tanstack/tanstackQueries";
import { INewFile } from "@/components/types";
import { Button } from "@/components/ui/button";
import { customToastNotifier, formatFileSize } from "@/utils/shared";
import { createClient } from "@/utils/supabase/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Loader2 } from "lucide-react";
import { message } from "antd";

dayjs.extend(utc);
const ProfilePage = () => {
	const { mutateAsync: deleteFileFromDb, isPending: isDeletingFile } = useDeleteFiles();
	type IData = {
		data: INewFile[];
	};
	const { data, isPending } = useGetAllUserUploadedFiles();
	const [deletingFileId, setDeletingFileId] = useState("");

	const userFiles = data as { data: any[] };

	const deleteFile = async (fileId: string) => {
		setDeletingFileId(fileId);
		try {
			const response = await deleteFileFromDb(fileId);
			return customToastNotifier("message", "success", message, { title: "File Deleted" });
		} catch (error) {}
	};

	const formatDate = (dateString: string) => {
		const date = dayjs(dateString).utc();
		return date.format("MMM D, YYYY - h:mm:ss A");
	};
	return (
		<div className="h-[100vh] p-[1rem]">
			<div className="h-[100px] border-b-2">
				<h1 className="text-[3rem] font-semibold">My Profile</h1>
			</div>

			<div className="overflow-y-auto h-full r">
				<h1>Added Files</h1>
				<Table>
					<TableCaption>Loading Added Files, Please wait...</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[70px] text-[.9rem]">Image</TableHead>
							<TableHead className="w-[100px] overflow-hidden">File Name</TableHead>
							<TableHead>Size</TableHead>
							<TableHead>Date Created</TableHead>
							<TableHead>Type</TableHead>
							<TableHead className="text-right">Extension</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{userFiles?.data?.map((item: any) => {
							return (
								<TableRow className=" text-gray-500">
									<TableCell className="font-medium">
										<img className="w-[50px] h-[50px] object-cover rounded-full" src={item?.url} alt="text" />
									</TableCell>
									<TableCell className="text-[.7rem] w-[50px !important]">{item?.file_name}</TableCell>
									<TableCell>{formatFileSize(item?.size)}</TableCell>

									<TableCell className="text-right text-[.7rem]">{formatDate(item?.created_at)}</TableCell>
									<TableCell className="text-right text-[.7rem]">{item.type}</TableCell>
									<TableCell className="text-right text-[.7rem]">{item.extension}</TableCell>
									<TableCell className="text-right text-[.7rem] flex gap-[.9rem]">
										{isDeletingFile && deletingFileId === item.id ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
											</>
										) : (
											<Button className="bg-red-500 rounded-e-md text-white" onClick={() => deleteFile(item.id)}>
												Delete
											</Button>
										)}

										<Button className="border rounded-e-md text-gray text-[.9rem]">View File</Button>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};

export default ProfilePage;
