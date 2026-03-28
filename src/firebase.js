import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

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

// Compress image: resize + lower quality to fit Firestore 1MB limit
export function compressImage(base64, maxWidth = 800, quality = 0.6) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width, h = img.height;
      if (w > maxWidth) { h = (maxWidth / w) * h; w = maxWidth; }
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = base64;
  });
}

export async function savePreset(preset) {
  // Compress media images, skip videos
  const compressedMedia = [];
  for (const m of (preset.media || [])) {
    if (m.type === "video") continue; // skip videos
    if (m.src && m.src.startsWith("data:")) {
      const compressed = await compressImage(m.src);
      compressedMedia.push({ ...m, src: compressed });
    } else {
      compressedMedia.push(m);
    }
  }

  // Compress logo
  let compressedLogo = null;
  if (preset.logo && preset.logo.startsWith("data:")) {
    compressedLogo = await compressImage(preset.logo, 200, 0.7);
  }

  // Compress card images
  const compressedCards = [];
  for (const c of (preset.cards || [])) {
    if (c.image && c.image.startsWith("data:")) {
      const compressed = await compressImage(c.image, 600, 0.5);
      compressedCards.push({ ...c, image: compressed });
    } else {
      compressedCards.push(c);
    }
  }

  const data = {
    ...preset,
    media: compressedMedia,
    logo: compressedLogo,
    cards: compressedCards,
  };

  await setDoc(doc(db, "presets", String(preset.id)), data);
  return data;
}

export async function loadPresets() {
  const snap = await getDocs(collection(db, "presets"));
  return snap.docs.map(d => d.data()).sort((a, b) => (b.ts || "").localeCompare(a.ts || ""));
}

export async function deletePreset(id) {
  await deleteDoc(doc(db, "presets", String(id)));
}