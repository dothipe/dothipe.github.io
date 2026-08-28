export type Region = 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';

export interface Athlete {
  id: string;
  name: string;
  rank: number;
  points: number;
  clubId: string;
  clubName: string;
  region: Region;
  accuracy: number; // percentage, e.g. 88.5
  medals: {
    gold: number;
    silver: number;
    bronze: number;
  };
  avatar: string;
}

export interface Club {
  id: string;
  name: string;
  leader: string;
  memberCount: number;
  rank: number;
  points: number;
  region: Region;
  logo: string;
  foundedYear: number;
}

export interface Tournament {
  id: string;
  title: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  location: string;
  organizer: string;
  participantsCount: number;
  prizePool: string;
  champion?: {
    athleteName: string;
    clubName: string;
  };
  detailsUrl?: string;
}

export interface PracticeLog {
  id: string;
  date: string;
  distance: 10 | 15 | 20; // standard slingshot distances in meters
  shotsCount: number;
  hitsCount: number;
  accuracy: number; // (hits/shots) * 100
  score: number; // total score (e.g. out of 100)
}

export interface PracticeChallenge {
  id: string;
  challengerName: string;
  challengerClub: string;
  defenderName?: string; // can be open to any challenger
  defenderClub?: string;
  distance: any;
  targetType: string;
  shotsCount: number;
  wager: string; // "Nước mía", "Cà phê", "Giao lưu vui vẻ"
  time: string;
  status: 'open' | 'accepted' | 'completed';
  winnerName?: string;
  loserName?: string;
}
