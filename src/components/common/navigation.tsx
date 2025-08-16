import { FC, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Search, ShoppingBag, Trash, UserRound } from "lucide-react";
import routes from "@/routes";
import { contactItems, socialLinks } from "@/components/common/top-bar";
import { cn, formatPrice } from "@/lib/utils";
import Logo from "@/assets/images/logo.svg";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { currencySymbol } from "@/config";
import { Separator } from "@/components/ui/separator";
import { cartService } from "@/api";
import { LoadingOverlay } from "@mantine/core";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useProduct } from "@/hooks/use-product";
import ProductCard from "@/components/product-card";

interface NavigationMenu {
	name: string;
	to: string;
	isActive: boolean;
}

interface NavigationMenusProps {
	isMobileNavOpen: boolean;
}

const Navigation = () => {
	const location = useLocation();
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const hamburgerMenuContainer = useRef<HTMLDivElement>(null);
	const navigationMenuContainerRef = useRef<HTMLDivElement>(null);
	const [isNavAtTop, setIsNavAtTop] = useState(false);

	const moblieNavMenuToggler = () => {
		setIsMobileNavOpen(!isMobileNavOpen);
		document.body.style.overflow = isMobileNavOpen ? "auto" : "hidden";
		hamburgerMenuContainer.current?.classList.toggle("active");
	};

	const handleScroll = () => {
		if (navigationMenuContainerRef.current) {
			const navTop =
				navigationMenuContainerRef.current.getBoundingClientRect().top;
			if (navTop <= 0) {
				setIsNavAtTop(true);
			} else if (navTop > 0) {
				setIsNavAtTop(false);
			}
		}
	};

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		if (isNavAtTop && navigationMenuContainerRef.current) {
			navigationMenuContainerRef.current.classList.add("top-0", "shadow-lg");
		} else if (navigationMenuContainerRef.current) {
			navigationMenuContainerRef.current.classList.remove("top-0", "shadow-lg");
		}
	}, [isNavAtTop]);

	useEffect(() => {
		window.scrollTo(0, 0);
		if (isMobileNavOpen) {
			moblieNavMenuToggler();
		}
	}, [location]);

	return (
		<div
			ref={navigationMenuContainerRef}
			className="bg-white/80 backdrop-blur-lg xl:left-0 xl:right-0 z-50 w-full sticky transition-all duration-300 ease-in-out"
		>
			{/* Desktop Nav */}
			<div className="row grid-cols-5 grid-rows-1 items-center gap-4 hidden xl:grid">
				<div>
					<Link to={routes.home.path}>
						<img
							src={Logo}
							className="lg:w-60 md:w-52"
							alt="Dhaka Plastic & Metal"
						/>
					</Link>
				</div>
				<div className="col-span-4">
					<NavigationMenus isMobileNavOpen={isMobileNavOpen} />
				</div>
			</div>

			{/* Mobile Nav */}
			<div className="row flex items-center justify-between xl:hidden py-2">
				<div className="z-10">
					<Link to={routes.home.path}>
						<img src={Logo} className="w-48" alt="Dhaka Plastic & Metal" />
					</Link>
				</div>

				<div className="z-10 flex gap-6 items-center">
					<CartMenuItem />
					<div
						className="hamburger-menu-container"
						ref={hamburgerMenuContainer}
						onClick={moblieNavMenuToggler}
					>
						<span></span>
					</div>
				</div>

				<NavigationMenus isMobileNavOpen={isMobileNavOpen} />
			</div>
		</div>
	);
};

