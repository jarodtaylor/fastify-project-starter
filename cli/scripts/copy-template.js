#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const EXCLUDE_PATTERNS = [
  "node_modules",
  ".git",
  "cli",
  ".turbo",
  "data/",
  "dist",
  "build",
  ".next",
  ".react-router",
  "*.log",
  ".DS_Store",
];

function shouldExclude(filename) {
  return EXCLUDE_PATTERNS.some((pattern) => {
    if (pattern.includes("*")) {
      const regex = new RegExp(pattern.replace(/\*/g, ".*"));
      return regex.test(filename);
    }
    // Exact match for directories ending with / or exact filename match
    if (pattern.endsWith("/")) {
      return filename === pattern.slice(0, -1);
    }
    return filename === pattern;
  });
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src);

  for (const entry of entries) {
    if (shouldExclude(entry)) {
      continue;
    }

    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    const stats = fs.statSync(srcPath);

    if (stats.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy from parent directory to template directory
const projectRoot = path.resolve(__dirname, "../..");
const templateDest = path.resolve(__dirname, "../template");

console.log("Copying template files...");
console.log(`From: ${projectRoot}`);
console.log(`To: ${templateDest}`);

// Clean existing template directory
if (fs.existsSync(templateDest)) {
  fs.rmSync(templateDest, { recursive: true });
}

copyRecursive(projectRoot, templateDest);
console.log("Template files copied successfully!");
