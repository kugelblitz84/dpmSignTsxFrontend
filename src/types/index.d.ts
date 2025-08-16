import { LucideIcon } from "lucide-react";

export interface ContactItem {
	icon: LucideIcon; // Type for the icon component
	title: string;
	to: string;
	target?: string;
}

export interface SocialLink {
	icon: LucideIcon; // Type for the icon component
	title: string;
	to: string;
	target?: string;
}
