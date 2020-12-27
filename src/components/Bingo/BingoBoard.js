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
import EmptyState from "../EmptyState";
import GameLostDialog from './GameLostDialog';
import animationData from '../../illustrations/new-board-waiting.json'
import winnerAnimationData from '../../illustrations/winner.json'
import Lottie from 'react-lottie';

// TODO add empty state when no current board present - Done
// Add calls to update every cell click - Done
// Add transaction call for winner updates and error handling - Done
// Add Admin view and create board logic - Done
// Add lottie animation for: Loading, No board present, email verify(gif), each tile click, winner, homepage - done
// Fix sign up and sign in UX (Fix email to only salesforce)
// Fix theme match to TH may be ?
// Remove unused views
// Fix email to only salesforce

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: winnerAnimationData
};

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        padding: 8,
        flexDirection: 'column'
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
        padding: 4
    },
    winner: {
        display: 'flex',
        justifyContent: 'center',
        padding: 4,
        alignItems: 'center'
    }
}));
const isMockData = false
export default function CenteredGrid({ user, openSnackbar, getAppRef }) {
    const classes = useStyles();
    const { boardData, winnerInfo } = hekaBackend.useBoardData(user, isMockData)

    const [state, setState] = useState({ readOnly: false, readOnlyMessage: null, won: false });
    const [currentChange, setCurrentChange] = useState("");
    const [ready, setReady] = useState(false);
    const [startScreenshot, setStartScreenshot] = useState(false);
    const [openSlackShare, setSlackShare] = useState(false);
    const [openGameLost, setOpenGameLost] = useState(false);
    const [dbInfo, setDbInfo] = useState({
        currentBoardId: null,
        currentBoardTitle: null,
        userBoardItems: [],
        userBoardItemStatus: [],
        isUserCompleted: false,
        isNoBoardPresent: false
    });
    const { width, height } = useWindowSize()
    const [image, takeScreenshot] = useScreenshot()

    const onCloseCallback = () => {
        console.log("Closing now")
        setSlackShare(false)
    }

    const onCloseGameLostCallback = () => {
        console.log("Closing now")
        setOpenGameLost(false)
    }

    useEffect(() => {
        if (image) {
            setSlackShare(true)
        }
    }, [image])

    useEffect(() => {
        const getImage = () => takeScreenshot(getAppRef().current)
        if (startScreenshot === true && !image) {
            getImage()
        }
    }, [startScreenshot, takeScreenshot, getAppRef, image])

    useEffect(() => {
        console.log(boardData)
        setReady(boardData.isReady)
        if (boardData.error) {
            openSnackbar(boardData.error.message)
        } else if (boardData.isReady) {
            setDbInfo(state => ({
                ...state,
                currentBoardId: boardData.currentBoardId,
                userBoardItems: boardData.userBoardItems,
                userBoardItemStatus: boardData.userBoardItemStatus,
                isUserCompleted: boardData.isUserCompleted,
                currentBoardTitle: boardData.currentBoardTitle,
                isNoBoardPresent: boardData.isNoBoardPresent
            }))
        }

    }, [boardData, openSnackbar]);

    useEffect(() => {
        console.log(winnerInfo)
        if (winnerInfo.isWon) {
            let message = "Game over"
            if (winnerInfo.winnerId === user.uid) {
                message = "Congrats you nailed it !"
            } else {
                setOpenGameLost(true)
            }
            setState(state => {
                return {
                    ...state,
                    readOnly: true,
                    readOnlyMessage: message
                };
            });
        }
    }, [winnerInfo, openSnackbar, user.uid])

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
        const checked = { ...dbInfo.userBoardItemStatus, [id]: !dbInfo.userBoardItemStatus[id] };
        const won = isWon(checked);
        await hekaBackend.saveUserAction(dbInfo.currentBoardId, checked, user)
        setCurrentChange("")
        if (won) {
            const result = await hekaBackend.updateWinner(dbInfo.currentBoardId, user)
            if (result) {
                setState(state => {
                    return {
                        ...state,
                        won
                    };
                });
            }
        }
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
                            readOnly: true,
                            readOnlyMessage: "Congrats you nailed it !"
                        };
                    });
                    setStartScreenshot(true)
                }}
            /> : null}
            {ready && (
                <>
                    {dbInfo.isNoBoardPresent ? <EmptyState
                        animationData={animationData}
                        lottieHeight={300}
                        lottieWidth={300}
                        title="Patience Is a Virtue"
                        description="No new board available yet..."
                    /> :
                        <>
                            <SlackShare
                                open={openSlackShare}
                                user={user}
                                boardTitle={'Stay Healthy'}
                                image={image}
                                openSnackbar={openSnackbar}
                                onClose={onCloseCallback} />

                            <GameLostDialog
                                open={openGameLost}
                                handleClose={onCloseGameLostCallback}
                                winnerName={winnerInfo.winnerName}
                            />

                            <Box className={classes.title}>
                                <Typography variant="h4">{dbInfo.currentBoardTitle}</Typography>
                            </Box>
                            <Box className={classes.winner}>
                                <Typography variant="body1">{state.readOnlyMessage}</Typography>
                                <Lottie
                                    options={defaultOptions}
                                    height={40}
                                    width={40}
                                    style={{ margin: 0 }}
                                />
                            </Box>
                            <Grid container spacing={1}>
                                {Object.keys(dbInfo.userBoardItems).map(id => {
                                    return <Grid item xs={3} key={id} style={{ display: 'flex' }}>
                                        {state.readOnly || dbInfo.isUserCompleted ?
                                            <ReadOnlyTile
                                                id={id}
                                                isSet={!!dbInfo.userBoardItemStatus[id]}
                                            >
                                                {dbInfo.userBoardItems[id]}
                                            </ReadOnlyTile>
                                            :
                                            <Tile
                                                id={id}
                                                isSet={!!dbInfo.userBoardItemStatus[id]}
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
                    }
                </>
            )}
        </div>
    );
}
