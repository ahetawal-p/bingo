import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Lottie from 'react-lottie';
import animationData from '../../illustrations/heka-loader.json'

const styles = (theme) => ({
  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  },
});

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

class LaunchScreen extends Component {
  render() {
    // Styling
    const { classes } = this.props;

    return (
      <div className={classes.center}>
        <Lottie options={defaultOptions}
          height={200}
          width={200}
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
