import type { Preview, Decorator } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import React from "react";
import "../src/app/globals.css";

const withQueryClient: Decorator = (Story) => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  return (
    <QueryClientProvider client={qc}>
      <Story />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
};

// ツールバーの選択値を優先し、未操作時はparameters.containerClassにフォールバック
const withContainer: Decorator = (Story, context) => {
  const cls =
    context.globals.containerClass !== undefined
      ? context.globals.containerClass
      : (context.parameters.containerClass ?? "container");
  if (!cls) return <Story />;
  return <div className={cls}><Story /></div>;
};

export const globalTypes = {
  containerClass: {
    name: "Container",
    defaultValue: "container",
    toolbar: {
      icon: "expand",
      items: [
        { value: false,                       title: "なし" },
        { value: "container",                 title: "480px（通常）" },
        { value: "container container--wide", title: "900px（管理画面）" },
      ],
    },
  },
};

const preview: Preview = {
  decorators: [withQueryClient, withContainer],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: "todo" },
  },
};

export default preview;
