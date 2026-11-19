import careerContent from "./careerContent.json" with { type: "json" };

export const DOCUMENTS = [
  {
    id: "cv",
    shortLabel: "CV (EN)",
    index: "01",
    eyebrow: "Public CV · English",
    title: "My projects, experience and studies.",
    summary:
      "A one-page CV with my OPIT results, technical projects and selected certificates.",
    pdfPath: "/documents/Ardian_Mehaj_Public_CV_EN.pdf",
    fileName: "Ardian_Mehaj_Public_CV_EN.pdf",
  },
  {
    id: "cv-fr",
    shortLabel: "CV (FR)",
    index: "02",
    eyebrow: "CV public · Français",
    title: "Mes projets, mon parcours et mes études.",
    summary: "Mes résultats à l’OPIT, mes projets techniques et une sélection de certificats en une page.",
    pdfPath: "/documents/Ardian_Mehaj_Public_CV_FR.pdf",
    fileName: "Ardian_Mehaj_Public_CV_FR.pdf",
  },
  {
    id: "letter",
    shortLabel: "Letter",
    index: "03",
    eyebrow: "General motivation · English",
    title: "Why I’m looking for my first software role.",
    summary:
      "My route into software, how I work and what I hope to learn in a team.",
    pdfPath: "/documents/Ardian_Mehaj_General_Motivation_Letter_EN.pdf",
    fileName: "Ardian_Mehaj_General_Motivation_Letter_EN.pdf",
  },
];

export const CV_CONTENT = careerContent.cv;
export const CV_FR_CONTENT = careerContent.cv_fr;
export const LETTER_CONTENT = careerContent.letter;
export const CERTIFICATES = careerContent.certificates;

const certificatesById = new Map(CERTIFICATES.map((certificate) => [certificate.id, certificate]));
export const CV_CERTIFICATES = careerContent.cvCertificateIds.map((id) => certificatesById.get(id));

export const CERTIFICATE_DOCUMENTS = CERTIFICATES.map((certificate, index) => ({
  ...certificate,
  index: String(index + 1).padStart(2, "0"),
  shortLabel: certificate.shortLabel,
  fileName: certificate.pdfPath?.split("/").at(-1) ?? `${certificate.id}.pdf`,
}));

export function documentFamily(id) {
  return CERTIFICATE_DOCUMENTS.some((certificate) => certificate.id === id)
    ? "certificate"
    : "document";
}

export function documentById(id) {
  return (
    DOCUMENTS.find((document) => document.id === id) ??
    CERTIFICATE_DOCUMENTS.find((certificate) => certificate.id === id) ??
    DOCUMENTS[0]
  );
}
