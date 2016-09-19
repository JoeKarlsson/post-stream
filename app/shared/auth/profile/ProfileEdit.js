import React, { PropTypes as T } from 'react'
import ReactDOM from 'react-dom'
import AuthService from '../AuthService'
import s from './ProfileEdit.scss'

export class ProfileEdit extends React.Component {
  // receiving AuthService instance and profile data as props
  static propTypes = {
    profile: T.object,
    auth: T.instanceOf(AuthService)
  }

  // method trigged when edit form is submitted
  handleSubmit(e){
    e.preventDefault()
    const { profile, auth } = this.props
    auth.updateProfile(profile.user_id, {
      user_metadata: {
        address: ReactDOM.findDOMNode(this.refs.address).value // the new address
      }
    })
  }

  render(){
    const { profile } = this.props
    const { address } = profile.user_metadata || {}
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