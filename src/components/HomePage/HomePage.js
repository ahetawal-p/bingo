import React, { Component } from "react";

import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";

import EmptyState from "../EmptyState";
import BingoBoard from "../Bingo"

import { ReactComponent as CabinIllustration } from "../../illustrations/cabin.svg";
import { ReactComponent as InsertBlockIllustration } from "../../illustrations/insert-block.svg";

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
          image={<CabinIllustration />}
          title="Home"
          description="Verify email"
        />
      );
    }

    return (
      <EmptyState
        image={<InsertBlockIllustration />}
        title="Heka"
        description="Welcome to wellness bingo !"
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
