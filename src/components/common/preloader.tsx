import { LoadingOverlay } from "@mantine/core";
import React from "react";

type VariantProps = "default" | "wave";

interface PreloaderProps {
	variant?: VariantProps;
}

const Preloader: React.FC<PreloaderProps> = ({ variant = "default" }) => {
	return (
		<div className="w-full h-screen overflow-hidden relative inset-0 flex items-center justify-center bg-white z-50">
			{/* <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-skyblue"></div> */}
			{variant === "default" ? (
				<LoadingOverlay
					visible={true}
					zIndex={50}
					overlayProps={{ radius: "sm", blur: 2 }}
				/>
			) : (
				<LoadingWave />
			)}
		</div>
	);
};

export const LoadingWave: React.FC = () => {
	return (
		<div className="w-full h-full absolute top-0 left-0 backdrop-blur-sm flex justify-center items-center z-[60]">
			<div className="w-[12px] h-[6px] mx-[5px] bg-skyblue rounded-[5px] animate-wave" />
			<div className="w-[12px] h-[6px] mx-[5px] bg-skyblue rounded-[5px] animate-wave animation-delay-100" />
			<div className="w-[12px] h-[6px] mx-[5px] bg-skyblue rounded-[5px] animate-wave animation-delay-200" />
			<div className="w-[12px] h-[6px] mx-[5px] bg-skyblue rounded-[5px] animate-wave animation-delay-300" />
		</div>
	);
};

export default Preloader;
