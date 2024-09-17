"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dayjs = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
exports.dayjs = dayjs_1.default;
require("dayjs/locale/pt-br");
const localizedFormat_1 = __importDefault(require("dayjs/plugin/localizedFormat"));
dayjs_1.default.locale("pt-br");
dayjs_1.default.extend(localizedFormat_1.default);
