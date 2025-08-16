import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { SetStateAction, useEffect, useState } from "react";
import { CategoryProps } from "@/hooks/use-category";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const ProductFilter = ({
	categories,
	selectedCategories,
	setSelectedCategories,
}: {
	categories: CategoryProps[];
	selectedCategories: CategoryProps[];
	setSelectedCategories: React.Dispatch<SetStateAction<CategoryProps[]>>;
}) => {
	const [checkedCategories, setCheckedCategories] = useState<number[]>([]);

	const [selectedCategory, setSelectedCategory] =
		useState<CategoryProps | null>(null);

	const handleSelectCategory = (category: CategoryProps) => {
		setSelectedCategory(category);

		// Add or remove selected category from selectedCategories array
		setSelectedCategories((prev) => {
			const isAlreadySelected = prev.some(
				(cat) => cat.categoryId === category.categoryId
			);

			if (isAlreadySelected) {
				return prev.filter((cat) => cat.categoryId !== category.categoryId);
			} else {
				return [...prev, category];
			}
		});
	};

	const clearSelectedCategory = () => {
		setSelectedCategories([]);
		setSelectedCategory(null);
		setCheckedCategories([]);
	};
  
	return (
		<div className="flex flex-col gap-4 pb-10 w-full">
			<h3 className="text-lg font-medium py-3">All Categories</h3>
			<Separator orientation="horizontal" />

			<NestedCategoryAccordion
				categories={categories}
				checkedCategories={checkedCategories}
				setCheckedCategories={setCheckedCategories}
				onSelectCategory={handleSelectCategory}
				selectedCategoryId={selectedCategory?.categoryId}
			/>

			{selectedCategories && selectedCategories.length > 0 && (
				<div className="mt-4 pt-4 border-t border-gray-100">
					<h3 className="text-sm font-medium text-gray-500 mb-2">
						Selected Categories:
					</h3>
					<div className="flex flex-wrap gap-2">
						{selectedCategories.map((cat) => (
							<span
								key={cat.categoryId}
								className="text-sm bg-slate-100 px-2 py-1 rounded"
							>
								{cat.name}
							</span>
						))}
					</div>

					<div className="my-4">
						<Button
							size="xs"
							variant="destructive"
							onClick={clearSelectedCategory}
						>
							<X /> Clear
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

interface CategoryTreeItem extends CategoryProps {
	children: CategoryTreeItem[];
}

const NestedCategoryAccordion = ({
	categories,
	checkedCategories,
	setCheckedCategories,
	onSelectCategory,
	selectedCategoryId,
}: {
	categories: CategoryProps[];
	checkedCategories: number[];
	setCheckedCategories: React.Dispatch<SetStateAction<number[]>>;
	onSelectCategory?: (category: CategoryProps) => void;
	selectedCategoryId?: number | null;
}) => {
	const [categoryTree, setCategoryTree] = useState<CategoryTreeItem[]>([]);
	const [expandedItems, setExpandedItems] = useState<string[]>([]);

	useEffect(() => {
		const buildCategoryTree = () => {
			const topLevelCategories = categories.filter(
				(category) =>
					!category.parentCategoryId ||
					!categories.some((c) => c.categoryId === category.parentCategoryId)
			);

			const buildTree = (category: CategoryProps): CategoryTreeItem => {
				const children = categories.filter(
					(c) => c.parentCategoryId === category.categoryId
				);

				return {
					...category,
					children: children.map(buildTree),
				};
			};

			const tree = topLevelCategories.map(buildTree);
			setCategoryTree(tree);

			if (selectedCategoryId) {
				const pathToSelected = findPathToCategory(tree, selectedCategoryId);
				if (pathToSelected.length) {
					setExpandedItems(pathToSelected.map((id) => `category-${id}`));
				}
			}
		};

		buildCategoryTree();
	}, [categories, selectedCategoryId]);

	const findPathToCategory = (
		tree: CategoryTreeItem[],
		targetId: number,
		currentPath: number[] = []
	): number[] => {
		for (const node of tree) {
			if (node.categoryId === targetId) {
				return [...currentPath, node.categoryId];
			}
			if (node.children.length) {
				const path = findPathToCategory(node.children, targetId, [
					...currentPath,
					node.categoryId,
				]);
				if (path.length) return path;
			}
		}
		return [];
	};

	const handleValueChange = (value: string[]) => {
		setExpandedItems(value);
	};

	const handleCheckboxChange = (categoryId: number, checked: boolean) => {
		setCheckedCategories((prev) => {
			const selectedCategory = categories.find(
				(c) => categoryId === c.categoryId
			);

			if (checked) {
				// Add this category and its subcategories to checked
				if (
					selectedCategory?.subCategories &&
					!prev.includes(categoryId)
				) {
					return [
						...prev,
						categoryId,
						...selectedCategory.subCategories.map((sc) => sc.categoryId),
					];
				}
				return [...prev, categoryId];
			} else {
				const subCategoryIds =
					selectedCategory?.subCategories.map((sc) => sc.categoryId) || [];
				return prev
					.filter((id) => id !== categoryId)
					.filter((id) => !subCategoryIds.includes(id));
			}
		});

		// Notify parent about selection
		const selectedCategory = categories.find(
			(c) => c.categoryId === categoryId
		);
		if (selectedCategory) {
			onSelectCategory?.(selectedCategory);
		}
	};

	const renderCategory = (category: CategoryTreeItem, level: number = 0) => {
		const hasChildren = category.children.length > 0;
		const isSelected = selectedCategoryId === category.categoryId;
		const isChecked = checkedCategories.includes(category.categoryId);

		const indentClasses = [
			"", // Level 0
			"ml-4", // Level 1
			"ml-8", // Level 2
			"ml-12", // Level 3
			"ml-16", // Level 4
			"ml-20", // Level 5
		];

		const indentClass =
			level < indentClasses.length
				? indentClasses[level]
				: indentClasses[indentClasses.length - 1];

		if (!hasChildren) {
			return (
				<div
					key={category.categoryId}
					className={cn(
						"flex items-center py-2 px-3 rounded-md transition-all",
						isSelected && "hover:text-skyblue",
						indentClass
					)}
				>
					<Checkbox
						id={`category-${category.categoryId}`}
						checked={isChecked}
						onCheckedChange={(checked) =>
							handleCheckboxChange(category.categoryId, checked === true)
						}
						className="mr-2 transition-all"
					/>
					<Label
						htmlFor={`category-${category.categoryId}`}
						className={cn(
							"text-sm font-medium cursor-pointer flex-grow transition-all",
							isSelected && "font-semibold"
						)}
					>
						{category.name}
						{category.products && (
							<span className="text-xs text-neutral-400 ml-1 transition-all">
								({category.products.length})
							</span>
						)}
					</Label>
				</div>
			);
		}
console.log(categories)
		return (
			<AccordionItem
				value={`category-${category.categoryId}`}
				key={category.categoryId}
				className="border-none"
			>
				<div className={cn("flex items-center", indentClass)}>
					<AccordionTrigger
						className={cn(
							"py-2 pr-2 rounded-md transition-all flex items-center flex-grow",
							"data-[state=open]:text-skyblue",
							isSelected && "hover:text-skyblue"
						)}
					>
						<div className="flex items-center w-full">
							<Label
								htmlFor={`category-${category.categoryId}`}
								className={cn(
									"text-sm font-medium cursor-pointer transition-all",
									isSelected && "font-semibold"
								)}
								onClick={(e) => e.stopPropagation()}
							>
								{category.name}
							</Label>
							{category.products && (
								<span className="text-xs text-neutral-400 ml-1 mr-2 transition-all">
									({category.products.length})
								</span>
							)}
						</div>
					</AccordionTrigger>

				<AccordionContent className="pt-1 pb-0">
					<div className="transition-all">
						{category.children.map((child) => renderCategory(child, level + 1))}
					</div>
				</AccordionContent>
				</div>
			</AccordionItem>
		);
	};

	return (
		<div className="w-full category-accordion overflow-hidden">
			<Accordion
				type="multiple"
				value={expandedItems}
				onValueChange={handleValueChange}
				className="w-full transition-all"
			>
				{categoryTree.map((category) => renderCategory(category))}
			</Accordion>
		</div>
	);
};

export default ProductFilter;
