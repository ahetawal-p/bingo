import React, { Component } from "react";

import PropTypes from "prop-types";

import { BrowserRouter, Switch, Redirect, Route } from "react-router-dom";

import HomePage from "../HomePage";
import AdminPage from "../AdminPage";
import UserPage from "../UserPage";
import NotFoundPage from "../NotFoundPage";

class Router extends Component {
  render() {
    // Properties
    const { user, roles, bar, getAppRef, userData } = this.props;

    // Functions
    const { openSnackbar } = this.props;

    let cloneUser = null
    if (user) {
      cloneUser = Object.assign({}, user);
      let newUser = JSON.parse(JSON.stringify(user));
      cloneUser = Object.assign(newUser || {}, userData);
    }

    return (
      <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
        {bar}

        <Switch>
          <Route path="/" exact>
            <HomePage user={cloneUser} openSnackbar={openSnackbar} getAppRef={getAppRef} />
          </Route>

          <Route path="/admin">
            {cloneUser && roles.includes("admin") ? (
              <AdminPage openSnackbar={openSnackbar} user={cloneUser} />
            ) : (
                <Redirect to="/" />
              )}
          </Route>

          <Route path="/user/:userId">
            {cloneUser ? <UserPage /> : <Redirect to="/" />}
          </Route>

          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

Router.propTypes = {
  // Properties
  user: PropTypes.object,
  roles: PropTypes.array.isRequired,
  bar: PropTypes.element,
  userData: PropTypes.object,

  // Functions
  openSnackbar: PropTypes.func.isRequired,
  getAppRef: PropTypes.func.isRequired,
};

export default Router;
