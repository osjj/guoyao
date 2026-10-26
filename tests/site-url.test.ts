import assert from "node:assert/strict";
import test from "node:test";
import { resolveSiteUrl } from "../src/lib/site-url";

test("all production Guoyao origins resolve to the HTTPS www canonical", () => {
  for (const configured of [undefined, "", " https://guoyaometal.com/ ", "http://guoyaometal.com", "https://www.guoyaometal.com/blog"]) {
    assert.equal(resolveSiteUrl(configured), "https://www.guoyaometal.com");
  }
});

test("preview and local origins stay usable; unsafe configurations fall back", () => {
  assert.equal(resolveSiteUrl("http://localhost:3000/blog?q=1"), "http://localhost:3000");
  assert.equal(resolveSiteUrl("https://preview.example.com/"), "https://preview.example.com");
  for (const configured of ["not a url", "ftp://guoyaometal.com", "https://user:password@example.com", "javascript:alert(1)"]) {
    assert.equal(resolveSiteUrl(configured), "https://www.guoyaometal.com");
  }
});
