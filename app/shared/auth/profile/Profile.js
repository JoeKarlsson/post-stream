import React from 'react';
import { connect } from 'react-redux';
import styles from './Profile.scss';

class Profile extends React.Component {
  // constructor() {
  //   super();
  //   // this.props.params.userName
  // }

  render() {
    return (
      <div className={styles.Profile}>
        <h1>Profile</h1>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {

  }
};

export default connect(
  mapStateToProps
)(Profile);
