/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    urlBase: process.env.APP_URL_BASE,
  }
  // output: 'export'
}

module.exports = nextConfig
