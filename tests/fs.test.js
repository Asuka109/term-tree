"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const vitest_1 = require("vitest");
const fs_1 = require("../src/fs");
const node_1 = require("../src/node");
const render_1 = require("../src/render");
const utils_1 = require("../src/utils");
(0, vitest_1.test)('walkDirectory', () => __awaiter(void 0, void 0, void 0, function* () {
    const walking = (0, fs_1.walkDirectory)(path_1.default.dirname(__dirname), {
        filter: filename => !filename.includes('node_modules')
    });
    const files = yield (0, utils_1.arrayFromAsyncGenerator)(walking);
    const tree = (0, node_1.createTreeFromFiles)(files.map(([filename]) => filename));
    (0, vitest_1.expect)((0, render_1.renderTree)(tree)).toMatchInlineSnapshot(`
    "
    ├── .eslintrc.js
    ├── .vscode/settings.json
    ├── foo.mjs
    ├── package.json
    ├── pnpm-lock.yaml
    ├── src
    │   ├── fs.ts
    │   ├── index.ts
    │   ├── node.ts
    │   ├── render.ts
    │   ├── types.ts
    │   └── utils.ts
    ├── tests
    │   ├── fs.test.ts
    │   └── node.test.ts
    └── tsconfig.json"
  `);
}));
