import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {CERTIFICATE_DOCUMENTS,DOCUMENTS,documentById,documentFamily} from "../src/documentData.js";

test("certificate selection resolves its own tab group while retaining the three career documents", () => {
  assert.deepEqual(DOCUMENTS.map(({id}) => id), ["cv","cv-fr","letter"]);
  assert.equal(CERTIFICATE_DOCUMENTS.length,5);
  assert.equal(new Set([...DOCUMENTS,...CERTIFICATE_DOCUMENTS].map(({id}) => id)).size,8);
  for(const certificate of CERTIFICATE_DOCUMENTS) {
    assert.equal(documentFamily(certificate.id),"certificate");
    assert.equal(documentById(certificate.id),certificate);
  }
  for(const document of DOCUMENTS) {
    assert.equal(documentFamily(document.id),"document");
    assert.equal(documentById(document.id),document);
  }
  assert.equal(documentById("unknown").id,"cv");
});

test("all certificate download and preview paths resolve to real PDF and WebP assets", async () => {
  for(const certificate of CERTIFICATE_DOCUMENTS) {
    assert.match(certificate.pdfPath,/^\/certificates\/[a-z-]+\.pdf$/);
    assert.match(certificate.previewPath,/^\/certificates\/[a-z-]+\.webp$/);
    const pdf=await readFile(new URL(`../public${certificate.pdfPath}`,import.meta.url));
    const image=await readFile(new URL(`../public${certificate.previewPath}`,import.meta.url));
    assert.equal(pdf.subarray(0,5).toString(),"%PDF-");
    assert.ok(pdf.length>20000);
    assert.equal(image.subarray(0,4).toString(),"RIFF");
    assert.equal(image.subarray(8,12).toString(),"WEBP");
    assert.ok(image.length>20000);
    assert.ok(certificate.previewWidth>certificate.previewHeight);
    assert.match(certificate.url,/^https:\/\/coursera\.org\/verify\//);
  }
});
