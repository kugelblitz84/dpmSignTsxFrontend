import ReactMarkdown from "react-markdown";

// Props for MarkdownPreview component
interface MarkdownPreviewProps {
	content: string;
}

const MarkdownPreview = ({ content }: MarkdownPreviewProps) => {
	return (
		<div className="max-w-none text-base font-medium font-para">
			<ReactMarkdown>{content}</ReactMarkdown>
		</div>
	);
};

export default MarkdownPreview;
