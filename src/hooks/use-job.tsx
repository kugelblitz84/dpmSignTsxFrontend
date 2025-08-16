import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useLocation } from "react-router-dom";
import { jobService } from "@/api";

export interface JobProps {
	jobId: number;
	title: string;
	content: string;
	jobLocation: string;
	applicationUrl: string;
	status: "open" | "closed";
	createdAt: Date;
	updatedAt: Date;
}

export interface JobContextProps {
	jobs: JobProps[];
	searchedJobs: JobProps[];
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	totalPages: number;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	searchLoading: boolean;
	setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
	error: string | null;
	fetchJobs: () => Promise<void>;
}

const JobContext = createContext<JobContextProps | null>(null);

const JobProvider = ({ children }: { children: React.ReactNode }) => {
	const [jobs, setJobs] = useState<JobProps[]>([]);
	const [searchedJobs, setSearchedJobs] = useState<JobProps[]>([]);
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const limit = 20;
	const [totalPages, setTotalPages] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [searchLoading, setSearchLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const location = useLocation();

	// Fetch jobs from the API
	const fetchJobs = async () => {
		if (loading) return;
		setLoading(true);
		setError(null);
		try {
			const response = await jobService.fetchAllJob("", page, limit);

			const updatedJobs = response.data.jobs.map((job: JobProps) => ({
				...job,
			}));

			setJobs(updatedJobs);
			setTotalPages(response.data.totalPages);
		} catch (err: any) {
			setError(err.message || "Failed to fetch jobs.");
		} finally {
			setLoading(false);
		}
	};

	// Fetch jobs from the API
	const fetchSearchedJobs = async () => {
		if (searchLoading) return;
		setSearchLoading(true);
		setError(null);
		try {
			const response = await jobService.fetchAllJob(searchTerm, page, limit);

			const updatedJobs = response.data.jobs.map((job: JobProps) => ({
				...job,
			}));

			setSearchedJobs(updatedJobs);
			setTotalPages(response.data.totalPages);
		} catch (err: any) {
			setError(err.message || "Failed to fetch jobs.");
		} finally {
			setSearchLoading(false);
		}
	};

	useEffect(() => {
		fetchJobs();
	}, [location, page]);

	useEffect(() => {
		fetchSearchedJobs();
	}, [location, searchTerm, page]);

	// Memoize the context value to prevent unnecessary re-renders
	const value = useMemo(
		() => ({
			jobs,
			searchedJobs,
			searchTerm,
			setSearchTerm,
			page,
			setPage,
			totalPages,
			loading,
			setLoading,
			searchLoading,
			setSearchLoading,
			error,
			fetchJobs,
		}),
		[jobs, searchedJobs, page, searchTerm, loading, searchLoading, error]
	);

	return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
};

export const useJobs = () => {
	const context = useContext(JobContext);
	if (!context) {
		throw new Error("useJobs must be used within a JobProvider");
	}
	return context;
};

export default JobProvider;
