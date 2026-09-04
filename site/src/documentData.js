import careerContent from "./careerContent.json" with { type: "json" };

export const DOCUMENTS = [
  {
    id: "cv",
    shortLabel: "CV",
    index: "01",
    eyebrow: "Public CV · English",
    title: "My projects, experience and studies.",
    summary:
      "A one-page overview of my background and the projects I have built with AI assistance.",
    pdfPath: "/documents/Ardian_Mehaj_Public_CV_EN.pdf",
    fileName: "Ardian_Mehaj_Public_CV_EN.pdf",
  },
  {
    id: "letter",
    shortLabel: "Letter",
    index: "02",
    eyebrow: "General motivation · English",
    title: "Why I’m looking for my first software role.",
    summary:
      "My route into software, how I work and what I hope to learn in a team.",
    pdfPath: "/documents/Ardian_Mehaj_General_Motivation_Letter_EN.pdf",
    fileName: "Ardian_Mehaj_General_Motivation_Letter_EN.pdf",
  },
];

export const CV_CONTENT = careerContent.cv;
export const LETTER_CONTENT = careerContent.letter;

export function documentById(id) {
  return DOCUMENTS.find((document) => document.id === id) ?? DOCUMENTS[0];
}
