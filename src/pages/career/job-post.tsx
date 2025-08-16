import MarkdownPreview from "@/components/markdown-preview";
import SectionHeading from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JobProps, useJobs } from "@/hooks/use-job";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";

const JobPost: React.FC = () => {
	const { jobs, loading } = useJobs();
	const [selectedFilter, setSelectedFilter] = useState("all");
	const filters = ["all", "open", "closed"];
	const [filteredJobs, setFilteredJobs] = useState<JobProps[]>(jobs);

	useEffect(() => {
		if (selectedFilter === "all") {
			setFilteredJobs(jobs);
			return;
		}

		setFilteredJobs(jobs.filter((job) => job.status === selectedFilter));
	}, [selectedFilter, jobs]);

	if (jobs.length === 0) return null;

	return (
		<section className="py-10">
			<SectionHeading title="Open Positions" />

			<div className="row py-5">
				<div className="w-full flex items-center justify-center gap-2 flex-wrap">
					{filters.map((filter, index) => (
						<Button
							onClick={(e) => {
								setSelectedFilter(e.currentTarget.dataset.id as any);
							}}
							key={index}
							variant={selectedFilter === filter ? "default" : "outline"}
							size="sm"
							data-id={filter}
						>
							{filter}
						</Button>
					))}
				</div>
			</div>

			<div className="row py-5 grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
				{loading &&
					Array.from({ length: 3 }).map((_, index) => (
						<Card
							key={index}
							className="w-full bg-slate-100/40 backdrop-blur-lg shadow-sm border-gray/50"
						>
							<CardHeader>
								<div className="flex items-center justify-between">
									<Skeleton className="h-6 w-40 rounded-md" />
									<div className="flex items-center gap-2">
										<Skeleton className="h-4 w-4 rounded-md" />
										<Skeleton className="h-4 w-20 rounded-md" />
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Skeleton className="h-4 w-40 mb-2 rounded-md" />
									<ul className="pl-5 space-y-1">
										{Array.from({ length: 3 }).map((_, i) => (
											<li key={i}>
												<Skeleton className="h-3 w-full rounded" />
											</li>
										))}
									</ul>
								</div>
								<div>
									<Skeleton className="h-4 w-36 mb-2 rounded-md" />
									<ul className="pl-5 space-y-1">
										{Array.from({ length: 3 }).map((_, i) => (
											<li key={i}>
												<Skeleton className="h-3 w-full rounded" />
											</li>
										))}
									</ul>
								</div>
								<Skeleton className="h-8 w-24 rounded-md" />
							</CardContent>
						</Card>
					))}

				{!loading &&
					filteredJobs.map((job, index) => {
						return (
							<Card
								key={index}
								className="w-full bg-slate-100/40 backdrop-blur-lg shadow-sm border-gray/50"
							>
								<CardHeader>
									<div className="flex items-start justify-between">
										<CardTitle className="text-2xl">{job.title}</CardTitle>
										<div className="flex flex-col items-end gap-2">
											<div className="flex items-center gap-2">
												<MapPin className="h-4 w-4" />
												<span className="text-sm">{job.jobLocation}</span>
											</div>
											<Badge
												variant={
													job.status === "open" ? "success" : "destructive"
												}
												size="sm"
											>
												{job.status}
											</Badge>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<MarkdownPreview
											key={job.jobId.toString()}
											content={job.content}
										/>

										<a
											href={job.applicationUrl}
											target="_blank"
											rel="noopener noreferrer"
											className={cn(
												"block",
												job.status === "closed" && "pointer-events-none"
											)}
										>
											<Button
												size="sm"
												variant="success"
												disabled={job.status === "closed"}
											>
												Apply Now
											</Button>
										</a>
									</div>
								</CardContent>
							</Card>
						);
					})}
			</div>
			{!loading && filteredJobs.length === 0 && (
				<div className="w-full text-center">
					<h3 className="text-gray">No Jobs Found</h3>
				</div>
			)}
		</section>
	);
};

export default JobPost;
