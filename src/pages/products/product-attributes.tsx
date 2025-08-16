import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ProductProps } from "@/hooks/use-product";

const ProductAttributes = ({ product }: { product: ProductProps }) => {
	return (
		<div className="">
			<h3 className="text-lg lg:text-xl font-semibold">Key attributes</h3>

			{product.attributes.length > 0 && (
				<div className="w-full  ">
					<Table className="border-collapse">
						<TableHeader className="text-sm">
							<TableRow>
								<TableHead className="bg-skyblue text-white border-[2px] border-white px-8 w-1/3">
									Property
								</TableHead>
								<TableHead className="bg-skyblue text-white border-[2px] border-white px-8">
									Description
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className="text-sm">
							{product.attributes.map((attribute, index) => (
								<TableRow key={index} className="border-gray/60">
									<TableCell className="px-8 w-1/3">
										{attribute.property}
									</TableCell>
									<TableCell className="px-8">
										{attribute.description}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			)}

			{/* <Table className="border-collapse mt-4">
				<TableHeader className="text-base">
					<TableRow>
						<TableHead className="text-sm xl:text-base bg-skyblue text-white border-[2px] border-white px-8">
							Industry specific attributes
						</TableHead>
						<TableHead className="text-sm xl:text-base bg-skyblue text-white border-[2px] border-white px-8">
							Details
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="text-base">
					<TableRow className="border-gray/60">
						<TableCell className="text-sm xl:text-base px-8 w-1/2">
							Material
						</TableCell>
						<TableCell className="text-sm xl:text-base px-8">
							Plastic
						</TableCell>
					</TableRow>
					<TableRow className="border-gray/60">
						<TableCell className="text-sm xl:text-base px-8 w-1/2">
							Application
						</TableCell>
						<TableCell className="text-sm xl:text-base px-8">
							Sports and Games, Other Activities, Martial Arts
							Competition, Taekwondo competition, Karare training,
							Boxing Club, Sports events
						</TableCell>
					</TableRow>

					<TableRow className="border-gray/60">
						<TableCell className="text-sm xl:text-base px-8 w-1/2">
							Printing
						</TableCell>
						<TableCell className="text-sm xl:text-base px-8">
							UV Printing
						</TableCell>
					</TableRow>
				</TableBody>
			</Table> */}

			{/* <Table className="border-collapse mt-4">
				<TableHeader className="text-base">
					<TableRow>
						<TableHead className="text-sm xl:text-base bg-skyblue text-white border-[2px] border-white px-8">
							Other attributes
						</TableHead>
						<TableHead className="text-sm xl:text-base bg-skyblue text-white border-[2px] border-white px-8">
							Details
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className="text-base">
					<TableRow className="border-gray/60">
						<TableCell className="text-sm xl:text-base px-8 w-1/2">
							Feature
						</TableCell>
						<TableCell className="text-sm xl:text-base px-8">
							Technique
						</TableCell>
					</TableRow>
					<TableRow className="border-gray/60">
						<TableCell className="text-sm xl:text-base px-8 w-1/2">
							Assemblable
						</TableCell>
						<TableCell className="text-sm xl:text-base px-8">
							Sports and Games, Other Activities, Martial Arts
							Competition, Taekwondo competition, Karare training,
							Boxing Club, Sports events
						</TableCell>
					</TableRow>

					<TableRow className="border-gray/60">
						<TableCell className="text-sm xl:text-base px-8 w-1/2">
							Printing
						</TableCell>
						<TableCell className="text-sm xl:text-base px-8">
							UV Printing
						</TableCell>
					</TableRow>
				</TableBody>
			</Table> */}
		</div>
	);
};

export default ProductAttributes;
