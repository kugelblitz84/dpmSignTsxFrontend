declare module "react-vertical-timeline-component" {
	import * as React from "react";

	export interface VerticalTimelineProps {
		children?: React.ReactNode;
		className?: string;
		layout?: "1-column" | "2-columns";
		lineColor?: string;
	}

	export interface VerticalTimelineElementProps {
		children?: React.ReactNode;
		className?: string;
		contentStyle?: React.CSSProperties;
		contentArrowStyle?: React.CSSProperties;
		date?: string | React.ReactNode;
		dateClassName?: string;
		icon?: React.ReactNode;
		iconStyle?: React.CSSProperties;
		iconClassName?: string;
		position?: "left" | "right";
		visible?: boolean;
	}

	export class VerticalTimeline extends React.Component<VerticalTimelineProps> {}
	export class VerticalTimelineElement extends React.Component<VerticalTimelineElementProps> {}
}
