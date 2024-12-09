/* eslint-disable react-refresh/only-export-components */

import type { RenderOptions } from "@testing-library/react";
import { render } from "@testing-library/react";
import type { FC, ReactElement, ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "../context/provider";

interface AllTheProvidersProperties {
  children: ReactNode;
}

const AllTheProviders: FC<AllTheProvidersProperties> = ({ children }) => {
  return (
    // Wrap in providers as needed
    <BrowserRouter>
      <AppProvider>{children}</AppProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">
) =>
  render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });

// re-export everything
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

// override render method
export { customRender as render };

export { renderHook } from "@testing-library/react";
