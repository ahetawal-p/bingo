import React, { Component } from "react";

import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";

import EmptyState from "../EmptyState";
import BingoBoard from "../Bingo"
import homeAnimationData from '../../illustrations/home.json'
import animationData from '../../illustrations/email-verify-waiting.json'

class HomePage extends Component {

  render() {
    const { user, openSnackbar, getAppRef } = this.props;

    if (user && user.emailVerified) {
      return (
        <BingoBoard user={user} openSnackbar={openSnackbar} getAppRef={getAppRef} />
      );
    } else if (user) {
      return (
        <EmptyState
          animationData={animationData}
          title="Are you there ?"
          description="Waiting for email verification"
        />
      );
    }

    return (
      <EmptyState
        animationData={homeAnimationData}
        lottieHeight={300}
        lottieWidth={300}
        size="large"
        title="Heka"
        description="Welcome to Wellness Bingo !"
      />
    );
  }

  componentDidMount() {

  }
}

HomePage.propTypes = {
  user: PropTypes.object,
  // Functions
  openSnackbar: PropTypes.func.isRequired,
  getAppRef: PropTypes.func.isRequired,
};

export default withRouter(HomePage);
