const sentenceSegmenter = new Intl.Segmenter('en', { granularity: 'sentence' });

export function projectDescriptionSentences(description: string): string[] {
  return [...sentenceSegmenter.segment(description)]
    .map(({ segment }) => segment.trim())
    .filter(Boolean);
}

export function projectDescriptionExcerpt(description: string): string {
  return projectDescriptionSentences(description)[0] ?? description;
}
