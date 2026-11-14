import { describe, expect, it } from 'vitest';
import { lessons, questions, olympiadTopics } from './data';

describe('AdabX learning content', () => {
  it('contains the 17 grade-eight lesson entries', () => {
    expect(lessons).toHaveLength(17);
    expect(new Set(lessons.map(item => item.id)).size).toBe(17);
  });
  it('has valid answer indexes for every authored question', () => {
    expect(questions.length).toBeGreaterThanOrEqual(10);
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(question.answer).toBeGreaterThanOrEqual(0);
      expect(question.answer).toBeLessThan(question.options.length);
      expect(question.explanation.length).toBeGreaterThan(10);
    }
  });
  it('has topic references for the olympiad archive', () => {
    expect(olympiadTopics.length).toBeGreaterThan(5);
    expect(olympiadTopics.every(topic => topic.page >= 1 && topic.page <= 24)).toBe(true);
  });
});