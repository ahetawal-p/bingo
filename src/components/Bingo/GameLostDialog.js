import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function GameLostDialog({ open, handleClose, winnerName }) {

    return (
        <div>
            <Dialog open={open}>
                <DialogTitle>{"Sorry Game Over :("}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {winnerName} just won this board. Better luck next time.
                    </DialogContentText>
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
