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
  displayName: "",
  errors: null,
};

class SignUpDialog extends Component {
  constructor(props) {
    super(props);

    this.state = initialState;
  }

  signUp = () => {
    const {
      emailAddress,
      password,
      displayName,
    } = this.state;

    const errors = validate(
      {
        emailAddress: emailAddress,
        password: password,
        displayName: displayName,
      },
      {
        emailAddress: constraints.emailAddress,
        password: constraints.password,
        displayName: constraints.displayName
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
            await authentication.signUpWithEmailAddressAndPassword(emailAddress, password, displayName)

            this.props.dialogProps.onClose();

          } catch (reason) {
            const code = reason.code;
            const message = reason.message;
            this.setState({
              performingAction: false,
            });
            switch (code) {
              case "auth/email-already-in-use":
              case "auth/invalid-email":
              case "auth/operation-not-allowed":
              case "auth/weak-password":
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
    const {
      emailAddress,
      password,
      displayName
    } = this.state;

    if (!emailAddress || !password || !displayName) {
      return;
    }

    const key = event.key;

    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    if (key === "Enter") {
      this.signUp();
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

  handleDisplayNameChange = (event) => {
    const displayName = event.target.value;

    this.setState({
      displayName: displayName,
    });
  };


  render() {
    // Styling
    const { classes } = this.props;

    // Dialog Properties
    const { dialogProps } = this.props;

    const {
      performingAction,
      emailAddress,
      password,
      displayName,
      errors,
    } = this.state;

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
          <Typography variant="h6">Sign up for an account</Typography>

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
                disabled={performingAction}
                error={!!(errors && errors.displayName)}
                fullWidth
                helperText={
                  errors && errors.displayName
                    ? errors.displayName[0]
                    : ""
                }
                label="Display Name"
                placeholder="i.am.awesome"
                required
                value={displayName}
                variant="outlined"
                InputLabelProps={{ required: false }}
                onChange={this.handleDisplayNameChange}
              />
            </Grid>
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
                autoComplete="new-password"
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
            disabled={
              !emailAddress ||
              !password ||
              !displayName ||
              performingAction
            }
            variant="contained"
            onClick={this.signUp}
          >
            Sign up
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SignUpDialog.propTypes = {
  // Styling
  classes: PropTypes.object.isRequired,

  // Dialog Properties
  dialogProps: PropTypes.object.isRequired,

  // Custom Functions
  openSnackbar: PropTypes.func.isRequired,
};

export default withStyles(styles)(SignUpDialog);
