import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { descriptionSchema } from "@/utils/schema/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { FolderUp, LucideSidebarClose, ShieldClose, SidebarClose, UploadCloud } from "lucide-react";
import { z } from "zod";
import { createClient } from "@/utils/supabase/client";
import * as tus from "tus-js-client";
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import Tus from "@uppy/tus";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

const Upload = () => {
	const form = useForm<z.infer<typeof descriptionSchema>>({
		resolver: zodResolver(descriptionSchema),
		defaultValues: {
			description: "",
			category: ""
		}
	});

	const [isDragOver, setIsDragOver] = useState(false);
	const fileInputRef = useRef(null);
	const [uploadResult, setUploadResult] = useState([]);

	const handleDragOver = (e) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = () => {
		setIsDragOver(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		setIsDragOver(false);
		handleFiles(e.dataTransfer.files);
	};

	const handleClick = () => {
		fileInputRef?.current.click();
	};

	const handleFileChange = (e) => {
		handleFiles(Array.from(e.target.files));
	};

	const [fileName, setFileName] = useState("");

	const [files, setFiles] = useState<File[]>([]);
	const [uploadProgress, setUploadProgress] = useState<{
		[key: string]: number;
	}>({});

	const handleFiles = (newFiles: File[]) => {
		setFiles((prevFiles) => [...prevFiles, ...newFiles]);
		newFiles.forEach((file) => {
			setUploadProgress((prevProgress) => ({
				...prevProgress,
				[file.name]: 0
			}));
		});
	};

	const [userData, setUserData] = useState({});
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

	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhdnJqaXV5aGdncGN6Ym16Y3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNjQ5NzMsImV4cCI6MjAzMDg0MDk3M30.TxDvlFDxy6ReMMUqe-IHQI5gAJ3ogi3EypE0wX-XGaw";
	const projectId = "iavrjiuyhggpczbmzczi";
	const bucketName = "files";
	const folderName = "Random";
	const supabaseUploadURL = `https://${projectId}.supabase.co/storage/v1/upload/resumable`;

	uppy.use(Tus, {
		endpoint: supabaseUploadURL,
		headers: {
			authorization: `Bearer ${token}`,
			apikey: token
		},
		uploadDataDuringCreation: true,
		chunkSize: 6 * 1024 * 1024,
		allowedMetaFields: ["bucketName", "objectName", "contentType", "cacheControl"]
	});

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
		try {
			console.log("Upload complete! We've uploaded these files:", result.successful);

			result.successful.map((file) => {
				console.log(file);
				const fileUrl = `https://${projectId}.supabase.co/storage/v1/object/public/files/${file?.meta?.objectName}`;
				const fileDetails = { ...file, url: fileUrl };

				setUploadResult([...uploadResult, fileDetails]);
			});
		} catch (error) {
			console.log(error);
		}
	});

	async function onSubmit(values: z.infer<typeof descriptionSchema>) {
		console.log(userData);
		const supabase = await createClient();
		try {
			console.log(uploadResult);
			const { successful } = uploadResult;
			console.log(uploadResult);
			uploadResult.map(async (file: any) => {
				const fileName = file?.name;
				const extension = file?.extension;
				const size = file?.size;
				const preview = file?.preview;
				const type = file?.data.type;
				const postedBy = userData?.email;
				const fileUrl = file?.url;
				const last_modified = file?.data.last_modified;

				console.log(fileUrl);
				const data = await supabase.from("Files").insert([{ posted_by: postedBy, url: fileUrl, last_modified: last_modified, file_name: fileName, type: type, preview: preview, size: size, extension: extension }]);

				console.log(data);
			});
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className="bg-[#00000073] backdrop-blur-sm flex items-center justify-center absolute top-0 left-0 h-screen w-full z-10">
			<div className="bg-white rounded-lg p-[1rem] flex  ">
				<LucideSidebarClose />

				<div className="w-full">
					<h1 className="text-[1rem] my-[.5rem]">Upload Files</h1>

					<div id="drop-area" className="rounded-lg p-[1rem] flex gap-[2rem] items-center w-full">
						{/* <div className="">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                className="w-[300px] h-[300px] border-2 border-dashed rounded-md border-gray-300 flex flex-col items-center justify-center"
              >
                <FolderUp size={100} color="#0f57ff" absoluteStrokeWidth />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  multiple
                />
                <div className="w-full">
                  {" "}
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between"
                    >
                      <p className="text-gray-600 text-sm truncate w-full pr-4">
                        {file.name}
                      </p>
                      <div className="w-[150px] bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${uploadProgress[file.name] || 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
						<Dashboard uppy={uppy} showProgressDetails={true}>
							Hello
						</Dashboard>
						<div>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[.8rem] w-[500px]">
									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Description</FormLabel>
												<FormControl>
													<Input className="w-full" placeholder="Description" {...field} />
												</FormControl>
												<FormMessage className="text-red-500" />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="category"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Category</FormLabel>
												<FormControl>
													<Input className="w-full" placeholder="Category" {...field} />
												</FormControl>
												<FormMessage className="text-red-500" />
											</FormItem>
										)}
									/>
									<Button className="bg-blue-500 text-center w-full text-white flex gap-[.7rem]" type="submit">
										<UploadCloud />
										Upload Image
									</Button>
								</form>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Upload;
