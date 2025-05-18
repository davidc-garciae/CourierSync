module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ejemplo.com",
        port: "",
        pathname: "/ruta/**",
      },
    ],
  },
};
