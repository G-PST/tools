import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const { gitDescribe, gitDescribeSync } = require("git-describe");
const content = JSON.stringify({ hash: gitDescribeSync().hash });
const fs = require("fs");
fs.writeFileSync("assets/hash.json", content);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: { "process.env": {} },
  /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
});
