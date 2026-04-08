import { POEM_TEMPLATES, VOCAB } from '../data/poemData';

const pick = (items: string[]): string => items[Math.floor(Math.random() * items.length)];

const fillTemplate = (template: string): string => {
  return template.replace(/\{(\w+)\}/g, (_, key: keyof typeof VOCAB) => {
    const words = VOCAB[key] ?? ['朝'];
    return pick(words);
  });
};

const generateComposedPoem = (): string => {
  const lineA = `${pick(VOCAB.timeOfDay)}、${pick(VOCAB.place)}で${pick(VOCAB.state)}していた私。`;
  const lineB = `${pick(VOCAB.noun)}みたいな${pick(VOCAB.emotion)}だけが、${pick(VOCAB.action)}に追いつけない。`;
  return Math.random() < 0.5 ? `${lineA}\n${lineB}` : `${lineA}${lineB}`;
};

export const generatePoem = (): string => {
  const useTemplate = Math.random() < 0.6;
  const text = useTemplate ? fillTemplate(pick(POEM_TEMPLATES)) : generateComposedPoem();
  return text.replace(/\s+/g, ' ').trim().slice(0, 120);
};
