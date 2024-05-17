export const TusConfigs = {
	endpoint: process.env.NEXT_PUBLIC_SUPABASE_UPLOAD_URL,
	headers: {
		authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
		apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
	},
	uploadDataDuringCreation: true,
	chunkSize: 6 * 1024 * 1024,
	allowedMetaFields: ["bucketName", "objectName", "contentType", "cacheControl"]
};
