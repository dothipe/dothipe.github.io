import { useState, FormEvent, useEffect } from 'react';
import { Athlete, Club, Tournament, Region } from '../types';
import { fetchVscAthletes, fetchVscClubs, fetchVscTournaments } from '../lib/firebase';
import { 
  Trophy, 
  Search, 
  MapPin, 
  Users, 
  Calendar, 
  Sparkles, 
  Filter, 
  Award, 
  CheckCircle2, 
  UserPlus, 
  ArrowLeft,
  ChevronRight,
  Shield,
  Star,
  Menu,
  X
} from 'lucide-react';

interface VscPortalProps {
  onBackToHome: () => void;
  onNavigateTo: (route: 'home' | 'vsc' | 'ncs') => void;
}

function renderAvatar(value: string, fallbackEmoji: string = '👤') {
  if (!value) return <span className="text-xl">{fallbackEmoji}</span>;
  if (value.startsWith('http') || value.startsWith('data:image') || value.length > 8) {
    return (
      <img 
        src={value} 
        alt="Avatar" 
        referrerPolicy="no-referrer"
        className="w-8 h-8 rounded-full object-cover border border-slate-700/50" 
      />
    );
  }
  return <span className="text-xl">{value}</span>;
}

function renderClubLogo(value: string, fallbackEmoji: string = '🎯') {
  if (!value) return <span className="text-lg">{fallbackEmoji}</span>;
  if (value.startsWith('http') || value.startsWith('data:image') || value.length > 8) {
    return (
      <img 
        src={value} 
        alt="Logo" 
        referrerPolicy="no-referrer"
        className="w-8 h-8 rounded-lg object-cover border border-slate-700/50" 
      />
    );
  }
  return <span className="text-lg">{value}</span>;
}

