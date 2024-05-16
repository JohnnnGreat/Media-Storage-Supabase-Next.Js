"use client";
import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/client";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Upload from "@/components/UploadContainer/Upload";

export default function Index() {
	const [openUpload, setOpenUpload] = useState(false);
	useEffect(() => {
		(async function () {
			const supabase = await createClient();

			const registeredUser = await supabase.auth.getUser();
		})();
	}, []);
	const canInitSupabaseClient = () => {
		// This function is just for the interactive tutorial.
		// Feel free to remove it once you have Supabase connected.
		try {
			createClient();
			return true;
		} catch (e) {
			return false;
		}
	};

	const isSupabaseConnected = canInitSupabaseClient();
	console.log(isSupabaseConnected);

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

			{openUpload && <Upload />}
			<div>
				<Tabs defaultValue="All" className="w-[400px]">
					<TabsList>
						<TabsTrigger value="all">ALL</TabsTrigger>
						<TabsTrigger value="images">IMAGES</TabsTrigger>
						<TabsTrigger value="videos">VIDEOS</TabsTrigger>
						<TabsTrigger value="pdfs">PDFS</TabsTrigger>
						<TabsTrigger value="others">OTHERS</TabsTrigger>
					</TabsList>
					<TabsContent value="images">This is images section</TabsContent>
					<TabsContent value="videos">This is videos section.</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
