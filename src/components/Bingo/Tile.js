import ReactCardFlip from 'react-card-flip';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        width: "100%",
        height: "100%",
        display: 'flex',
        flexDirection: "column",
        justifyContent: "space-between"


    },
    tile: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        width: "100%",
        height: "100%",
        fontWeight: "bold",
        fontSize: "12px",
        border: "2px saddlebrown dashed",
        borderRadius: "8px",
        cursor: "pointer"

    }
}));


function Tile({ id, children, onToggle, isSet, isChanging }) {
    const classes = useStyles();
    return (
        <ReactCardFlip isFlipped={isSet} flipDirection="vertical" containerStyle={{
            width: '100%',
            height: '100%',
        }}>
            <Card onClick={onToggle} style={{
                border: "2px saddlebrown dashed",
                borderRadius: "8px",
                cursor: "pointer",
                display: 'flex',
                width: '100%',
                height: '100%',
                boxShadow: 'none',
                justifyContent: 'center',
                textAlign: 'center',
                alignContent: 'center',
                flexDirection: 'column', alignItems: 'center'
            }}>

                <CardContent>
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
            <Card style={{
                border: "2px saddlebrown dashed",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: 'red',
                display: 'flex',
                width: '100%',
                height: '100%',
                boxShadow: 'none',
                textAlign: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column', alignItems: 'center'
            }}>
                <CardContent>
                    <Typography color="textSecondary">
                        {children}
                    </Typography>
                </CardContent>
            </Card>
        </ReactCardFlip>
    );
}

export default Tile;