// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, listAll } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAvXw55DhCOhLipOuf767tCqjPbNxbBRXw",
  authDomain: "mimetic-obelisk-407017.firebaseapp.com",
  projectId: "mimetic-obelisk-407017",
  storageBucket: "mimetic-obelisk-407017.appspot.com",
  messagingSenderId: "1051607975308",
  appId: "1:1051607975308:web:77987a2f297a96f64102a9",
  measurementId: "G-SWDXFPMFS2"
};

const app = initializeApp(firebaseConfig);
export const imageDB = getStorage(app);

// get all images categories [Firebase.js]
export function getAllImages() {
  const imagesRef = ref(imageDB, '/images_categories');
  return listAll(imagesRef).then((response) => {
    const images = response.items.map((item) => item.name);
    return images; // <- array
  }).catch((error) => {
    console.error(error);
  });
};

/*
get all images categories [from Firebase]
useEffect(() => {
  const getSampleImage = async () => {
    const images = await getAllImages();
    console.log(images);
  }
getSampleImage();
  
}, []);

*/