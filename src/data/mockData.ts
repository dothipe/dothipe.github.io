import { Athlete, Club, Tournament, PracticeLog, PracticeChallenge } from '../types';

export const mockClubs: Club[] = [
  {
    id: 'club-1',
    name: 'CLB Ná Cao Su Thủ Đô (Hà Nội)',
    leader: 'Nguyễn Văn Hùng',
    memberCount: 48,
    rank: 1,
    points: 2450,
    region: 'Miền Bắc',
    logo: '🎯',
    foundedYear: 2019
  },
  {
    id: 'club-2',
    name: 'CLB Ná Thể Thao Sài Gòn (Gia Định)',
    leader: 'Trần Thanh Lâm',
    memberCount: 52,
    rank: 2,
    points: 2310,
    region: 'Miền Nam',
    logo: '⚡',
    foundedYear: 2020
  },
  {
    id: 'club-3',
    name: 'CLB Slingshot Sông Hàn (Đà Nẵng)',
    leader: 'Lê Hoàng Hải',
    memberCount: 35,
    rank: 3,
    points: 1980,
    region: 'Miền Trung',
    logo: '🌊',
    foundedYear: 2021
  },
  {
    id: 'club-4',
    name: 'Hội Ná Thể Thao Đắk Lắk',
    leader: 'Y Kông Knul',
    memberCount: 42,
    rank: 4,
    points: 1850,
    region: 'Miền Trung',
    logo: '🦅',
    foundedYear: 2018
  },
  {
    id: 'club-5',
    name: 'CLB Ná Cao Su Đất Sen Hồng (Đồng Tháp)',
    leader: 'Phạm Minh Trí',
    memberCount: 30,
    rank: 5,
    points: 1620,
    region: 'Miền Nam',
    logo: '🌸',
    foundedYear: 2022
  },
  {
    id: 'club-6',
    name: 'CLB Slingshot Kinh Bắc (Bắc Ninh)',
    leader: 'Nguyễn Đăng Khoa',
    memberCount: 28,
    rank: 6,
    points: 1490,
    region: 'Miền Bắc',
    logo: '⛩️',
    foundedYear: 2022
  }
];

export const mockAthletes: Athlete[] = [
  {
    id: 'ath-1',
    name: 'Nguyễn Anh Tuấn (Tuấn Slingshot)',
    rank: 1,
    points: 780,
    clubId: 'club-1',
    clubName: 'CLB Ná Cao Su Thủ Đô (Hà Nội)',
    region: 'Miền Bắc',
    accuracy: 94.2,
    medals: { gold: 4, silver: 1, bronze: 0 },
    avatar: '🎯'
  },
  {
    id: 'ath-2',
    name: 'Phạm Thành Nam (Nam Gia Định)',
    rank: 2,
    points: 720,
    clubId: 'club-2',
    clubName: 'CLB Ná Thể Thao Sài Gòn (Gia Định)',
    region: 'Miền Nam',
    accuracy: 92.8,
    medals: { gold: 2, silver: 3, bronze: 1 },
    avatar: '🏹'
  },
  {
    id: 'ath-3',
    name: 'Lê Văn Thắng (Thắng Đà Nẵng)',
    rank: 3,
    points: 680,
    clubId: 'club-3',
    clubName: 'CLB Slingshot Sông Hàn (Đà Nẵng)',
    region: 'Miền Trung',
    accuracy: 91.5,
    medals: { gold: 1, silver: 2, bronze: 3 },
    avatar: '💎'
  },
  {
    id: 'ath-4',
    name: 'Trần Văn Đạt (Đạt Đắk Lắk)',
    rank: 4,
    points: 640,
    clubId: 'club-4',
    clubName: 'Hội Ná Thể Thao Đắk Lắk',
    region: 'Miền Trung',
    accuracy: 90.4,
    medals: { gold: 2, silver: 0, bronze: 2 },
    avatar: '🔥'
  },
  {
    id: 'ath-5',
    name: 'Nguyễn Minh Quân (Quân Cao Lãnh)',
    rank: 5,
    points: 590,
    clubId: 'club-5',
    clubName: 'CLB Ná Cao Su Đất Sen Hồng (Đồng Tháp)',
    region: 'Miền Nam',
    accuracy: 89.2,
    medals: { gold: 1, silver: 1, bronze: 1 },
    avatar: '⭐'
  },
  {
    id: 'ath-6',
    name: 'Hoàng Quốc Việt (Việt Kinh Bắc)',
    rank: 6,
    points: 560,
    clubId: 'club-6',
    clubName: 'CLB Slingshot Kinh Bắc (Bắc Ninh)',
    region: 'Miền Bắc',
    accuracy: 88.7,
    medals: { gold: 0, silver: 2, bronze: 1 },
    avatar: '🐲'
  },
  {
    id: 'ath-7',
    name: 'Lê Minh Tuấn (Tuấn Miền Nam)',
    rank: 7,
    points: 510,
    clubId: 'club-2',
    clubName: 'CLB Ná Thể Thao Sài Gòn (Gia Định)',
    region: 'Miền Nam',
    accuracy: 87.5,
    medals: { gold: 0, silver: 1, bronze: 2 },
    avatar: '⚡'
  },
  {
    id: 'ath-8',
    name: 'Vũ Đức Mạnh (Mạnh Hải Phòng)',
    rank: 8,
    points: 480,
    clubId: 'club-1',
    clubName: 'CLB Ná Cao Su Thủ Đô (Hà Nội)',
    region: 'Miền Bắc',
    accuracy: 86.9,
    medals: { gold: 0, silver: 0, bronze: 3 },
    avatar: '🦁'
  }
];

