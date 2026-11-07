import { expect } from 'chai';
import { authorColor, AUTHOR_COLORS } from '../../app/utils/authorColor.ts';

describe('authorColor', () => {
  it('gives the same author the same color every time', () => {
    expect(authorColor('janedoe343')).to.equal(authorColor('janedoe343'));
  });

  it('always returns one of the post colors', () => {
    for (const name of ['a', 'johndoe131', 'joejoebinks131', 'x'.repeat(50)]) {
      expect(AUTHOR_COLORS).to.include(authorColor(name));
    }
  });

  it('tells the seed authors apart', () => {
    const colors = ['johndoe131', 'janedoe343', 'joejoebinks131'].map(authorColor);
    expect(new Set(colors).size).to.equal(3);
  });
});
