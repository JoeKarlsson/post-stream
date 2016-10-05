import {
  POST_REQUEST, POST_SUCCESS, POST_FAILURE
} from '../actions/posts/postActions';
import {
  NEW_POST_REQUEST, NEW_POST_SUCCESS, NEW_POST_FAILURE
} from '../actions/posts/newPostActions';
import {
  DESTROY_POST_REQUEST, DESTROY_POST_SUCCESS, DESTROY_POST_FAILURE
} from '../actions/posts/destroyPostActions';
import {
  EDIT_POST_REQUEST,
  EDIT_POST_SUCCESS,
  EDIT_POST_FAILURE,
  HANDLE_UPDATED_POST_BODY_CHANGE,
} from '../actions/posts/editPostActions';
import {
  REPLY_REQUEST, REPLY_SUCCESS, REPLY_FAILURE
} from '../actions/posts/replyActions';
import {
  COMMENT_REQUEST, COMMENT_SUCCESS, COMMENT_FAILURE
} from '../actions/posts/commentActions';

import { Map, List } from 'immutable';

const initialState = Map({
  isFetchingPosts: false,
  isFetchingComments: false,
  isDestroyingPost: false,
  submittingNewPost: false,
  isSubmittingReply: false,
  didInvalidate: false,
  lastUpdated: null,
  newPostBody: '',
  receivedAt: null,
  posts: List()
});

const post = (state = initialState, action) => {

  switch(action.type) {
    case POST_FAILURE:
      return state.set('didInvalidate', true);

    case POST_REQUEST:
      return state.set('isFetchingPosts', true)
        .set('didInvalidate', false);

    case POST_SUCCESS:
      return state.updateIn(['posts'], (posts) => {
        return posts.clear().concat(
          JSON.parse(action.response).map((post) => {
            return Map(post)
            .set('showComments', false)
            .set('isParentPost', true)
            .set('realName', `Joe Karlsson`)
            .set('username', 'JoeJoeBinks131')
            .set('comments', List())
            .set('childId', 0)
            .set('childContext', {})
            .set('didInvalidate', false)
            .set('updatedPostBody', post.body)
            .set('editMode', false)
            .set('replyMode', false)
            .set('replyBody', '')
          })
        )
      })
      .set('isFetchingPosts', false)
      .set('didInvalidate', false)
      .set('lastUpdated', Date.now());

    case 'HANDLE_NEW_POST_BODY_CHANGE':
      return state.set('newPostBody', action.body);

    case NEW_POST_REQUEST:
      return state.set('submittingNewPost', true);

    case NEW_POST_SUCCESS:
      return state.updateIn(['posts'], (posts) => {
        let newPost = JSON.parse(action.response);
        return posts.unshift(Map(newPost)
          .set('showComments', false)
          .set('isParentPost', true)
          .set('realName', 'Joe Karlsson')
          .set('username', 'joejoebinks3')
          .set('comments', List())
          .set('childId', 0)
          .set('childContext', Map())
          .set('didInvalidate', false)
          .set('updatedPostBody', newPost.body)
          .set('editMode', false)
          .set('replyMode', false)
          .set('replyBody', '')
        );
      })
      .set('submittingNewPost', false)
      .set('newPostBody', '');

    case NEW_POST_FAILURE:
      return state.set('didInvalidate', true)
        .set('submittingNewPost', false)

    case 'TOGGLE_EDIT_MODE':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('editMode', action.editState)
        })
      })

    case HANDLE_UPDATED_POST_BODY_CHANGE:
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('updatedPostBody', action.body)
        })
      })

    case EDIT_POST_REQUEST:
      return state;

    case EDIT_POST_SUCCESS:
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.data.index, (post) => {
          let updatedPost = JSON.parse(action.response);
          return post.set('body', updatedPost.body)
            .set('editMode', false);
        })
      })

    case EDIT_POST_FAILURE:
      return state;

    case DESTROY_POST_REQUEST:
      return state.set('isDestroyingPost', true)

    case DESTROY_POST_SUCCESS:
      return state.updateIn(['posts'], (posts) => {
        return posts.delete(action.data.index);
      })
      .set('isDestroyingPost', false)

    case DESTROY_POST_FAILURE:
      return state.set('didInvalidate', true)
        .set('isDestroyingPost', false)

    case 'INVALIDATE_COMMENTS':
      return state.set('didInvalidate', true);

    case COMMENT_REQUEST:
      return state.set('isFetchingComments', true)
        .set('didInvalidate', false);

    case COMMENT_SUCCESS:
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.data.index, (post) => {
          const parsedComments = JSON.parse(action.response);
          return post.updateIn(['comments'], (comments) => {
            return comments.clear().concat(
              parsedComments.map((comment) => {
                return Map(comment)
                  .set('childId', 0)
                  .set('showComments', false)
                  .set('isParentPost', false)
              })
            );
          })
          .set('showComments', true)
          .set('childContext', parsedComments[0])
        })
      })
      .set('isFetchingPosts', false)
      .set('didInvalidate', false);

    case COMMENT_FAILURE:
      return state.set('isFetchingComments', false)
        .set('didInvalidate', true);

    case 'TOGGLE_COMMENT':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('childId', action.newChildId)
          .set('childContext', post.get('comments').get(action.newChildId).toJS());
        })
      });

    case 'TOGGLE_SHOW_COMMENT':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('showComments', action.showCommentState)
        })
      })

    case 'TOGGLE_REPLY_MODE':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('replyMode', !post.get('replyMode'));
        })
      });

    case 'HANDLE_REPLY_BODY_CHANGE':
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.index, (post) => {
          return post.set('replyBody', action.body);
        })
      });

    case REPLY_REQUEST:
      return state.set('isSubmittingReply', true)
        .set('didInvalidate', false);

    case REPLY_SUCCESS:
      return state.updateIn(['posts'], (posts) => {
        return posts.update(action.data.index, (post) => {
          const comments = JSON.parse(action.response);
          return post.set('commentCount', post.get('commentCount') + 1)
            .set('replyBody', '')
            .set('comments', post.get('comments').unshift(comments))
            .set('replyMode', false)
        })
      })
      .set('isSubmittingReply', false);

    case REPLY_FAILURE:
      return state.set('isSubmittingReply', false)
        .set('didInvalidate', true);

    default:
      return state;
  }
};

export default post;
