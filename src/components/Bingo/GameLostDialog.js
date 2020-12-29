import Button from '@material-ui/core/Button';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Grid,
} from "@material-ui/core";

export default function GameLostDialog({ open, handleClose, winnerName, winnerBoardUrl }) {

    return (
        <div>
            <Dialog open={open}>
                <DialogTitle>{"Sorry Game Over :("}</DialogTitle>
                <DialogContent>
                    <Grid container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography variant="body2">{winnerName} just won this board. Better luck next time.</Typography>
                        </Grid>
                        <Grid item xs>
                            <img
                                style={{ width: '100%', height: '50%', boxShadow: '0 0 8px' }}
                                src={winnerBoardUrl}
                                alt="winner" />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        color="primary">
                        😔 Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
