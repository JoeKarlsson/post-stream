import React from 'react';
import { connect } from 'react-redux';
import EditForm from './editForm/EditForm';
import styles from './EditProfile.scss';

class EditProfile extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const { userName} = this.props.params;
  };

  render() {
    const {
      posts,
      isAuthenticated,
      profile,
      dispatch
    } = this.props;
    const { userName} = this.props.params;

    return (
      <div className={ styles.Profile }>
        <h1>{ userName }'s PostStream</h1>
        <EditForm
          profile={ profile }
          dispatch={ dispatch }
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  const { auth, profile } = state.root;

  return {
    isAuthenticated: auth.get('isAuthenticated'),
    profile: profile.get('profile').toJS(),
  }
};

export default connect(
  mapStateToProps
)(EditProfile);
