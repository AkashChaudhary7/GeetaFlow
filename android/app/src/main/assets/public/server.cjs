var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_child_process = require("child_process");
var import_crypto = __toESM(require("crypto"), 1);
var import_os = __toESM(require("os"), 1);
var import_genai = require("@google/genai");
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
app.use(import_express.default.raw({
  type: ["video/*", "application/octet-stream"],
  limit: "100mb"
}));
var aiClient = null;
function getGeminiClient() {
  if (!aiClient) {
    aiClient = new import_genai.GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
  }
  return aiClient;
}
var GITA_KNOWLEDGE_BASE = [
  {
    chapter: 2,
    verse: 47,
    sanskrit: "\u0915\u0930\u094D\u092E\u0923\u094D\u092F\u0947\u0935\u093E\u0927\u093F\u0915\u093E\u0930\u0938\u094D\u0924\u0947 \u092E\u093E \u092B\u0932\u0947\u0937\u0941 \u0915\u0926\u093E\u091A\u0928\u0964 \u092E\u093E \u0915\u0930\u094D\u092E\u092B\u0932\u0939\u0947\u0924\u0941\u0930\u094D\u092D\u0942\u0930\u094D\u092E\u093E \u0924\u0947 \u0938\u0919\u094D\u0917\u094B\u093D\u0938\u094D\u0924\u094D\u0935\u0915\u0930\u094D\u092E\u0923\u093F\u0965",
    simpleHindi: "\u0924\u0941\u092E\u094D\u0939\u093E\u0930\u093E \u0905\u0927\u093F\u0915\u093E\u0930 \u0915\u0947\u0935\u0932 \u0915\u0930\u094D\u092E \u0915\u0930\u0928\u0947 \u092E\u0947\u0902 \u0939\u0948, \u0909\u0938\u0915\u0947 \u092B\u0932\u094B\u0902 \u092E\u0947\u0902 \u0915\u092D\u0940 \u0928\u0939\u0940\u0902\u0964 \u0907\u0938\u0932\u093F\u090F \u0915\u0930\u094D\u092E\u092B\u0932 \u0915\u0940 \u0907\u091A\u094D\u091B\u093E \u0938\u0947 \u0915\u0930\u094D\u092E \u092E\u0924 \u0915\u0930\u094B \u0914\u0930 \u0928 \u0939\u0940 \u0915\u0930\u094D\u092E \u0928 \u0915\u0930\u0928\u0947 \u092E\u0947\u0902 \u0906\u0938\u0915\u094D\u0924\u093F \u0939\u094B\u0964",
    bhavarth: "\u092A\u0930\u093F\u0923\u093E\u092E \u0915\u0940 \u091A\u093F\u0902\u0924\u093E \u091B\u094B\u0921\u093C \u092A\u0942\u0930\u0940 \u090A\u0930\u094D\u091C\u093E \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E (effort) \u092E\u0947\u0902 \u0932\u0917\u093E\u0928\u0947 \u0938\u0947 \u0924\u0928\u093E\u0935 \u0938\u092E\u093E\u092A\u094D\u0924 \u0939\u094B\u0924\u093E \u0939\u0948 \u0914\u0930 \u0915\u093E\u0930\u094D\u092F \u0915\u094D\u0937\u092E\u0924\u093E \u092C\u0922\u093C\u0924\u0940 \u0939\u0948\u0964",
    aajKiSeekh: "\u0905\u092A\u0928\u0947 \u0906\u091C \u0915\u0947 \u0915\u093E\u0930\u094D\u092F \u092A\u0930 100% \u0927\u094D\u092F\u093E\u0928 \u0926\u0947\u0902\u0964 '\u0915\u094D\u092F\u093E \u0939\u094B\u0917\u093E' \u0915\u093E \u092D\u092F \u0924\u094D\u092F\u093E\u0917\u0915\u0930 \u0905\u092A\u0928\u0940 \u092A\u094D\u0930\u0915\u094D\u0930\u093F\u092F\u093E \u0915\u094B \u0909\u0924\u094D\u0915\u0943\u0937\u094D\u091F \u092C\u0928\u093E\u090F\u0902\u0964",
    topics: ["\u0915\u0930\u094D\u092E", "\u0938\u092B\u0932\u0924\u093E", "\u091A\u093F\u0902\u0924\u093E", "\u0928\u094C\u0915\u0930\u0940", "\u092D\u0935\u093F\u0937\u094D\u092F", "\u0915\u0930\u094D\u0924\u0935\u094D\u092F", "\u0924\u0928\u093E\u0935"]
  },
  {
    chapter: 2,
    verse: 14,
    sanskrit: "\u092E\u093E\u0924\u094D\u0930\u093E\u0938\u094D\u092A\u0930\u094D\u0936\u093E\u0938\u094D\u0924\u0941 \u0915\u094C\u0928\u094D\u0924\u0947\u092F \u0936\u0940\u0924\u094B\u0937\u094D\u0923\u0938\u0941\u0916\u0926\u0941\u0903\u0916\u0926\u093E\u0903\u0964 \u0906\u0917\u092E\u093E\u092A\u093E\u092F\u093F\u0928\u094B\u093D\u0928\u093F\u0924\u094D\u092F\u093E\u0938\u094D\u0924\u093E\u0902\u0938\u094D\u0924\u093F\u0924\u093F\u0915\u094D\u0937\u0938\u094D\u0935 \u092D\u093E\u0930\u0924\u0965",
    simpleHindi: "\u0907\u0928\u094D\u0926\u094D\u0930\u093F\u092F\u094B\u0902 \u0914\u0930 \u0935\u093F\u0937\u092F\u094B\u0902 \u0915\u0947 \u0938\u0902\u092F\u094B\u0917 \u0938\u0947 \u0939\u094B\u0928\u0947 \u0935\u093E\u0932\u0947 \u0938\u0941\u0916-\u0926\u0941\u0903\u0916, \u0938\u0930\u094D\u0926\u0940-\u0917\u0930\u094D\u092E\u0940 \u0906\u0926\u093F \u0905\u0928\u093F\u0924\u094D\u092F (\u0906\u0928\u0947-\u091C\u093E\u0928\u0947 \u0935\u093E\u0932\u0947) \u0939\u0948\u0902, \u0907\u0928\u094D\u0939\u0947\u0902 \u0927\u0948\u0930\u094D\u092F\u092A\u0942\u0930\u094D\u0935\u0915 \u0938\u0939\u0928 \u0915\u0930\u094B\u0964",
    bhavarth: "\u0938\u0941\u0916 \u0914\u0930 \u0926\u0941\u0903\u0916 \u092E\u094C\u0938\u092E \u0915\u0940 \u0924\u0930\u0939 \u092C\u0926\u0932\u0924\u0947 \u0930\u0939\u0924\u0947 \u0939\u0948\u0902\u0964 \u0915\u0920\u093F\u0928 \u0938\u092E\u092F \u092E\u0947\u0902 \u0927\u0948\u0930\u094D\u092F \u0939\u0940 \u0938\u092C\u0938\u0947 \u092C\u0921\u093C\u093E \u0938\u0902\u092C\u0932 \u0939\u0948\u0964",
    aajKiSeekh: "\u0915\u0920\u093F\u0928 \u0938\u092E\u092F \u0939\u092E\u0947\u0936\u093E \u0915\u0947 \u0932\u093F\u090F \u0928\u0939\u0940\u0902 \u0930\u0939\u0924\u093E\u0964 \u0927\u0948\u0930\u094D\u092F \u0930\u0916\u0947\u0902, \u092F\u0939 \u092A\u0930\u093F\u0938\u094D\u0925\u093F\u0924\u093F \u092D\u0940 \u0905\u0935\u0936\u094D\u092F \u092C\u0926\u0932\u0947\u0917\u0940\u0964",
    topics: ["\u0927\u0948\u0930\u094D\u092F", "\u0909\u0926\u093E\u0938\u0940", "\u0905\u0938\u092B\u0932\u0924\u093E", "\u0924\u0928\u093E\u0935", "\u0936\u093E\u0902\u0924\u093F", "\u0926\u0941\u0903\u0916"]
  },
  {
    chapter: 2,
    verse: 62,
    sanskrit: "\u0927\u094D\u092F\u093E\u092F\u0924\u094B \u0935\u093F\u0937\u092F\u093E\u0928\u094D\u092A\u0941\u0902\u0938\u0903 \u0938\u0919\u094D\u0917\u0938\u094D\u0924\u0947\u0937\u0942\u092A\u091C\u093E\u092F\u0924\u0947\u0964 \u0938\u0919\u094D\u0917\u093E\u0924\u094D\u0938\u091E\u094D\u091C\u093E\u092F\u0924\u0947 \u0915\u093E\u092E\u0903 \u0915\u093E\u092E\u093E\u0924\u094D\u0915\u094D\u0930\u094B\u0927\u094B\u093D\u092D\u093F\u091C\u093E\u092F\u0924\u0947\u0965",
    simpleHindi: "\u0935\u093F\u0937\u092F\u094B\u0902 \u0915\u093E \u0928\u093F\u0930\u0902\u0924\u0930 \u091A\u093F\u0902\u0924\u0928 \u0915\u0930\u0928\u0947 \u0938\u0947 \u0906\u0938\u0915\u094D\u0924\u093F, \u0906\u0938\u0915\u094D\u0924\u093F \u0938\u0947 \u0915\u093E\u092E\u0928\u093E \u0914\u0930 \u0915\u093E\u092E\u0928\u093E \u092E\u0947\u0902 \u092C\u093E\u0927\u093E \u0938\u0947 \u0915\u094D\u0930\u094B\u0927 \u0909\u0924\u094D\u092A\u0928\u094D\u0928 \u0939\u094B\u0924\u093E \u0939\u0948\u0964",
    bhavarth: "\u0905\u0924\u093F-\u0905\u092A\u0947\u0915\u094D\u0937\u093E\u090F\u0902 \u0914\u0930 \u0905\u0928\u093F\u092F\u0902\u0924\u094D\u0930\u093F\u0924 \u0907\u091A\u094D\u091B\u093E\u090F\u0902 \u0939\u0940 \u0917\u0941\u0938\u094D\u0938\u0947 \u0915\u093E \u092E\u0942\u0932 \u0915\u093E\u0930\u0923 \u0939\u0948\u0902\u0964",
    aajKiSeekh: "\u0917\u0941\u0938\u094D\u0938\u0947 \u0915\u094B \u0930\u094B\u0915\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0905\u092A\u0928\u0940 \u0905\u092A\u0947\u0915\u094D\u0937\u093E\u0913\u0902 \u0915\u094B \u092A\u0939\u091A\u093E\u0928\u0947\u0902 \u0914\u0930 \u0935\u093F\u091A\u093E\u0930\u094B\u0902 \u0915\u094B \u0936\u093E\u0902\u0924 \u0930\u0916\u0947\u0902\u0964",
    topics: ["\u0915\u094D\u0930\u094B\u0927", "\u0917\u0941\u0938\u094D\u0938\u093E", "\u092E\u0928", "\u0905\u092A\u0947\u0915\u094D\u0937\u093E", "\u0930\u093F\u0936\u094D\u0924\u0947"]
  },
  {
    chapter: 2,
    verse: 63,
    sanskrit: "\u0915\u094D\u0930\u094B\u0927\u093E\u0926\u094D\u092D\u0935\u0924\u093F \u0938\u0902\u092E\u094B\u0939\u0903 \u0938\u0902\u092E\u094B\u0939\u093E\u0924\u094D\u0938\u094D\u092E\u0943\u0924\u093F\u0935\u093F\u092D\u094D\u0930\u092E\u0903\u0964 \u0938\u094D\u092E\u0943\u0924\u093F\u092D\u094D\u0930\u0902\u0936\u093E\u0926\u094D \u092C\u0941\u0926\u094D\u0927\u093F\u0928\u093E\u0936\u094B \u092C\u0941\u0926\u094D\u0927\u093F\u0928\u093E\u0936\u093E\u0924\u094D\u092A\u094D\u0930\u0923\u0936\u094D\u092F\u0924\u093F\u0965",
    simpleHindi: "\u0915\u094D\u0930\u094B\u0927 \u0938\u0947 \u0905\u0935\u093F\u0935\u0947\u0915 (\u092D\u094D\u0930\u092E) \u0939\u094B\u0924\u093E \u0939\u0948, \u092D\u094D\u0930\u092E \u0938\u0947 \u0938\u094D\u092E\u0943\u0924\u093F \u0915\u093E \u0928\u093E\u0936 \u0939\u094B\u0924\u093E \u0939\u0948 \u0914\u0930 \u092C\u0941\u0926\u094D\u0927\u093F \u0915\u0947 \u0928\u093E\u0936 \u0938\u0947 \u092E\u0928\u0941\u0937\u094D\u092F \u0915\u093E \u092A\u0924\u0928 \u0939\u094B \u091C\u093E\u0924\u093E \u0939\u0948\u0964",
    bhavarth: "\u0917\u0941\u0938\u094D\u0938\u0947 \u092E\u0947\u0902 \u0938\u0939\u0940 \u0928\u093F\u0930\u094D\u0923\u092F \u0932\u0947\u0928\u0947 \u0915\u0940 \u0915\u094D\u0937\u092E\u0924\u093E \u0928\u0937\u094D\u091F \u0939\u094B \u091C\u093E\u0924\u0940 \u0939\u0948\u0964",
    aajKiSeekh: "\u0915\u094D\u0930\u094B\u0927 \u0915\u0947 \u0938\u092E\u092F \u0915\u094B\u0908 \u092D\u0940 \u092C\u0921\u093C\u093E \u0928\u093F\u0930\u094D\u0923\u092F \u0928 \u0932\u0947\u0902\u0964 \u0936\u093E\u0902\u0924 \u0939\u094B\u0928\u0947 \u092A\u0930 \u0939\u0940 \u092A\u094D\u0930\u0924\u093F\u0915\u094D\u0930\u093F\u092F\u093E \u0926\u0947\u0902\u0964",
    topics: ["\u0915\u094D\u0930\u094B\u0927", "\u0928\u093F\u0930\u094D\u0923\u092F", "\u092C\u0941\u0926\u094D\u0927\u093F", "\u0930\u093F\u0936\u094D\u0924\u0947"]
  },
  {
    chapter: 6,
    verse: 5,
    sanskrit: "\u0909\u0926\u094D\u0927\u0930\u0947\u0926\u093E\u0924\u094D\u092E\u0928\u093E\u0924\u094D\u092E\u093E\u0928\u0902 \u0928\u093E\u0924\u094D\u092E\u093E\u0928\u092E\u0935\u0938\u093E\u0926\u092F\u0947\u0924\u094D\u0964 \u0906\u0924\u094D\u092E\u0948\u0935 \u0939\u094D\u092F\u093E\u0924\u094D\u092E\u0928\u094B \u092C\u0928\u094D\u0927\u0941\u0930\u093E\u0924\u094D\u092E\u0948\u0935 \u0930\u093F\u092A\u0941\u0930\u093E\u0924\u094D\u092E\u0928\u0903\u0965",
    simpleHindi: "\u092E\u0928\u0941\u0937\u094D\u092F \u0915\u094B \u091A\u093E\u0939\u093F\u090F \u0915\u093F \u0935\u0939 \u0905\u092A\u0928\u0947 \u092E\u0928 \u0915\u0947 \u0926\u094D\u0935\u093E\u0930\u093E \u0905\u092A\u0928\u093E \u0909\u0926\u094D\u0927\u093E\u0930 \u0915\u0930\u0947, \u0938\u094D\u0935\u092F\u0902 \u0915\u094B \u0928 \u0917\u093F\u0930\u093E\u090F; \u0915\u094D\u092F\u094B\u0902\u0915\u093F \u092E\u0928 \u0939\u0940 \u092E\u093F\u0924\u094D\u0930 \u0939\u0948 \u0914\u0930 \u092E\u0928 \u0939\u0940 \u0936\u0924\u094D\u0930\u0941 \u0939\u0948\u0964",
    bhavarth: "\u0905\u0928\u0941\u0936\u093E\u0938\u093F\u0924 \u092E\u0928 \u0938\u092C\u0938\u0947 \u092C\u0921\u093C\u093E \u0938\u093E\u0925\u0940 \u0939\u0948 \u0914\u0930 \u0905\u0928\u093F\u092F\u0902\u0924\u094D\u0930\u093F\u0924 \u092E\u0928 \u0938\u092C\u0938\u0947 \u092C\u0921\u093C\u093E \u092C\u093E\u0927\u0915\u0964",
    aajKiSeekh: "\u0906\u0924\u094D\u092E-\u0938\u0902\u0926\u0947\u0939 \u0938\u0947 \u092C\u091A\u0947\u0902\u0964 \u0938\u0915\u093E\u0930\u093E\u0924\u094D\u092E\u0915 \u0938\u094B\u091A \u0914\u0930 \u0928\u093F\u0930\u0902\u0924\u0930 \u0905\u092D\u094D\u092F\u093E\u0938 \u0938\u0947 \u0905\u092A\u0928\u0947 \u092E\u0928 \u0915\u094B \u0938\u0936\u0915\u094D\u0924 \u092C\u0928\u093E\u090F\u0902\u0964",
    topics: ["\u092E\u0928", "\u0906\u0924\u094D\u092E\u0935\u093F\u0936\u094D\u0935\u093E\u0938", "\u0906\u0932\u0938\u094D\u092F", "\u0905\u0928\u0941\u0936\u093E\u0938\u0928", "\u0938\u092B\u0932\u0924\u093E", "\u090F\u0915\u093E\u0917\u094D\u0930\u0924\u093E"]
  },
  {
    chapter: 6,
    verse: 26,
    sanskrit: "\u092F\u0924\u094B \u092F\u0924\u094B \u0928\u093F\u0936\u094D\u091A\u0930\u0924\u093F \u092E\u0928\u0936\u094D\u091A\u091E\u094D\u091A\u0932\u092E\u0938\u094D\u0925\u093F\u0930\u092E\u094D\u0964 \u0924\u0924\u0938\u094D\u0924\u0924\u094B \u0928\u093F\u092F\u092E\u094D\u092F\u0948\u0924\u0926\u093E\u0924\u094D\u092E\u0928\u094D\u092F\u0947\u0935 \u0935\u0936\u0902 \u0928\u092F\u0947\u0924\u094D\u0965",
    simpleHindi: "\u092F\u0939 \u091A\u0902\u091A\u0932 \u092E\u0928 \u091C\u093F\u0938-\u091C\u093F\u0938 \u0935\u093F\u0937\u092F \u0915\u0940 \u0913\u0930 \u092D\u093E\u0917\u0947, \u0935\u0939\u093E\u0901-\u0935\u0939\u093E\u0901 \u0938\u0947 \u0907\u0938\u0947 \u0930\u094B\u0915\u0915\u0930 \u092A\u0941\u0928\u0903 \u0906\u0924\u094D\u092E\u093E \u092E\u0947\u0902 \u0938\u094D\u0925\u093F\u0930 \u0915\u0930\u0947\u0902\u0964",
    bhavarth: "\u092E\u0928 \u0915\u093E \u092D\u091F\u0915\u0928\u093E \u0938\u094D\u0935\u093E\u092D\u093E\u0935\u093F\u0915 \u0939\u0948, \u0909\u0938\u0947 \u092C\u093E\u0930-\u092C\u093E\u0930 \u0927\u0948\u0930\u094D\u092F\u092A\u0942\u0930\u094D\u0935\u0915 \u0932\u0915\u094D\u0937\u094D\u092F \u092A\u0930 \u0932\u094C\u091F\u093E\u0928\u093E \u0939\u0940 \u0938\u093E\u0927\u0928\u093E \u0939\u0948\u0964",
    aajKiSeekh: "\u091C\u092C \u092D\u0940 \u0927\u094D\u092F\u093E\u0928 \u092D\u091F\u0915\u0947, \u092C\u093F\u0928\u093E \u091D\u0932\u094D\u0932\u093E\u0939\u091F \u0915\u0947 \u0924\u0941\u0930\u0902\u0924 \u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u0915\u093E\u0930\u094D\u092F \u092A\u0930 \u0932\u094C\u091F \u0906\u090F\u0902\u0964",
    topics: ["\u090F\u0915\u093E\u0917\u094D\u0930\u0924\u093E", "\u092E\u0928", "\u0927\u094D\u092F\u093E\u0928", "\u092A\u0922\u093C\u093E\u0908", "\u0915\u093E\u092E"]
  },
  {
    chapter: 9,
    verse: 22,
    sanskrit: "\u0905\u0928\u0928\u094D\u092F\u093E\u0936\u094D\u091A\u093F\u0928\u094D\u0924\u092F\u0928\u094D\u0924\u094B \u092E\u093E\u0902 \u092F\u0947 \u091C\u0928\u093E\u0903 \u092A\u0930\u094D\u092F\u0941\u092A\u093E\u0938\u0924\u0947\u0964 \u0924\u0947\u0937\u093E\u0902 \u0928\u093F\u0924\u094D\u092F\u093E\u092D\u093F\u092F\u0941\u0915\u094D\u0924\u093E\u0928\u093E\u0902 \u092F\u094B\u0917\u0915\u094D\u0937\u0947\u092E\u0902 \u0935\u0939\u093E\u092E\u094D\u092F\u0939\u092E\u094D\u0965",
    simpleHindi: "\u091C\u094B \u0905\u0928\u0928\u094D\u092F \u092D\u093E\u0935 \u0938\u0947 \u0938\u0924\u094D\u0915\u0930\u094D\u092E \u0914\u0930 \u092A\u094D\u0930\u092D\u0941 \u0915\u093E \u091A\u093F\u0902\u0924\u0928 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902, \u0909\u0928\u0915\u0947 \u0915\u0932\u094D\u092F\u093E\u0923 \u0914\u0930 \u0938\u0941\u0930\u0915\u094D\u0937\u093E \u0915\u093E \u0926\u093E\u092F\u093F\u0924\u094D\u0935 \u0908\u0936\u094D\u0935\u0930 \u0938\u094D\u0935\u092F\u0902 \u0938\u0902\u092D\u093E\u0932\u0924\u0947 \u0939\u0948\u0902\u0964",
    bhavarth: "\u0908\u092E\u093E\u0928\u0926\u093E\u0930\u0940 \u0914\u0930 \u0938\u092E\u0930\u094D\u092A\u0923 \u0938\u0947 \u0915\u0930\u094D\u092E \u0915\u0930\u0928\u0947 \u0935\u093E\u0932\u0947 \u0915\u094B \u092D\u0935\u093F\u0937\u094D\u092F \u0915\u0940 \u0905\u0924\u094D\u092F\u0927\u093F\u0915 \u091A\u093F\u0902\u0924\u093E \u0915\u0930\u0928\u0947 \u0915\u0940 \u0906\u0935\u0936\u094D\u092F\u0915\u0924\u093E \u0928\u0939\u0940\u0902 \u0939\u0948\u0964",
    aajKiSeekh: "\u092D\u0935\u093F\u0937\u094D\u092F \u0915\u0947 \u092D\u092F \u0915\u094B \u091B\u094B\u0921\u093C\u0947\u0902\u0964 \u0938\u0939\u0940 \u0928\u0940\u092F\u0924 \u0914\u0930 \u0932\u0917\u0928 \u0938\u0947 \u0906\u0917\u0947 \u092C\u0922\u093C\u0947\u0902\u0964",
    topics: ["\u092D\u092F", "\u0938\u0941\u0930\u0915\u094D\u0937\u093E", "\u091A\u093F\u0902\u0924\u093E", "\u0935\u093F\u0936\u094D\u0935\u093E\u0938", "\u0936\u093E\u0902\u0924\u093F"]
  }
];
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "GeetaFlow", version: "1.0.0" });
});
app.post("/api/convert-to-mp4", async (req, res) => {
  let inputPath = "";
  let outputPath = "";
  try {
    if (!req.body || !Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ error: "No video binary data received" });
    }
    const requestedFilename = req.headers["x-filename"] || "GeetaFlow_Reel.mp4";
    const cleanFilename = requestedFilename.replace(/[^a-zA-Z0-9_\-\.]/g, "_").replace(/\.webm$/i, ".mp4");
    const uniqueId = import_crypto.default.randomUUID();
    const tempDir = import_os.default.tmpdir();
    inputPath = import_path.default.join(tempDir, `reel_in_${uniqueId}.webm`);
    outputPath = import_path.default.join(tempDir, `reel_out_${uniqueId}.mp4`);
    await import_fs.default.promises.writeFile(inputPath, req.body);
    (0, import_child_process.execFile)("ffprobe", [
      "-i",
      inputPath,
      "-show_streams",
      "-select_streams",
      "a",
      "-loglevel",
      "error"
    ], (probeErr, probeStdout) => {
      const hasAudio = !probeErr && probeStdout && probeStdout.trim().length > 0;
      const ffmpegArgs = hasAudio ? [
        "-y",
        "-i",
        inputPath,
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-profile:v",
        "high",
        "-level",
        "4.1",
        "-preset",
        "fast",
        "-crf",
        "19",
        "-r",
        "30",
        "-g",
        "60",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-ar",
        "44100",
        "-ac",
        "2",
        "-movflags",
        "+faststart",
        outputPath
      ] : [
        "-y",
        "-i",
        inputPath,
        "-f",
        "lavfi",
        "-i",
        "anullsrc=channel_layout=stereo:sample_rate=44100",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-profile:v",
        "high",
        "-level",
        "4.1",
        "-preset",
        "fast",
        "-crf",
        "19",
        "-r",
        "30",
        "-g",
        "60",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-shortest",
        "-movflags",
        "+faststart",
        outputPath
      ];
      (0, import_child_process.execFile)("ffmpeg", ffmpegArgs, async (convErr, _stdout, stderr) => {
        if (convErr) {
          console.error("ffmpeg MP4 conversion error:", convErr, stderr);
          try {
            if (inputPath) await import_fs.default.promises.unlink(inputPath);
          } catch {
          }
          try {
            if (outputPath) await import_fs.default.promises.unlink(outputPath);
          } catch {
          }
          return res.status(500).json({ error: "Video encoding failed", details: stderr || convErr.message });
        }
        try {
          const stat = await import_fs.default.promises.stat(outputPath);
          res.setHeader("Content-Type", "video/mp4");
          res.setHeader("Content-Length", stat.size);
          res.setHeader("Content-Disposition", `attachment; filename="${cleanFilename}"`);
          res.setHeader("Cache-Control", "no-cache");
          const stream = import_fs.default.createReadStream(outputPath);
          stream.pipe(res);
          const cleanup = async () => {
            try {
              if (inputPath) await import_fs.default.promises.unlink(inputPath);
            } catch {
            }
            try {
              if (outputPath) await import_fs.default.promises.unlink(outputPath);
            } catch {
            }
          };
          stream.on("close", cleanup);
          stream.on("error", (streamErr) => {
            console.error("Streaming MP4 error:", streamErr);
            cleanup();
          });
        } catch (statErr) {
          console.error("MP4 stat error:", statErr);
          res.status(500).json({ error: "Failed to access converted video" });
        }
      });
    });
  } catch (err) {
    console.error("Server error in /api/convert-to-mp4:", err);
    try {
      if (inputPath) await import_fs.default.promises.unlink(inputPath);
    } catch {
    }
    try {
      if (outputPath) await import_fs.default.promises.unlink(outputPath);
    } catch {
    }
    res.status(500).json({ error: "Internal server error during MP4 conversion" });
  }
});
app.post("/api/ask-gita", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Question is required" });
    }
    const cleanQuestion = question.trim().toLowerCase();
    const matchedVerses = GITA_KNOWLEDGE_BASE.filter(
      (v) => v.topics.some((t) => cleanQuestion.includes(t.toLowerCase())) || cleanQuestion.includes(v.simpleHindi.toLowerCase())
    );
    const primaryVerses = matchedVerses.length > 0 ? matchedVerses.slice(0, 2) : [GITA_KNOWLEDGE_BASE[0], GITA_KNOWLEDGE_BASE[4]];
    let gitaPerspective = "";
    let practicalReflection = "";
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiClient();
        const prompt = `You are a respectful, authentic Bhagavad Gita wisdom guide for GeetaFlow app.
User's Question: "${question}"

Relevant Authentic Gita Verses retrieved for this question:
${primaryVerses.map((v) => `\u2022 Chapter ${v.chapter}, Verse ${v.verse}:
  Sanskrit: ${v.sanskrit}
  Hindi: ${v.simpleHindi}
  Core Principle: ${v.bhavarth}`).join("\n")}

STRICT THEOLOGICAL & PROMPTING RULES:
1. PROHIBIT DIRECT SPEECH ATTRIBUTION: You are STRICTLY FORBIDDEN from using phrases that attribute direct speech to Krishna (such as "Krishna says...", "\u0936\u094D\u0930\u0940\u0915\u0943\u0937\u094D\u0923 \u0915\u0939\u0924\u0947 \u0939\u0948\u0902 \u0915\u093F...", "\u092D\u0917\u0935\u093E\u0928 \u0936\u094D\u0930\u0940\u0915\u0943\u0937\u094D\u0923 \u0928\u0947 \u0915\u0939\u093E \u0939\u0948...") UNLESS you are quoting a specific authentic verse word-for-word with its chapter and verse citation.
2. MANDATORY FRAMING PHRASES: When explaining the philosophical perspective, you MUST consistently use phrases like:
   - "\u092D\u0917\u0935\u0926\u094D\u0917\u0940\u0924\u093E \u0915\u0940 \u0936\u093F\u0915\u094D\u0937\u093E\u0913\u0902 \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930..." (Based on the teachings of the Bhagavad Gita...)
   - "\u0907\u0928 \u0936\u094D\u0932\u094B\u0915\u094B\u0902 \u0938\u0947 \u0906\u0927\u0941\u0928\u093F\u0915 \u091C\u0940\u0935\u0928 \u0915\u0947 \u0932\u093F\u090F \u090F\u0915 \u0926\u0943\u0937\u094D\u091F\u093F\u0915\u094B\u0923 \u092F\u0939 \u0939\u094B \u0938\u0915\u0924\u093E \u0939\u0948..." (A modern interpretation from these verses could be...)
3. PRIORITIZATION: The system presents the authentic verses FIRST to the user. Your role in "gitaPerspective" is to provide a grounded, compassionate philosophical context (100-140 words in clean, natural Hindi).
4. ACTIONABLE REFLECTION: "practicalReflection" must provide 2-3 calm, concrete, peaceful daily steps ("\u0906\u091C \u0915\u0947 \u091C\u0940\u0935\u0928 \u092E\u0947\u0902 \u092A\u094D\u0930\u092F\u094B\u0917") in Hindi.

Return ONLY a valid JSON object with keys:
{
  "gitaPerspective": "string starting with or prominently using '\u092D\u0917\u0935\u0926\u094D\u0917\u0940\u0924\u093E \u0915\u0940 \u0936\u093F\u0915\u094D\u0937\u093E\u0913\u0902 \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930...' or '\u0907\u0928 \u0936\u094D\u0932\u094B\u0915\u094B\u0902 \u0938\u0947 \u0906\u0927\u0941\u0928\u093F\u0915 \u091C\u0940\u0935\u0928 \u0915\u0947 \u0932\u093F\u090F \u0926\u0943\u0937\u094D\u091F\u093F\u0915\u094B\u0923 \u092F\u0939 \u0939\u094B \u0938\u0915\u0924\u093E \u0939\u0948...'",
  "practicalReflection": "string with 2-3 numbered practical daily reflections"
}`;
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json"
          }
        });
        const parsed = JSON.parse(response.text || "{}");
        gitaPerspective = parsed.gitaPerspective || "";
        practicalReflection = parsed.practicalReflection || "";
      } catch (geminiErr) {
        console.warn("Gemini API fallback to local grounded synthesis:", geminiErr);
      }
    }
    if (!gitaPerspective) {
      gitaPerspective = `\u092D\u0917\u0935\u0926\u094D\u0917\u0940\u0924\u093E \u0915\u0940 \u0936\u093F\u0915\u094D\u0937\u093E\u0913\u0902 \u0915\u0947 \u0906\u0927\u093E\u0930 \u092A\u0930, \u092F\u0939 \u092A\u0930\u093F\u0938\u094D\u0925\u093F\u0924\u093F \u092E\u0928 \u0915\u0940 \u0905\u0938\u094D\u0925\u093F\u0930\u0924\u093E \u0914\u0930 \u0915\u0930\u094D\u092E \u0915\u0947 \u0938\u094D\u0925\u093E\u0928 \u092A\u0930 \u0915\u0947\u0935\u0932 \u092A\u0930\u093F\u0923\u093E\u092E \u092E\u0947\u0902 \u0909\u0932\u091D\u0928\u0947 \u0938\u0947 \u0909\u0924\u094D\u092A\u0928\u094D\u0928 \u0939\u094B\u0924\u0940 \u0939\u0948\u0964 \u0907\u0928 \u0936\u094D\u0932\u094B\u0915\u094B\u0902 \u0938\u0947 \u0906\u0927\u0941\u0928\u093F\u0915 \u091C\u0940\u0935\u0928 \u0915\u0947 \u0932\u093F\u090F \u090F\u0915 \u0926\u0943\u0937\u094D\u091F\u093F\u0915\u094B\u0923 \u092F\u0939 \u0939\u094B \u0938\u0915\u0924\u093E \u0939\u0948 \u0915\u093F \u0939\u092E\u093E\u0930\u0947 \u0905\u0927\u093F\u0915\u093E\u0930 \u0915\u094D\u0937\u0947\u0924\u094D\u0930 \u092E\u0947\u0902 \u0915\u0947\u0935\u0932 \u0906\u091C \u0915\u093E \u0928\u093F\u0937\u094D\u0920\u093E\u0935\u093E\u0928 \u092A\u094D\u0930\u092F\u093E\u0938 \u0939\u0948, \u092D\u0935\u093F\u0937\u094D\u092F \u0915\u093E \u092A\u0930\u093F\u0923\u093E\u092E \u0928\u0939\u0940\u0902\u0964 \u091C\u092C \u0939\u092E \u092B\u0932 \u0915\u0940 \u091A\u093F\u0902\u0924\u093E \u0938\u0947 \u092E\u0941\u0915\u094D\u0924 \u0939\u094B\u0915\u0930 \u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u0915\u0930\u094D\u0924\u0935\u094D\u092F \u092E\u0947\u0902 \u090F\u0915\u093E\u0917\u094D\u0930 \u0939\u094B\u0924\u0947 \u0939\u0948\u0902, \u0924\u094B \u091A\u093F\u0924\u094D\u0924 \u0915\u094B \u0938\u094D\u0935\u093E\u092D\u093E\u0935\u093F\u0915 \u0936\u093E\u0902\u0924\u093F \u0914\u0930 \u0938\u094D\u092A\u0937\u094D\u091F\u0924\u093E \u092A\u094D\u0930\u093E\u092A\u094D\u0924 \u0939\u094B\u0924\u0940 \u0939\u0948\u0964`;
      practicalReflection = `1. \u0906\u091C \u0905\u092A\u0928\u0947 \u0928\u093F\u092F\u0902\u0924\u094D\u0930\u0923 \u092E\u0947\u0902 \u0906\u0928\u0947 \u0935\u093E\u0932\u0947 2 \u092E\u0941\u0916\u094D\u092F \u0915\u093E\u0930\u094D\u092F\u094B\u0902 \u0915\u0940 \u0938\u0942\u091A\u0940 \u092C\u0928\u093E\u090F\u0902 \u0914\u0930 \u0905\u092A\u0928\u093E \u0938\u0930\u094D\u0935\u0936\u094D\u0930\u0947\u0937\u094D\u0920 \u092A\u094D\u0930\u092F\u093E\u0938 \u0926\u0947\u0902\u0964
2. \u091C\u092C \u092D\u0940 \u092E\u0928 \u092E\u0947\u0902 \u0938\u0902\u0936\u092F \u092F\u093E \u091A\u093F\u0902\u0924\u093E \u0906\u090F, 5 \u092C\u093E\u0930 \u0917\u0939\u0930\u0940 \u0938\u093E\u0902\u0938 \u0932\u0947\u0902 \u0914\u0930 '\u0915\u0930\u094D\u092E\u0923\u094D\u092F\u0947\u0935\u093E\u0927\u093F\u0915\u093E\u0930\u0938\u094D\u0924\u0947' \u0915\u0947 \u092E\u0942\u0932 \u092D\u093E\u0935 \u0915\u093E \u0938\u094D\u092E\u0930\u0923 \u0915\u0930\u0947\u0902\u0964
3. \u0926\u0942\u0938\u0930\u094B\u0902 \u0938\u0947 \u0924\u0941\u0932\u0928\u093E \u0915\u0930\u0928\u0947 \u0915\u0947 \u092C\u091C\u093E\u092F \u0905\u092A\u0928\u0940 \u092E\u093E\u0928\u0938\u093F\u0915 \u0936\u093E\u0902\u0924\u093F \u0914\u0930 \u0906\u0924\u094D\u092E-\u0935\u093F\u0915\u093E\u0938 \u092A\u0930 \u0927\u094D\u092F\u093E\u0928 \u0915\u0947\u0902\u0926\u094D\u0930\u093F\u0924 \u0915\u0930\u0947\u0902\u0964`;
    }
    res.json({
      query: question,
      matchedTheme: primaryVerses[0]?.topics[0] || "\u0915\u0930\u094D\u092E \u0935 \u092E\u093E\u0930\u094D\u0917\u0926\u0930\u094D\u0936\u0928",
      relevantVerses: primaryVerses,
      gitaPerspective,
      practicalReflection
    });
  } catch (err) {
    console.error("Error in /api/ask-gita:", err);
    res.status(500).json({ error: "Failed to process Gita inquiry", details: err?.message });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GeetaFlow server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
