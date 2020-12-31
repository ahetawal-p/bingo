import ReactCardFlip from 'react-card-flip';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
    tile: {
        cursor: "pointer",
        [theme.breakpoints.down('sm')]: {
            height: '140px',
        },
        [theme.breakpoints.up('sm')]: {
            height: '100px',
        },
        display: 'flex',
        width: '100%',
        boxShadow: ` 0 0 4px ${theme.palette.action.active}`,
        backgroundColor: `${theme.palette.background.paper}`,
        justifyContent: 'center',
        textAlign: 'center',
        alignContent: 'center',
        flexDirection: 'column', alignItems: 'center'
    },
    completedTile: {
        cursor: "not-allowed",
        boxShadow: `0 0 4px ${theme.palette.secondary.dark}`,
        background: 'linear-gradient(45deg, #9575cd 50%, #00bfa5 90%)',
    }
}));


function Tile({ id, children, onToggle, isSet, isChanging }) {
    const classes = useStyles();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const fontVariant = isDesktop ? 'subtitle1' : 'body2'
    const completedStyle = clsx({
        [classes.tile]: true,
        [classes.completedTile]: isSet ? true : false,
        'hvr-pulse-grow': !isSet ? true : false,

    })
    return (
        <ReactCardFlip isFlipped={isSet} flipDirection="vertical" containerStyle={{
            width: '100%',
            height: '100%',
        }}>
            <Card onClick={onToggle} className={completedStyle}>
                <CardContent style={{ padding: '4px' }}>
                    {isChanging && <CircularProgress size={16} />}
                    {!isChanging && (
                        <>
                            <Typography variant={fontVariant} >
                                {children}
                            </Typography>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card className={completedStyle}>
                <CardContent style={{ padding: '4px' }}>
                    <Typography variant={fontVariant}>
                        {children}
                    </Typography>
                </CardContent>
            </Card>
        </ReactCardFlip>
    );
}

export default Tile;