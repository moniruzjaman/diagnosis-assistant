import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import type { HistoryScan, AIDiagnosisResult } from "./types";

const firebaseConfig = {
  projectId: "fertilizer-dealer",
  appId: "1:798390434310:web:5743a5619e2004e8286187",
  apiKey: "AIzaSyCMRA3_SceO-iemeiMHh0Cyhu9T1BTd_-M",
  authDomain: "fertilizer-dealer.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-cabiplantdiagnos-08fd4720-ce87-4830-ae1e-83a7a7656a1d",
  storageBucket: "fertilizer-dealer.firebasestorage.app",
  messagingSenderId: "798390434310",
  measurementId: "",
  oAuthClientId: "798390434310-30f5akk397m4n9662m382qsssa71un0k.apps.googleusercontent.com",
  recaptchaSiteKey: "",
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with the provisioned database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

// Initialize Auth
export const auth = getAuth(app);

// Provider for Google sign in
export const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error("Firebase Google sign-in failed:", err);
    throw err;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    // After signout, restore anonymous session
    return await signInAnonymously(auth);
  } catch (err) {
    console.error("Firebase signout failed:", err);
    throw err;
  }
}

// Auto sign-in anonymously if not already signed in
export function subscribeAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      try {
        const cred = await signInAnonymously(auth);
        callback(cred.user);
      } catch (err) {
        console.error("Firebase anonymous sign-in error:", err);
        callback(null);
      }
    } else {
      callback(user);
    }
  });
}

// Save diagnosis scan to Firestore
export async function saveScanToFirestore(
  userId: string,
  symptomDescription: string,
  image: string | null,
  result: AIDiagnosisResult,
  cropType?: string
): Promise<string> {
  try {
    // If image is a large base64 data URL, store a truncated representation or url to prevent Firestore document size limit (1MB)
    let storedImage = image;
    if (storedImage && storedImage.startsWith("data:") && storedImage.length > 500000) {
      // Don't store oversized base64 to preserve doc budget
      storedImage = null;
    }

    const docRef = await addDoc(collection(db, "diagnostic_history"), {
      userId,
      symptomDescription,
      cropType: cropType || "General Plant / Crop",
      matchedCategory: result.matchedCategory || "Unknown",
      pathogen: result.signsDetected?.[0] || result.matchedCategory || "Uncategorized",
      confidenceScore: result.confidence,
      image: storedImage,
      result,
      timestamp: new Date().toLocaleString(),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (err) {
    console.error("Error saving scan to Firestore:", err);
    throw err;
  }
}

// Delete diagnosis scan from Firestore
export async function deleteScanFromFirestore(scanId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "diagnostic_history", scanId));
  } catch (err) {
    console.error("Error deleting scan from Firestore:", err);
    throw err;
  }
}

// Real-time listener for user's diagnostic scans
export function subscribeToUserHistory(
  userId: string,
  onUpdate: (scans: HistoryScan[]) => void
) {
  if (!userId) return () => {};

  const q = query(
    collection(db, "diagnostic_history"),
    where("userId", "==", userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const scans: HistoryScan[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        scans.push({
          id: docSnap.id,
          timestamp: data.timestamp || new Date().toLocaleString(),
          symptomDescription: data.symptomDescription || "",
          image: data.image || null,
          result: data.result as AIDiagnosisResult,
        });
      });
      // Sort in memory by createdAt / timestamp descending
      onUpdate(scans.reverse());
    },
    (error) => {
      console.error("Error listening to diagnostic_history:", error);
    }
  );
}

// Save Quiz Score
export async function saveQuizScore(userId: string, score: number, played: number) {
  if (!userId) return;
  try {
    await setDoc(
      doc(db, "quiz_scores", userId),
      {
        userId,
        score,
        played,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error("Error saving quiz score to Firestore:", err);
  }
}

// Retrieve Quiz Score
export async function fetchQuizScore(userId: string) {
  if (!userId) return null;
  try {
    const snap = await getDoc(doc(db, "quiz_scores", userId));
    if (snap.exists()) {
      return snap.data() as { score: number; played: number };
    }
    return null;
  } catch (err) {
    console.error("Error fetching quiz score from Firestore:", err);
    return null;
  }
}
