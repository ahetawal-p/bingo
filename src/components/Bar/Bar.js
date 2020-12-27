import React, { Component } from "react";

import PropTypes from "prop-types";

import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  ButtonGroup,
  Button,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  Link,
} from "@material-ui/core";

import UserAvatar from "../UserAvatar";

class Bar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: {
        anchorEl: null,
      },
    };
  }

  openMenu = (event) => {
    const anchorEl = event.currentTarget;

    this.setState({
      menu: {
        anchorEl,
      },
    });
  };

  closeMenu = () => {
    this.setState({
      menu: {
        anchorEl: null,
      },
    });
  };

  render() {
    // Properties
    const { performingAction, user, userData, roles } = this.props;

    let cloneUser = Object.assign({}, user);
    let newUser = JSON.parse(JSON.stringify(user));
    cloneUser = Object.assign(newUser || {}, userData);


    // Events
    const {
      onAboutClick,
      onSignOutClick,
      onSignUpClick,
      onSignInClick,
    } = this.props;

    const { menu } = this.state;

    const menuItems = [
      {
        name: "About",
        onClick: onAboutClick,
      },
      // {
      //   name: "Profile",
      //   to: user ? `/user/${user.uid}` : null,
      // },
      // {
      //   name: "Settings",
      //   onClick: onSettingsClick,
      // },
      {
        name: "Sign out",
        divide: true,
        onClick: onSignOutClick,
      },
    ];

    if (user && roles.includes("admin")) {
      menuItems.splice(1, 0, {
        name: "Admin",
        to: '/admin',
      });

    }
    return (
      <AppBar color="primary" position="static">
        <Toolbar>
          <Box display="flex" flexGrow={1} alignItems='center'>
            {/* <Lottie options={defaultOptions}
              height={50}
              width={50}
              style={{ margin: 0 }}

            /> */}
            <Typography color="inherit" variant="h6">
              <Link
                color="inherit"
                component={RouterLink}
                to="/"
                underline="none"
              >
                {process.env.REACT_APP_TITLE}
              </Link>
            </Typography>
          </Box>

          {user && (
            <>
              <Box >
                <Typography color="inherit" variant="body2" noWrap={true} align={'right'}>
                  {`${roles.includes("admin") ? "*" : ''} Welcome ${cloneUser.displayName} !`}
                </Typography>
              </Box>
              <IconButton
                color="inherit"
                disabled={performingAction}
                onClick={this.openMenu}
              >
                <UserAvatar user={cloneUser} />
              </IconButton>

              <Menu
                anchorEl={menu.anchorEl}
                open={Boolean(menu.anchorEl)}
                onClose={this.closeMenu}
              >
                {menuItems.map((menuItem, index) => {
                  if (
                    menuItem.hasOwnProperty("condition") &&
                    !menuItem.condition
                  ) {
                    return null;
                  }

                  let component = null;

                  if (menuItem.to) {
                    component = (
                      <MenuItem
                        key={index}
                        component={RouterLink}
                        to={menuItem.to}
                        onClick={this.closeMenu}
                      >
                        {menuItem.name}
                      </MenuItem>
                    );
                  } else {
                    component = (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          this.closeMenu();

                          menuItem.onClick();
                        }}
                      >
                        {menuItem.name}
                      </MenuItem>
                    );
                  }

                  if (menuItem.divide) {
                    return (
                      <span key={index}>
                        <Divider />

                        {component}
                      </span>
                    );
                  }

                  return component;
                })}
              </Menu>
            </>
          )}

          {!user && (
            <ButtonGroup
              color="inherit"
              disabled={performingAction}
              variant="outlined"
            >
              <Button onClick={onSignUpClick}>Sign up</Button>
              <Button onClick={onSignInClick}>Sign in</Button>
            </ButtonGroup>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Bar.defaultProps = {
  performingAction: false,
};

Bar.propTypes = {
  // Properties
  performingAction: PropTypes.bool.isRequired,
  user: PropTypes.object,
  userData: PropTypes.object,

  // Events
  onAboutClick: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func.isRequired,
  onSignOutClick: PropTypes.func.isRequired,
};

export default Bar;
