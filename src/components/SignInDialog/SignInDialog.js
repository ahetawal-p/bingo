import React, { Component } from "react";

import PropTypes from "prop-types";

import validate from "validate.js";

import { withStyles } from "@material-ui/core/styles";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Tooltip,
  IconButton,
  Grid,
  Button,
  TextField,
} from "@material-ui/core";

import { Close as CloseIcon } from "@material-ui/icons";


import constraints from "../../data/constraints";
import authentication from "../../services/authentication";

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },

  icon: {
    marginRight: theme.spacing(0.5),
  },

  divider: {
    margin: "auto",
  },

  grid: {
    marginBottom: theme.spacing(2),
  },
});

const initialState = {
  performingAction: false,
  emailAddress: "",
  password: "",
  errors: null,
};

class SignInDialog extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  getSignInButton = () => {
    const { emailAddress, password, performingAction } = this.state;

    return (
      <Button
        color="primary"
        disabled={!emailAddress || !password || performingAction}
        variant="contained"
        onClick={() => this.signIn()}
      >
        Sign in
      </Button>
    );
  };

  resetPassword = () => {
    const { emailAddress } = this.state;

    const errors = validate(
      {
        emailAddress: emailAddress,
      },
      {
        emailAddress: constraints.emailAddress,
      }
    );

    if (errors) {
      this.setState({
        errors: errors,
      });
    } else {
      this.setState(
        {
          errors: null,
        },
        () => {
          this.setState(
            {
              performingAction: true,
            },
            () => {
              authentication
                .resetPassword(emailAddress)
                .then((value) => {
                  this.props.openSnackbar(
                    `Sent password reset e-mail to ${emailAddress}`
                  );
                })
                .catch((reason) => {
                  const code = reason.code;
                  const message = reason.message;

                  switch (code) {
                    case "auth/invalid-email":
                    case "auth/missing-android-pkg-name":
                    case "auth/missing-continue-uri":
                    case "auth/missing-ios-bundle-id":
                    case "auth/invalid-continue-uri":
                    case "auth/unauthorized-continue-uri":
                    case "auth/user-not-found":
                      this.props.openSnackbar(message);
                      return;

                    default:
                      this.props.openSnackbar(message);
                      return;
                  }
                })
                .finally(() => {
                  this.setState({
                    performingAction: false,
                  });
                });
            }
          );
        }
      );
    }
  };

  signIn = () => {
    const { emailAddress, password } = this.state;

    const errors = validate(
      {
        emailAddress: emailAddress,
        password: password,
      },
      {
        emailAddress: constraints.emailAddress,
        password: constraints.password,
      }
    );

    if (errors) {
      this.setState({
        errors: errors,
      });
    } else {
      this.setState(
        {
          performingAction: true,
          errors: null,
        },
        async () => {
          try {
            const user = await authentication.signIn(emailAddress, password)

            this.props.dialogProps.onClose(() => {
              const displayName = user.displayName;
              const emailAddress = user.email;

              this.props.openSnackbar(
                `Signed in as ${displayName || emailAddress}`
              );
            });
          } catch (reason) {
            const code = reason.code;
            const message = reason.message;
            this.setState({
              performingAction: false,
            });
            switch (code) {
              case "auth/invalid-email":
              case "auth/user-disabled":
              case "auth/user-not-found":
              case "auth/wrong-password":
                this.props.openSnackbar(message);
                return;

              default:
                this.props.openSnackbar(message);

                return;
            }

          }
        }
      );
    }
  };

  handleKeyPress = (event) => {
    const { emailAddress, password } = this.state;

    if (!emailAddress && !password) {
      return;
    }

    const key = event.key;

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (key === "Enter") {
      if (emailAddress && !password) {
        this.sendSignInLinkToEmail();
      } else {
        this.signIn();
      }
    }
  };

  handleExited = () => {
    this.setState(initialState);
  };

  handleEmailAddressChange = (event) => {
    const emailAddress = event.target.value;

    this.setState({
      emailAddress: emailAddress,
    });
  };

  handlePasswordChange = (event) => {
    const password = event.target.value;

    this.setState({
      password: password,
    });
  };

  render() {
    // Styling
    const { classes } = this.props;

    // Dialog Properties
    const { dialogProps } = this.props;

    const { performingAction, emailAddress, password, errors } = this.state;

    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        disableBackdropClick={performingAction}
        disableEscapeKeyDown={performingAction}
        {...dialogProps}
        onKeyPress={this.handleKeyPress}
        onExited={this.handleExited}
      >
        <DialogTitle disableTypography>
          <Typography variant="h6">Sign in to your account</Typography>

          <Tooltip title="Close">
            <IconButton
              className={classes.closeButton}
              disabled={performingAction}
              onClick={dialogProps.onClose}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <DialogContent>
          <Grid container direction="column" spacing={2}>
            <Grid item xs>
              <TextField
                autoComplete="email"
                disabled={performingAction}
                error={!!(errors && errors.emailAddress)}
                fullWidth
                helperText={
                  errors && errors.emailAddress
                    ? errors.emailAddress[0]
                    : ""
                }
                label="E-mail address"
                placeholder="john.doe@salesforce.com"
                required
                type="email"
                value={emailAddress}
                variant="outlined"
                InputLabelProps={{ required: false }}
                onChange={this.handleEmailAddressChange}
              />
            </Grid>

            <Grid item xs>
              <TextField
                autoComplete="current-password"
                disabled={performingAction}
                error={!!(errors && errors.password)}
                fullWidth
                helperText={
                  errors && errors.password ? errors.password[0] : ""
                }
                label="Password"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                required
                type="password"
                value={password}
                variant="outlined"
                InputLabelProps={{ required: false }}
                onChange={this.handlePasswordChange}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            color="primary"
            disabled={!emailAddress || performingAction}
            variant="outlined"
            onClick={this.resetPassword}
          >
            Reset password
          </Button>

          {this.getSignInButton()}
        </DialogActions>
      </Dialog>
    );
  }
}

SignInDialog.propTypes = {
  // Styling
  classes: PropTypes.object.isRequired,

  // Dialog Properties
  dialogProps: PropTypes.object.isRequired,

  // Custom Functions
  openSnackbar: PropTypes.func.isRequired,
};

export default withStyles(styles)(SignInDialog);
