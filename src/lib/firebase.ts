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
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
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

// Initialize Auth
export const ncsAuth = getAuth(ncsApp);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ---------------------------------------------------------
// 2. VSC DATA FETCHING (FROM vscDb)
// ---------------------------------------------------------

export async function fetchVscTournaments(): Promise<Tournament[]> {
  try {
    const querySnapshot = await getDocs(collection(vscDb, 'v3_tournaments'));
    if (querySnapshot.empty) {
      console.log("No tournaments found in v3_tournaments collection, falling back to mockTournaments.");
      return mockTournaments;
    }
    
    const tournaments: Tournament[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Parse tournament title from first history comment or fallbacks
      const firstHistory = data.workflowHistory?.[0];
      const title = firstHistory?.comment 
        ? firstHistory.comment.replace(/^Khởi tạo giải đấu:\s*/i, '') 
        : (data.name || data.title || "Giải Đấu Thể Thao VSC-26");

      const dateStr = data.workflowUpdatedAt 
        ? new Date(data.workflowUpdatedAt).toLocaleDateString('vi-VN') 
        : (data.date || "2026");

      let statusVal: 'upcoming' | 'ongoing' | 'completed' = 'upcoming';
      if (data.workflowState === 'registration_open') {
        statusVal = 'upcoming';
      } else if (data.workflowState === 'active' || data.workflowState === 'ongoing') {
        statusVal = 'ongoing';
      } else if (data.workflowState === 'completed' || data.workflowState === 'finished') {
        statusVal = 'completed';
      } else {
        statusVal = data.status || 'upcoming';
      }

      tournaments.push({
        id: doc.id,
        title: title,
        date: dateStr,
        status: statusVal,
        location: data.location || `Cự ly: 15M - Sân thi đấu Quốc gia VSC`,
        organizer: data.organizer || "Liên đoàn Thể thao Ná Cao Su Việt Nam (VSC)",
        participantsCount: data.participantsCount || data.views || 120,
        prizePool: data.prizePool || "Cúp Vàng Danh Giá VSC",
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

export async function fetchNcsPracticeLogs(userId?: string): Promise<PracticeLog[]> {
  try {
    const querySnapshot = await getDocs(collection(ncsDb, 'vsc_training_sessions'));
    if (querySnapshot.empty) {
      return [];
    }

    const logs: PracticeLog[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      
      // Filter by userId if specified to display only logged-in athlete's data
      if (userId && data.userId !== userId && data.uid !== userId) {
        return;
      }

      // Calculate hits and shots from native fields shown in the database screenshot (Image 3)
      const shotsArray = data.shots || [];
      const shotsCount = Number(data.targetShots || data.shotsCount || shotsArray.length || 30);
      let hitsCount = 0;
      if (data.hitsCount !== undefined) {
        hitsCount = Number(data.hitsCount);
      } else if (data.hits !== undefined) {
        hitsCount = Number(data.hits);
      } else if (shotsArray.length > 0) {
        hitsCount = shotsArray.filter((s: boolean) => s === true).length;
      } else {
        const misses = Number(data.missesCount !== undefined ? data.missesCount : (data.misses !== undefined ? data.misses : 0));
        hitsCount = Math.max(0, shotsCount - misses);
      }

      const accuracy = shotsCount > 0 ? parseFloat(((hitsCount / shotsCount) * 100).toFixed(1)) : 0;
      const score = Math.round(accuracy);
      const dateStr = data.date || (data.createdAt ? data.createdAt.split('T')[0] : "2026-08-27");

      logs.push({
        id: docSnap.id,
        date: dateStr,
        distance: data.distance !== undefined ? data.distance : "15m",
        shotsCount,
        hitsCount,
        accuracy,
        score
      });
    });

    const sorted = logs.sort((a, b) => b.date.localeCompare(a.date));
    return sorted;
  } catch (error) {
    console.warn("Firestore error fetching NCS practice logs:", error);
    return [];
  }
}

export async function saveNcsPracticeLog(log: Omit<PracticeLog, 'id'>): Promise<PracticeLog> {
  const newLog: PracticeLog = {
    ...log,
    id: `log-${Date.now()}`
  };
  
  try {
    // Generate boolean array matching target shots and hit counts
    const shotsArray = Array.from({ length: log.shotsCount }, (_, i) => i < log.hitsCount);
    const dbPayload = {
      userId: ncsAuth.currentUser?.uid || "Ijh6rccAnxVBD3zFDG5sYYY6Tob2",
      targetShots: log.shotsCount,
      missesCount: log.shotsCount - log.hitsCount,
      shots: shotsArray,
      targetType: "bia_muc_tieu",
      notes: "",
      createdAt: new Date().toISOString(),
      date: log.date,
      distance: log.distance
    };
    const docRef = await addDoc(collection(ncsDb, 'vsc_training_sessions'), dbPayload);
    newLog.id = docRef.id;
    return newLog;
  } catch (error) {
    console.warn("Firestore error saving NCS practice log:", error);
    return newLog;
  }
}

export async function fetchNcsChallenges(): Promise<PracticeChallenge[]> {
  try {
    const querySnapshot = await getDocs(collection(ncsDb, 'vsc_pk_challenges'));
    if (querySnapshot.empty) {
      return [];
    }

    const challenges: PracticeChallenge[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      
      // Preserve exact distance string or format
      const rawDistance = data.distance !== undefined ? data.distance : "15m";

      // Map targetType to friendly name or keep raw database value
      let targetVal = data.targetType || "Bia Giấy";
      if (data.targetType === 'bia_muc_tieu') {
        targetVal = "Bia Mục Tiêu";
      } else if (data.targetType === 'bia_dat_set' || data.targetType === 'bia_dat') {
        targetVal = "Bia Đất Sét";
      } else if (data.targetType === 'nap_chai') {
        targetVal = "Nắp Chai";
      } else if (data.targetType === 'bia_kim_loai' || data.targetType === 'bia_sat') {
        targetVal = "Bia Kim Loại";
      }

      // Determine status from database properties
      let statusVal: 'open' | 'accepted' | 'completed' = 'open';
      if (data.winnerName || data.winner || data.status === 'completed') {
        statusVal = 'completed';
      } else if (data.opponentUid || data.opponentName || data.status === 'accepted') {
        statusVal = 'accepted';
      }

      const challengerNameStr = data.challengerName || data.challengerAthleteName || "Thành viên NCS";
      const defenderNameStr = data.opponentName || data.opponentAthleteName || undefined;
      const winnerNameStr = data.winnerName || data.winner || data.winnerAthleteName || undefined;
      let loserNameStr = data.loserName || data.loser || data.loserAthleteName || undefined;
      
      if (winnerNameStr && !loserNameStr) {
        if (winnerNameStr === challengerNameStr) {
          loserNameStr = defenderNameStr || "Đối thủ";
        } else if (defenderNameStr && winnerNameStr === defenderNameStr) {
          loserNameStr = challengerNameStr;
        }
      }

      challenges.push({
        id: docSnap.id,
        challengerName: challengerNameStr,
        challengerClub: data.challengerClub || "Tự do",
        defenderName: defenderNameStr,
        defenderClub: data.opponentUid ? "NCS Club" : undefined,
        distance: rawDistance,
        targetType: targetVal,
        shotsCount: Number(data.shotsCount || data.targetShots || 30),
        wager: data.wager || "Ly cà phê vui vẻ ☕",
        time: data.dateTime || data.time || "Gặp trực tiếp",
        status: statusVal,
        winnerName: winnerNameStr,
        loserName: loserNameStr
      });
    });

    return challenges;
  } catch (error) {
    console.warn("Firestore error fetching NCS challenges:", error);
    return [];
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
    const dbPayload = {
      challengerName: challenge.challengerName,
      challengerClub: challenge.challengerClub,
      challengerUid: ncsAuth.currentUser?.uid || "Ijh6rccAnxVBD3zFDG5sYYY6Tob2",
      createdAt: new Date().toISOString(),
      dateTime: challenge.time,
      distance: `${challenge.distance}m`,
      targetType: challenge.targetType === 'Bia Giấy' ? 'bia_muc_tieu' : 'bia_muc_tieu',
      rules: "Cộng tổng điểm (Cộng dồn tất cả các hiệp)",
      wager: challenge.wager || "Ly cà phê vui vẻ ☕",
      opponentName: challenge.defenderName || "",
      opponentUid: challenge.defenderClub || "",
      shotsCount: challenge.shotsCount,
      status: challenge.status
    };
    const docRef = await addDoc(collection(ncsDb, 'vsc_pk_challenges'), dbPayload);
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
    const chalRef = doc(ncsDb, 'vsc_pk_challenges', challengeId);
    
    // Map updates back to DB format
    const dbUpdates: any = {};
    if (updates.defenderName !== undefined) dbUpdates.opponentName = updates.defenderName;
    if (updates.defenderClub !== undefined) dbUpdates.opponentUid = "accepted-opponent-uid";
    if (updates.winnerName !== undefined) dbUpdates.winnerName = updates.winnerName;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    await updateDoc(chalRef, dbUpdates);
    return true;
  } catch (error) {
    console.warn("Firestore error updating NCS challenge (updated in local storage fallback):", error);
    return true;
  }
}
