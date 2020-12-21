import { firestore } from "../firebase";
import shuffle from "shuffle-array";

const hekaBackend = {};

hekaBackend.fetchCurrentUserBoard = async (user) => {
    const userBoard = {}
    const activeDocs = await firestore.collection("boards").where("isActive", "==", true).get()
    if (activeDocs.docs[0]) {
        const activeItems = activeDocs.docs[0].data().items
        const docId = activeDocs.docs[0].id
        let actionSequence = []
        let actionStatus = []
        let isBoardCompleted = false
        const docRef = await firestore.collection("users").doc(user.uid).collection("myboards").doc(docId).get();
        if (docRef.exists) {
            console.log("I am present")
            const currentData = docRef.data()
            actionSequence = currentData.sequence
            isBoardCompleted = currentData.isCompleted
            actionStatus = currentData.status
        } else {
            console.log("I am NOT present")
            actionSequence = shuffle(activeItems, { copy: true }).map(val => (
                activeItems.findIndex(origValue => origValue === val)
            ));

            actionStatus = new Array(16).fill(false)
            await firestore.collection("users").doc(user.uid).collection("myboards").doc(docId).set({
                isBoardCompleted,
                actionSequence,
                actionStatus
            })
        }
        const updatedSequenceData = actionSequence.reduce(
            (data, value, index) => ({ ...data, [index]: activeItems[value] }),
            {}
        );
        userBoard['boardId'] = docId
        userBoard['isBoardCompleted'] = isBoardCompleted
        userBoard['actionSequence'] = updatedSequenceData
        userBoard['actionStatus'] = actionStatus
    }
    return userBoard;
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
        "boardId": "board1",
        "isBoardCompleted": false,
        "actionSequence": tempData,
        actionStatus: new Array(16).fill(false)

    }
    return userBoard
}

export default hekaBackend;