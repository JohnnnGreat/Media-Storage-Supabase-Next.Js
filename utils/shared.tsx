import { ToastType } from "@/components/types";
import { ZodStringCheck } from "zod";

export const customToastNotifier = (toast: Function, { title, description, variant }: ToastType) => {
	return toast({ title: title, description: description, variant: variant });
};
