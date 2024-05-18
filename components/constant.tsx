import {
	CloudUpload,
	FolderArchive,
	Home,
	SearchIcon,
	User
} from "lucide-react";
import { IFileDetails, INav } from "./types";

export const NavConstant: INav[] = [
	{
		id: 1,
		text: "Home",
		path: "/dashboard",
		icon: <Home size={18} color="#4d4d4d" />
	},
	{
		id: 2,
		text: "Uploads",
		path: "/dashboard/uploads",
		icon: <CloudUpload size={18} color="#4d4d4d" />
	},

	{
		id: 3,
		text: "Archives",
		path: "/dashboard/archives",
		icon: <FolderArchive size={18} color="#4d4d4d" />
	},
	{
		id: 4,
		text: "Profile",
		path: "/dashboard/profile",
		icon: <User size={18} color="#4d4d4d" />
	},
	{
		id: 5,
		text: "Search",
		path: "/dashboard/search",
		icon: <SearchIcon size={18} color="#4d4d4d" />
	}
];

export const FildDetails: IFileDetails[] = [
	{
		id: 1,
		fileName: "Image Source",
		extenstion: "jpg",
		imageUrl: "http://",
		description: "",
		category: ""
	},
	{
		id: 2,
		fileName: "Image Source",
		extenstion: "jpg",
		imageUrl: "http://",
		description: "",
		category: ""
	},
	{
		id: 3,
		fileName: "Image Source",
		extenstion: "jpg",
		imageUrl: "http://",
		description: "",
		category: ""
	}
];