export const mockTournaments: Tournament[] = [
  {
    id: 'tour-1',
    title: 'Giải vô địch Ná cao su Thể thao Toàn quốc 2026 (VSC-26)',
    date: '15/10/2026',
    status: 'upcoming',
    location: 'Nhà thi đấu Thể thao Phú Thọ, Quận 11, TP. Hồ Chí Minh',
    organizer: 'Ủy ban Thể dục Thể thao & Liên đoàn Ná Thể Thao Việt Nam',
    participantsCount: 150,
    prizePool: '150.000.000 VND + Cúp Vàng Quốc Gia'
  },
  {
    id: 'tour-2',
    title: 'Giải Cúp các Câu lạc bộ Slingshot Miền Bắc lần IV',
    date: '05/09/2026',
    status: 'upcoming',
    location: 'Sân vận động Mỹ Đình (Khu tập luyện ngoài trời), Hà Nội',
    organizer: 'Ban điều hành VSC Miền Bắc',
    participantsCount: 80,
    prizePool: '50.000.000 VND'
  },
  {
    id: 'tour-3',
    title: 'Giải Đấu Mở Rộng Slingshot Miền Trung - Tây Nguyên',
    date: '20/07/2026',
    status: 'ongoing',
    location: 'Khu du lịch sinh thái Kotam, Buôn Ma Thuột, Đắk Lắk',
    organizer: 'Hội Ná Thể Thao Đắk Lắk đăng cai',
    participantsCount: 120,
    prizePool: '80.000.000 VND'
  },
  {
    id: 'tour-4',
    title: 'Giải Vô Địch Ná Thể Thao Đồng Bằng Sông Cửu Long 2026',
    date: '12/04/2026',
    status: 'completed',
    location: 'Công viên Văn hóa Cao Lãnh, Đồng Tháp',
    organizer: 'CLB Đất Sen Hồng phối hợp sở VHTTDL Đồng Tháp',
    participantsCount: 95,
    prizePool: '60.000.000 VND',
    champion: {
      athleteName: 'Nguyễn Minh Quân',
      clubName: 'CLB Ná Cao Su Đất Sen Hồng (Đồng Tháp)'
    }
  },
  {
    id: 'tour-5',
    title: 'Giải Slingshot Tranh Cúp Thủ Đô Mở Rộng 2026',
    date: '18/01/2026',
    status: 'completed',
    location: 'Nhà thi đấu Trịnh Hoài Đức, Đống Đa, Hà Nội',
    organizer: 'CLB Ná Cao Su Thủ Đô',
    participantsCount: 110,
    prizePool: '70.000.000 VND',
    champion: {
      athleteName: 'Nguyễn Anh Tuấn',
      clubName: 'CLB Ná Cao Su Thủ Đô (Hà Nội)'
    }
  }
];

export const mockPracticeLogs: PracticeLog[] = [
  { id: 'log-1', date: '2026-08-19', distance: 10, shotsCount: 50, hitsCount: 47, accuracy: 94.0, score: 94 },
  { id: 'log-2', date: '2026-08-18', distance: 15, shotsCount: 50, hitsCount: 43, accuracy: 86.0, score: 86 },
  { id: 'log-3', date: '2026-08-16', distance: 10, shotsCount: 100, hitsCount: 91, accuracy: 91.0, score: 91 },
  { id: 'log-4', date: '2026-08-15', distance: 15, shotsCount: 40, hitsCount: 32, accuracy: 80.0, score: 80 },
  { id: 'log-5', date: '2026-08-14', distance: 20, shotsCount: 30, hitsCount: 22, accuracy: 73.3, score: 73 },
  { id: 'log-6', date: '2026-08-12', distance: 15, shotsCount: 50, hitsCount: 41, accuracy: 82.0, score: 82 },
  { id: 'log-7', date: '2026-08-10', distance: 10, shotsCount: 50, hitsCount: 48, accuracy: 96.0, score: 96 }
];

export const mockPracticeChallenges: PracticeChallenge[] = [
  {
    id: 'chal-1',
    challengerName: 'Lê Minh Tuấn',
    challengerClub: 'CLB Sài Gòn',
    distance: 15,
    targetType: 'Bia Giấy',
    shotsCount: 30,
    wager: 'Cà phê sáng ☕',
    time: 'Chủ nhật này (23/08) - 8:30 sáng',
    status: 'open'
  },
  {
    id: 'chal-2',
    challengerName: 'Hoàng Quốc Việt',
    challengerClub: 'CLB Kinh Bắc',
    distance: 10,
    targetType: 'Bia Đất Sét',
    shotsCount: 50,
    wager: 'Lẩu đuôi bò cuối tuần 🍲',
    time: 'Thứ Bảy này (22/08) - 17:00 chiều',
    status: 'open'
  },
  {
    id: 'chal-3',
    challengerName: 'Nguyễn Văn Hùng',
    challengerClub: 'CLB Thủ Đô',
    defenderName: 'Trần Đăng',
    defenderClub: 'Tự do',
    distance: 20,
    targetType: 'Nắp Chai',
    shotsCount: 20,
    wager: 'Nước mía giải nhiệt 🥤',
    time: 'Hôm nay (20/08) - 18:00 chiều',
    status: 'accepted'
  },
  {
    id: 'chal-4',
    challengerName: 'Phạm Minh Trí',
    challengerClub: 'CLB Đồng Tháp',
    defenderName: 'Trần Thanh Lâm',
    defenderClub: 'CLB Sài Gòn',
    distance: 15,
    targetType: 'Bia Kim Loại',
    shotsCount: 30,
    wager: 'Trà đá vui vẻ 🍵',
    time: '18/08/2026',
    status: 'completed',
    winnerName: 'Phạm Minh Trí'
  }
];
