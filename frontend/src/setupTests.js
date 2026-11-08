import "@testing-library/jest-dom";
import "whatwg-fetch";

const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

Object.defineProperty(global, "crypto", {
    value: {
        randomUUID: jest.fn(
            () => "00000000-0000-4000-8000-000000000000"
        )
    }
});