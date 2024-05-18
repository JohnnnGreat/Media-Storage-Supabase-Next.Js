import { Loader } from "lucide-react";
import React from "react";

const Loading = () => {
	return (
		<div className="h-full flex items-center justify-center">
			<Loader className="animate-spin" size={60} strokeWidth={1.25} />
		</div>
	);
};

export default Loading;
