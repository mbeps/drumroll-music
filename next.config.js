/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
			domains: [
					`${process.env.SUPABASE_REFERENCE_ID}.supabase.co`
			]
	}
}

module.exports = nextConfig
