import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { signInUserWithOtp } from "../supabase/supabaseRequest";
import { IUser } from "@/components/types";

export const useSignUpUser = () => {
	return useMutation({
		mutationFn: (data: IUser) => signInUserWithOtp(data)
	});
};
