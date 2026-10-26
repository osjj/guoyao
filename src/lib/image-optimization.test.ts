import assert from "node:assert/strict";
import test from "node:test";
import { canOptimizeImage } from "./image-optimization";

test("local raster images and configured CDN images can use responsive optimization", () => {
  for (const source of [
    "/images/project.webp", "/images/project.jpg?v=2",
    "https://media.guoyaometal.com/projects/column.webp",
    "https://media.glarivoglass.com/project.png?v=2",
  ]) assert.equal(canOptimizeImage(source), true, source);
});

test("query and port restrictions on the metal CDN match Next remotePatterns", () => {
  assert.equal(canOptimizeImage("https://media.guoyaometal.com/project.webp?v=2"), false);
  assert.equal(canOptimizeImage("https://media.guoyaometal.com:8443/project.webp"), false);
  assert.equal(canOptimizeImage("https://media.glarivoglass.com:8443/project.webp?v=2"), true);
});

test("known animations and vectors keep their original source even on allowed hosts", () => {
  for (const source of [
    "/images/process.GIF?v=2", "/images/process.apng", "/images/logo.svg",
    "https://media.guoyaometal.com/process.%67if",
    "https://media.glarivoglass.com/process.gif?download=1",
  ]) assert.equal(canOptimizeImage(source), false, source);
});

test("unknown and malformed URLs never enter the configured optimizer", () => {
  for (const source of [
    "https://other.example/project.jpg", "http://media.guoyaometal.com/project.jpg",
    "https://media.guoyaometal.com.other.example/project.jpg", "//media.guoyaometal.com/project.jpg",
    "images/project.jpg", "/\\other.example/project.jpg", "https://user:pass@media.guoyaometal.com/project.jpg",
    "data:image/png;base64,abc", "/images/invalid%zz.jpg", "", " /images/project.jpg",
  ]) assert.equal(canOptimizeImage(source), false, source);
});
