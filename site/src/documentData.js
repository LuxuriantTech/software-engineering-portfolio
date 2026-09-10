import careerContent from "./careerContent.json" with { type: "json" };

export const DOCUMENTS = [
  {
    id: "cv",
    shortLabel: "CV (EN)",
    index: "01",
    eyebrow: "Public CV · English",
    title: "My projects, experience and studies.",
    summary:
      "A one-page overview of my background and the projects I have built with AI assistance.",
    pdfPath: "/documents/Ardian_Mehaj_Public_CV_EN.pdf",
    fileName: "Ardian_Mehaj_Public_CV_EN.pdf",
  },
  {
    id: "cv-fr",
    shortLabel: "CV (FR)",
    index: "02",
    eyebrow: "CV public · Français",
    title: "Mes projets, mon parcours et mes études.",
    summary: "Mon profil et mes projets en une page, en français.",
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

export function documentById(id) {
  return DOCUMENTS.find((document) => document.id === id) ?? DOCUMENTS[0];
}
