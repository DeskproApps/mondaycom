import "regenerator-runtime/runtime";
import "@testing-library/jest-dom/extend-expect";
import React from "react";
import { TextDecoder, TextEncoder } from "util";

global.TextEncoder = TextEncoder;
//for some reason the types are wrong, but this works
global.TextDecoder = TextDecoder;
global.React = React;
