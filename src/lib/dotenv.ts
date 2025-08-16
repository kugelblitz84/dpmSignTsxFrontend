import urlJoin from "url-join";

export const apiUrl: string = urlJoin(import.meta.env.VITE_API_BASE_URL || "https://dpm-api-475a8e326094.herokuapp.com/");
export const apiKey: string = import.meta.env.VITE_API_KEY || "12CDCDF73FCC2493865178F3E3EC6";
export const apiBaseURL: string = urlJoin(
	import.meta.env.VITE_API_BASE_URL || "https://dpm-api-475a8e326094.herokuapp.com/",
	"/api"
);
export const apiStaticURL = urlJoin(
	import.meta.env.VITE_API_BASE_URL || "https://dpm-api-475a8e326094.herokuapp.com/",
	"/static"
);
