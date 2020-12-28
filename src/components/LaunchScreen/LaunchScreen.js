import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

import animationData from '../../illustrations/heka-loader.json'
import Lottie from 'react-lottie-player';

const styles = (theme) => ({
  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
});

class LaunchScreen extends Component {
  render() {
    // Styling
    const { classes } = this.props;

    return (
      <div className={classes.center}>
        <Lottie
          loop
          play
          animationData={animationData}
          style={{ width: 200, height: 200 }}
        />
      </div>
    );
  }
}

LaunchScreen.propTypes = {
  // Styling
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LaunchScreen);
