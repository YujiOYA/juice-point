import type { StorybookConfig } from "@storybook/nextjs-vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/stories/**/*.stories.@(ts|tsx)"],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  viteFinal: async (cfg) => {
    cfg.resolve ??= {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias as Record<string, string>),
      "@app":      path.resolve(__dirname, "../src/app"),
      "@atom":     path.resolve(__dirname, "../src/components/atoms"),
      "@molecule": path.resolve(__dirname, "../src/components/molecules"),
      "@organism": path.resolve(__dirname, "../src/components/organisms"),
      "@hook":     path.resolve(__dirname, "../src/hooks"),
      "@lib":      path.resolve(__dirname, "../src/lib"),
      "@type":     path.resolve(__dirname, "../src/types"),
      "@const":    path.resolve(__dirname, "../src/const"),
      "@providers": path.resolve(__dirname, "../src/providers"),
    };
    return cfg;
  },
};

export default config;
