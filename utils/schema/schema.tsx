import { z } from "zod";

export const formSchema = z.object({
	email: z.string().min(2).max(50)
});

export const descriptionSchema = z.object({
	description: z.string().min(2).max(50),
	category: z.string().min(2).max(50)
});
