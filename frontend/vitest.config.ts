import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
	test: {
		exclude: [
			"node_modules/**",
			"coverage/**",
			"public/**",
			"src/assets/**",
			"src/components/**",
			"src/router/**"
		],
		alias: {
			"@": path.resolve(__dirname, "./src")
		},
		coverage: {
			provider: "v8",
			include: [
				"src/utils/array/array.util.ts",
				"src/utils/crypt/crypt.util.ts",
				"src/utils/date/date.util.ts",
				"src/utils/string/string.util.ts",
				"src/services/**/**.service.ts"
			]
		}
	}
})