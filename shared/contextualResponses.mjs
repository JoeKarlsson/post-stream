// PostStream's contextual responses: replies are picked from this list instead
// of written free-form. Shared by the server (validation, the stored text) and
// the client (the reply menu).

export const MAX_DETAIL_LENGTH = 200;

// detail: what the extra text field is for, if this response takes one
export const RESPONSES = [
  { kind: 'agree', label: 'agree' },
  { kind: 'agree_because', label: 'agree, because', detail: 'reason' },
  { kind: 'disagree', label: 'disagree' },
  { kind: 'disagree_because', label: 'disagree, because', detail: 'reason' },
  { kind: 'tell_me_more', label: 'tell me more about', detail: 'thought or opinion' },
  { kind: 'thanks', label: 'thank you for sharing' },
  { kind: 'brilliant', label: 'brilliant' }
];

export const findResponse = (kind) => RESPONSES.find((response) => response.kind === kind);

// The text a reply is stored and shown as, e.g. "agree, because it's faster".
// Returns { body } or { error } so callers can answer with a 400.
export const composeResponse = (kind, detail = '') => {
  const response = findResponse(kind);
  if (!response) {
    return { error: `Pick one of: ${RESPONSES.map((r) => r.label).join(', ')}` };
  }
  const text = String(detail ?? '').trim();
  if (!response.detail) {
    return { body: response.label };
  }
  if (!text) {
    return { error: `"${response.label}" needs a ${response.detail}` };
  }
  if (text.length > MAX_DETAIL_LENGTH) {
    return { error: `Keep the ${response.detail} under ${MAX_DETAIL_LENGTH} characters` };
  }
  return { body: `${response.label} ${text}` };
};
