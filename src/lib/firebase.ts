import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  limit, 
  Firestore 
} from 'firebase/firestore';
import { Athlete, Club, Tournament, PracticeLog, PracticeChallenge } from '../types';
import { mockAthletes, mockClubs, mockTournaments, mockPracticeLogs, mockPracticeChallenges } from '../data/mockData';

// ---------------------------------------------------------
// 1. FIREBASE CONFIGURATIONS
// ---------------------------------------------------------

// Project: VSCS-ASIA (vscs-asia)
const vscConfig = {
  apiKey: "AIzaSyAGSEFLyrcBoFQ8e9NiJ2GFExzloib88U",
  authDomain: "vscs-asia.firebaseapp.com",
  projectId: "vscs-asia",
  storageBucket: "vscs-asia.firebasestorage.app",
  messagingSenderId: "622110528719",
  appId: "1:622110528719:web:671b64a1056cc4b22253ba"
};

// Project: NCS-VSCS-ASIA (ncs-vscs-asia)
const ncsConfig = {
  apiKey: "AIzaSyCKiMEzohowJ3UbWTliL6cibRpzrJrwdF0",
  authDomain: "ncs-vscs-asia.firebaseapp.com",
  projectId: "ncs-vscs-asia",
  storageBucket: "ncs-vscs-asia.firebasestorage.app",
  messagingSenderId: "943194734991",
  appId: "1:943194734991:web:04a1602a245a7a8e4c4bfa"
};

// Initialize App Instances safely
const vscApp = getApps().find(app => app.name === 'vscApp') || initializeApp(vscConfig, 'vscApp');
const ncsApp = getApps().find(app => app.name === 'ncsApp') || initializeApp(ncsConfig, 'ncsApp');

// Initialize Firestores targeting the specific Database IDs from screenshots
export const vscDb = getFirestore(vscApp, "ai-studio-vscvietnamslings-3031112d-39bd-4933-828d-a6397149f785");
export const ncsDb = getFirestore(ncsApp, "ai-studio-ncsvscvietnamsli-8b781f81-bfed-4913-9810-6113db23caba");

// ---------------------------------------------------------
// 2. VSC DATA FETCHING (FROM vscDb)
// ---------------------------------------------------------

export async function fetchVscTournaments(): Promise<Tournament[]> {
  try {
    const querySnapshot = await getDocs(collection(vscDb, 'tournaments'));
    if (querySnapshot.empty) {
      console.log("No tournaments found in Firestore, falling back to mockTournaments.");
      return mockTournaments;
    }
    
    const tournaments: Tournament[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Safely map incoming structure with fallbacks
      tournaments.push({
        id: doc.id,
        title: data.name || data.title || "Giải Đấu Thể Thao",
        date: data.createdAt ? new Date(data.createdAt).toLocaleDateString('vi-VN') : (data.date || "2026"),
        status: data.status === 'active' ? 'ongoing' : (data.status || 'upcoming'),
        location: data.location || `Cự ly thi đấu: ${data.currentDistance || 10}M - Vòng ${data.currentRound || "1"}`,
        organizer: data.organizer || "Liên đoàn Thể thao Ná Cao Su Việt Nam (VSC)",
        participantsCount: data.participantsCount || 120,
        prizePool: data.prizePool || "Cúp Vàng Danh Giá",
        champion: data.champion ? {
          athleteName: data.champion.athleteName || "",
          clubName: data.champion.clubName || ""
        } : undefined
      });
    });
    
    return tournaments;
  } catch (error) {
    console.warn("Firestore error fetching VSC tournaments (using mock fallback):", error);
    return mockTournaments; // Safe fallback
  }
}

export async function fetchVscAthletes(): Promise<Athlete[]> {
  try {
    const querySnapshot = await getDocs(collection(vscDb, 'athletes'));
    if (querySnapshot.empty) {
      console.log("No athletes found in Firestore, falling back to mockAthletes.");
      return mockAthletes;
    }

    const athletes: Athlete[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const avatarVal = data.avatar || data.avatarUrl || "👤";
      athletes.push({
        id: doc.id,
        name: data.fullName || data.name || "Vận Động Viên",
        rank: Number(data.rank) || 1,
        points: Number(data.points) || 100,
        clubId: data.clubId || "club-free",
        clubName: data.clubName || "Tự Do",
        region: (data.region || data.province || "Miền Bắc") as any,
        accuracy: Number(data.accuracy) || 85,
        medals: {
          gold: Number(data.medals?.gold) || 0,
          silver: Number(data.medals?.silver) || 0,
          bronze: Number(data.medals?.bronze) || 0
        },
        avatar: avatarVal
      });
    });

    // Sort by rank ascending
    return athletes.sort((a, b) => a.rank - b.rank);
  } catch (error) {
    console.warn("Firestore error fetching VSC athletes (using mock fallback):", error);
    return mockAthletes;
  }
}