export default function VscPortal({ onBackToHome, onNavigateTo }: VscPortalProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');
  const [activeTab, setActiveTab] = useState<'athletes' | 'clubs' | 'tournaments'>('athletes');
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  // Load live data from Firestore on mount
  useEffect(() => {
    async function loadLiveData() {
      try {
        const [loadedAthletes, loadedClubs, loadedTournaments] = await Promise.all([
          fetchVscAthletes(),
          fetchVscClubs(),
          fetchVscTournaments()
        ]);
        setAthletes(loadedAthletes);
        setClubs(loadedClubs);
        setTournaments(loadedTournaments);
      } catch (err) {
        console.error("Failed to load VSC Firebase data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveData();
  }, []);
  
  // Registration State
  const [showRegForm, setShowRegForm] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regData, setRegData] = useState({
    fullName: '',
    phone: '',
    club: '',
    region: 'Miền Bắc' as Region,
    distance: 15,
    email: '',
    experience: 'Từ 1 - 3 năm'
  });

  // Handle athlete sorting/filtering
  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          athlete.clubName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'All' || athlete.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // Handle club sorting
  const sortedClubs = [...clubs].sort((a, b) => b.points - a.points);

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!regData.fullName || !regData.phone) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên và Số điện thoại).');
      return;
    }
    setRegSuccess(true);
  };

  const resetForm = () => {
    setRegData({
      fullName: '',
      phone: '',
      club: '',
      region: 'Miền Bắc',
      distance: 15,
      email: '',
      experience: 'Từ 1 - 3 năm'
    });
    setRegSuccess(false);
    setShowRegForm(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-200 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0D1117]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            id="vsc-back-btn"
            onClick={onBackToHome}
            className="flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-all py-1.5 px-3 rounded-lg hover:bg-amber-500/10 cursor-pointer text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Về Trang Chủ</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h1 className="text-lg md:text-xl font-bold font-display tracking-tight text-amber-500">VSC PORTAL</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest hidden sm:block">Hệ thống giải quốc gia & vinh danh</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <button onClick={() => onNavigateTo('home')} className="hover:text-amber-400 transition-colors cursor-pointer">Trang Chủ</button>
            <button onClick={() => onNavigateTo('vsc')} className="text-amber-400 hover:text-slate-100 transition-colors cursor-pointer">Giải Quốc Gia (VSC)</button>
            <button onClick={() => onNavigateTo('ncs')} className="hover:text-blue-400 transition-colors cursor-pointer">Câu Lạc Bộ (NCS)</button>
          </nav>

          <div className="flex items-center gap-2">
            <button 
              id="vsc-header-reg-btn"
              onClick={() => { setShowRegForm(true); setActiveTab('tournaments'); }}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all hover:scale-105 shadow-md shadow-amber-500/10 cursor-pointer"
            >
              Đăng Ký VSC-26
            </button>
            
            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white focus:outline-none p-1.5 rounded-lg bg-slate-800/40 ml-1 block lg:hidden"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Menu Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2.5 font-semibold text-xs uppercase tracking-wider text-slate-300 bg-[#0D1117] px-2 py-3 rounded-xl">
            <button 
              onClick={() => { onNavigateTo('home'); setIsMenuOpen(false); }} 
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-amber-400 transition-colors"
            >
              Trang Chủ
            </button>
            <button 
              onClick={() => { onNavigateTo('vsc'); setIsMenuOpen(false); }} 
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-amber-400 transition-colors"
            >
              Giải Quốc Gia (VSC)
            </button>
            <button 
              onClick={() => { onNavigateTo('ncs'); setIsMenuOpen(false); }} 
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 hover:text-blue-400 transition-colors"
            >
              Câu Lạc Bộ (NCS)
            </button>
            <button 
              onClick={() => { onNavigateTo('vsc'); setIsMenuOpen(false); }} 
              className="text-left py-2 px-3 rounded-lg bg-amber-500/15 border border-amber-500/20 text-amber-400 font-bold flex items-center gap-2 transition-colors"
            >
              <span>🏆 CÚP QUỐC GIA (XEM NGAY)</span>
            </button>
          </div>
        )}
      </header>

      {/* Mobile Persistent Sub-Header Navigation */}
      <div className="md:hidden sticky top-[61px] z-30 bg-[#090d12] border-b border-slate-800/80 px-3 py-2.5 flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none shadow-lg">
        <div className="flex items-center gap-1 min-w-max">
          <button 
            onClick={() => onNavigateTo('home')} 
            className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg uppercase transition-all text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            Trang Chủ
          </button>
          <button 
            onClick={() => onNavigateTo('vsc')} 
            className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg uppercase transition-all bg-amber-500/10 text-amber-400 border border-amber-500/20"
          >
            Giải VSC
          </button>
          <button 
            onClick={() => onNavigateTo('ncs')} 
            className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg uppercase transition-all text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            CLB NCS
          </button>
        </div>
        <button 
          onClick={() => onNavigateTo('vsc')} 
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-1.5 rounded-lg text-[10px] uppercase tracking-wider transition-all shadow-md shadow-amber-500/15 shrink-0"
        >
          🏆 CÚP QUỐC GIA
        </button>
      </div>

      {/* Hero Banner for VSC */}
      <section className="relative overflow-hidden bg-radial from-amber-950/10 via-[#0A0C10] to-[#0A0C10] border-b border-slate-900 px-4 py-12 md:py-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0D1117] border border-slate-800 text-amber-400 text-xs font-semibold rounded-full uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Hệ Thống Giải Đấu Ná Cao Su Thể Thao Việt Nam
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-slate-100">
            CHINH PHỤC <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">ĐỈNH CAO</span> QUỐC GIA
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Nơi hội tụ những xạ thủ ná cao su xuất sắc nhất Việt Nam. Hệ thống tính điểm chuẩn quốc gia, vinh danh vận động viên và câu lạc bộ chuyên nghiệp với thứ hạng uy tín.
          </p>
          
          <div className="pt-4 flex flex-wrap justify-center gap-4 text-xs md:text-sm text-slate-300">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 rounded-lg">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Chỉ mở giải mở rộng Toàn Quốc</span>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 rounded-lg">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Xếp hạng chính thức VĐV & CLB</span>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 rounded-lg">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Hệ thống vinh danh chuyên nghiệp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tab Controller & Navigation */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-4">
          <div className="flex bg-[#0D1117] p-1 rounded-xl w-fit border border-slate-800">
            <button
              id="vsc-tab-athletes"
              onClick={() => setActiveTab('athletes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'athletes' 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Bảng Xếp Hạng VĐV</span>
            </button>
            <button
              id="vsc-tab-clubs"
              onClick={() => setActiveTab('clubs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'clubs' 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Thứ Hạng Câu Lạc Bộ</span>
            </button>
            <button
              id="vsc-tab-tournaments"
              onClick={() => setActiveTab('tournaments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'tournaments' 
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Giải Đấu & Sự Kiện</span>
            </button>
          </div>

          {/* Quick Search and Region Filter for VĐV/CLB */}
          {activeTab !== 'tournaments' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="vsc-search-input"
                  type="text"
                  placeholder={activeTab === 'athletes' ? "Tìm kiếm vận động viên..." : "Tìm kiếm câu lạc bộ..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#0D1117] border border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-lg pl-9 pr-4 py-2 text-sm w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
              </div>

              {activeTab === 'athletes' && (
                <div className="flex items-center gap-2 bg-[#0D1117] border border-slate-800 px-3 py-1.5 rounded-lg text-sm">
                  <Filter className="w-3.5 h-3.5 text-amber-500" />
                  <select
                    id="vsc-region-filter"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value as Region | 'All')}
                    className="bg-transparent text-slate-300 focus:outline-none cursor-pointer text-xs font-semibold"
                  >
                    <option value="All" className="bg-[#0D1117]">Mọi Miền</option>
                    <option value="Miền Bắc" className="bg-[#0D1117]">Miền Bắc</option>
                    <option value="Miền Trung" className="bg-[#0D1117]">Miền Trung</option>
                    <option value="Miền Nam" className="bg-[#0D1117]">Miền Nam</option>
                  </select>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dynamic View Panel */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* TAB 1: ATHLETE RANKINGS */}
          {activeTab === 'athletes' && (
            <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
              <div className="p-4 bg-[#0D1117]/80 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base md:text-lg text-slate-100 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>Xếp Hạng Vận Động Viên Toàn Quốc 2026</span>
                  </h3>
                  <p className="text-xs text-slate-400">Cập nhật sau mỗi kỳ giải đấu nằm trong hệ thống VSC quốc gia</p>
                </div>
                <span className="text-xs bg-slate-800 text-amber-400 px-3 py-1 rounded-full font-bold">
                  {filteredAthletes.length} VĐV
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/60 bg-[#0A0C10]/60 text-slate-400 text-xs uppercase font-semibold">
                      <th className="py-3.5 px-4 text-center w-16">Hạng</th>
                      <th className="py-3.5 px-4">Xạ Thủ</th>
                      <th className="py-3.5 px-4">Khu Vực</th>
                      <th className="py-3.5 px-4">Câu Lạc Bộ</th>
                      <th className="py-3.5 px-4 text-center">Độ Chính Xác</th>
                      <th className="py-3.5 px-4 text-center">Huy Chương</th>
                      <th className="py-3.5 px-4 text-right pr-6">Điểm Số</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-sm">
                    {filteredAthletes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          Không tìm thấy xạ thủ nào trùng khớp kết quả tìm kiếm.
                        </td>
                      </tr>
                    ) : (
                      filteredAthletes.map((ath, index) => {
                        // Badge formatting based on rank
                        let rankBadge = <span className="font-bold text-slate-400">{ath.rank}</span>;
                        if (ath.rank === 1) rankBadge = <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-sm">1</span>;
                        if (ath.rank === 2) rankBadge = <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-300 text-slate-950 font-black text-sm">2</span>;
                        if (ath.rank === 3) rankBadge = <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-700 text-slate-100 font-black text-sm">3</span>;

                        return (
                          <tr key={ath.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-4 px-4 text-center font-display">{rankBadge}</td>
                            <td className="py-4 px-4 font-semibold text-slate-200">
                              <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-slate-850 flex items-center justify-center overflow-hidden">{renderAvatar(ath.avatar)}</span>
                                <div>
                                  <p>{ath.name}</p>
                                  <span className="md:hidden text-[10px] text-slate-400 block font-normal">{ath.clubName}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#0A0C10] text-slate-400 border border-slate-800">
                                <MapPin className="w-3 h-3 text-amber-500" />
                                {ath.region}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-300 hidden md:table-cell">{ath.clubName}</td>
                            <td className="py-4 px-4 text-center font-mono font-bold text-emerald-400">{ath.accuracy}%</td>
                            <td className="py-4 px-4 text-center">
                              <div className="flex justify-center items-center gap-1">
                                {ath.medals.gold > 0 && <span className="text-xs bg-amber-500/15 text-amber-400 font-bold px-1.5 py-0.5 rounded-md">🥇 {ath.medals.gold}</span>}
                                {ath.medals.silver > 0 && <span className="text-xs bg-slate-400/15 text-slate-300 font-bold px-1.5 py-0.5 rounded-md">🥈 {ath.medals.silver}</span>}
                                {ath.medals.bronze > 0 && <span className="text-xs bg-amber-700/15 text-amber-500 font-bold px-1.5 py-0.5 rounded-md">🥉 {ath.medals.bronze}</span>}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right pr-6 font-bold font-mono text-amber-500 text-base">{ath.points}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CLUB RANKINGS */}
          {activeTab === 'clubs' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leaderboard Clubs table */}
              <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800/80 rounded-xl overflow-hidden shadow-xl lg:col-span-2">
                <div className="p-4 bg-[#0D1117]/80 border-b border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-slate-100 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-500" />
                      <span>Xếp Hạng Câu Lạc Bộ Toàn Quốc</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-normal">Xếp hạng dựa trên thành tích tập thể tại hệ thống giải VSC</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 bg-[#0A0C10]/60 text-slate-400 text-xs uppercase font-semibold">
                        <th className="py-3 px-4 text-center w-16">Hạng</th>
                        <th className="py-3 px-4">Câu Lạc Bộ</th>
                        <th className="py-3 px-4">Khu Vực</th>
                        <th className="py-3 px-4 text-center">Chủ Nhiệm CLB</th>
                        <th className="py-3 px-4 text-center">Thành Viên</th>
                        <th className="py-3 px-4 text-right pr-6">Điểm Tích Lũy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-sm">
                      {sortedClubs.map((club, index) => (
                        <tr key={club.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-4 text-center font-bold font-display">
                            {index + 1 === 1 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-black text-xs">I</span>
                            ) : index + 1 === 2 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-300 text-slate-950 font-black text-xs">II</span>
                            ) : index + 1 === 3 ? (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-700 text-slate-100 font-black text-xs">III</span>
                            ) : (
                              <span className="text-slate-500 font-bold">{index + 1}</span>
                            )}
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-200">
                            <div className="flex items-center gap-3">
                              <span className="w-8 h-8 rounded-lg bg-slate-850 flex items-center justify-center border border-slate-800 overflow-hidden">{renderClubLogo(club.logo)}</span>
                              <div>
                                <p>{club.name}</p>
                                <span className="text-[10px] text-slate-500 font-normal">Thành lập: {club.foundedYear}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-xs text-slate-300 bg-[#0A0C10] px-2.5 py-1 rounded-full border border-slate-800">{club.region}</span>
                          </td>
                          <td className="py-4 px-4 text-center text-slate-300">{club.leader}</td>
                          <td className="py-4 px-4 text-center font-mono font-semibold text-slate-300">{club.memberCount} thành viên</td>
                          <td className="py-4 px-4 text-right pr-6 font-bold font-mono text-amber-500">{club.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Club Hall of Fame info card */}
              <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 p-6 rounded-xl flex flex-col justify-between space-y-6 hover:border-amber-500/30 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-slate-100">BẢNG VÀNG CLB XUẤT SẮC</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Vinh danh Câu lạc bộ dẫn đầu bảng xếp hạng tích lũy quốc gia thông qua các giải đấu VSC Cup.
                  </p>

                  <div className="bg-[#0A0C10]/80 p-4 rounded-xl border border-amber-500/15 text-center space-y-2">
                    <span className="text-4xl">👑</span>
                    <h4 className="font-bold text-amber-400 text-sm">{sortedClubs[0].name}</h4>
                    <p className="text-xs text-slate-400">Ban quản trị: {sortedClubs[0].leader}</p>
                    <div className="flex justify-center gap-4 pt-2 border-t border-slate-900 text-xs">
                      <div>
                        <span className="block text-slate-500">Thứ hạng</span>
                        <span className="font-bold text-amber-400 font-mono text-base">Hạng #1</span>
                      </div>
                      <div className="border-r border-slate-900" />
                      <div>
                        <span className="block text-slate-500">Điểm</span>
                        <span className="font-bold text-amber-400 font-mono text-base">{sortedClubs[0].points}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 text-[11px] text-amber-400/90 leading-relaxed">
                  ⚠️ <strong>Quy tắc điểm CLB:</strong> Điểm CLB bằng tổng điểm xếp hạng cá nhân của 5 xạ thủ có thành tích cao nhất của CLB tại các kỳ VSC quốc gia trong năm.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TOURNAMENTS */}
          {activeTab === 'tournaments' && (
            <div className="space-y-6">
              {/* Show registration form as banner overlay or page section */}
              {showRegForm ? (
                <div id="vsc-reg-form" className="bg-gradient-to-b from-[#0D1117] to-black border border-amber-500/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -z-10" />
                  
                  {regSuccess ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-100">ĐĂNG KÝ THÀNH CÔNG!</h3>
                      <p className="text-slate-400 text-sm max-w-md mx-auto">
                        Chúc mừng xạ thủ <strong>{regData.fullName}</strong> đã đăng ký thành công giải đấu <strong>VSC-26</strong>. Mã số định danh vận động viên tạm thời đã được gửi tới số điện thoại <strong>{regData.phone}</strong>.
                      </p>
                      <button 
                        onClick={resetForm}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition-all cursor-pointer"
                      >
                        Quay lại danh sách giải đấu
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                            <UserPlus className="w-5 h-5" />
                            Đăng Ký Tham Gia Giải Vô Địch Quốc Gia VSC-26
                          </h3>
                          <p className="text-xs text-slate-400">Vui lòng nhập thông tin chính xác để ban tổ chức đối chiếu khi làm thủ tục</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setShowRegForm(false)}
                          className="text-slate-400 hover:text-slate-200 text-xs py-1 px-2.5 rounded hover:bg-slate-800 cursor-pointer"
                        >
                          Hủy bỏ
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Họ và Tên Vận Động Viên <span className="text-amber-500">*</span></label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ví dụ: Nguyễn Anh Tuấn"
                            value={regData.fullName}
                            onChange={e => setRegData({...regData, fullName: e.target.value})}
                            className="bg-[#0A0C10] border border-slate-800 rounded-lg p-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-100"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Số Điện Thoại Nhận SMS <span className="text-amber-500">*</span></label>
                          <input 
                            type="tel" 
                            required
                            placeholder="Ví dụ: 0987xxxxxx"
                            value={regData.phone}
                            onChange={e => setRegData({...regData, phone: e.target.value})}
                            className="bg-[#0A0C10] border border-slate-800 rounded-lg p-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-100"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Thuộc Câu Lạc Bộ (Nếu có)</label>
                          <input 
                            type="text" 
                            placeholder="Nhập tên CLB hoặc ghi Tự do"
                            value={regData.club}
                            onChange={e => setRegData({...regData, club: e.target.value})}
                            className="bg-[#0A0C10] border border-slate-800 rounded-lg p-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-100"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Khu Vực Thi Đấu</label>
                          <select 
                            value={regData.region}
                            onChange={e => setRegData({...regData, region: e.target.value as Region})}
                            className="bg-[#0A0C10] border border-slate-800 rounded-lg p-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-300 cursor-pointer"
                          >
                            <option value="Miền Bắc" className="bg-[#0D1117]">Miền Bắc</option>
                            <option value="Miền Trung" className="bg-[#0D1117]">Miền Trung</option>
                            <option value="Miền Nam" className="bg-[#0D1117]">Miền Nam</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Cự Ly Thi Đấu Sở Trường</label>
                          <select 
                            value={regData.distance}
                            onChange={e => setRegData({...regData, distance: Number(e.target.value)})}
                            className="bg-[#0A0C10] border border-slate-800 rounded-lg p-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-300 cursor-pointer"
                          >
                            <option value="10" className="bg-[#0D1117]">10 Mét (Standard Short)</option>
                            <option value="15" className="bg-[#0D1117]">15 Mét (Standard National)</option>
                            <option value="20" className="bg-[#0D1117]">20 Mét (Advanced Long)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-300">Kinh Nghiệm Tập Luyện</label>
                          <select 
                            value={regData.experience}
                            onChange={e => setRegData({...regData, experience: e.target.value})}
                            className="bg-[#0A0C10] border border-slate-800 rounded-lg p-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-amber-500/40 text-slate-300 cursor-pointer"
                          >
                            <option value="Dưới 1 năm" className="bg-[#0D1117]">Dưới 1 năm</option>
                            <option value="Từ 1 - 3 năm" className="bg-[#0D1117]">Từ 1 - 3 năm</option>
                            <option value="Trên 3 năm" className="bg-[#0D1117]">Trên 3 năm (Chuyên nghiệp)</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end gap-3">
                        <button 
                          type="button" 
                          onClick={() => setShowRegForm(false)}
                          className="bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold px-4 py-2 rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Đóng lại
                        </button>
                        <button 
                          type="submit" 
                          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded-lg text-xs transition-transform hover:scale-[1.02] cursor-pointer"
                        >
                          Xác Nhận Đăng Ký
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : null}

              {/* Tournament List Cards */}
              <div className="space-y-4">
                <h3 className="font-bold font-display text-lg text-slate-100 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-500" />
                  <span>Danh Sách Giải Đấu Trọng Điểm 2026</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tournaments.map((tour) => (
                    <div key={tour.id} className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 rounded-xl p-5 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-lg hover:translate-y-[-1px]">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                            tour.status === 'upcoming' 
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                              : tour.status === 'ongoing' 
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {tour.status === 'upcoming' ? 'Sắp diễn ra' : tour.status === 'ongoing' ? 'Đang diễn ra' : 'Đã kết thúc'}
                          </span>
                          <span className="text-xs text-slate-500 font-medium font-mono">{tour.date}</span>
                        </div>

                        <h4 className="font-bold text-slate-100 text-sm md:text-base leading-snug">{tour.title}</h4>
                        
                        <div className="space-y-1 pt-1 text-xs text-slate-400">
                          <p className="flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-500/70 shrink-0 mt-0.5" />
                            <span>{tour.location}</span>
                          </p>
                          <p className="flex items-start gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-amber-500/70 shrink-0 mt-0.5" />
                            <span>Bản quyền: {tour.organizer}</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-4">
                        <div className="text-xs">
                          <span className="block text-slate-500">Cơ cấu giải thưởng</span>
                          <span className="font-bold text-amber-400 font-mono">{tour.prizePool}</span>
                        </div>

                        {tour.status === 'upcoming' ? (
                          <button
                            id={`reg-tour-btn-${tour.id}`}
                            onClick={() => { setShowRegForm(true); window.scrollTo({ top: 150, behavior: 'smooth' }); }}
                            className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 hover:border-amber-500 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
                          >
                            Đăng ký ngay
                          </button>
                        ) : tour.champion ? (
                          <div className="text-right text-xs">
                            <span className="block text-slate-500">🏆 Quán quân</span>
                            <span className="font-bold text-slate-200">{tour.champion.athleteName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs font-semibold">Đang tổng hợp</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0D1117] border-t border-slate-900 py-6 px-4 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-bold text-amber-500/80 font-display">VSCS.ASIA — TRANG CHỦ GIẢI ĐẤU NÁ CAO SU THỂ THAO VIỆT NAM</p>
          <p>Bản quyền thuộc Liên đoàn Ná Thể Thao Việt Nam VSC. Mọi giải quốc gia đều phải tuân thủ quy tắc ứng xử thể thao chuyên nghiệp.</p>
        </div>
      </footer>
    </div>
  );
}
