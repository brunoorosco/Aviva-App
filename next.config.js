/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    emailPassword: process.env.EMAIL_PASSWORD
  }
}

module.exports = nextConfig
