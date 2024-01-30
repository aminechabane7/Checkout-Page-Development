import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173/',
    supportFile: false,
    fixturesFolder: false,
    viewportWidth: 1800,
    viewportHeight: 2500,
    setupNodeEvents(on, config) {

      
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