export async function fetchVscClubs(): Promise<Club[]> {
  try {
    const querySnapshot = await getDocs(collection(vscDb, 'clubs'));
    if (querySnapshot.empty) {
      console.log("No clubs found in Firestore, falling back to mockClubs.");
      return mockClubs;
    }

    const clubs: Club[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const logoVal = data.logo || data.logoUrl || "🎯";
      const fDate = data.foundedDate || data.foundedYear;
      let fYear = 2024;
      if (fDate) {
        if (typeof fDate === 'string' && fDate.includes('-')) {
          fYear = new Date(fDate).getFullYear() || 2024;
        } else {
          fYear = Number(fDate) || 2024;
        }
      }

      clubs.push({
        id: doc.id,
        name: data.clubName || data.name || "Câu Lạc Bộ Slingshot",
        leader: data.leaderAthleteName || data.leader || "Trưởng CLB",
        memberCount: Number(data.memberCount) || 10,
        rank: Number(data.rank) || 1,
        points: Number(data.points) || 1000,
        region: (data.region || data.province || "Miền Bắc") as any,
        logo: logoVal,
        foundedYear: fYear
      });
    });

    return clubs.sort((a, b) => b.points - a.points);
  } catch (error) {
    console.warn("Firestore error fetching VSC clubs (using mock fallback):", error);
    return mockClubs;
  }
}

// Helper to manage local fallback data in localStorage
function getLocalLogs(): PracticeLog[] {
  const stored = localStorage.getItem('vscs_practice_logs');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  return mockPracticeLogs;
}

function saveLocalLogs(logs: PracticeLog[]) {
  localStorage.setItem('vscs_practice_logs', JSON.stringify(logs));
}

function getLocalChallenges(): PracticeChallenge[] {
  const stored = localStorage.getItem('vscs_practice_challenges');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  return mockPracticeChallenges;
}

function saveLocalChallenges(chals: PracticeChallenge[]) {
  localStorage.setItem('vscs_practice_challenges', JSON.stringify(chals));
}

// ---------------------------------------------------------
// 3. NCS DATA FETCHING & WRITING (FROM/TO ncsDb)
// ---------------------------------------------------------

export async function fetchNcsPracticeLogs(): Promise<PracticeLog[]> {
  try {
    const querySnapshot = await getDocs(collection(ncsDb, 'practice_logs'));
    if (querySnapshot.empty) {
      return getLocalLogs();
    }

    const logs: PracticeLog[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        date: data.date || "2026-08-20",
        distance: data.distance as any,
        shotsCount: Number(data.shotsCount),
        hitsCount: Number(data.hitsCount),
        accuracy: Number(data.accuracy),
        score: Number(data.score)
      });
    });

    const sorted = logs.sort((a, b) => b.date.localeCompare(a.date));
    saveLocalLogs(sorted);
    return sorted;
  } catch (error) {
    console.warn("Firestore error fetching NCS practice logs (using local storage fallback):", error);
    return getLocalLogs();
  }
}

export async function saveNcsPracticeLog(log: Omit<PracticeLog, 'id'>): Promise<PracticeLog> {
  const newLog: PracticeLog = {
    ...log,
    id: `log-${Date.now()}`
  };
  
  const localLogs = getLocalLogs();
  saveLocalLogs([newLog, ...localLogs]);

  try {
    const docRef = await addDoc(collection(ncsDb, 'practice_logs'), log);
    newLog.id = docRef.id;
    saveLocalLogs([newLog, ...localLogs]);
    return newLog;
  } catch (error) {
    console.warn("Firestore error saving NCS practice log (saved to local storage fallback):", error);
    return newLog;
  }
}

export async function fetchNcsChallenges(): Promise<PracticeChallenge[]> {
  try {
    const querySnapshot = await getDocs(collection(ncsDb, 'practice_challenges'));
    if (querySnapshot.empty) {
      return getLocalChallenges();
    }

    const challenges: PracticeChallenge[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      challenges.push({
        id: doc.id,
        challengerName: data.challengerName || "",
        challengerClub: data.challengerClub || "",
        defenderName: data.defenderName,
        defenderClub: data.defenderClub,
        distance: data.distance as any,
        targetType: data.targetType as any,
        shotsCount: Number(data.shotsCount),
        wager: data.wager || "",
        time: data.time || "",
        status: data.status as any,
        winnerName: data.winnerName
      });
    });

    saveLocalChallenges(challenges);
    return challenges;
  } catch (error) {
    console.warn("Firestore error fetching NCS challenges (using local storage fallback):", error);
    return getLocalChallenges();
  }
}

export async function saveNcsChallenge(challenge: Omit<PracticeChallenge, 'id'>): Promise<PracticeChallenge> {
  const newChal: PracticeChallenge = {
    ...challenge,
    id: `chal-${Date.now()}`
  };

  const localChals = getLocalChallenges();
  saveLocalChallenges([newChal, ...localChals]);

  try {
    const docRef = await addDoc(collection(ncsDb, 'practice_challenges'), challenge);
    newChal.id = docRef.id;
    saveLocalChallenges([newChal, ...localChals]);
    return newChal;
  } catch (error) {
    console.warn("Firestore error saving NCS challenge (saved to local storage fallback):", error);
    return newChal;
  }
}

export async function updateNcsChallenge(challengeId: string, updates: Partial<PracticeChallenge>): Promise<boolean> {
  const localChals = getLocalChallenges();
  const updatedChals = localChals.map(chal => {
    if (chal.id === challengeId) {
      return { ...chal, ...updates };
    }
    return chal;
  });
  saveLocalChallenges(updatedChals);

  try {
    if (challengeId.startsWith('local-') || challengeId.startsWith('chal-') || challengeId.startsWith('log-')) {
      return true;
    }
    const chalRef = doc(ncsDb, 'practice_challenges', challengeId);
    await updateDoc(chalRef, updates);
    return true;
  } catch (error) {
    console.warn("Firestore error updating NCS challenge (updated in local storage fallback):", error);
    return true;
  }
}
