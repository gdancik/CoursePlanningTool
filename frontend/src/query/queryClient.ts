import {QueryClient} from "@tanstack/react-query";
import queryConfig from "./queryConfig.json"

const minutesToMilliSeconds =(minutes: number) => {
    return minutes * 60 * 1000;
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries : {
            staleTime: minutesToMilliSeconds(queryConfig.staleTimeMinutes),
        },
    },
})