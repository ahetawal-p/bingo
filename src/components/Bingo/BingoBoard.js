import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LaunchScreen from "../LaunchScreen";
import Tile from "./Tile";
import ReadOnlyTile from "./ReadOnlyTile";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { useScreenshot } from 'use-react-screenshot'
import hekaBackend from '../../services/hekaBackend'


const wait = ms => new Promise(r => setTimeout(r, ms));

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        padding: 8,
        flexDirection: 'column'
    }
}));

export default function CenteredGrid({ user, openSnackbar, getAppRef }) {
    const classes = useStyles();
    const [state, setState] = useState({ checked: {}, readOnly: false });
    const [currentChange, setCurrentChange] = useState("");
    const [ready, setReady] = useState(false);
    const [dbInfo, setDbInfo] = useState({
        currentBoardId: null,
        userBoardItems: [],
        userBoardItemStatus: [],
        isCompleted: false
    });
    const { width, height } = useWindowSize()
    const [image, takeScreenshot] = useScreenshot()

    const fetchBoardData = async (isMockData, user, openSnackbarCallback) => {
        try {
            let userBoardData = {}
            if (isMockData) {
                console.log("Using mock data")
                userBoardData = hekaBackend.mockData()
            } else {
                console.log("Using real data")
                userBoardData = await hekaBackend.fetchCurrentUserBoard(user)
            }
            if (userBoardData.boardId) {
                console.log("Setting db info now")
                setDbInfo(state => ({
                    ...state,
                    currentBoardId: userBoardData.boardId,
                    userBoardItems: userBoardData.actionSequence,
                    userBoardItemStatus: userBoardData.actionStatus,
                    isCompleted: userBoardData.isBoardCompleted
                }))
                setReady(true)
            } else {
                console.error("Something went wrong")
                openSnackbarCallback("Something went wrong")
            }
        } catch (e) {
            console.error(e)
            openSnackbarCallback(e.message)
        }
    }
    useEffect(() => {
        const getImage = () => takeScreenshot(getAppRef().current)
        if (state.readOnly === true && !image) {
            getImage()
        }
        if (image) {
            console.log(image)
        }
    }, [state.readOnly, image, takeScreenshot, getAppRef])

    useEffect(() => {
        fetchBoardData(false, user, openSnackbar)
    }, [openSnackbar, user]);

    const isWon = checked => {
        const range = [0, 1, 2, 3];
        return (
            undefined !==
            range.find(row => range.every(column => checked[row * 4 + column])) ||
            undefined !==
            range.find(column => range.every(row => checked[row * 4 + column])) ||
            range.every(index => checked[index * 4 + index]) ||
            range.every(index => checked[index * 4 + 3 - index])
        );
    };

    const toggle = async (id) => {
        // do not allow multiple changes, may be update more styling on cards
        if (currentChange !== "") {
            return
        }
        setCurrentChange(id)
        await wait(50)
        setCurrentChange("")
        setState(state => {
            const checked = { ...state.checked, [id]: !state.checked[id] };
            const won = isWon(checked);
            return {
                ...state,
                checked,
                won
            };
        });

    }

    return (
        <div className={classes.root}>
            {!ready && <LaunchScreen />}
            {state.won ? <Confetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={500}
                onConfettiComplete={confetti => {
                    console.log("i am done");
                    confetti.reset()
                    setState(state => {
                        return {
                            ...state,
                            won: false,
                            readOnly: true
                        };
                    });
                }}
            /> : null}
            {ready && (
                <>
                    <Box mx="auto" bgcolor="background.paper" p={1} m={1}>
                        <Typography variant="body1">"Hello There"</Typography>
                    </Box>
                    <Grid container spacing={1}>
                        {Object.keys(dbInfo.userBoardItems).map(id => {
                            return <Grid item xs={3} key={id} style={{ display: 'flex' }}>
                                {state.readOnly ?
                                    <ReadOnlyTile
                                        id={id}
                                        isSet={!!state.checked[id]}
                                    >
                                        {dbInfo.userBoardItems[id]}
                                    </ReadOnlyTile>
                                    :
                                    <Tile
                                        id={id}
                                        isSet={!!state.checked[id]}
                                        onToggle={() => toggle(id)}
                                        isChanging={id === currentChange}
                                    >
                                        {dbInfo.userBoardItems[id]}
                                    </Tile>
                                }
                            </Grid>
                        })}
                    </Grid>
                </>
            )}
        </div>
    );
}
