/** @type {import('next').NextConfig} */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseReference = process.env.SUPABASE_REFERENCE_ID;
const supabaseDomain = (() => {
	try {
		return supabaseUrl ? new URL(supabaseUrl).hostname : undefined;
	} catch {
		return undefined;
	}
})();

const imageHostname = supabaseDomain
	? supabaseDomain
	: supabaseReference
	? `${supabaseReference}.supabase.co`
	: undefined;

const remotePatterns = imageHostname
	? [
			{
				protocol: "https",
				hostname: imageHostname,
			},
	  ]
	: [];

const nextConfig = {
	images: {
		remotePatterns,
	},
};

module.exports = nextConfig;
