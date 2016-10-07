import React from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import {
  updateProfile,
  onFormChange,
} from '../../../actions/profile/updateProfileActions';

export class ProfileEdit extends React.Component {

  handleChange(e){
    const { dispatch } = this.props;
    dispatch(onFormChange(e.target.id, e.target.value))
  };

  // method trigged when edit form is submitted
  handleSubmit(e){
    e.preventDefault()
    const {
      profile,
      dispatch
    } = this.props;
    const metadata = {
      user_metadata: {
        address: ReactDOM.findDOMNode(this.refs.address).value,
        bio: ReactDOM.findDOMNode(this.refs.bio).value,
      }
    };
    dispatch(updateProfile(profile.user_id, metadata));
  };

  render(){
    const { profile } = this.props;
    const { address } = profile.user_metadata || {};
    const { bio } = profile.user_metadata || {};

    return (
      <div>
          <h3>Editing Profile</h3>
          <form onSubmit={this.handleSubmit.bind(this)}>
            <label htmlFor='address'>address</label>
            <input
              ref='address'
              type='text'
              id='address'
              className='u-full-width'
              placeholder='address'
              value={ address }
              onChange={ this.handleChange.bind(this) }
            />
            <label htmlFor='bio'>bio</label>
            <input
              ref='bio'
              type='text'
              id='bio'
              className='u-full-width'
              placeholder='bio'
              value={ bio }
              onChange={ this.handleChange.bind(this) }
            />
            <div>
              <button type='submit'>save</button>
            </div>
          </form>
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  const { profile } = state.root;

  return {
    profile: profile.get('profile').toJS(),
  }
};

export default connect(
  mapStateToProps
)(ProfileEdit);
