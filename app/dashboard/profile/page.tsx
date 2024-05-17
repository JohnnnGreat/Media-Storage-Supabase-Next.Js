"use client";
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllUserUploadedFiles } from "@/utils/tanstack/tanstackQueries";
import { INewFile } from "@/components/types";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/shared";

const ProfilePage = () => {
	type IData = {
		data: INewFile[];
	};
	const { data, isPending } = useGetAllUserUploadedFiles();
	const userFiles = data as { data: any[] };
	return (
		<div className="h-[100vh]">
			ProfilePage

			<div className="overflow-y-auto h-full custom-scrollbar">
				<Table>
					<TableCaption>Loading Added Files, Please wait...</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px] text-[.9rem]">Image</TableHead>
							<TableHead className="w-[100px]">File Name</TableHead>
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
								<TableRow className="overflow-y-[scroll]">
									<TableCell className="font-medium">
										<img className="w-[50px] h-[50px] object-cover rounded-full" src={item?.url} alt="text" />
									</TableCell>
									<TableCell>{item?.file_name}</TableCell>
									<TableCell>{formatFileSize(item?.size)}</TableCell>
									<TableCell className="text-right">{item.created_at}</TableCell>
									<TableCell className="text-right">{item.type}</TableCell>
									<TableCell className="text-right">{item.extension}</TableCell>
									<TableCell className="text-right flex gap-[.9rem]">
										<Button className="bg-red-500 rounded-e-md text-white">Delete</Button>
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
