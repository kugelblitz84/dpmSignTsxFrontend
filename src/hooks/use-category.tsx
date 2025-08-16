import { categoryService } from "@/api";
import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useLocation } from "react-router-dom";

export interface CategoryProps {
	categoryId: number;
	name: string;
	slug: string;
	parentCategoryId: number | null;
	parentCategory: CategoryProps | null;
	subCategories: CategoryProps[];
	products: [];
	createdAt: Date;
	updatedAt: Date;
}

export interface CategoryContextProps {
	categories: CategoryProps[];
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
	totalPages: number;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	error: string | null;
	fetchCategory: () => Promise<void>;
	fetchAllCategories: () => Promise<void>;
	fetchCategoryById: (categoryId: number) => Promise<CategoryProps | null>;
}

const CategoryContext = createContext<CategoryContextProps | null>(null);

const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
	const [categories, setCategories] = useState<CategoryProps[]>([]);
	const [fetchedCategories, setFetchedCategories] = useState<
		Map<number, CategoryProps>
	>(new Map());

	const [searchTerm, setSearchTerm] = useState<string>("");
	const [page, setPage] = useState<number>(1);
	const limit = 20;
	const [totalPages, setTotalPages] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const location = useLocation();

	// Fetch category from the API
	const fetchCategory = async () => {
		if (loading) return;
		setLoading(true);
		setError(null);
		try {
			const response = await categoryService.fetchAllCategory(
				searchTerm,
				page,
				limit
			);

			setCategories(response.data.categories);
			setTotalPages(response.data.totalPages);
		} catch (err: any) {
			setError(err.message || "Failed to fetch categories.");
		} finally {
			setLoading(false);
		}
	};

	const fetchAllCategories = async () => {
		if (loading) return;
		setLoading(true);
		setError(null);
		let allCategories: CategoryProps[] = [];
		let currentPage = 1;
		let totalPages = 1;

		try {
			while (currentPage <= totalPages) {
				const response = await categoryService.fetchAllCategory(
					searchTerm,
					currentPage,
					limit
				);

				allCategories = [...allCategories, ...response.data.categories]; // Merge categories
				totalPages = response.data.totalPages; // Update total pages
				currentPage++; // Move to next page
			}

			setCategories(allCategories);
		} catch (err: any) {
			setError(err.message || "Failed to fetch all categories.");
		} finally {
			setLoading(false);
		}
	};

	const fetchCategoryById = async (
		categoryId: number
	): Promise<CategoryProps | null> => {
		try {
			if (!categoryId) return null;

			// Check if category already exists in state
			if (fetchedCategories.has(categoryId)) {
				return fetchedCategories.get(categoryId) || null;
			}

			const response = await categoryService.fetchCategoryById(categoryId);
			const category = response.data.category;

			setFetchedCategories((prev) => new Map(prev).set(categoryId, category));

			return category;
		} catch (err: any) {
			setError(err.message || "Failed to fetch category by id.");
			return null;
		}
	};

	// Fetch category on component mount
	useEffect(() => {
		// fetchCategory();
		fetchAllCategories();
	}, [location, searchTerm, page]);

	// Memoize the context value to avoid unnecessary re-renders
	const value = useMemo(
		() => ({
			categories,
			searchTerm,
			setSearchTerm,
			totalPages,
			page,
			setPage,
			loading,
			setLoading,
			error,
			fetchCategory,
			fetchAllCategories,
			fetchCategoryById,
		}),
		[categories, loading, error, searchTerm, page]
	);

	return (
		<CategoryContext.Provider value={value}>
			{children}
		</CategoryContext.Provider>
	);
};

export const useCategory = () => {
	const context = useContext(CategoryContext);
	if (!context) {
		throw new Error("useCategory must be used within a CategoryProvider");
	}
	return context;
};

export default CategoryProvider;
