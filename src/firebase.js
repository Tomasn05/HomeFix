import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDSbhqlMWy4yaInrfKMTljfMGT8_2iXJWs",
  authDomain: 'homefix-b5d9c.firebaseapp.com',
  projectId: 'homefix-b5d9c',
  storageBucket: 'homefix-b5d9c.firebasestorage.app',
  messagingSenderId: '190511436838',
  appId: '1:190511436838:web:0ddc87f6bc69f9c29582e7',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
