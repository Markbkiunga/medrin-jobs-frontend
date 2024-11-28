import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [react()],
	optimizeDeps: {
		exclude: ["lucide-react"], // Exclude these from optimization
		include: ["@stripe/react-stripe-js", "@stripe/stripe-js"], // Pre-bundle these dependencies
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"), // Path alias for cleaner imports
		},
	},
	build: {
		chunkSizeWarningLimit: 1200, // Increase chunk size limit to avoid warnings
		rollupOptions: {
			external: ["@stripe/react-stripe-js", "@stripe/stripe-js"], // Ensure Stripe libraries are treated as external
			output: {
				manualChunks: {
					react: ["react", "react-dom"], // Group React libraries
					vendor: ["lodash", "axios"], // Group vendor libraries
				},
			},
		},
	},
});
