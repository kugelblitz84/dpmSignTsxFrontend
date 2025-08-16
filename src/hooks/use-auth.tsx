import React, {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useNavigate } from "react-router-dom";
import Preloader from "@/components/common/preloader";

export interface CustomerProps {
	customerId: number;
	name: string;
	email: string;
	phone: string;
	billingAddress: string;
	shippingAddress: string;
	verified: boolean;
	verificationToken: string;
	tokenVersion: number;
	createdAt: Date;
	updatedAt: Date;
}

interface AuthContextType {
	loading: boolean;
	token: string | null;
	customer: CustomerProps | null;
	navigateTo: string;
	setNavigateTo: React.Dispatch<React.SetStateAction<string>>;
	login: (token: string, customer: CustomerProps, navigateTo?: string) => void; // Add optional navigateTo parameter
	logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const navigate = useNavigate();
	const [token, setToken] = useState<string | null>(null);
	const [customer, setCustomer] = useState<CustomerProps | null>(null);
	const [loading, setLoading] = useState(true);
	const [navigateTo, setNavigateTo] = useState<string>("");

	// Consolidating the loading and state initialization in a single useEffect
	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		const storedCustomer = localStorage.getItem("customer");

		if (storedToken && storedCustomer) {
			setToken(storedToken);
			setCustomer(JSON.parse(storedCustomer));
		}

		setLoading(false); // Ensure loading state is set to false after checking localStorage
	}, []);

	useEffect(() => {
		if (navigateTo) {
			navigate(navigateTo);
		}
	}, [navigateTo, navigate]);

	const login = (
		token: string,
		customer: CustomerProps,
		navigateTo?: string
	) => {
		// Only update localStorage and state if the values are actually different
		if (
			token !== localStorage.getItem("token") ||
			customer !== JSON.parse(localStorage.getItem("customer") || "{}")
		) {
			localStorage.setItem("token", token);
			localStorage.setItem("customer", JSON.stringify(customer));
			setToken(token);
			setCustomer(customer);
		}

		if (navigateTo) {
			setNavigateTo(navigateTo);
		}
	};

	const logout = () => {
		// Only update localStorage and state if necessary
		if (token !== null || customer !== null) {
			localStorage.removeItem("token");
			localStorage.removeItem("customer");
			setToken(null);
			setCustomer(null);
		}
	};

	const value = useMemo(
		() => ({
			loading,
			token,
			customer,
			navigateTo,
			setNavigateTo,
			login,
			logout,
		}),
		[loading, token, customer, navigateTo]
	);

	if (loading) {
		return <Preloader />;
	} else {
		return (
			<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
		);
	}
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context as AuthContextType;
};
