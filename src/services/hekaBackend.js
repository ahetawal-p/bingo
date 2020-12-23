import { firestore } from "../firebase";
import { useState, useEffect } from 'react';
import shuffle from "shuffle-array";
import { useCollection, useDocumentOnce } from 'react-firebase-hooks/firestore';


const hekaBackend = {};

hekaBackend.useBoardData = function useBoardData(user, isMockData) {
    const [boardData, setDbInfo] = useState({
        currentBoardId: null,
        currentBoardTitle: null,
        userBoardItems: [],
        userBoardItemStatus: [],
        isUserCompleted: false,
        error: null,
        isReady: false,
        isWon: false
    });

    const [winnerInfo, setWinnerInfo] = useState({
        winnerBoard: null,
        winnerId: [],
        winnerName: [],
        wonAt: false,
        isWon: false
    });

    const [currentBoard, , boardError] = useCollection(!isMockData ?
        firestore.collection("boards").where("isActive", "==", true).limit(1)
        : null, {
        snapshotListenOptions: { includeMetadataChanges: true },
    }
    );
    const [userDoc, , docError] = useDocumentOnce(!isMockData && currentBoard && currentBoard.docs[0].id ?
        firestore.collection("users").doc(user.uid).collection("myboards").doc(currentBoard.docs[0].id) : null
    );



    useEffect(() => {
        let actionSequence = []
        let actionStatus = []
        let isBoardCompleted = false

        const updateUserDoc = async (docId) => {
            await firestore.collection("users").doc(user.uid).collection("myboards").doc(docId).set({
                isBoardCompleted,
                actionSequence,
                actionStatus
            })
        }
        if (isMockData) {
            const mockData = this.mockData()
            setDbInfo(mockData)
        }

        if (currentBoard && currentBoard.docs[0].id && userDoc) {
            const currentDocRef = currentBoard.docs[0]
            const currentDocData = currentDocRef.data()
            const docId = currentDocRef.id
            const activeItems = currentDocData.items
            const title = currentDocData.title
            const isWon = currentDocData.isWon
            if (isWon) {
                setWinnerInfo({
                    winnerBoard: currentDocData.winnerBoard,
                    winnerName: currentDocData.winnerName,
                    wonAt: currentDocData.wonAt,
                    isWon: true
                })
            } else {
                setWinnerInfo(state => ({
                    ...state,
                    isWon: false
                }))
            }
            if (userDoc.exists) {
                console.log("I am present")
                const currentData = userDoc.data()
                actionSequence = currentData.actionSequence
                isBoardCompleted = currentData.isCompleted
                actionStatus = currentData.actionStatus
            } else {
                console.log("I am NOT present")
                actionSequence = shuffle(activeItems, { copy: true }).map(val => (
                    activeItems.findIndex(origValue => origValue === val)
                ));

                actionStatus = new Array(16).fill(false)
                updateUserDoc(docId)
            }
            const updatedSequenceData = actionSequence.reduce(
                (data, value, index) => ({ ...data, [index]: activeItems[value] }),
                {}
            );
            setDbInfo({
                currentBoardTitle: title,
                currentBoardId: docId,
                userBoardItems: updatedSequenceData,
                userBoardItemStatus: actionStatus,
                isUserCompleted: isBoardCompleted,
                isError: null,
                isReady: true
            })
        }
        if (boardError || docError) {
            setDbInfo({
                error: boardError || docError,
                isReady: true
            })
        }
    }, [currentBoard, userDoc, user.uid, boardError, docError, isMockData])

    return { boardData, winnerInfo }
}

const bbb = [
    "Great success",
    "User engagement",
    "Kodiak",
    "Huge kudos to X",
    "Suboptimal",
    "Learning experience ",
    "Personalized learning",
    "Super excited ",
    "Funnel",
    "OKRs",
    "Highest company priority ",
    "It’s only a test",
    "Operate like a startup a very long test here ",
    "Keeping the momentum",
    "The results look promising",
    "Initial signals"
];



hekaBackend.mockData = () => {
    const tempData = bbb.reduce(
        (data, value, index) => ({ ...data, [index]: value }),
        {}
    );
    const userBoard = {
        currentBoardId: "board1",
        currentBoardTitle: "Mock Data title",
        isCompleted: false,
        userBoardItems: tempData,
        userBoardItemStatus: new Array(16).fill(false),
        isError: null,
        isReady: true

    }
    return userBoard
}

export default hekaBackend;