"use client";
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteFiles, useGetAllUserUploadedFiles } from "@/utils/tanstack/tanstackQueries";
import { INewFile } from "@/components/types";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/shared";
import { createClient } from "@/utils/supabase/client";

const ProfilePage = () => {
	const { mutateAsync: deleteFileFromDb, isPending: isDeletingFile } = useDeleteFiles();
	type IData = {
		data: INewFile[];
	};
	const { data, isPending } = useGetAllUserUploadedFiles();

	const userFiles = data as { data: any[] };

	const deleteFile = async (fileId: string) => {
		try {
			const response = await deleteFile(fileId);
			console.log(response);
		} catch (error) {}
	};

	return (
		<div className="h-[100vh] p-[1rem]">
			<div className="h-[300] border-b-2"></div>

			<div className="overflow-y-auto h-full custom-scrollbar">
				<Table>
					<TableCaption>Loading Added Files, Please wait...</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[70px] text-[.9rem]">Image</TableHead>
							<TableHead className="w-[80px] overflow-hidden">File Name</TableHead>
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
								<TableRow className="overflow-y-[scroll] text-gray-500">
									<TableCell className="font-medium">
										<img className="w-[50px] h-[50px] object-cover rounded-full" src={item?.url} alt="text" />
									</TableCell>
									<TableCell className="text-[.8rem] w-[50px !important]">{item?.file_name}</TableCell>
									<TableCell>{formatFileSize(item?.size)}</TableCell>
									<TableCell className="text-right">{item.created_at}</TableCell>
									<TableCell className="text-right">{item.type}</TableCell>
									<TableCell className="text-right">{item.extension}</TableCell>
									<TableCell className="text-right flex gap-[.9rem]">
										<Button className="bg-red-500 rounded-e-md text-white" onClick={() => deleteFile(item.id)}>
											Delete
										</Button>
										<Button>View File</Button>
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
