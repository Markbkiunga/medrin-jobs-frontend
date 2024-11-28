/** @format */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		exclude: ["lucide-react"],
	},

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		chunkSizeWarningLimit: 1200,
		rollupOptions: {
			external: ["@stripe/react-stripe-js"],
			output: {
				manualChunks: {
					react: ["react", "react-dom"],
					vendor: ["lodash", "axios"],
				},
			},
		},
	},
});
