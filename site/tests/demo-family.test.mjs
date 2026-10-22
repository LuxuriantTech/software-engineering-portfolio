import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const routes = ["api-contract-guard", "toolcall-replay", "entity-resolution-workbench", "evidencedesk", "postgres-migration-rehearsal", "skill-studio"];

test("each public demo loads the shared family and its local font assets", async () => {
  for (const route of routes) {
    const html = await readFile(new URL(`../public/projects/${route}/index.html`, import.meta.url), "utf8");
    assert.match(html, /href="\.\.\/demo-family\.css"/);
  }
  const css = await readFile(new URL("../public/projects/demo-family.css", import.meta.url), "utf8");
  const fonts = [...css.matchAll(/url\("(\/projects\/assets\/fonts\/[^\"]+\.woff2)"\)/g)].map(match => match[1]);
  assert.equal(fonts.length, 3);
  for (const path of fonts) assert.ok((await stat(new URL(`../public${path}`, import.meta.url))).size > 10_000);
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  const policy = config.headers.find(rule => rule.source === "/projects/skill-studio/(.*)").headers.find(header => header.key === "Content-Security-Policy").value;
  assert.match(policy, /font-src 'self'/);
  assert.match(policy, /connect-src 'none'/);
});

test("Skill Studio skip destinations can receive keyboard focus", async () => {
  for (const page of ["index", "guide", "evidence", "evaluation"]) {
    const html = await readFile(new URL(`../public/projects/skill-studio/${page}.html`, import.meta.url), "utf8");
    const skipTarget=html.match(/class="skip" href="#([^\"]+)"/)?.[1];
    const main=html.match(/<main\b[^>]*>/)?.[0];
    assert.ok(skipTarget && main);
    assert.match(main, /\btabindex="-1"/);
    assert.ok(main.includes(`id="${skipTarget}"`));
  }
});

test("shared focus token contrasts with the light, dark and skip surfaces", async () => {
  const css = await readFile(new URL("../public/projects/demo-family.css", import.meta.url), "utf8");
  const focus = css.match(/:root\{[^}]*--focus:(#[0-9a-f]{6})/i)?.[1];
  assert.ok(focus);
  const luminance = color => {
    const linear = [1,3,5].map(index => parseInt(color.slice(index,index+2),16)/255).map(value => value<=.04045?value/12.92:((value+.055)/1.055)**2.4);
    return .2126*linear[0]+.7152*linear[1]+.0722*linear[2];
  };
  for (const surface of ["#f4f1e8", "#fffdf7", "#f4ed53", "#151512"]) {
    const values=[luminance(focus),luminance(surface)].sort((a,b)=>a-b);
    assert.ok((values[1]+.05)/(values[0]+.05)>=3, `${focus} focus must contrast with ${surface}`);
  }
});
