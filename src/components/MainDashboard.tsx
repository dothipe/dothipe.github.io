import { useState, useEffect } from 'react';
import { Trophy, Shield, Target, Flame, Users, Sparkles, ChevronRight, Activity, BookOpen, CheckCircle } from 'lucide-react';
import { fetchVscAthletes, fetchVscClubs, fetchVscTournaments, fetchNcsChallenges } from '../lib/firebase';

interface MainDashboardProps {
  onNavigateTo: (route: 'home' | 'vsc' | 'ncs') => void;
}

export default function MainDashboard({ onNavigateTo }: MainDashboardProps) {
  const [stats, setStats] = useState({
    clubs: 48,
    athletes: 1250,
    tournaments: 12,
    challenges: 5800
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [loadedAthletes, loadedClubs, loadedTournaments, loadedChallenges] = await Promise.all([
          fetchVscAthletes(),
          fetchVscClubs(),
          fetchVscTournaments(),
          fetchNcsChallenges()
        ]);
        
        setStats({
          clubs: loadedClubs.length || 48,
          athletes: loadedAthletes.length || 1250,
          tournaments: loadedTournaments.length || 12,
          challenges: loadedChallenges.length || 5800
        });
      } catch (err) {
        console.warn("Failed to load dashboard community stats from Firestore:", err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-200 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0D1117]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <span className="font-extrabold text-lg md:text-xl font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-amber-400 to-blue-400">
                VSCS.ASIA
              </span>
              <span className="text-[10px] text-slate-500 font-bold block leading-none">VIETNAM SLINGSHOT SPORTS</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <button onClick={() => onNavigateTo('home')} className="text-amber-400 hover:text-slate-100 transition-colors cursor-pointer">Trang Chủ</button>
            <button onClick={() => onNavigateTo('vsc')} className="hover:text-amber-400 transition-colors cursor-pointer">Giải Quốc Gia (VSC)</button>
            <button onClick={() => onNavigateTo('ncs')} className="hover:text-blue-400 transition-colors cursor-pointer">Câu Lạc Bộ (NCS)</button>
          </nav>

          <div className="flex gap-2">
            <button 
              id="vsc-nav-shortcut"
              onClick={() => onNavigateTo('vsc')}
              className="hidden sm:inline-flex bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/25 hover:border-amber-500 transition-all font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
            >
              Cúp Quốc Gia
            </button>
            <button 
              id="ncs-nav-shortcut"
              onClick={() => onNavigateTo('ncs')}
              className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/25 hover:border-blue-500 transition-all font-bold px-3 py-1.5 rounded-lg text-xs cursor-pointer"
            >
              Giao Hữu CLB
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Banner */}
      <section className="relative overflow-hidden bg-radial from-[#0D1117] via-[#0A0C10] to-[#0A0C10] px-4 py-16 md:py-24 border-b border-slate-900">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0D1117] border border-slate-800 text-slate-300 text-xs font-semibold rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Trang Chủ Chính Thức Hệ Thống Slingshot Thể Thao
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight text-slate-100 uppercase leading-none">
            CỔNG THÔNG TIN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-slate-100 to-blue-400">
              NÁ CAO SU THỂ THAO
            </span> VIỆT NAM
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Chào mừng bạn đến với <strong>VSCS.ASIA</strong>. Nơi đồng hành cùng sự phát triển của môn thể thao bắn ná cao su chuyên nghiệp tại Việt Nam. Kết nối chính quy, tập luyện an toàn, thi đấu công bằng.
          </p>
        </div>
      </section>

      {/* Primary Split Gateways (VSC vs NCS) */}
      <section className="max-w-7xl w-full mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl md:text-2xl font-bold font-display uppercase tracking-tight text-slate-100">
            HỆ THỐNG VẬN HÀNH DỰ ÁN
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">Vui lòng lựa chọn hệ thống tương ứng với nhu cầu thi đấu hoặc tập luyện của bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          
          {/* LEFT SYSTEM: VSC (vscs.asia/vsc) */}
          <div className="group relative bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-xl transition-all hover:translate-y-[-2px] duration-300">
            {/* Top gold glow element */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-yellow-400 rounded-t-2xl opacity-80" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold font-mono tracking-widest text-amber-400 uppercase bg-amber-500/5 px-2.5 py-1 rounded-md border border-amber-500/10">
                  vscs.asia/vsc
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-amber-500 font-bold tracking-widest uppercase block">Hệ thống Giải đấu Toàn Quốc</span>
                <h3 className="text-xl md:text-2xl font-black font-display text-slate-100">VSC CHAMPIONSHIP</h3>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed">
                Nền tảng quản lý giải đấu mở rộng quy mô toàn quốc. Cập nhật bảng xếp hạng thành tích vận động viên, xếp hạng câu lạc bộ chính quy và vinh danh các nhà vô địch quốc gia.
              </p>

              <ul className="space-y-2 pt-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span>Xếp hạng vận động viên quốc gia VSC</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span>Vinh danh câu lạc bộ xuất sắc nhất</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span>Đăng ký tham gia trực tuyến giải đấu trọng điểm</span>
                </li>
              </ul>
            </div>

            <a
              id="vsc-navigate-btn"
              href="https://vscs.asia/vsc/"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs md:text-sm tracking-wider uppercase transition-all shadow-md shadow-amber-500/5 flex items-center justify-center gap-2 cursor-pointer group-hover:scale-[1.01]"
            >
              <span>Vào Cổng Giải Quốc Gia</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* RIGHT SYSTEM: NCS (vscs.asia/ncs) */}
          <div className="group relative bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-xl transition-all hover:translate-y-[-2px] duration-300">
            {/* Top cyan glow element */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-t-2xl opacity-80" />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold font-mono tracking-widest text-blue-400 uppercase bg-blue-500/5 px-2.5 py-1 rounded-md border border-blue-500/10">
                  vscs.asia/ncs
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-blue-400 font-bold tracking-widest uppercase block">Sân chơi Offline Nội bộ & Sát hạch</span>
                <h3 className="text-xl md:text-2xl font-black font-display text-slate-100">NCS CLUB CENTER</h3>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed">
                Cổng thông tin câu lạc bộ địa phương, hỗ trợ tổ chức thi đấu offline nội bộ, thiết lập các kèo thách đấu tập luyện vui vẻ (cà phê, nước mía) và tự theo dõi biểu đồ tiến trình trúng bia cá nhân.
              </p>

              <ul className="space-y-2 pt-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Hệ thống Matchmaker - Set kèo thách đấu tập</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Biểu đồ tự ghi nhận tỉ lệ bắn trúng bia (%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Mở giải offline nội bộ các CLB giao lưu học hỏi</span>
                </li>
              </ul>
            </div>

            <a
              id="ncs-navigate-btn"
              href="https://vscs.asia/ncs/"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl text-xs md:text-sm tracking-wider uppercase transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer group-hover:scale-[1.01]"
            >
              <span>Vào Cổng Luyện Tập Nội Bộ</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

        </div>
      </section>

      {/* Stats Bento Grid Grid */}
      <section className="bg-[#0D1117] border-y border-slate-900 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-1">
            <h3 className="text-lg md:text-xl font-bold font-display uppercase text-slate-100">DỮ LIỆU CỘNG ĐỒNG VSCS 2026</h3>
            <p className="text-xs text-slate-500">Thông số tổng hợp hoạt động thể thao ná cao su cả nước</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 p-6 rounded-xl text-center space-y-1.5">
              <span className="text-3xl block">🛡️</span>
              <span className="block text-2xl md:text-3xl font-black font-mono text-amber-500">{stats.clubs}+</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">CLB Đăng Ký Hệ Thống</span>
            </div>
            
            <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 p-6 rounded-xl text-center space-y-1.5">
              <span className="text-3xl block">🎯</span>
              <span className="block text-2xl md:text-3xl font-black font-mono text-blue-400">{stats.athletes.toLocaleString()}+</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Xạ Thủ Khắp Cả Nước</span>
            </div>

            <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 p-6 rounded-xl text-center space-y-1.5">
              <span className="text-3xl block">🏆</span>
              <span className="block text-2xl md:text-3xl font-black font-mono text-amber-500">{stats.tournaments}+</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Giải Đấu Thường Niên</span>
            </div>

            <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 p-6 rounded-xl text-center space-y-1.5">
              <span className="text-3xl block">⚡</span>
              <span className="block text-2xl md:text-3xl font-black font-mono text-blue-400">{stats.challenges.toLocaleString()}+</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Trận Đấu Kèo Giao Hữu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Athlete Code Section */}
      <section className="max-w-4xl w-full mx-auto px-4 py-16 space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-900 pb-3">
          <div className="w-10 h-10 rounded bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg md:text-xl font-display uppercase tracking-tight text-slate-100">BỘ QUY TẮC AN TOÀN VĐV</h3>
            <p className="text-xs text-slate-500">Được phê chuẩn bởi Ban Điều Hành Ná Cao Su Thể Thao Việt Nam</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 p-4 rounded-xl flex gap-3">
            <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-100">Bảo hộ cá nhân bắt buộc</h4>
              <p className="text-slate-400 leading-relaxed">Đeo kính bảo hộ thể thao trong quá trình bắn tập, đặc biệt khi sử dụng các loại bia gạch hoặc kim loại để tránh xước xát mạt bắn dội ngược.</p>
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 p-4 rounded-xl flex gap-3">
            <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-100">Ranh giới khu vực bắn an toàn</h4>
              <p className="text-slate-400 leading-relaxed">Chỉ giương ná bắn khi chắc chắn phía sau bia có màn chắn đạn và không có người hay động vật di chuyển qua vùng nguy hiểm.</p>
            </div>
          </div>

          <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 p-4 rounded-xl flex gap-3">
            <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-100">Kiểm tra kỹ thuật định kỳ</h4>
              <p className="text-slate-400 leading-relaxed">Thường xuyên kiểm tra dây chun ná, lỗ bọc da trước khi kéo. Thay chun ngay khi phát hiện nứt rạn nhỏ để ngăn rách bất ngờ gây tổn thương mặt.</p>
            </div>
          </div>

          <div className="bg-[#0D1117]/60 border border-slate-900 p-4 rounded-xl flex gap-3">
            <CheckCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-100">Đạo đức ứng xử thể thao</h4>
              <p className="text-slate-400 leading-relaxed">Tuyệt đối không sử dụng ná cao su thể thao ngoài các khu vực bãi tập chuyên nghiệp, không săn bắn chim muông, không làm mất mỹ quan văn minh cộng đồng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1117] border-t border-slate-850 py-10 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg">🎯</span>
            <span className="font-bold font-display text-slate-300 tracking-wider">VSCS.ASIA</span>
          </div>
          <p className="max-w-2xl mx-auto leading-relaxed text-slate-400">
            Hệ thống website quản lý Ná cao su thể thao uy tín hàng đầu châu Á. Mọi thông tin xếp hạng, bài thi đấu và kèo đấu tập luyện đều được số hóa minh bạch, chuyên nghiệp.
          </p>
          <div className="pt-4 border-t border-slate-900 text-[10px] text-slate-600">
            © 2026 VSCS.ASIA. All rights reserved. Phát triển vì một cộng đồng Ná cao su Việt Nam an toàn & lớn mạnh.
          </div>
        </div>
      </footer>
    </div>
  );
}
