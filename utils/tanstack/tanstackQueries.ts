import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { createNewFiles, getAllUploadedFiles, signInUserWithOtp, verifyOtp } from "../supabase/supabaseRequest";
import { INewFile, IUser, IVerifyToken } from "@/components/types";

export const useSignUpUser = () => {
	return useMutation({
		mutationFn: (data: IUser) => signInUserWithOtp(data)
	});
};

export const useVerifyOtp = () => {
	return useMutation({
		mutationFn: (value: IVerifyToken) => verifyOtp(value)
	});
};

export const useGetAllUserUploadedFiles = () => {
	return useQuery({ queryKey: ["getUserFilesUploaded"], queryFn: getAllUploadedFiles });
};

export const useCreateNewFiles = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: INewFile) => createNewFiles(data),
		onSuccess: () => {
			console.log("success");
			queryClient.invalidateQueries({
				queryKey: ["getUserFilesUploaded"]
			});
		}
	});
};
