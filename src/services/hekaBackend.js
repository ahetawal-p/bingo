import firebase, { firestore, storage } from "../firebase";
import { useState, useEffect } from 'react';
import shuffle from "shuffle-array";
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';


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
        isWon: false,
        isNoBoardPresent: false,
        timeLimitExpired: true,
        nextPlayDate: ""
    });

    const [winnerInfo, setWinnerInfo] = useState({
        winnerId: null,
        winnerName: [],
        wonAt: false,
        isWon: false,
        winnerBoardUrl: null
    });

    const [currentBoard, , boardError] = useCollection(!isMockData ?
        firestore.collection("boards")
            .where("isActive", "==", true)
            .orderBy("modifiedOn", "desc")
            .limit(1) : null,
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );
    const [userDoc, , docError] = useDocument(!isMockData
        && currentBoard
        && currentBoard.docs.length > 0
        && currentBoard.docs[0].id ?
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
            }, { merge: true })
        }
        if (isMockData) {
            const mockData = this.mockData()
            setDbInfo(mockData)
        }
        if (currentBoard && currentBoard.docs.length === 0) {
            setDbInfo(state => ({
                ...state,
                isNoBoardPresent: true,
                isReady: true
            }))
        } else if (currentBoard && currentBoard.docs[0].id && userDoc) {
            const currentDocRef = currentBoard.docs[0]
            const currentDocData = currentDocRef.data()
            const docId = currentDocRef.id
            const activeItems = currentDocData.items
            const title = currentDocData.title
            const isWon = currentDocData.isWon
            const winnerBoardUrl = currentDocData.winnerBoardUrl
            let timeLimitExpired = true
            let nextPlayDate = new Date()
            if (isWon) {
                setWinnerInfo({
                    winnerId: currentDocData.winnerId,
                    winnerName: currentDocData.winnerName,
                    wonAt: currentDocData.wonAt,
                    isWon: true,
                    winnerBoardUrl: winnerBoardUrl
                })
            } else {
                setWinnerInfo(state => ({
                    ...state,
                    isWon: false
                }))
            }
            if (userDoc.exists) {
                const currentData = userDoc.data()
                if (currentData.lastModifiedOn) {
                    const lastMilli = currentData.lastModifiedOn.toMillis()
                    nextPlayDate = new Date(lastMilli + 60 * 60 * 24 * 1000);
                    const now = new Date()
                    var diffInHour = Math.floor((nextPlayDate - now) / (1000 * 60 * 60));
                    timeLimitExpired = diffInHour > 0 ? false : true
                }
                actionSequence = currentData.actionSequence
                isBoardCompleted = currentData.isBoardCompleted
                actionStatus = currentData.actionStatus
            } else {
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
                isReady: true,
                timeLimitExpired: timeLimitExpired,
                nextPlayDate: nextPlayDate.toLocaleString()
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

hekaBackend.getAdminBoards = function useAdminBoardsData(isMockData) {
    const [origBoards = { docs: [] }, loading, error] = useCollection(!isMockData ?
        firestore.collection("boards")
        : null)
    const allBoards = origBoards.docs.map(eachDoc => {
        const data = eachDoc.data();
        return {
            ...data,
            id: eachDoc.id,
            createdOn: data.createdOn ? data.createdOn.seconds : null,
            modifiedOn: data.modifiedOn ? data.modifiedOn.seconds : null,
            wonAt: data.wonAt ? data.wonAt.seconds : null,
            items: data.items ? data.items.join("\n") : ""
        }
    })
    return { allBoards, loading, error }
}

hekaBackend.saveAdminBoard = async (boardData) => {
    try {
        const newDoc = await firestore.collection("boards").add({
            title: boardData.title,
            items: boardData.items,
            isActive: boardData.isActive || false,
            createdOn: firebase.firestore.FieldValue.serverTimestamp(),
            modifiedOn: firebase.firestore.FieldValue.serverTimestamp()
        })
        return newDoc
    } catch (e) {
        alert(e)
        console.error(e)
        return e
    }
}

hekaBackend.updateAdminBoardActiveStatus = async (boardId, isActive, items) => {
    try {
        const updatedDoc = await firestore.collection("boards").doc(boardId).set({
            items: items,
            isActive: isActive,
            modifiedOn: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true })
        return updatedDoc
    } catch (e) {
        alert(e)
        console.error(e)
        return e
    }
}

hekaBackend.saveUserAction = async (currentBoardId, currentChoices, user) => {
    try {
        await firestore
            .collection("users")
            .doc(user.uid)
            .collection("myboards")
            .doc(currentBoardId)
            .update({
                actionStatus: currentChoices,
                lastModifiedOn: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true })
    } catch (e) {
        console.error(e)
    }
}

hekaBackend.updateWinner = async (currentBoardId, user) => {
    const mainBoardRef = firestore.collection('boards').doc(currentBoardId);
    const userDocRef = firestore.collection("users")
        .doc(user.uid)
        .collection("myboards")
        .doc(currentBoardId)
    try {
        const res = await firestore.runTransaction(async (t) => {
            const doc = await t.get(mainBoardRef);
            const isWonValue = doc.data().isWon;
            if (!isWonValue) {
                t.update(mainBoardRef, {
                    isWon: true,
                    winnerName: user.displayName,
                    winnerId: user.uid,
                    wonAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                t.update(userDocRef, {
                    isBoardCompleted: true
                })
                return true;
            } else {
                throw new Error("Already a winner present");
            }
        });
        return res;
    } catch (e) {
        console.error('Transaction failure:', e);
        return false
    }
}

hekaBackend.uploadWinnerBoard = async (currentBoardId, base64Image) => {
    const avatarReference = storage
        .ref()
        .child("images")
        .child("boards")
        .child(currentBoardId);
    try {
        const newFileRes = await fetch(base64Image)
        const blob = await newFileRes.blob()
        await avatarReference.put(blob)
        const downloadUrl = await avatarReference.getDownloadURL()
        const mainBoardRef = firestore.collection('boards').doc(currentBoardId);
        await mainBoardRef.set({
            winnerBoardUrl: downloadUrl
        }, { merge: true })
        return true
    } catch (e) {
        console.error('upload failed:', e);
        return false
    }



}
export default hekaBackend;