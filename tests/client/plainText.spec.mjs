import { expect } from 'chai';
import { formatTimestamp, counterBar, previewText } from '../../app/utils/plainText.ts';

describe('formatTimestamp', () => {
  it('prints a date and time like a log line, zero-padded', () => {
    const local = new Date(2026, 0, 5, 7, 3); // Jan 5 2026, 07:03 local time
    expect(formatTimestamp(local)).to.equal('2026-01-05 07:03');
    expect(formatTimestamp(local.toISOString())).to.equal('2026-01-05 07:03');
  });
});

describe('counterBar', () => {
  it('is empty at zero and full at the limit', () => {
    expect(counterBar(0, 255)).to.equal(`[${'.'.repeat(20)}]`);
    expect(counterBar(255, 255)).to.equal(`[${'#'.repeat(20)}]`);
  });

  it('fills in proportion and never overflows', () => {
    expect(counterBar(128, 256, 10)).to.equal('[#####.....]');
    expect(counterBar(999, 255, 10)).to.equal('[##########]');
  });
});

describe('previewText', () => {
  it('leaves short text alone', () => {
    expect(previewText('short post', 256)).to.equal('short post');
  });

  it('cuts long text at a word boundary and adds "..."', () => {
    expect(previewText('one two three four', 10)).to.equal('one two...');
  });

  it('cuts mid-word when there is no space in the second half', () => {
    expect(previewText('x'.repeat(20), 10)).to.equal(`${'x'.repeat(10)}...`);
  });
});
