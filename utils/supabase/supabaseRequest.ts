import { INewFile, IUser, IVerifyToken } from "@/components/types";
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

export const verifyOtp = async ({ email, token }: IVerifyToken) => {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase.auth.verifyOtp({ email, token: token, type: "email" });

		return { data, error };
	} catch (error) {
		return error;
	}
};

export const getAllUploadedFiles = async () => {
	try {
		const supabase = await createClient();
		const {
			data: { user }
		} = await supabase.auth.getUser();
		const { data, error } = await supabase.from("Files").select("*").eq("posted_by", user?.email);

		return { data, error };
	} catch (error) {
		return error;
	}
};

export const createNewFiles = async (values: INewFile) => {
	const { postedBy, fileUrl, fileName, extension, preview, last_modified, type, size } = values;
	try {
		const supabase = await createClient();
		const addNewUser = await supabase.from("Files").insert([
			{
				posted_by: postedBy,
				url: fileUrl,
				last_modified: last_modified,
				file_name: fileName,
				type: type,
				preview: preview,
				size: size,
				extension: extension
			}
		]);

		return addNewUser;
	} catch (error) {
		console.log(error);
	}
};
