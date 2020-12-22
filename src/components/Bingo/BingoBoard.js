import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import SlackShare from './SlackShare'
import util from '../../services/util'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        padding: 8,
        flexDirection: 'column'
    }
}));
const isMockData = false
export default function CenteredGrid({ user, openSnackbar, getAppRef }) {
    const classes = useStyles();
    const { boardData, winnerInfo } = hekaBackend.useBoardData(user, isMockData)

    const [state, setState] = useState({ checked: {}, readOnly: false });
    const [currentChange, setCurrentChange] = useState("");
    const [ready, setReady] = useState(false);
    const [startScreenshot, setStartScreenshot] = useState(false);
    const [openSlackShare, setSlackShare] = useState(false);
    const [dbInfo, setDbInfo] = useState({
        currentBoardId: null,
        userBoardItems: [],
        userBoardItemStatus: [],
        isUserCompleted: false
    });
    const { width, height } = useWindowSize()
    const [image, takeScreenshot] = useScreenshot()

    const onCloseCallback = () => {
        console.log("Closing now")
        setSlackShare(false)
    }
    useEffect(() => {
        if (image) {
            console.log("I got image")
            setSlackShare(true)
        }
    }, [image])

    useEffect(() => {
        const getImage = () => takeScreenshot(getAppRef().current)
        if (startScreenshot === true && !image) {
            console.log("I getting image")
            getImage()
        }
    }, [startScreenshot, takeScreenshot, getAppRef, image])

    useEffect(() => {
        console.log("i am changing here")
        console.log(boardData)
        setReady(boardData.isReady)
        if (boardData.error) {
            openSnackbar(boardData.error)
        } else if (boardData.isReady) {
            setDbInfo(state => ({
                ...state,
                currentBoardId: boardData.currentBoardId,
                userBoardItems: boardData.userBoardItems,
                userBoardItemStatus: boardData.userBoardItemStatus,
                isUserCompleted: boardData.isUserCompleted
            }))
        }

    }, [boardData, openSnackbar]);

    useEffect(() => {
        console.log("i am winner info")
        console.log(winnerInfo)
        if (winnerInfo.isWon) {
            openSnackbar("Sorry you lost")
        }
    }, [winnerInfo, openSnackbar])

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
        await util.wait(50)
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
                    setStartScreenshot(true)
                }}
            /> : null}
            {ready && (
                <>
                    <SlackShare open={openSlackShare}
                        user={user}
                        boardTitle={'Stay Healthy'}
                        image={image}
                        openSnackbar={openSnackbar}
                        onClose={onCloseCallback} />

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
