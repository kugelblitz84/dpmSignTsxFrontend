import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { LoginRegistrationForm } from "@/pages/account/login-registration-form";

type DefaultTab = "login" | "registration";

interface AuthModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	defaultTab?: DefaultTab;
	initialLoginEmail?: string;
	initialRegistration?: {
		name?: string;
		email?: string;
		phone?: string;
	};
	onSuccess?: () => void;
}

export const AuthModal = ({
	open,
	onOpenChange,
	defaultTab = "login",
	initialLoginEmail,
	initialRegistration,
	onSuccess,
}: AuthModalProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle className="text-2xl">Account</DialogTitle>
				</DialogHeader>
				<LoginRegistrationForm
					defaultTab={defaultTab}
					initialLoginEmail={initialLoginEmail}
					initialRegistration={initialRegistration}
					onSuccess={onSuccess}
				/>
			</DialogContent>
		</Dialog>
	);
};

export default AuthModal;
