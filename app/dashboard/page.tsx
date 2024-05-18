"use client";
import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
	Chart,
	DoughnutController,
	ArcElement,
	Title,
	Tooltip,
	Legend
} from "chart.js/auto";
import {
	useDeleteFiles,
	useGetAllUserUploadedFiles
} from "@/utils/tanstack/tanstackQueries";
import { Button } from "@/components/ui/button";
import { Space, Table, message } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Loader2 } from "lucide-react";
import { customToastNotifier } from "@/utils/shared";

Chart.register(DoughnutController, ArcElement, Title, Tooltip, Legend);

dayjs.extend(utc);

const Home = () => {
	const { data, isPending } = useGetAllUserUploadedFiles();
	const { mutateAsync: deleteFileFromDb, isPending: isDeletingFile } =
		useDeleteFiles();
	const [deletingFileId, setDeletingFileId] = useState("");
	const userFiles = data as { data: any[] };

	const images = userFiles?.data?.filter((item) => {
		return item.extension === "jpg" || item.extension === "png";
	});
	const pdf = userFiles?.data?.filter((item) => {
		return item.extension === "pdf";
	});

	const dataSetFiles = {
		labels: ["All", "Images", "PDF"],
		datasets: [
			{
				label: "Uploaded Files Statistics",
				data: [userFiles?.data?.length, images?.length, pdf?.length],
				backgroundColor: [
					"rgb(255, 99, 132)",
					"rgb(54, 162, 235)",
					"rgb(255, 205, 86)"
				],
				hoverOffset: 2
			}
		]
	};

	const dataSetArchives = {
		labels: ["All", "Images", "PDF"],
		datasets: [
			{
				label: "Uploaded Files Statistics",
				data: [userFiles?.data?.length, images?.length, pdf?.length],
				backgroundColor: [
					"rgb(255, 99, 132)",
					"rgb(54, 162, 235)",
					"rgb(255, 205, 86)"
				],
				hoverOffset: 2
			}
		]
	};

	const options = {
		plugins: {
			title: {
				display: true,
				text: "File Uploads"
			}
		},

		responsive: true,
		layout: {
			padding: {
				top: 20,
				bottom: 20
			}
		}
	};

	const handleDelete = async (record: any) => {
		setDeletingFileId(record.id);
		try {
			const response = await deleteFileFromDb(record.id);
			return customToastNotifier("message", "success", message, {
				title: "File Deleted"
			});
		} catch (error) {
			console.log(error);
		}
	};

	const columns = [
		{
			title: "File Name",
			dataIndex: "file_name"
		},
		{
			title: "Image Url",
			dataIndex: "image",
			render: (_: any, record: any) => {
				console.log(record);

				return (
					<img
						className="w-[50px] h-[50px] object-cover rounded-full"
						src={record.url}
						alt="Image Url"
					/>
				);
			}
		},
		{
			title: "Size",
			dataIndex: "size"
		},
		{
			title: "Date",
			dataIndex: "created_at",
			render: (_: any, record: any) => {
				const formatDate = (dateString: string) => {
					const date = dayjs(dateString).utc();
					return date.format("MMM D, YYYY - h:mm:ss A");
				};
				return <p>{formatDate(record.created_at)}</p>;
			}
		},
		{
			title: "Extension",
			dataIndex: "extension"
		},
		{
			title: "Action",
			key: "action",
			render: (_: any, record: any) => (
				<Space size="middle">
					<Button
						disabled={isDeletingFile && deletingFileId === record.id && true}
						className="bg-red-500 rounded-e-md text-white"
						onClick={() => {
							handleDelete(record);
						}}
					>
						{isDeletingFile && deletingFileId === record.id ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : (
							"Delete"
						)}
					</Button>
				</Space>
			)
		}
	];

	return (
		<div className="w-full p-[1rem]">
			<div style={{ width: "40%" }} className=" flex">
				<Doughnut
					className="w-[100px !important]"
					data={dataSetFiles}
					options={options}
				/>
				<Doughnut data={dataSetArchives} options={options} />
			</div>

			<div>
				Files Uploaded
				<div>
					<Table columns={columns} dataSource={userFiles?.data} />
				</div>
			</div>
		</div>
	);
};

export default Home;
