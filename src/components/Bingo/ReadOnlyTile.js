import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
    tile: {
        cursor: "not-allowed",
        [theme.breakpoints.down('sm')]: {
            height: '140px',
        },
        [theme.breakpoints.up('sm')]: {
            height: '100px',
        },
        display: 'flex',
        width: '100%',
        border: `1px ${theme.palette.action.active} solid`,
        boxShadow: ` 0 0 4px ${theme.palette.action.active}`,
        backgroundColor: `${theme.palette.background.paper}`,
        justifyContent: 'center',
        textAlign: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'

    },
    isSet: {
        cursor: "not-allowed",
        boxShadow: `0 0 4px ${theme.palette.secondary.dark}`,
        background: 'linear-gradient(45deg, #9575cd 50%, #00bfa5 90%)',
    }
}));


function ReadOnlyTile({ id, children, isSet }) {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const fontVariant = isDesktop ? 'subtitle1' : 'body2'
    const classes = useStyles();
    const style = clsx({
        [classes.tile]: true, //always applies
        [classes.isSet]: isSet //only when isSet === true
    })
    return (
        <div style={{
            width: '100%',
            height: '100%'
        }}>
            <Card className={style}>
                <CardContent style={{ padding: '4px' }}>
                    <Typography variant={fontVariant}>
                        {children}
                    </Typography>
                </CardContent>
            </Card>
        </div>

    );
}

export default ReadOnlyTile;