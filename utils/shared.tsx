import { ToastType } from "@/components/types";
import { ZodStringCheck } from "zod";

export const customToastNotifier = (toast: Function, { title, description, variant }: ToastType) => {
	return toast({ title: title, description: description, variant: variant });
};

export const formatFileSize = (size: number) => {
	const units = ["B", "KB", "MB", "GB", "TB"];
	let i = 0;
	while (size >= 1024 && i < units.length - 1) {
		size /= 1024;
		i++;
	}
	return `${size.toFixed(2)} ${units[i]}`;
};
