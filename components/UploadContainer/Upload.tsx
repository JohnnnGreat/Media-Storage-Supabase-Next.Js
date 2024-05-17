"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { descriptionSchema } from "@/utils/schema/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { X, LucideSidebarClose, ShieldClose, SidebarClose, UploadCloud, Loader2 } from "lucide-react";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import * as tus from "tus-js-client";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { TusConfigs } from "@/lib/tusConfigs";
import { useCreateNewFiles } from "@/utils/tanstack/tanstackQueries";
import { customToastNotifier } from "@/utils/shared";
import { useToast } from "../ui/use-toast";

const Upload = (props: any) => {
	const { openUpload } = props;
	const { toast } = useToast();
	const form = useForm<z.infer<typeof descriptionSchema>>({
		resolver: zodResolver(descriptionSchema),
		defaultValues: {
			description: "",
			category: ""
		}
	});

	const [isDragOver, setIsDragOver] = useState(false);
	const fileInputRef = useRef(null);
	const [uploadResult, setUploadResult] = useState<any>([]);

	const { mutateAsync: addNewFilesToDb, isPending: isLoading, isError } = useCreateNewFiles();

	const [userData, setUserData] = useState<any>({});
	useEffect(() => {
		(async function () {
			const supabase = await createClient();

			const {
				data: { user }
			} = await supabase.auth.getUser();

			setUserData(user);
		})();
	}, []);

	var uppy = new Uppy();

	// // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdnJqaXV5aGdncGN6Ym16Y3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNjQ5NzMsImV4cCI6MjAzMDg0MDk3M30.TxDvlFDxy6ReMMUqe-IHQI5gAJ3ogi3EypE0wX-XGaw";
	// const projectId = "iavrjiuyhggpczbmzczi";
	const bucketName = "files";
	const folderName = "Random";
	// const supabaseUploadURL = `https://${projectId}.supabase.co/storage/v1/upload/resumable`;

	uppy.use(Tus, TusConfigs);
	uppy.on("file-added", (file) => {
		const fileName = `${Date.now()}`;
		file.meta = {
			...file.meta,
			bucketName: bucketName,
			objectName: folderName ? `${folderName}/${fileName}` : fileName,
			contentType: file.type
		};
	});

	uppy.on("complete", (result: any) => {
		setUploadResult([]);
		try {
			console.log("Upload complete! We've uploaded these files:", result.successful);

			result.successful.map((file: any) => {
				const fileUrl = `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID as string}.supabase.co/storage/v1/object/public/files/${file?.meta?.objectName}`;
				const fileDetails = { ...file, url: fileUrl };
				setUploadResult([...uploadResult, fileDetails]);
			});
		} catch (error) {
			console.log(error);
		}
	});

	async function onSubmit() {
		try {
			const supabase = await createClient();
			uploadResult.map(async (file: any) => {
				const fileName = file?.name;
				const extension = file?.extension;
				const size = file?.size;
				const preview = file?.preview;
				const type = file?.data.type;
				const postedBy = userData?.email;
				const fileUrl = file?.url;
				const last_modified = file?.data.last_modified;

				const response = await addNewFilesToDb({
					fileName,
					extension,
					size,
					preview,
					type,
					postedBy,
					fileUrl,
					last_modified
				});
				if (response?.error) {
					customToastNotifier("message", "error", toast, {
						title: "Your file was uploaded, but could not be saved to the database",
						variant: "destructive"
					});
				}

				return openUpload(false);
			});
		} catch (error) {
			customToastNotifier("message", "error", toast, {
				title: "Oops, An unexpected Error had occured!!",
				variant: "destructive"
			});
		}
	}

	return (
		<div className="bg-[#00000073] backdrop-blur-sm flex items-center justify-center absolute top-0 left-0 h-screen w-full z-10">
			<div className="bg-white rounded-lg p-[1rem] flex  ">
				<X
					onClick={() => {
						openUpload(false);
					}}
				/>

				<div className="w-full">
					<h1 className="text-[1rem] my-[.5rem]">Upload Files</h1>

					<div id="drop-area" className="rounded-lg p-[1rem] flex gap-[2rem] items-center w-full">
						<Dashboard uppy={uppy} showProgressDetails={true} />

						<Button onClick={onSubmit} className="bg-blue-500 text-center w-full text-white flex gap-[.7rem]" type="submit">
							{isLoading ? (
								<div className="flex gap-2">
									<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait...
								</div>
							) : (
								<>
									<UploadCloud />
									Upload Image
								</>
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Upload;
