import React, { ReactElement } from "react";
import { render } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

export function ProviderRenderer(ui: ReactElement) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false
            },
            mutations: {
                retry: false
            }
        }
    });

    return render(
        <MemoryRouter>
            <QueryClientProvider client={queryClient}>
                {ui}
            </QueryClientProvider>
        </MemoryRouter>
    );
}