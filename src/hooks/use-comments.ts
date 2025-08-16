import { useState } from "react";

// Define the type for a tag
interface Tag {
	id: string;
	name: string;
}

// Define the type for a reply
interface Reply {
	id: string;
	author: string;
	avatar: string;
	content: string;
	votes: number;
	timestamp: string;
}

// Define the type for a comment
interface Comment {
	id: string;
	author: string;
	avatar: string;
	content: string;
	votes: number;
	timestamp: string;
	replies?: Reply[];
}

// Define the type for a question
interface Question {
	id: string;
	question: string;
	description: string;
	author: string;
	authorImg: string;
	time: string;
	tags: Tag[];
	comments: Comment[];
	views: string[];
}

// Sample questions data
const questionsData: Question[] = [
	{
		id: "q1",
		question: "How can I center a div in CSS?",
		description:
			"I'm trying to vertically and horizontally center a div using CSS. What is the best approach for modern browsers?",
		author: "John Doe",
		authorImg: "https://i.pravatar.cc/50",
		time: "2 hours ago",
		tags: [
			{ id: "t1", name: "CSS" },
			{ id: "t2", name: "HTML" },
		],
		comments: [
			{
				id: "c1",
				author: "Jane Smith",
				avatar: "https://i.pravatar.cc/50",
				content:
					"You can use flexbox. Add `display: flex; justify-content: center; align-items: center;` to the parent container.",
				votes: 10,
				timestamp: "a day ago",
			},
			{
				id: "c2",
				author: "Mike Johnson",
				avatar: "https://i.pravatar.cc/50",
				content:
					"Grid is another option. Use `display: grid; place-items: center;` on the parent container.",
				votes: 10,
				timestamp: "a day ago",
			},
		],
		views: ["u1", "u2", "u3"],
	},
	{
		id: "q2",
		question:
			"What is the difference between let, const, and var in JavaScript?",
		description:
			"I'm confused about when to use let, const, or var in JavaScript. Can someone explain the differences and provide examples?",
		author: "Alice Johnson",
		authorImg: "https://i.pravatar.cc/50",
		time: "5 hours ago",
		tags: [
			{ id: "t3", name: "JavaScript" },
			{ id: "t4", name: "Programming" },
		],
		comments: [
			{
				id: "c3",
				author: "Chris Evans",
				avatar: "https://i.pravatar.cc/50",
				content:
					"`const` is for variables that should not be reassigned, `let` is for variables scoped to a block, and `var` is function-scoped but outdated.",
				votes: 10,
				timestamp: "a day ago",
			},
			{
				id: "c4",
				author: "Sara Brown",
				avatar: "https://i.pravatar.cc/50",
				content:
					"Avoid using `var` in modern JavaScript. Stick to `let` and `const` for better scoping and safety.",
				votes: 10,
				timestamp: "a day ago",
			},
		],
		views: ["u4", "u5"],
	},
	// Add more questions as needed
];

// Sample question for fallback
const SAMPLE_QUESTION: Question = {
	id: "q1",
	question: "How can I center a div in CSS?",
	description:
		"I'm trying to vertically and horizontally center a div using CSS. What is the best approach for modern browsers?",
	author: "John Doe",
	authorImg: "https://i.pravatar.cc/50",
	time: "2 hours ago",
	tags: [
		{ id: "t1", name: "CSS" },
		{ id: "t2", name: "HTML" },
	],
	comments: [
		{
			id: "c1",
			author: "Jane Smith",
			avatar: "https://i.pravatar.cc/50",
			content:
				"You can use flexbox. Add `display: flex; justify-content: center; align-items: center;` to the parent container.",
			votes: 10,
			timestamp: "a day ago",
		},
		{
			id: "c2",
			author: "Mike Johnson",
			avatar: "https://i.pravatar.cc/50",
			content:
				"Grid is another option. Use `display: grid; place-items: center;` on the parent container.",
			votes: 10,
			timestamp: "a day ago",
		},
	],
	views: ["u1", "u2", "u3"],
};

// Define the return type for the useComments hook
interface UseCommentsReturn {
	comments: Comment[];
	addComment: (content: string) => void;
	addReply: (parentId: string, content: string) => void;
	updateVotes: (commentId: string, delta: number) => void;
}

const useComments = (id: string): UseCommentsReturn => {
	const currentQuestion =
		questionsData.find((question) => question.id === id) || SAMPLE_QUESTION;

	const [comments, setComments] = useState<Comment[]>(
		currentQuestion.comments
	);
	const [nextId, setNextId] = useState<string>("c4");

	const addComment = (content: string) => {
		const newComment: Comment = {
			id: nextId,
			author: "Current User",
			avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
			content,
			votes: 0,
			timestamp: "just now",
		};

		setComments([...comments, newComment]);
		setNextId(`c${parseInt(nextId.slice(1)) + 1}`);
	};

	const addReply = (parentId: string, content: string) => {
		const newReply: Reply = {
			id: nextId,
			author: "Current User",
			avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
			content,
			votes: 0,
			timestamp: "just now",
		};

		const updateComments = (comments: Comment[]): Comment[] => {
			return comments.map((comment) => {
				if (comment.id === parentId) {
					return {
						...comment,
						replies: [...(comment.replies || []), newReply],
					};
				}
				if (comment.replies) {
					return {
						...comment,
						replies: updateComments(comment.replies),
					};
				}
				return comment;
			});
		};

		setComments(updateComments(comments));
		setNextId(`c${parseInt(nextId.slice(1)) + 1}`);
	};

	const updateVotes = (commentId: string, delta: number) => {
		const updateVotesInComments = (comments: Comment[]): Comment[] => {
			return comments.map((comment) => {
				if (comment.id === commentId) {
					return {
						...comment,
						votes: comment.votes + delta,
					};
				}
				if (comment.replies) {
					return {
						...comment,
						replies: updateVotesInComments(comment.replies),
					};
				}
				return comment;
			});
		};

		setComments(updateVotesInComments(comments));
	};

	return {
		comments,
		addComment,
		addReply,
		updateVotes,
	};
};

export default useComments;
