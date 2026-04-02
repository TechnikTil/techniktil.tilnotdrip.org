import { defineConfig } from "bunup";
import { copy } from "bunup/plugins";

export default defineConfig({
	outDir: "dist",
	minify: true,
	dts: false,
	packages: "external",
	preferredTsconfig: "./tsconfig.json",
	unused: {level: "error"},
	plugins: [copy("assets").to("assets")],
});
