import ReactCardFlip from 'react-card-flip';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    tile: {
        border: "2px saddlebrown dashed",
        borderRadius: "8px",
        cursor: "pointer",
        [theme.breakpoints.down('sm')]: {
            height: '120px',
        },
        [theme.breakpoints.up('sm')]: {
            height: '100px',
        },
        display: 'flex',
        width: '100%',
        boxShadow: 'none',
        justifyContent: 'center',
        textAlign: 'center',
        alignContent: 'center',
        flexDirection: 'column', alignItems: 'center'
    },
    completedTile: {
        cursor: "not-allowed",
        backgroundColor: 'red'
    }
}));


function Tile({ id, children, onToggle, isSet, isChanging }) {
    const classes = useStyles();
    const completedStyle = clsx({
        [classes.tile]: true,
        [classes.completedTile]: true
    })
    return (
        <ReactCardFlip isFlipped={isSet} flipDirection="vertical" containerStyle={{
            width: '100%',
            height: '100%',
        }}>
            <Card onClick={onToggle} className={classes.tile}>
                <CardContent style={{ padding: '4px' }}>
                    {isChanging && <CircularProgress size={16} />}
                    {!isChanging && (
                        <>
                            <Typography color="textSecondary">
                                {children}
                            </Typography>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card className={completedStyle}>
                <CardContent style={{ padding: '4px' }}>
                    <Typography color="textSecondary">
                        {children}
                    </Typography>
                </CardContent>
            </Card>
        </ReactCardFlip>
    );
}

export default Tile;