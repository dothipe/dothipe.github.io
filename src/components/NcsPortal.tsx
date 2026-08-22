import { useState, FormEvent, useEffect } from 'react';
import { PracticeLog, PracticeChallenge } from '../types';
import { 
  fetchNcsPracticeLogs, 
  saveNcsPracticeLog, 
  fetchNcsChallenges, 
  saveNcsChallenge, 
  updateNcsChallenge 
} from '../lib/firebase';
import { 
  ArrowLeft, 
  Target, 
  Plus, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Coffee, 
  PlusCircle, 
  CheckCircle, 
  Users, 
  BarChart3,
  Dumbbell
} from 'lucide-react';

interface NcsPortalProps {
  onBackToHome: () => void;
}

export default function NcsPortal({ onBackToHome }: NcsPortalProps) {
  const [activeTab, setActiveTab] = useState<'challenges' | 'tracker'>('challenges');
  const [challenges, setChallenges] = useState<PracticeChallenge[]>([]);
  const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Load live data from Firestore on mount
  useEffect(() => {
    async function loadLiveData() {
      try {
        const [logs, chals] = await Promise.all([
          fetchNcsPracticeLogs(),
          fetchNcsChallenges()
        ]);
        setPracticeLogs(logs);
        setChallenges(chals);
      } catch (err) {
        console.error("Failed to load Firebase data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadLiveData();
  }, []);

  // Challenge Form State
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [challengeData, setChallengeData] = useState({
    challengerName: '',
    challengerClub: '',
    distance: 15 as 10 | 12 | 15 | 20,
    targetType: 'Bia Giấy' as 'Bia Giấy' | 'Bia Đất Sét' | 'Nắp Chai' | 'Bia Kim Loại',
    shotsCount: 30,
    wager: 'Cà phê đá ☕',
    time: 'Chiều nay 17:30'
  });

  // Practice Log Form State
  const [showLogForm, setShowLogForm] = useState(false);
  const [logData, setLogData] = useState({
    distance: 15 as 10 | 15 | 20,
    shotsCount: 50,
    hitsCount: 40
  });

  // Calculate stats from logs
  const averageAccuracy = practiceLogs.length > 0 
    ? (practiceLogs.reduce((acc, log) => acc + log.accuracy, 0) / practiceLogs.length).toFixed(1) 
    : '0';

  const totalShots = practiceLogs.reduce((acc, log) => acc + log.shotsCount, 0);
  const totalHits = practiceLogs.reduce((acc, log) => acc + log.hitsCount, 0);
  const cumulativeAccuracy = totalShots > 0 ? ((totalHits / totalShots) * 100).toFixed(1) : '0';

  const handleCreateChallenge = async (e: FormEvent) => {
    e.preventDefault();
    if (!challengeData.challengerName || !challengeData.challengerClub) {
      alert('Vui lòng điền họ tên và câu lạc bộ.');
      return;
    }

    const newChallenge: Omit<PracticeChallenge, 'id'> = {
      challengerName: challengeData.challengerName,
      challengerClub: challengeData.challengerClub,
      distance: challengeData.distance,
      targetType: challengeData.targetType,
      shotsCount: challengeData.shotsCount,
      wager: challengeData.wager,
      time: challengeData.time,
      status: 'open'
    };

    const savedChallenge = await saveNcsChallenge(newChallenge);
    setChallenges([savedChallenge, ...challenges]);
    setShowChallengeForm(false);
    setChallengeData({
      challengerName: '',
      challengerClub: '',
      distance: 15,
      targetType: 'Bia Giấy',
      shotsCount: 30,
      wager: 'Cà phê đá ☕',
      time: 'Chiều nay 17:30'
    });
  };

  const handleAcceptChallenge = async (challengeId: string, defenderName: string, defenderClub: string) => {
    setChallenges(challenges.map(chal => {
      if (chal.id === challengeId) {
        return {
          ...chal,
          status: 'accepted',
          defenderName,
          defenderClub
        };
      }
      return chal;
    }));

    await updateNcsChallenge(challengeId, {
      status: 'accepted',
      defenderName,
      defenderClub
    });
  };

  const handleCompleteChallenge = async (challengeId: string, winnerName: string) => {
    setChallenges(challenges.map(chal => {
      if (chal.id === challengeId) {
        return {
          ...chal,
          status: 'completed',
          winnerName
        };
      }
      return chal;
    }));

    await updateNcsChallenge(challengeId, {
      status: 'completed',
      winnerName
    });
  };

  const handleCreateLog = async (e: FormEvent) => {
    e.preventDefault();
    if (logData.hitsCount > logData.shotsCount) {
      alert('Số lần bắn trúng không thể lớn hơn tổng số phát bắn.');
      return;
    }

    const accuracy = parseFloat(((logData.hitsCount / logData.shotsCount) * 100).toFixed(1));
    const score = Math.round(accuracy);

    // Format today's date
    const today = new Date().toISOString().split('T')[0];

    const newLog: Omit<PracticeLog, 'id'> = {
      date: today,
      distance: logData.distance,
      shotsCount: logData.shotsCount,
      hitsCount: logData.hitsCount,
      accuracy,
      score
    };

    const savedLog = await saveNcsPracticeLog(newLog);
    setPracticeLogs([savedLog, ...practiceLogs]);
    setShowLogForm(false);
    setLogData({
      distance: 15,
      shotsCount: 50,
      hitsCount: 40
    });
  };

  // Rendering visual SVG path logic for accuracy graph
  const renderSVGGraph = () => {
    if (practiceLogs.length === 0) return null;
    
    // Sort logs oldest to newest for graph plotting
    const chronologicalLogs = [...practiceLogs].reverse().slice(-7);
    const width = 600;
    const height = 200;
    const padding = 30;
    
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const maxAccuracy = 100;
    const minAccuracy = 50; // set baseline accuracy view
    
    const getX = (index: number) => {
      if (chronologicalLogs.length <= 1) return padding + chartWidth / 2;
      return padding + (index / (chronologicalLogs.length - 1)) * chartWidth;
    };
    
    const getY = (accuracyValue: number) => {
      const boundedVal = Math.max(minAccuracy, Math.min(maxAccuracy, accuracyValue));
      const percentage = (boundedVal - minAccuracy) / (maxAccuracy - minAccuracy);
      return padding + chartHeight - (percentage * chartHeight);
    };

    // Construct path string
    let pathD = '';
    chronologicalLogs.forEach((log, idx) => {
      const x = getX(idx);
      const y = getY(log.accuracy);
      if (idx === 0) {
        pathD += `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
      }
    });

    // Fill area path string
    let areaD = '';
    if (chronologicalLogs.length > 0) {
      const firstX = getX(0);
      const lastX = getX(chronologicalLogs.length - 1);
      const baseY = padding + chartHeight;
      areaD = `${pathD} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {/* Grids and Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={padding + chartHeight} stroke="#1e293b" strokeWidth="1" />
        <line x1={padding} y1={padding + chartHeight} x2={padding + chartWidth} y2={padding + chartHeight} stroke="#1e293b" strokeWidth="1" />
        
        {/* Horizontal grid lines */}
        {[50, 75, 100].map((val) => {
          const y = getY(val);
          return (
            <g key={val}>
              <line x1={padding} y1={y} x2={padding + chartWidth} y2={y} stroke="#1e293b" strokeDasharray="3,3" />
              <text x={padding - 8} y={y + 4} fill="#64748b" className="text-[10px] font-mono text-right" textAnchor="end">{val}%</text>
            </g>
          );
        })}

        {/* Fill Area with Gradient */}
        {chronologicalLogs.length > 0 && (
          <>
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#chartGrad)" />
          </>
        )}

        {/* Line */}
        {chronologicalLogs.length > 0 && (
          <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Interactive Dots & Tooltips */}
        {chronologicalLogs.map((log, idx) => {
          const x = getX(idx);
          const y = getY(log.accuracy);
          return (
            <g key={log.id} className="group cursor-pointer">
              <circle cx={x} cy={y} r="5" fill="#030712" stroke="#06b6d4" strokeWidth="3" />
              <circle cx={x} cy={y} r="10" fill="#06b6d4" className="opacity-0 hover:opacity-20 transition-opacity" />
              
              {/* Simple Tooltip on SVG hover */}
              <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <rect x={x - 40} y={y - 35} width="80" height="24" rx="4" fill="#0f172a" stroke="#06b6d4" strokeWidth="1" />
                <text x={x} y={y - 20} fill="#f8fafc" className="text-[10px] font-mono font-bold" textAnchor="middle">
                  {log.accuracy}% ({log.hitsCount}/{log.shotsCount})
                </text>
              </g>

              {/* X Axis Labels */}
              <text x={x} y={padding + chartHeight + 16} fill="#64748b" className="text-[9px] font-mono" textAnchor="middle">
                {log.date.slice(5)}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-200 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0D1117]/95 backdrop-blur-md border-b border-slate-800 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button 
            id="ncs-back-btn"
            onClick={onBackToHome}
            className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 transition-all py-1.5 px-3 rounded-lg hover:bg-cyan-500/10 cursor-pointer text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h1 className="text-lg md:text-xl font-bold font-display tracking-tight text-cyan-400">NCS CLUB PORTAL</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest hidden sm:block">Giao lưu nội bộ & Sân tập luyện</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              id="ncs-header-kèo-btn"
              onClick={() => { setShowChallengeForm(true); setActiveTab('challenges'); }}
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs transition-all hover:scale-105 shadow-md shadow-cyan-500/10 cursor-pointer"
            >
              Set Kèo Giao Lưu
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner for NCS */}
      <section className="relative overflow-hidden bg-radial from-cyan-950/10 via-[#0A0C10] to-[#0A0C10] border-b border-slate-900 px-4 py-12 md:py-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0D1117] border border-slate-800 text-cyan-400 text-xs font-semibold rounded-full uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Không Gian Giao Lưu Slingshot Thể Thao Câu Lạc Bộ
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display tracking-tight text-slate-100">
            SÂN CHƠI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-400">NỘI BỘ & TẬP LUYỆN</span> NCS
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Nơi kết nối các trận đấu giao hữu, set kèo vui vẻ, theo dõi tiến trình bắn trúng của bản thân và cùng các thành viên CLB nâng cao kỹ thuật bắn Ná Cao Su Thể Thao.
          </p>
          
          <div className="pt-4 flex flex-wrap justify-center gap-4 text-xs md:text-sm text-slate-300">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 rounded-lg">
              <Flame className="w-4 h-4 text-cyan-400" />
              <span>Dễ dàng mở giải offline nội bộ</span>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 rounded-lg">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Ghi chép & theo dõi tiến trình tập luyện</span>
            </div>
            <div className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 rounded-lg">
              <Coffee className="w-4 h-4 text-cyan-400" />
              <span>Set kèo bắt kèo vui vẻ nước mía, cà phê</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        
        {/* Navigation Tab */}
        <div className="flex bg-[#0D1117] p-1 rounded-xl w-fit border border-slate-800">
          <button
            id="ncs-tab-challenges"
            onClick={() => setActiveTab('challenges')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'challenges' 
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>Kèo Thử Thách Giao Lưu</span>
          </button>
          <button
            id="ncs-tab-tracker"
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'tracker' 
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/10' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Biểu Đồ Tiến Trình Tập Luyện</span>
          </button>
        </div>

        {/* Dynamic Content Window */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* TAB 1: CHALLENGES */}
          {activeTab === 'challenges' && (
            <div className="space-y-6">
              
              {/* challenge creation form */}
              {showChallengeForm ? (
                <div id="ncs-challenge-form" className="bg-gradient-to-b from-[#0D1117] to-black border border-cyan-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl -z-10" />
                  
                  <form onSubmit={handleCreateChallenge} className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-cyan-400 flex items-center gap-2">
                          <PlusCircle className="w-5 h-5" />
                          Tạo Kèo Thách Đấu Mới
                        </h3>
                        <p className="text-xs text-slate-400">Các thành viên câu lạc bộ khác có thể chấp nhận thử thách của bạn</p>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setShowChallengeForm(false)}
                        className="text-xs text-slate-400 hover:text-slate-200 py-1 px-2.5 rounded hover:bg-slate-800 cursor-pointer"
                      >
                        Đóng
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Tên Của Bạn <span className="text-cyan-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ví dụ: Hoàng Lâm"
                          value={challengeData.challengerName}
                          onChange={e => setChallengeData({...challengeData, challengerName: e.target.value})}
                          className="bg-[#0A0C10] border border-slate-800 rounded-lg p-2 text-xs w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-slate-100"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Câu Lạc Bộ <span className="text-cyan-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          placeholder="Ví dụ: CLB Sài Gòn"
                          value={challengeData.challengerClub}
                          onChange={e => setChallengeData({...challengeData, challengerClub: e.target.value})}
                          className="bg-[#0A0C10] border border-slate-800 rounded-lg p-2 text-xs w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-slate-100"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Cự Ly Tập Luyện</label>
                        <select 
                          value={challengeData.distance}
                          onChange={e => setChallengeData({...challengeData, distance: Number(e.target.value) as 10 | 12 | 15 | 20})}
                          className="bg-[#0A0C10] border border-slate-800 rounded-lg p-2 text-xs w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-slate-300 cursor-pointer"
                        >
                          <option value="10" className="bg-[#0D1117]">10 Mét (Standard Short)</option>
                          <option value="12" className="bg-[#0D1117]">12 Mét (Intermediate)</option>
                          <option value="15" className="bg-[#0D1117]">15 Mét (Standard League)</option>
                          <option value="20" className="bg-[#0D1117]">20 Mét (Long Shot)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Mục Tiêu (Bia)</label>
                        <select 
                          value={challengeData.targetType}
                          onChange={e => setChallengeData({...challengeData, targetType: e.target.value as any})}
                          className="bg-[#0A0C10] border border-slate-800 rounded-lg p-2 text-xs w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-slate-300 cursor-pointer"
                        >
                          <option value="Bia Giấy" className="bg-[#0D1117]">Bia Giấy (Standard)</option>
                          <option value="Bia Đất Sét" className="bg-[#0D1117]">Bia Đất Sét (Bể rớt)</option>
                          <option value="Nắp Chai" className="bg-[#0D1117]">Nắp Chai (Kỹ thuật cao)</option>
                          <option value="Bia Kim Vật" className="bg-[#0D1117]">Bia Kim Loại (Tiếng gõ xoong)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Số Lượt Bắn</label>
                        <input 
                          type="number" 
                          required
                          value={challengeData.shotsCount}
                          onChange={e => setChallengeData({...challengeData, shotsCount: Number(e.target.value)})}
                          className="bg-[#0A0C10] border border-slate-800 rounded-lg p-2 text-xs w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-slate-100"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Giải Thưởng (Vui vẻ)</label>
                        <input 
                          type="text" 
                          placeholder="Ví dụ: Ly nước mía, Ly cafe đá"
                          value={challengeData.wager}
                          onChange={e => setChallengeData({...challengeData, wager: e.target.value})}
                          className="bg-[#0A0C10] border border-slate-800 rounded-lg p-2 text-xs w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Thời Gian & Địa Điểm Đề Xuất</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ví dụ: Chiều Thứ Bảy 22/08 lúc 17:30 tại Sân tập Q7"
                        value={challengeData.time}
                        onChange={e => setChallengeData({...challengeData, time: e.target.value})}
                        className="bg-[#0A0C10] border border-slate-800 rounded-lg p-2 text-xs w-full focus:outline-none focus:ring-2 focus:ring-cyan-500/40 text-slate-100"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => setShowChallengeForm(false)}
                        className="bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-800 px-4 py-2 rounded-lg text-xs cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button 
                        type="submit" 
                        className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
                      >
                        Đăng Kèo Lên Bảng
                      </button>
                    </div>
                  </form>
                </div>
              ) : null}

              {/* Challenge Grid cards list */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold font-display text-base text-slate-100 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-cyan-400" />
                    <span>Kèo Giao Hữu Club Đang Chờ Thách Đấu</span>
                  </h3>
                  <span className="text-xs text-slate-400">Tự do set kèo và giao lưu nâng tầm kỹ năng</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {challenges.map((chal) => (
                    <div key={chal.id} className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:translate-y-[-1px]">
                      <div className="space-y-2">
                        {/* Top Wager and Status Row */}
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-xs text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
                            <Coffee className="w-3.5 h-3.5 shrink-0" />
                            {chal.wager}
                          </span>
                          
                          <span className={`text-[9px] uppercase px-2 py-0.5 font-bold rounded-full ${
                            chal.status === 'open' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                              : chal.status === 'accepted' 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                              : 'bg-slate-855 text-slate-400 border border-slate-800'
                          }`}>
                            {chal.status === 'open' ? 'Đang mở' : chal.status === 'accepted' ? 'Đã nhận kèo' : 'Đã đấu xong'}
                          </span>
                        </div>

                        {/* Match Details */}
                        <div className="space-y-1">
                          <p className="text-xs text-slate-400">Thách đấu bởi:</p>
                          <h4 className="font-bold text-slate-100 text-sm">
                            {chal.challengerName} <span className="text-xs text-cyan-400 font-normal">({chal.challengerClub})</span>
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-xs text-slate-300">
                            <div>
                              <span className="text-slate-500 block text-[10px]">Cự ly</span>
                              <span className="font-bold font-mono">{chal.distance} Mét</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">Mục tiêu</span>
                              <span className="font-bold">{chal.targetType}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">Số phát bắn</span>
                              <span className="font-bold font-mono">{chal.shotsCount} Lượt</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">Hẹn giờ</span>
                              <span className="font-bold text-slate-400 truncate block max-w-[120px]">{chal.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Opponent or Action Row */}
                      <div className="pt-3 border-t border-slate-900">
                        {chal.status === 'open' ? (
                          <div className="flex gap-2">
                            <button
                              id={`accept-btn-${chal.id}`}
                              onClick={() => {
                                const name = prompt('Nhập tên của bạn để Chấp Nhận thách đấu:');
                                if (!name) return;
                                const club = prompt('Nhập tên CLB của bạn (hoặc Tự do):') || 'Tự do';
                                handleAcceptChallenge(chal.id, name, club);
                              }}
                              className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-center"
                            >
                              Nhận Kèo Ngay
                            </button>
                          </div>
                        ) : chal.status === 'accepted' ? (
                          <div className="space-y-2">
                            <div className="text-xs bg-[#0A0C10] p-2 rounded-lg border border-slate-850 flex items-center justify-between">
                              <div>
                                <span className="text-slate-500 block text-[9px]">Đối thủ:</span>
                                <span className="font-bold text-amber-400">{chal.defenderName}</span>
                              </div>
                              <span className="text-[10px] text-slate-500">{chal.defenderClub}</span>
                            </div>
                            <button
                              id={`complete-btn-${chal.id}`}
                              onClick={() => {
                                const confirmWin = confirm(`Kèo đấu giữa ${chal.challengerName} và ${chal.defenderName} đã đấu xong? Bạn thắng hay đối thủ thắng? \nClick 'OK' nếu ${chal.challengerName} thắng, click 'Cancel' nếu ${chal.defenderName} thắng.`);
                                const winner = confirmWin ? chal.challengerName : (chal.defenderName || 'Đối thủ');
                                handleCompleteChallenge(chal.id, winner);
                              }}
                              className="w-full bg-[#0D1117] hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-center"
                            >
                              Nhập Kết Quả Đấu
                            </button>
                          </div>
                        ) : (
                          <div className="bg-[#0A0C10] p-2 rounded-lg border border-slate-850 flex items-center gap-2 text-xs">
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            <p className="text-slate-400 truncate">
                              Chiến thắng: <strong className="text-emerald-400 font-bold">{chal.winnerName}</strong>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROGRESS TRACKER */}
          {activeTab === 'tracker' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Practice Stats and SVG graph */}
              <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 rounded-xl p-5 shadow-xl lg:col-span-2 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold font-display text-base text-slate-100 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                      <span>Biểu Đồ Tiến Trình Trúng Mục Tiêu</span>
                    </h3>
                    <p className="text-xs text-slate-400">Theo dõi tỉ lệ bắn chính xác (%) của 7 buổi tập luyện gần nhất</p>
                  </div>
                  
                  <button
                    id="add-log-toggle-btn"
                    onClick={() => setShowLogForm(!showLogForm)}
                    className="flex items-center gap-1 bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-950 border border-cyan-500/20 hover:border-cyan-500 font-bold px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer self-start"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ghi Lịch Sử Mới</span>
                  </button>
                </div>

                {/* Simulated Log submission form inside container */}
                {showLogForm && (
                  <form onSubmit={handleCreateLog} className="bg-[#0A0C10] p-4 rounded-xl border border-cyan-500/20 space-y-3">
                    <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Nhập Nhật Ký Tập Luyện Hôm Hôm Nay</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-400">Cự ly bắn (m)</label>
                        <select
                          value={logData.distance}
                          onChange={e => setLogData({...logData, distance: Number(e.target.value) as any})}
                          className="bg-[#0D1117] border border-slate-800 text-slate-200 text-xs p-2 rounded-lg w-full cursor-pointer focus:outline-none"
                        >
                          <option value="10" className="bg-[#0D1117]">10 mét</option>
                          <option value="15" className="bg-[#0D1117]">15 mét</option>
                          <option value="20" className="bg-[#0D1117]">20 mét</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-400">Số phát bắn (lượt)</label>
                        <input
                          type="number"
                          required
                          min="10"
                          max="200"
                          value={logData.shotsCount}
                          onChange={e => setLogData({...logData, shotsCount: Number(e.target.value)})}
                          className="bg-[#0D1117] border border-slate-800 text-slate-200 text-xs p-2 rounded-lg w-full focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-400">Số lần trúng mục tiêu</label>
                        <input
                          type="number"
                          required
                          min="0"
                          max={logData.shotsCount}
                          value={logData.hitsCount}
                          onChange={e => setLogData({...logData, hitsCount: Number(e.target.value)})}
                          className="bg-[#0D1117] border border-slate-800 text-slate-200 text-xs p-2 rounded-lg w-full focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowLogForm(false)}
                        className="bg-[#0D1117] hover:bg-slate-800 text-slate-400 text-xs px-3 py-1.5 rounded-md cursor-pointer border border-slate-800"
                      >
                        Bỏ qua
                      </button>
                      <button
                        type="submit"
                        className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-md cursor-pointer"
                      >
                        Lưu Nhật Ký
                      </button>
                    </div>
                  </form>
                )}

                {/* SVG Line Graph */}
                <div className="bg-[#0A0C10] p-4 rounded-xl border border-slate-800 flex items-center justify-center">
                  {renderSVGGraph()}
                </div>

                {/* Cumulative Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-black/40 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Trung bình %</span>
                    <span className="block text-xl font-bold font-mono text-cyan-400 mt-1">{averageAccuracy}%</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Tổng phát bắn</span>
                    <span className="block text-xl font-bold font-mono text-slate-300 mt-1">{totalShots} phát</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Tổng bắn trúng</span>
                    <span className="block text-xl font-bold font-mono text-emerald-400 mt-1">{totalHits} lần</span>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Tỉ lệ tổng hợp</span>
                    <span className="block text-xl font-bold font-mono text-cyan-400 mt-1">{cumulativeAccuracy}%</span>
                  </div>
                </div>
              </div>

              {/* Training Logs listing */}
              <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 p-5 rounded-xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm font-display">Lịch Sử Tập Luyện Gần Nhất</h4>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {practiceLogs.map((log) => (
                    <div key={log.id} className="bg-[#0A0C10] p-3 rounded-lg border border-slate-850 flex items-center justify-between text-xs hover:border-slate-800 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-300">{log.date}</span>
                          <span className="bg-[#0D1117] text-slate-400 px-1.5 py-0.5 rounded-md font-semibold font-mono text-[9px] border border-slate-800">
                            {log.distance} mét
                          </span>
                        </div>
                        <p className="text-slate-500">
                          Bắn trúng: <strong className="text-slate-300 font-semibold">{log.hitsCount}</strong> trên tổng <strong className="text-slate-300 font-semibold">{log.shotsCount}</strong> phát
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="block text-[10px] text-slate-500">Độ chính xác</span>
                        <span className={`font-bold font-mono ${
                          log.accuracy >= 90 ? 'text-emerald-400' : log.accuracy >= 80 ? 'text-cyan-400' : 'text-amber-500'
                        }`}>{log.accuracy}%</span>
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
          <p className="font-bold text-cyan-500/80 font-display">NCS.ASIA — SÂN CHƠI TẬP LUYỆN NỘI BỘ & SET KÈO OFFLINE CLB</p>
          <p>Mọi hoạt động vui chơi luyện tập đều dựa trên tinh thần tự nguyện, tôn trọng lẫn nhau và cam kết an toàn, văn minh thể thao.</p>
        </div>
      </footer>
    </div>
  );
}
