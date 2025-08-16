import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error, errorInfo: null };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
		console.error("Error caught by ErrorBoundary:", error, errorInfo);
		this.setState({ error, errorInfo });
	}

	render(): ReactNode {
		if (this.state.hasError) {
			return (
				<div className="p-4 bg-red-100 border border-red-400 text-red-700">
					<h1 className="text-xl font-bold">Something went wrong.</h1>
					<p className="mt-2">{this.state.error?.toString()}</p>
					<details className="mt-4">
						<summary>Error Details</summary>
						<pre className="whitespace-pre-wrap">
							{this.state.errorInfo?.componentStack}
						</pre>
					</details>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
