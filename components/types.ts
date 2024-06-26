import React from "react";

export type INav = {
	id: number;
	text: string;
	path: string;
	icon: React.ReactNode;
};

export type IFileDetails = {
	id: number;
	imageUrl: string;
	extenstion: string;
	fileName: string;
	description: string;
	category: string;
};

export type IUser = {
	email?: any;
};

export type ToastType = {
	title: string;
	description?: string;
	variant?: string;
};

export type IVerifyToken = {
	email: string;
	token: string;
};

export type INewFile = {
	postedBy?: string;
	fileUrl?: string;
	last_modified?: string;
	fileName?: string;
	type?: string;
	preview?: string;
	size?: Number;
	extension?: string;
};
