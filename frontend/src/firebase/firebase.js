
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";



const firebaseConfig = {
  apiKey: "AIzaSyCrkMIxbmRD798OirZIGCisI17N5f-YDwc",
  authDomain: "code-combat-dc7e1.firebaseapp.com",
  projectId: "code-combat-dc7e1",
  storageBucket: "code-combat-dc7e1.appspot.com",
  messagingSenderId: "723400702648",
  appId: "1:723400702648:web:af0e2414eb4df847b3124d",
  measurementId: "G-FXYDN5YZ75"
};

import { getStorage, ref , uploadBytes} from "firebase/storage";
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);





export {storage};