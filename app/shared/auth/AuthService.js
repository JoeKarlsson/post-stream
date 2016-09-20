import { EventEmitter } from 'events';
import { isTokenExpired } from './jwtHelper';
import Auth0Lock from 'auth0-lock';
const logo = require('../img/PS_58.png')

export default class AuthService extends EventEmitter {
  constructor(clientId, domain) {
    super()
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {
      theme: {
        logo,
        primaryColor: '#1EAEDB'
      },
      languageDictionary: {
        emailInputPlaceholder: "something@youremail.com",
        title: "PostStream"
      },

      auth: {
        params: {param1: "value1"},
        redirect: true,
        redirectUrl: "http://localhost:3000/",
        responseType: "token",
        sso: true
      },
      additionalSignUpFields: [{
        name: "address",
        placeholder: "enter your address",
        // The following properties are optional
        prefill: "street 123",
        validator: function(address) {
          return {
             valid: address.length >= 10,
             hint: "Must have 10 or more chars" // optional
          };
        }
      },
      {
        name: "full_name",
        placeholder: "Enter your full name"
      }],
      allowForgotPassword: true,
      allowSignUp: true,
      loginAfterSignup: true,

      rememberLastLogin: true,
    })

    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // Add callback for lock `authorization_error` event
    this.lock.on('authorization_error', this._authorizationError.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this)
    this.loggedIn = this.loggedIn.bind(this)
    this.getToken = this.getToken.bind(this)
  }

  _doAuthentication(authResult){
    // Saves the user token
    this.setToken(authResult.idToken)
    // Async loads the user profile data
    this.lock.getProfile(authResult.idToken, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error)
      } else {
        this.setProfile(profile)
      }
    })
  }

  _authorizationError(error){
    // Unexpected authentication error
    console.log('Authentication Error', error)
  }

  login() {
    // Call the show method to display the widget.
    this.lock.show()
  }

  loggedIn(){
    // Checks if there is a saved token and it's still valid
    const token = this.getToken()
    return !!token && !isTokenExpired(token)
  }

  setProfile(profile){
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile)
  }

  getProfile(){
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

  setToken(idToken){
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  }

  getToken(){
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
  }

  logout(){
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
  }
}
