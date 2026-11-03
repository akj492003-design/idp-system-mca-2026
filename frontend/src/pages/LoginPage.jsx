
import LoginHero from '../components/LoginHero';

export default function LoginPage() {

  
  return (
    <div className="font-sans bg-[#050b1f] text-slate-200 min-h-screen overflow-x-hidden relative">
      {/* Background glows */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(59, 130, 246, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 80% 20%, rgba(168, 85, 247, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 50% 60% at 70% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 45%)
          `,
        }}
      />
      {/* Wave lines */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[40%] pointer-events-none z-0 bg-no-repeat bg-bottom bg-[length:100%_100%]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320' preserveAspectRatio='none'%3E%3Cpath fill='none' stroke='%233b82f6' stroke-opacity='0.15' stroke-width='1.5' d='M0,160 C320,220 480,80 720,140 C960,200 1120,100 1440,160'/%3E%3Cpath fill='none' stroke='%23a855f7' stroke-opacity='0.12' stroke-width='1.5' d='M0,200 C360,140 540,260 780,180 C1020,100 1200,220 1440,160'/%3E%3C/svg%3E")`,
        }}
      />

      {/* LoginHero includes: left panel + form + footer */}
      <div className="relative z-10 min-h-screen max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] items-start lg:items-stretch content-start lg:content-center gap-7 sm:gap-8 lg:gap-10 px-4 sm:px-8 lg:px-10 pt-5 sm:pt-8 pb-5 sm:pb-6">
        <LoginHero />
      </div>
    </div>
  );
}