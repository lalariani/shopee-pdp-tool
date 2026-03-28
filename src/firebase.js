import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCL0-6Q7Qpnjv_Qmxal0PGqx122iYnsvZQ",
  authDomain: "shopee-pdp-tool.firebaseapp.com",
  projectId: "shopee-pdp-tool",
  storageBucket: "shopee-pdp-tool.firebasestorage.app",
  messagingSenderId: "857525451625",
  appId: "1:857525451625:web:ba49820e16aa3e94e05bf8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function savePreset(preset) {
  await setDoc(doc(db, "presets", String(preset.id)), preset);
}

export async function loadPresets() {
  const snap = await getDocs(collection(db, "presets"));
  return snap.docs.map(d => d.data()).sort((a, b) => (b.ts || "").localeCompare(a.ts || ""));
}

export async function deletePreset(id) {
  await deleteDoc(doc(db, "presets", String(id)));
}