import { IUser } from "@/components/types";
import { createClient } from "./client";

export const getCurrentSession = async () => {
	try {
		const supabase = await createClient();
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (user) {
			return true;
		}

		return false;
	} catch (error) {
		return error;
	}
};

export const signInUserWithOtp = async (user: IUser) => {
	try {
		const supabase = await createClient();

		const { data, error } = await supabase.auth.signInWithOtp({
			email: user.email
		});
		console.log(data);
		if (error) {
			throw Error(error?.message);
			return;
		}
		return true;
	} catch (error: any) {
		return error?.message;
	}
};

export const verifyOtp = async () => {
	try {
		const supabase = await createClient();
	} catch (error) {}
};
