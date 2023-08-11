// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getDatabase, ref, set, push } from "firebase/database";
import { getFirestore, addDoc, doc, setDoc, collection, deleteDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Store Data to localstorage
const JSONtoString = (obj) => JSON.stringify(obj);  // returns a string
const StringtoJSON = (str) => JSON.parse(str);  // returns an object

const strorageKey = 'xcxviDv::'
// Environment variable
const env = process.env;
const apiKey = process.env.REACT_APP_API_KEY;
const appId = process.env.REACT_APP_APP_ID;
const collectionName = 'payment.0.1';

// Firebase config
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: apiKey,
    authDomain: "lifepayment-40885.firebaseapp.com",
    projectId: "lifepayment-40885",
    storageBucket: "lifepayment-40885.appspot.com",
    messagingSenderId: "318813611939",
    appId: appId,
    measurementId: "G-86673DZLDZ",
    // databaseURL: "https://lifepayment-40885-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Realtime Database and get a reference to the service

// const database = getDatabase(app);
const database = getFirestore(app);



function slugify(text) {
    // Slugify a text by
    // -> converting to lowercase
    // -> replacing all spaces with underscore
    return text.toLowerCase().replaceAll(' ', '_')
}


/**
 * Structure now in localstorage is
 *      payId: {
 *                  id: string,
 *                  name: string,
 *                  amount: number
 *              }
 * 
 *    Then to save
 *      id: {
 *                  payId: string,
 *                  name: string,
 *                  amount: number
 *              }
 */


async function deleteData(name) {

    const payId = slugify(name);
    let remoteId; // track online id

    // Load document from db
    let existingData = localStorage.getItem(strorageKey);

    if (existingData === null) return; // if there is nothing in localstorage.

    // if record is in storage
    // Data is expected to be string,
    //    convert the object string to object
    existingData = StringtoJSON(existingData);

    // identify the existing record for the name
    let record = existingData[payId];

    if (!Boolean(record?.id)) return; // if there is no remote record id, return.

    // Get remote Id from record
    const { id } = record;
    remoteId = id;

    // If there is a remoteId, update by record id
    //   otherwise, push and create a new record
    try {
        const docRef = doc(database, collectionName, remoteId);
        await deleteDoc(docRef);
    } catch (e) {
        console.error("Error deleting document: ", e);
    }
}

async function save({name, amount}) {

    const payId = slugify(name);
    let remoteId; // track online id
    let userData = {
        name,
        amount: Number(amount) || 0
    };

    // Load document from db
    let existingData = localStorage.getItem(strorageKey);

    if (existingData !== null){ // if record is in storage
        // Data is expected to be string,
        //    convert the object string to object
        existingData = StringtoJSON(existingData);

        // identify the existing record for the name
        let record = existingData[payId];

        if (record?.id){
            const { id, amount:previousAmount } = record;
            remoteId = id;
            userData.amount += Number(previousAmount) || 0
        }
    }

    // If there is a remoteId, update by record id
    //   otherwise, push and create a new record
    try {
        if (remoteId) {
            const docRef = doc(database, collectionName, remoteId);

            await setDoc(docRef, { ...userData, payId })
        }else {
            // const docRef = doc(database, collectionName);
            const dbRef = collection(database, collectionName);
            await addDoc(dbRef, { ...userData, payId })
        }
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

function load() {
    let existingData = localStorage.getItem(strorageKey);

    if (existingData !== null) { // if there is an existing data
        // convert existing data from string to an object
        existingData = StringtoJSON(existingData);
        existingData = Object.values(existingData); // array
    } else {
        existingData = []
    }
    
    existingData.sort((a, b) => Number(b.amount) - Number(a.amount));
    return existingData;

}

export { save, load, deleteData, database, collectionName, JSONtoString, strorageKey };
