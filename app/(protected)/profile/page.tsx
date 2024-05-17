import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetAllUserUploadedFiles } from "@/utils/tanstack/tanstackQueries";
import { INewFile } from "@/components/types";

const ProfilePage = () => {
	type IData = {
		data: INewFile[];
	};
	const { data, isPending } = useGetAllUserUploadedFiles();
	const userFiles = data as { data: any[] };
	return (
		<div>
			ProfilePage
			<div>
				<Table>
					<TableCaption>A list of your recent invoices.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]">Invoice</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Method</TableHead>
							<TableHead className="text-right">Amount</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{userFiles?.data?.map((item: any) => {
							return (
								<TableRow>
									<TableCell className="font-medium">INV001</TableCell>
									<TableCell>Paid</TableCell>
									<TableCell>Credit Card</TableCell>
									<TableCell className="text-right">$250.00</TableCell>
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
