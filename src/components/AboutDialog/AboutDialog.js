import React from "react";
import PropTypes from "prop-types";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Tooltip,
  IconButton
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

import { Close as CloseIcon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

function AboutDialog(props) {
  const classes = useStyles();
  const dialogProps = props.dialogProps;
  const user = props.user;
  const version = process.env.REACT_APP_VERSION;

  if (!user && !version) {
    return null;
  }

  return (
    <Dialog fullWidth maxWidth="xs" {...dialogProps}>
      <DialogTitle disableTypography>
        <Typography variant="h6">
          About {process.env.REACT_APP_TITLE}
        </Typography>

        <Tooltip title="Close">
          <IconButton
            className={classes.closeButton}
            onClick={dialogProps.onClose}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" paragraph>
          {process.env.REACT_APP_TITLE} a new way to be healthy and have fun with your coworkers.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

AboutDialog.propTypes = {
  dialogProps: PropTypes.object.isRequired,
  user: PropTypes.object,
};

export default AboutDialog;
