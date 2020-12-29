import React, { useState } from 'react';
import { ReactComponent as SlackIcon } from "../../illustrations/slack.svg";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Grid,
    TextField,
    CircularProgress,
} from "@material-ui/core";
import slack from '../../services/slack'
// eslint-disable-next-line no-unused-vars
import util from '../../services/util'


export default function SlackShare({ open, image, user, boardTitle, openSnackbar, onClose }) {
    const [isPosting, setPosting] = useState(false);

    const shareIt = async () => {
        try {
            setPosting(true)
            // await util.wait(1050)
            await slack.share(user, image, boardTitle, value || "Check this out...")
            openSnackbar("Shared Successfully")
        } catch (e) {
            console.error(e)
            openSnackbar("Error sharing")
        }
        setPosting(false)
        onClose()
    }

    const [value, setValue] = useState();

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const placeholder = `Share your glory on Slack #Heka ${user.displayName}`
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            onBackdropClick={shareIt}

        >
            <DialogTitle disableTypography>
                <Typography variant="h6">Winning Message!</Typography>
            </DialogTitle>

            <DialogContent>
                <Grid container direction="column" spacing={2}>
                    {isPosting && <Grid item xs align="center"> <CircularProgress /> </Grid>}
                    {!isPosting && (
                        <>
                            <Grid item xs>
                                <TextField
                                    placeholder={placeholder}
                                    multiline
                                    fullWidth
                                    value={value}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs>
                                <img style={{ width: '100%', height: '100%', boxShadow: '0 0 8px' }} src={image} alt="winner" />
                            </Grid>

                        </>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={shareIt}
                    className={"hvr-wobble-skew"}
                    startIcon={<SlackIcon />}
                >
                    Share
          </Button>
            </DialogActions>
        </Dialog >

    );
}