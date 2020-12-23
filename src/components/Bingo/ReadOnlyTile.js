import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    tile: {
        border: "2px saddlebrown dashed",
        borderRadius: "8px",
        display: 'flex',
        width: '100%',
        [theme.breakpoints.down('sm')]: {
            height: '120px',
        },
        [theme.breakpoints.up('sm')]: {
            height: '100px',
        },
        boxShadow: 'none',
        justifyContent: 'center',
        textAlign: 'center',
        alignContent: 'center',
        flexDirection: 'column', alignItems: 'center'

    },
    isSet: {
        backgroundColor: 'red',
    }
}));


function ReadOnlyTile({ id, children, isSet }) {
    const classes = useStyles();
    const style = clsx({
        [classes.tile]: true, //always applies
        [classes.isSet]: isSet //only when isSet === true
    })
    return (
        <Card className={style}>
            <CardContent>
                <Typography color="textSecondary">
                    {children}
                </Typography>
            </CardContent>
        </Card>

    );
}

export default ReadOnlyTile;