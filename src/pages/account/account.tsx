import SectionHeading from "@/components/section-heading";
import { LoginRegistrationForm } from "@/pages/account/login-registration-form";
import AccountIllustrator from "@/assets/icons/account-illustrator.svg";

const Account = () => {
	return (
		<section className="py-2 md:py-0">
			<SectionHeading
				title={"Account"}
				description={
					"Login if you already our customer. Otherwise please register yourself."
				}
			/>

			<div className="row py-12 grid grid-cols-1 lg:grid-cols-2 gap-6 place-items-center">
				<LoginRegistrationForm />
				<img
					src={AccountIllustrator}
					className="max-w-full xl:w-2/3"
					alt="Account Illustration"
				/>
			</div>
		</section>
	);
};

export default Account;
