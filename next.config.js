/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: true,
    },
    webpack: (config, { isServer }) => {
        // Add source-map support
        config.devtool = 'source-map';
        
        // Force client-side rendering for auth context
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            net: false,
            tls: false
        };

        return config;
    },
    experimental: {
        // Enable client component features
        serverActions: {
            enabled: true
        }
    }
};

module.exports = nextConfig;