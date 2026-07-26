/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the Next.js <Image> component to load images from these external domains.
  images: {
    domains: ['via.placeholder.com', 'jsonplaceholder.typicode.com'],
  },
};

module.exports = nextConfig;
