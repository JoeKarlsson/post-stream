import { expect } from 'chai';
import { renderPostHtml } from '../../app/utils/markdown.ts';

describe('renderPostHtml', () => {
  it('turns markdown images into plain links so nothing loads', () => {
    const html = renderPostHtml('![a "pic"](https://example.com/t.png?x=1&y=2)');
    expect(html).to.not.include('<img');
    expect(html).to.include('<a href="https://example.com/t.png?x=1&amp;y=2">a &quot;pic&quot;</a>');
  });

  it('escapes raw HTML', () => {
    expect(renderPostHtml('<script>alert(1)</script>')).to.not.include('<script>');
  });

  it('refuses javascript: links', () => {
    expect(renderPostHtml('[x](javascript:alert(1))')).to.not.include('href="javascript:');
    expect(renderPostHtml('![x](javascript:alert(1))')).to.not.include('href="javascript:');
  });

  it('keeps emphasis and emoji', () => {
    expect(renderPostHtml('**ok** ☕')).to.equal('<p><strong>ok</strong> ☕</p>\n');
  });
});
