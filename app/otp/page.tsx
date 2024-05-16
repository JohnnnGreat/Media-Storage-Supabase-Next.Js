"use client";
import React, { useEffect } from "react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { customToastNotifier } from "@/utils/shared";

const Otp = () => {
	const [value, setValue] = React.useState("");
	const email = useSearchParams().get("email");
	const { toast } = useToast();
	const router = useRouter();

	const verifyOtp = async () => {
		try {
			const supabase = await createClient();
			if (!email) {
				console.error("Email is not available in the URL.");
				return;
			}

			const { data, error } = await supabase.auth.verifyOtp({ email, token: value, type: "email" });

			if (error) {
				setValue("");
				customToastNotifier(toast, { title: error?.message });
				return;
			}
			const addNewUser = await supabase.from("User").insert([{ email: email }]);
			router.push("/dashboard");
		} catch (error) {
			console.log(error);
		}

		// Create User in Database
	};

	return (
		<div className="h-screen w-full flex items-center justify-center">
			<div className="absolute top-0 w-[1200px] mx-auto flex justify-between items-center h-[80px]">
				<Link href="/" className="flex items-center justify-center gap-2 p-[.5rem] px-[.8rem] hover:bg-slate-100 transition-all rounded-md">
					<ArrowLeft size={16} />
					<p className="text-[.85rem]">Home</p>
				</Link>
				<Link href="/login" className="flex items-center justify-center gap-2 p-[.5rem] px-[.8rem] hover:bg-slate-100 transition-all rounded-md">
					<p className="text-[.85rem]">Login</p>
					<ArrowRight size={16} />
				</Link>
			</div>
			<div className="flex flex-col items-center">
				<h1 className="text-[1.8rem] font-bold my-[.5rem]"> We've sent you a code!</h1>
				<p className="text-gray-500 text-[.8rem] mb-[.5rem]">Open your email and copy-paste the code here.</p>
				<InputOTP onChange={(value: any) => setValue(value)} maxLength={6}>
					<InputOTPGroup>
						<InputOTPSlot index={0} className="h-[60px]" />
						<InputOTPSlot index={1} className="h-[60px]" />
						<InputOTPSlot index={2} className="h-[60px]" />
					</InputOTPGroup>
					<InputOTPSeparator />
					<InputOTPGroup>
						<InputOTPSlot index={3} className="h-[60px]" />
						<InputOTPSlot index={4} className="h-[60px]" />
						<InputOTPSlot index={5} className="h-[60px]" />
					</InputOTPGroup>
				</InputOTP>
				<Button disabled={value.length < 6 && true} className="bg-blue-500 w-full text-white mt-[.7rem]" onClick={verifyOtp}>
					Verify OTP
				</Button>
			</div>
		</div>
	);
};

export default Otp;
