"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/utils/schema/schema";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { toast, useToast } from "@/components/ui/use-toast";

import { Loader2 } from "lucide-react";
import { useSignUpUser } from "@/utils/tanstack/tanstackQueries";
import { customToastNotifier } from "@/utils/shared";
import { message } from "antd";

const Register: React.FC = () => {
	const router = useRouter();
	const { toast } = useToast();
	const { data, mutateAsync: signInUserWithOtp, isPending: isLoading, isError } = useSignUpUser();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: ""
		}
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const supabase = await createClient();
		try {
			const userIsSignedIn = await signInUserWithOtp(values);

			const { error } = await supabase.functions.invoke("sendWelcomeEmail", {
				body: JSON.stringify({ email: "johnossai20@gmail.com" })
			});

			if (userIsSignedIn) {
				customToastNotifier("message", "success", message, { title: "An Otp have been sentd to your email" });
				return router.push(`/otp?email=${values?.email}`);
			}
		} catch (error: any) {
			toast({ title: "An Error had Occured, Please try again" });
		}
	}

	return (
		<div className="w-full h-screen flex items-center justify-center">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[90%] md:w-[500px]">
					<h1 className="text-[1.8rem] font-bold my-[.5rem]">Login</h1>
					<p className="text-gray-500 font-normal m-[0!important]">Login to continue</p>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input className="w-full" placeholder="shadcn" {...field} />
								</FormControl>
								<FormMessage className="text-red-500" />
							</FormItem>
						)}
					/>
					<Button className="bg-blue-500 text-center w-full text-white mt-[.7rem!important]" type="submit" disabled={isLoading && true}>
						{isLoading ? (
							<div className="flex gap-2">
								<Loader2 className="mr-2 h-4 w-4 animate-spin" /> "Sending Otp"
							</div>
						) : (
							<>
								<>
									<Mail className="mr-2 h-4 w-4" /> Send me Login Code
								</>
							</>
						)}
					</Button>
					<p className="text-gray-500 font-normal text-[.8rem] text-center m-[.9rem!important]">or login with...!</p>
					<Button type="button" className="bg-black text-center w-full text-white mt-[.7rem!important]">
						{isLoading ? (
							<div>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" /> "Sending Otp"
							</div>
						) : (
							<>
								<>
									<Mail className="mr-2 h-4 w-4" /> Send me Login Code
								</>
							</>
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default Register;
