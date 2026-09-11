import { useState, useEffect } from 'react';
import { Trophy, Shield, Target, Flame, Users, Sparkles, ChevronRight, Activity, BookOpen, CheckCircle, Menu, X } from 'lucide-react';
import { fetchNcsSystemAthletes, fetchNcsSystemClubs, fetchNcsTournaments, fetchNcsChallenges } from '../lib/firebase';

export default function MainDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          fetchNcsSystemAthletes(),
          fetchNcsSystemClubs(),
          fetchNcsTournaments(),
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-slate-200 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0D1117]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={scrollToTop}>
            <span className="text-2xl">🎯</span>
            <div>
              <span className="font-extrabold text-lg md:text-xl font-display tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-amber-400 to-blue-400">
                VSCS.ASIA
              </span>
              <span className="text-[10px] text-slate-500 font-bold block leading-none">VIETNAM SLINGSHOT SPORTS</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <button onClick={scrollToTop} className="text-amber-400 hover:text-slate-100 transition-colors cursor-pointer">Trang Chủ</button>
            <a href="https://vscs.asia/ncs/" className="hover:text-blue-400 transition-colors">Hệ Thống NCS</a>
          </nav>
 
          {/* Desktop Right Actions */}
          <div className="hidden sm:flex items-center gap-2">
            <a 
              id="ncs-nav-shortcut"
              href="https://vscs.asia/ncs/"
              className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/35 hover:border-blue-500 transition-all font-black px-4 py-2 rounded-lg text-xs uppercase tracking-wider"
            >
              Vào Hệ Thống NCS
            </a>
          </div>
 
          {/* Mobile Right Controls */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white focus:outline-none p-1.5 rounded-lg bg-slate-800/40"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
 
          {/* Medium Screen Menu Control (when md-hidden but sm-visible) */}
          <div className="hidden sm:flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white focus:outline-none p-1.5 rounded-lg bg-slate-800/40 ml-2"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
 
        {/* Collapsible Mobile Menu Drawer */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2.5 font-semibold text-xs uppercase tracking-wider text-slate-300 bg-[#0D1117] px-2 py-3 rounded-xl">
            <button 
              onClick={() => { scrollToTop(); setIsMenuOpen(false); }} 
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 text-amber-400 transition-colors"
            >
              Trang Chủ
            </button>
            <a 
              href="https://vscs.asia/ncs/"
              className="text-left py-2 px-3 rounded-lg hover:bg-slate-800 hover:text-blue-400 transition-colors"
            >
              Hệ Thống NCS
            </a>
            <a 
              href="https://vscs.asia/ncs/"
              className="text-left py-2 px-3 rounded-lg bg-blue-600/15 border border-blue-500/20 text-blue-400 font-bold flex items-center gap-2 transition-colors"
            >
              <span>🎯 TRUY CẬP HỆ THỐNG NCS</span>
            </a>
          </div>
        )}
      </header>


      {/* Main Hero Banner */}
      <section className="relative overflow-hidden bg-radial from-[#0D1117] via-[#0A0C10] to-[#0A0C10] px-4 py-[30px] border-b border-slate-900">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0D1117] border border-slate-800 text-slate-300 text-xs font-semibold rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Trang Chủ Chính Thức Hệ Thống Slingshot Thể Thao
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight text-slate-100 uppercase leading-none">
            CỔNG THÔNG TIN <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-slate-100 to-blue-400">
              NÁ CAO SU THỂ THAO
            </span> VIỆT NAM
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Chào mừng bạn đến với <strong>VSCS.ASIA</strong>. Nơi đồng hành cùng sự phát triển của môn thể thao bắn ná cao su chuyên nghiệp tại Việt Nam. Kết nối chính quy, tập luyện an toàn, thi đấu công bằng.!
          </p>


        </div>
      </section>

