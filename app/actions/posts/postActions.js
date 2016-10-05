// The middleware to call the API for quotes
import { CALL_API } from '../../components/middleware/api'

export const POST_REQUEST = 'POST_REQUEST'
export const POST_SUCCESS = 'POST_SUCCESS'
export const POST_FAILURE = 'POST_FAILURE'

// Uses the API middlware to get a quote
export function fetchPosts() {
  return {
    [CALL_API]: {
      endpoint: '/post',
      types: [POST_REQUEST, POST_SUCCESS, POST_FAILURE]
    }
  }
}

// // Same API middlware is used to get a
// // secret quote, but we set authenticated
// // to true so that the auth header is sent
// export function fetchSecretQuote() {
//   return {
//     [CALL_API]: {
//       endpoint: '/post',
//       authenticated: true,
//       types: [QUOTE_REQUEST, QUOTE_SUCCESS, QUOTE_FAILURE]
//     }
//   }
// }
