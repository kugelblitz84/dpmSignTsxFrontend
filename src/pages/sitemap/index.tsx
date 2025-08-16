import routes from "@/routes";
import SitemapSection from "@/pages/sitemap/sitemap-section";

// Define the type for a route object
interface Route {
	path: string;
	name: string;
}

const Sitemap = () => {
	// Organize routes into categories
	const mainPages: Route[] = [
		routes.home,
		routes.products,
		routes.services,
		routes.clients,
		routes.about,
		routes.contact,
		routes.career,
		routes.partnerWithUs,
	];

	const accountPages: Route[] = [
		routes.account,
		routes.account.dashboard,
		routes.account.orders,
		routes.account.accountDetails,
		routes.account.resetPassword,
	];

	const policyPages: Route[] = [
		routes.privacyPolicy,
		routes.returnPolicy,
		routes.exchangePolicy,
		routes.termsNCondition,
		routes.faq,
	];

	const blogPages: Route[] = [routes.blogs];

	return (
		<div className="py-12 px-4">
			<div className="row space-y-8">
				<h2 className="text-3xl font-semibold text-center">Site Map</h2>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
					<SitemapSection title="Main Pages" links={mainPages} />
					<SitemapSection title="Account" links={accountPages} />
					<SitemapSection
						title="Policies & Help"
						links={policyPages}
					/>
					<SitemapSection title="Blog" links={blogPages} />
				</div>
			</div>
		</div>
	);
};

export default Sitemap;
