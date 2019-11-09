import { summarizeTimeEntries } from '../src/lib/time';

describe('summarizeTimeEntries', () => {
  test('summarizes all given time entries', () => {
    const entries = [
      { task: { id: 1 }, user: { name: 'A' }, hours: 1.2 },
      { task: { id: 2 }, user: { name: 'A' }, hours: 2.4 },
      { task: { id: 2 }, user: { name: 'A' }, hours: 0.2 },
      { task: { id: 2 }, user: { name: 'B' }, hours: 0.7 },
    ];
    const summaries = summarizeTimeEntries(entries);
    expect(summaries).toEqual({ 1: { A: 1.2 }, 2: { A: 2.6, B: 0.7 } });
  });
});
