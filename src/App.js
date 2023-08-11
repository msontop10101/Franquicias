import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentForm from './components/Forms';
import Home from './components/Home';

import {
  JSONtoString,
  collectionName,
  database,
  strorageKey
} from './utils/store';

import './App.css';
import { getFirestore, collection, onSnapshot, query } from 'firebase/firestore';

function App() {
  useEffect(() => {
    const db = getFirestore(); // Initialize Firestore instance

    const collectionName = 'payment.0.1';

    const q = query(collection(db, collectionName)); // Initialize query

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        // Clear local storage
        localStorage.removeItem(strorageKey);
      }

      const entry = {};

      querySnapshot.forEach((doc) => {
        const { payId, ...rest } = doc.data();

        entry[payId] = {
          id: doc.id,
          ...rest
        };
      });

      localStorage.setItem(strorageKey, JSONtoString(entry));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<PaymentForm />} />
      </Routes>
    </div>
  );
}

export default App;
