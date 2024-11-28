import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        exclude: ["lucide-react"], // Exclude non-critical dependencies
        include: ["@stripe/react-stripe-js", "@stripe/stripe-js"], // Ensure Stripe libraries are pre-bundled
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"), // Simplified imports
        },
    },
    build: {
        chunkSizeWarningLimit: 1200, // Suppress chunk size warnings
        rollupOptions: {
            output: {
                manualChunks: {
                    react: ["react", "react-dom"], // React libraries in a separate chunk
                    vendor: ["lodash", "axios"], // Vendor dependencies
                },
            },
        },
    },
});
