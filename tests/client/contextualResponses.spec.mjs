import { expect } from 'chai';
import { composeResponse, RESPONSES, MAX_DETAIL_LENGTH } from '../../shared/contextualResponses.mjs';

describe('composeResponse', () => {
  it('uses the label alone for responses without a detail, ignoring any text', () => {
    expect(composeResponse('thanks', 'ignored')).to.deep.equal({ body: 'thank you for sharing' });
  });

  it('joins the label and the trimmed detail', () => {
    expect(composeResponse('agree_because', '  it is faster ')).to.deep.equal({ body: 'agree, because it is faster' });
  });

  it('refuses unknown kinds, missing details and overlong details', () => {
    expect(composeResponse('free text')).to.have.property('error');
    expect(composeResponse('tell_me_more', '')).to.have.property('error');
    expect(composeResponse('disagree_because', 'x'.repeat(MAX_DETAIL_LENGTH + 1))).to.have.property('error');
  });

  it('always fits the 255-character reply column', () => {
    for (const { kind } of RESPONSES) {
      const { body } = composeResponse(kind, 'x'.repeat(MAX_DETAIL_LENGTH));
      expect(body.length).to.be.at.most(255);
    }
  });
});
