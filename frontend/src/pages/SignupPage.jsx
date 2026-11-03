
import {Logo,Illustration,Features,SignupForm,SocialSignup,Footer} from "../components/SignupForm";

export default function SignupPage() {
  return (
    <div className="font-['Inter',system-ui,sans-serif] bg-[#050b1f] text-slate-200 min-h-screen overflow-x-hidden relative">

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

      <div className="relative z-10 min-h-[calc(100vh-52px)] grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] max-w-[1400px] mx-auto px-5 sm:px-9 pt-5 pb-3 gap-8 items-stretch">

        {/* LEFT PANEL */}
        <div className="flex flex-col justify-between py-1">
          <div>
            <Logo />

            <h1 className="text-[clamp(1.9rem,3vw,2.75rem)] font-extrabold leading-[1.12] tracking-tight mb-2.5">
              <span className="text-white">Create Your </span>
              <span className="text-blue-500">IDP</span>{" "}
              <span className="text-purple-500">Account</span>
            </h1>

            <p className="text-[0.95rem] text-slate-400 max-w-[400px] leading-normal mb-7">
              Join us and experience the power of AI for intelligent document processing.
            </p>

            <Illustration />
          </div>

          <Features />
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-[400px] bg-[rgba(12,22,48,0.72)] backdrop-blur-[20px] border border-[rgba(59,130,246,0.35)] rounded-2xl px-7 pt-7 pb-[22px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">

            <h1 className="text-[1.55rem] font-bold tracking-tight mb-1">
              Sign <span className="text-blue-500">Up</span>
            </h1>

            <p className="text-[0.85rem] text-slate-400 mb-[18px]">
              Create your account and get started with IDP.
            </p>

            <SignupForm />

            <SocialSignup />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
