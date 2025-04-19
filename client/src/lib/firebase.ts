import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, getDoc, doc, updateDoc, deleteDoc, DocumentData, orderBy, limit } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { Project, Skill, Certificate, JourneyItem, Profile } from "@/types";

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: "456462842687",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-JN2CCJ4LND"
};

// Initialize Firebase - use existing app if available
let app;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
} catch (error) {
  console.error("Firebase initialization error", error);
  app = initializeApp(firebaseConfig);
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export const initializeFirebase = () => {
  return { app, db, auth, storage, analytics };
};

// Authentication functions
export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Project functions
export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsCollection = collection(db, "projects");
    const projectsQuery = query(projectsCollection, orderBy("order"));
    const snapshot = await getDocs(projectsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
  } catch (error) {
    console.error("Error getting projects:", error);
    throw error;
  }
};

export const addProject = async (project: Omit<Project, "id">) => {
  try {
    const projectsCollection = collection(db, "projects");
    return await addDoc(projectsCollection, project);
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

export const updateProject = async (projectId: string, projectData: Partial<Project>) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, projectData);
    return { id: projectId, ...projectData };
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    const projectRef = doc(db, "projects", projectId);
    await deleteDoc(projectRef);
    return projectId;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

// Skills functions
export const getSkills = async (): Promise<Skill[]> => {
  try {
    const skillsCollection = collection(db, "skills");
    const skillsQuery = query(skillsCollection, orderBy("category"), orderBy("proficiency", "desc"));
    const snapshot = await getDocs(skillsQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Skill));
  } catch (error) {
    console.error("Error getting skills:", error);
    throw error;
  }
};

export const addSkill = async (skill: Omit<Skill, "id">) => {
  try {
    const skillsCollection = collection(db, "skills");
    return await addDoc(skillsCollection, skill);
  } catch (error) {
    console.error("Error adding skill:", error);
    throw error;
  }
};

export const updateSkill = async (skillId: string, skillData: Partial<Skill>) => {
  try {
    const skillRef = doc(db, "skills", skillId);
    await updateDoc(skillRef, skillData);
    return { id: skillId, ...skillData };
  } catch (error) {
    console.error("Error updating skill:", error);
    throw error;
  }
};

export const deleteSkill = async (skillId: string) => {
  try {
    const skillRef = doc(db, "skills", skillId);
    await deleteDoc(skillRef);
    return skillId;
  } catch (error) {
    console.error("Error deleting skill:", error);
    throw error;
  }
};

// Certificates functions
export const getCertificates = async (): Promise<Certificate[]> => {
  try {
    const certificatesCollection = collection(db, "certificates");
    const certificatesQuery = query(certificatesCollection, orderBy("date", "desc"));
    const snapshot = await getDocs(certificatesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate));
  } catch (error) {
    console.error("Error getting certificates:", error);
    throw error;
  }
};

export const addCertificate = async (certificate: Omit<Certificate, "id">) => {
  try {
    const certificatesCollection = collection(db, "certificates");
    return await addDoc(certificatesCollection, certificate);
  } catch (error) {
    console.error("Error adding certificate:", error);
    throw error;
  }
};

export const updateCertificate = async (certificateId: string, certificateData: Partial<Certificate>) => {
  try {
    const certificateRef = doc(db, "certificates", certificateId);
    await updateDoc(certificateRef, certificateData);
    return { id: certificateId, ...certificateData };
  } catch (error) {
    console.error("Error updating certificate:", error);
    throw error;
  }
};

export const deleteCertificate = async (certificateId: string) => {
  try {
    const certificateRef = doc(db, "certificates", certificateId);
    await deleteDoc(certificateRef);
    return certificateId;
  } catch (error) {
    console.error("Error deleting certificate:", error);
    throw error;
  }
};

// Journey items functions
export const getJourneyItems = async (): Promise<JourneyItem[]> => {
  try {
    const journeyCollection = collection(db, "journeyItems");
    const journeyQuery = query(journeyCollection, orderBy("order"));
    const snapshot = await getDocs(journeyQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JourneyItem));
  } catch (error) {
    console.error("Error getting journey items:", error);
    throw error;
  }
};

export const addJourneyItem = async (journeyItem: Omit<JourneyItem, "id">) => {
  try {
    const journeyCollection = collection(db, "journeyItems");
    return await addDoc(journeyCollection, journeyItem);
  } catch (error) {
    console.error("Error adding journey item:", error);
    throw error;
  }
};

export const updateJourneyItem = async (itemId: string, itemData: Partial<JourneyItem>) => {
  try {
    const itemRef = doc(db, "journeyItems", itemId);
    await updateDoc(itemRef, itemData);
    return { id: itemId, ...itemData };
  } catch (error) {
    console.error("Error updating journey item:", error);
    throw error;
  }
};

export const deleteJourneyItem = async (itemId: string) => {
  try {
    const itemRef = doc(db, "journeyItems", itemId);
    await deleteDoc(itemRef);
    return itemId;
  } catch (error) {
    console.error("Error deleting journey item:", error);
    throw error;
  }
};

// Messages functions
export const addMessage = async (message: { name: string; email: string; subject: string; message: string }) => {
  try {
    const messagesCollection = collection(db, "messages");
    return await addDoc(messagesCollection, {
      ...message,
      read: false,
      createdAt: new Date()
    });
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
};

export const getMessages = async () => {
  try {
    const messagesCollection = collection(db, "messages");
    const messagesQuery = query(messagesCollection, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(messagesQuery);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    const messageRef = doc(db, "messages", messageId);
    await updateDoc(messageRef, { read: true });
    return messageId;
  } catch (error) {
    console.error("Error marking message as read:", error);
    throw error;
  }
};

export const deleteMessage = async (messageId: string) => {
  try {
    const messageRef = doc(db, "messages", messageId);
    await deleteDoc(messageRef);
    return messageId;
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

// Profile functions
export const getProfile = async (): Promise<Profile | null> => {
  try {
    const profileCollection = collection(db, "profile");
    const profileQuery = query(profileCollection, limit(1));
    const snapshot = await getDocs(profileQuery);
    
    if (snapshot.empty) {
      return null;
    }
    
    const data = snapshot.docs[0].data();
    return { 
      id: snapshot.docs[0].id, 
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "", 
      phone: data.phone || "",
      bio: data.bio || "",
      location: data.location || "",
      avatar: data.avatar || "",
      resume: data.resume || "",
      github: data.github || "",
      linkedin: data.linkedin || "",
      instagram: data.instagram || "",
      website: data.website || "",
      titles: data.titles || [],
      stats: data.stats || {}
    } as Profile;
  } catch (error) {
    console.error("Error getting profile:", error);
    throw error;
  }
};

export const updateProfile = async (profileId: string, profileData: DocumentData) => {
  try {
    const profileRef = doc(db, "profile", profileId);
    await updateDoc(profileRef, profileData);
    return { id: profileId, ...profileData };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