{/* Unified Project Gateway Showcase (vscs.asia/ncs/ only) */}
      <section className="max-w-4xl w-full mx-auto px-4 py-12 space-y-8">
        <div className="pt-2">
          {/* SINGLE SHOWCASE BANNER FOR NCS SUPER PORTAL */}
          <div className="group relative bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 md:p-10 flex flex-col justify-between space-y-8 shadow-xl transition-all duration-300">
            {/* Top cyan glow element */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-amber-400 to-cyan-400 rounded-t-2xl opacity-80" />
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase block">Hệ Sinh Thái Ná Cao Su Việt Nam</span>
                    <h3 className="text-xl md:text-2xl font-black font-display text-slate-100">SLINGSHOT SUPER PORTAL</h3>
                  </div>
                </div>
                <span className="self-start sm:self-auto text-xs font-black font-mono tracking-wider text-blue-400 uppercase bg-blue-500/5 px-3.5 py-1.5 rounded-lg border border-blue-500/20">
                  vscs.asia/ncs/
                </span>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                Nền tảng số hóa toàn diện tích hợp đồng bộ các giải đấu lớn toàn quốc, quản lý hồ sơ vận động viên, xếp hạng Rank ELO chuyên nghiệp, cũng như thiết lập các kèo đấu PK SOLO giao hữu kịch tính giữa các câu lạc bộ trên cả nước.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs text-slate-300 border-t border-slate-900/60">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                    <span>Hệ thống tạo giải đấu tự động (Điều phối bốc thăm, cấp SBD)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                    <span>Hồ sơ VĐV định danh số hóa & Quản lý danh sách CLB</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                    <span>Tính năng PK SOLO thách đấu trực tiếp thời gian thực</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                    <span>Lịch sử tiến trình tập luyện & Thang điểm xếp hạng ELO động</span>
                  </div>
                </div>
              </div>
            </div>

            <a
              id="ncs-navigate-btn"
              href="https://vscs.asia/ncs/"
              className="w-full bg-gradient-to-r from-blue-600 to-amber-500 hover:from-blue-700 hover:to-amber-600 text-slate-950 font-black py-3.5 px-6 rounded-xl text-xs md:text-sm tracking-wider uppercase transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2.5 cursor-pointer group-hover:scale-[1.01]"
            >
              <span>VÀO CỔNG LUYỆN TẬP - PK - THI ĐẤU</span>
              <ChevronRight className="w-4 h-4 text-slate-950 stroke-[3]" />
            </a>
          </div>
        </div>
      </section>

      {/* Unified Super-Platform Feature Highlights */}
      <section className="max-w-7xl w-full mx-auto px-4 py-12 border-b border-slate-900/60">


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Feature 1 */}
          <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800/80 p-5 rounded-xl hover:border-amber-500/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-100 text-sm uppercase">Tự Động Hóa Giải Đấu</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Tích hợp toàn diện các công cụ hỗ trợ vận hành giải đấu lớn, tự động điều phối bốc thăm, cấp số báo danh và hiển thị diễn biến trực tiếp từ trọng tài điều hành.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800/80 p-5 rounded-xl hover:border-blue-500/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-100 text-sm uppercase">Hồ Sơ Xạ Thủ & CLB</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Thiết lập hồ sơ cá nhân số hóa đầy đủ thông tin, gia nhập hoặc kiến tạo câu lạc bộ thể thao riêng biệt nhằm kết nối và đại diện giao lưu học hỏi rộng khắp cả nước.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800/80 p-5 rounded-xl hover:border-amber-500/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-100 text-sm uppercase">Đấu Kèo PK SOLO</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Sân chơi đối kháng trực tiếp cho phép các xạ thủ tự do thiết lập kèo PK, thi triển kỹ năng ngắm bắn chuẩn xác và ghi nhận kết quả ngay tức thời trên hệ thống trực tuyến.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800/80 p-5 rounded-xl hover:border-blue-500/40 transition-colors space-y-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-100 text-sm uppercase">Rank ELO Toàn Quốc</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Thang đo trình độ chuẩn quốc tế thông qua điểm xếp hạng ELO động dựa trên thành tích. Tự động lưu vết tiến trình tập luyện nhằm tối ưu hóa phong độ bắn trúng bia.
              </p>
            </div>
          </div>

        </div>
      </section>

      

      {/* Stats Bento Grid Grid */}
      <section className="bg-[#0D1117] border-y border-slate-900 py-12 px-4">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-1">
            <h3 className="text-lg md:text-xl font-bold font-display uppercase text-slate-100">DỮ LIỆU CỘNG ĐỒNG NÁ CAO SU VIỆT NAM</h3>
            <p className="text-xs text-slate-500">Thông số thời gian thực kết nối từ cơ sở dữ liệu</p>
          </div>


          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 p-6 rounded-xl text-center space-y-1.5">
              <span className="text-3xl block">🛡️</span>
              <span className="block text-2xl md:text-3xl font-black font-mono text-amber-500">{stats.clubs}+</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">CLB Đăng Ký</span>
              <span className="text-[9px] text-slate-500 font-mono block">vsc system clubs</span>
            </div>
            
            <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 p-6 rounded-xl text-center space-y-1.5">
              <span className="text-3xl block">🎯</span>
              <span className="block text-2xl md:text-3xl font-black font-mono text-blue-400">{stats.athletes.toLocaleString()}+</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Xạ Thủ Hệ Thống</span>
              <span className="text-[9px] text-slate-500 font-mono block">vsc system athletes</span>
            </div>
 
            <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 p-6 rounded-xl text-center space-y-1.5">
              <span className="text-3xl block">🏆</span>
              <span className="block text-2xl md:text-3xl font-black font-mono text-amber-500">{stats.tournaments}+</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Giải Đấu Số Hóa</span>
              <span className="text-[9px] text-slate-500 font-mono block">tournaments</span>
            </div>
 
            <div className="bg-gradient-to-b from-[#0D1117] to-black border border-slate-800 p-6 rounded-xl text-center space-y-1.5">
              <span className="text-3xl block">⚡</span>
              <span className="block text-2xl md:text-3xl font-black font-mono text-blue-400">{stats.challenges.toLocaleString()}+</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Thách Đấu PK SOLO</span>
              <span className="text-[9px] text-slate-500 font-mono block">vsc pk challenges</span>
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
