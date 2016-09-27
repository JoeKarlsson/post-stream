import React, { PropTypes as T } from 'react'
import ReactDOM from 'react-dom'
import AuthService from '../AuthService'

export class ProfileEdit extends React.Component {
  // receiving AuthService instance and profile data as props
  static propTypes = {
    profile: T.object,
    auth: T.instanceOf(AuthService)
  }

  handleChange(e){

  }

  // method trigged when edit form is submitted
  handleSubmit(e){
    e.preventDefault()
    const { profile, auth } = this.props
    console.log('profile.user_metadata: ', profile.user_metadata);
    auth.updateProfile(profile.user_id, {
      user_metadata: {
        address: ReactDOM.findDOMNode(this.refs.address).value
      }
    })
  }

  render(){
    const { profile } = this.props
    const { address } = profile.user_metadata || {}
    const { bio } = profile.user_metadata || {}
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
              value={address}
              onChange={this.handleChange.bind(this)}
            />
            <label htmlFor='bio'>bio</label>
            <input
              ref='bio'
              type='text'
              id='bio'
              className='u-full-width'
              placeholder='bio'
              value={bio}
              onChange={this.handleChange.bind(this)}
            />
            <div>
              <button type='submit'>save</button>
            </div>
          </form>
      </div>
    )
  }
}

export default ProfileEdit;