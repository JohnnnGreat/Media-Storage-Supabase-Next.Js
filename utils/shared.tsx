import { ToastType } from "@/components/types";
import { ZodStringCheck } from "zod";

export const customToastNotifier = (type: string, value: string, trigger: any, { title, description, variant }: ToastType) => {
	if (type === "message") {
		if (value === "success") {
			return trigger.success(title);
		} else {
			return trigger.error(title);
		}
	} else if (type === "toast") {
		return trigger({ title: title, description: description, variant: variant });
	}

	return;
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