const NavigationMenus: FC<NavigationMenusProps> = ({ isMobileNavOpen }) => {
	const { products, setSearchTerm, error } = useProduct();
	const [searchInput, setSearchInput] = useState<string>("");
	const [isSearchSheetOpen, setSearchSheetOpen] = useState(false);
	const location = useLocation();
	const isMobile = useIsMobile();
	const { toast } = useToast();

	useEffect(() => {
		if (error) {
			toast({
				description: error,
				variant: "destructive",
				duration: 10000,
			});
		}
	}, []);

	const [currentPath, setCurrentPath] = useState(
		`${location.pathname}${location.hash}`
	);
	const { customer } = useAuth();
	const [menus, setMenus] = useState<NavigationMenu[]>([
		{
			name: "Home",
			to: routes.home.path,
			isActive: true,
		},
		{
			name: "Our Products",
			to: routes.products.path,
			isActive: false,
		},
		{
			name: "Services",
			to: routes.services.path,
			isActive: false,
		},
		{
			name: "Our Clients",
			to: routes.clients.path,
			isActive: false,
		},
		{
			name: "About Us",
			to: routes.about.path,
			isActive: false,
		},
		{
			name: "Contact",
			to: routes.contact.path,
			isActive: false,
		},
	]);

	useEffect(() => {
		setCurrentPath(`${location.pathname}${location.hash}`);
	}, [location]);

	useEffect(() => {
		setMenus((prevMenus) =>
			prevMenus.map((menu) => ({
				...menu,
				isActive: menu.to === currentPath,
			}))
		);
	}, [currentPath]);

	// Debounce search Effect
	useEffect(() => {
		const handler = setTimeout(() => {
			setSearchTerm(searchInput); // Only update context after delay
		}, 500); // Delay of 500ms

		return () => clearTimeout(handler); // Cleanup on each change
	}, [searchInput]);

	return (
		<div
			className={
				isMobileNavOpen
					? "xl:w-full w-screen h-screen xl:h-auto flex items-center justify-center gap-7 flex-col fixed top-0 left-0 bg-white text-black xl:static xl:bg-transparent overflow-hidden transition-all duration-300 py-0 xl:py-8 ease-in-out"
					: "xl:w-full w-0 h-screen xl:h-auto flex items-end justify-center gap-7 flex-col fixed top-[65px] left-0 bg-white text-black xl:static xl:bg-transparent overflow-hidden transition-all duration-300 py-0 xl:py-8 ease-in-out"
			}
		>
			<ul className="flex items-center justify-between flex-col xl:flex-row gap-5 md:gap-2 xl:gap-6 text-base xl:text-lg font-semibold uppercase">
				{menus.map((menu, index) => (
					<li key={index}>
						<Link
							to={menu.to}
							className={cn(
								"nav-link h-full",
								menu.isActive ? "nav-link-active" : ""
							)}
						>
							{menu.name}
						</Link>
					</li>
				))}

				{/* Search Icon */}
				<li>
					<Sheet open={isSearchSheetOpen} onOpenChange={setSearchSheetOpen}>
						<SheetTrigger asChild>
							<Search
								size={25}
								className="text-black cursor-pointer hover:text-skyblue transition-all duration-300"
							/>
						</SheetTrigger>
						<SheetContent className="sm:max-w-[550px]">
							<div className="flex w-full items-center space-x-2 mt-8 relative">
								<Input
									id="search"
									placeholder="I'm looking for..."
									value={searchInput}
									onChange={(e) => setSearchInput(e.target.value)}
								/>
								<Search
									size={20}
									className="cursor-pointer text-gray absolute right-5"
								/>
							</div>

							<div className="w-full flex gap-4 flex-col mt-4">
								{products.length > 0 &&
									searchInput.length > 0 &&
									products.map((product, index) => (
										<div
											key={index}
											onClick={() => {
												setSearchSheetOpen(false);
												setSearchInput("");
											}}
										>
											<ProductCard orientation="horizontal" product={product} />
										</div>
									))}
							</div>
						</SheetContent>
					</Sheet>
				</li>

				{/* Cart Icon */}
				{!isMobile && (
					<li>
						<CartMenuItem />
					</li>
				)}

				{/* User Login Icon */}
				<li>
					<Link
						to={customer ? routes.account.dashboard.path : routes.account.path}
					>
						<UserRound
							size={25}
							className="text-black cursor-pointer hover:text-skyblue transition-all duration-300"
						/>
					</Link>
				</li>
			</ul>

			<div className="xl:hidden w-full h-auto py-2 flex items-center justify-center gap-6 flex-col">
				<div className="flex items-center justify-center gap-4 flex-col">
					{contactItems.map((item, index) => (
						<div key={index} className="flex items-center justify-center gap-3">
							<item.icon size={20} />
							<Link
								to={item.to}
								target={item.target}
								className="text-black underline font-montserrat text-base"
							>
								{item.title}
							</Link>
						</div>
					))}
				</div>
				<div className="flex items-center justify-center">
					<div className="flex items-center justify-center gap-4">
						{socialLinks.map((link, index) => (
							<Link key={index} to={link.to} target={link.target}>
								<link.icon size={20} />
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

const CartMenuItem = () => {
	const { cartItems, fetchCartItems, loading, setLoading } = useCart();
	const { token } = useAuth();
	const { toast } = useToast();

	const isMobile = useIsMobile();

	const handleDeleteItem = async (cartItemId: number) => {
		try {
			setLoading(true);
			if (!token) {
				// navigate(routes.products.path);
				return;
			}

			const response = await cartService.deleteCartItem(token, cartItemId);

			toast({
				description: response.message,
				variant: response.status === 200 ? "success" : "default",
				duration: 10000,
			});
			await fetchCartItems();

			if (cartItems.length === 0) {
				// navigate(routes.products.path);
				return;
			}
		} catch (err: any) {
			setLoading(false);
			console.log(err.message);
			toast({
				description: err.message,
				variant: "destructive",
				duration: 10000,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Sheet>
			<SheetTrigger asChild>
				<div className="relative">
					<ShoppingBag
						size={isMobile ? 28 : 25}
						className="text-black cursor-pointer hover:text-skyblue transition-all duration-300"
					/>
					<span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
						{cartItems.length}
					</span>
				</div>
			</SheetTrigger>
			<SheetContent className="h-full">
				{loading && (
					<>
						<LoadingOverlay
							visible={loading}
							zIndex={10}
							overlayProps={{ radius: "xs", blur: 1 }}
						/>
					</>
				)}

				<div className="h-full overflow-y-auto scrollbar-none">
					<SheetHeader className="my-4">
						<SheetTitle className="mb-2">
							{cartItems.length ? "Checkout" : "Your cart is empty"}
						</SheetTitle>
						<SheetDescription>
							{cartItems.length === 0 && (
								<p className="text-sm font-semibold">
									Please visit{" "}
									<Link
										to={routes.products.path}
										className="text-skyblue underline"
									>
										Our Products
									</Link>{" "}
									to add product in your cart.
								</p>
							)}

							{cartItems.length > 0 && (
								<div className="space-y-4">
									{cartItems.map((item, index) => (
										<div key={index} className="w-full">
											<div
												key={item.cartItemId}
												className="grid grid-cols-[1fr_auto] gap-4"
											>
												<div className="space-y-1">
													<div className="flex flex-wrap items-center gap-1">
														<span className="font-medium text-black">
															{item.product.name}
														</span>
														<span className="text-sm text-skyblue">
															×{item.quantity} (pieces)
														</span>
														{item.size && (
															<span className="text-sm text-skyblue">
																×{item.size.toFixed(2)} (sq.feet)
															</span>
														)}
													</div>

													<div className="text-xs text-gray flex flex-wrap gap-2">
														{item.productVariant.variantDetails.map(
															(detail, index) => (
																<p
																	className="font-semibold text-gray"
																	key={index}
																>
																	{detail.variationItem.variation.name}:
																	{detail.variationItem.value}{" "}
																	{detail.variationItem.variation.unit}
																</p>
															)
														)}
													</div>
												</div>

												<div className="flex flex-col justify-between items-end">
													<div className="text-right">
														<h5 className="text-lg font-semibold text-black">
															{currencySymbol} {formatPrice(item.price)}
														</h5>
													</div>

													<Button
														variant="destructive"
														size="xs"
														onClick={() => handleDeleteItem(item.cartItemId)}
													>
														<Trash className="h-3 w-3" />
													</Button>
												</div>
											</div>

											{index < cartItems.length - 1 && (
												<Separator className="my-4 bg-gray/30" />
											)}
										</div>
									))}
								</div>
							)}
						</SheetDescription>
					</SheetHeader>
					<SheetFooter className="mt-6">
						{cartItems.length > 0 && (
							<div className="w-full flex flex-col gap-2">
								<Separator className="my-4 bg-gray/30" />

								<div className="space-y-2">
									<div className="flex items-center justify-between text-sm">
										<span className="text-base font-medium">Subtotal</span>
										<span className="text-base xl:text-lg font-medium">
											{currencySymbol}{" "}
											{formatPrice(
												cartItems.reduce((acc, item) => (acc += item.price), 0)
											)}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-base font-medium">Total</span>
										<span className="text-base xl:text-lg font-medium">
											{currencySymbol}{" "}
											{formatPrice(
												cartItems.reduce((acc, item) => (acc += item.price), 0)
											)}
										</span>
									</div>
								</div>

								<SheetClose
									asChild
									className="w-full flex items-start justify-start mt-4"
								>
									<Link to={routes.checkout.path}>
										<Button size="sm" className="w-full">
											Checkout
										</Button>
									</Link>
								</SheetClose>
							</div>
						)}
					</SheetFooter>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default Navigation;
