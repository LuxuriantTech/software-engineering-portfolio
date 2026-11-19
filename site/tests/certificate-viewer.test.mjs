import test from "node:test";
import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {CERTIFICATE_DOCUMENTS,CV_CERTIFICATES,DOCUMENTS,documentById,documentFamily} from "../src/documentData.js";

test("certificate selection resolves its own tab group while retaining the three career documents", () => {
  assert.deepEqual(DOCUMENTS.map(({id}) => id), ["cv","cv-fr","letter"]);
  assert.deepEqual(CERTIFICATE_DOCUMENTS.slice(0, 4).map(({id}) => id), [
    "ibm-ai-engineering", "ibm-machine-learning", "sas-managing-machine-learning-models", "ibm-data-analyst",
  ]);
  assert.equal(new Set([...DOCUMENTS,...CERTIFICATE_DOCUMENTS].map(({id}) => id)).size,12);
  assert.deepEqual(CV_CERTIFICATES.map(({id}) => id), [
    "ibm-ai-engineering", "ibm-machine-learning", "ibm-rag-agentic-ai", "ibm-data-science",
    "hbr-generative-ai", "hbr-business-savvy",
  ]);
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
