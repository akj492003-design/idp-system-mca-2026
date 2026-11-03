import { useNavigate } from "react-router-dom";
export default function WelcomeSection() {
  const navigate = useNavigate();

  return (<>
    <section className="idp-welcome-banner relative flex min-h-[120px] items-center overflow-hidden rounded-xl border border-blue-400/50 bg-[radial-gradient(420px_220px_at_78%_55%,rgba(60,100,255,.35),transparent_70%),linear-gradient(100deg,#0a1b73_0%,#0c2290_55%,#0a1a6d_100%)] px-[18px] py-[15px] min-[701px]:flex-none min-[701px]:max-[1100px]:min-h-[105px] min-[701px]:max-[1100px]:p-3 max-[700px]:min-h-[110px] max-[700px]:p-3 [@media(min-width:701px)_and_(max-height:760px)]:min-h-[94px] [@media(min-width:701px)_and_(max-height:760px)]:px-3.5 [@media(min-width:701px)_and_(max-height:760px)]:py-[9px] [background-size:180%_180%] animate-idp-banner-pulse isolate [.light_&]:border-[#c7d7ee] [.light_&]:bg-[linear-gradient(100deg,#e7f0ff_0%,#e8edff_55%,#f0eaff_100%)] [.light_&]:shadow-[0_8px_24px_rgba(15,35,70,.08)] motion-reduce:animate-none motion-reduce:transition-none motion-reduce:[background-position:50%_50%]">

<div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
<div className="absolute inset-0 opacity-70 bg-[linear-gradient(rgba(96,165,250,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,.12)_1px,transparent_1px)] bg-[size:26px_26px] [-webkit-mask-image:radial-gradient(75%_120%_at_75%_50%,#000_0%,transparent_75%)] [mask-image:radial-gradient(75%_120%_at_75%_50%,#000_0%,transparent_75%)] animate-idp-grid motion-reduce:animate-none"></div>
<div className="absolute top-1/2 right-[14%] size-36 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-2xl animate-idp-glow motion-reduce:animate-none"></div>
<div className="absolute inset-y-0 left-0 w-1/3 bg-[linear-gradient(100deg,transparent_0%,rgba(147,197,253,.16)_50%,transparent_100%)] animate-idp-sweep motion-reduce:animate-none"></div>
<span className="absolute top-[22%] left-[46%] size-[3px] rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9] animate-idp-float-1 motion-reduce:animate-none"></span>
<span className="absolute top-[68%] left-[52%] size-0.5 rounded-full bg-blue-300 shadow-[0_0_6px_#93c5fd] animate-idp-float-2 motion-reduce:animate-none"></span>
<span className="absolute top-[30%] left-[63%] size-[3px] rounded-full bg-violet-300 shadow-[0_0_6px_#c4b5fd] animate-idp-float-3 motion-reduce:animate-none"></span>
<span className="absolute top-[78%] left-[72%] size-0.5 rounded-full bg-cyan-200 shadow-[0_0_6px_#a5f3fc] animate-idp-float-4 motion-reduce:animate-none"></span>
<span className="absolute top-[16%] left-[84%] size-0.5 rounded-full bg-blue-200 shadow-[0_0_6px_#bfdbfe] animate-idp-float-5 motion-reduce:animate-none"></span>
<span className="absolute top-[56%] left-[92%] size-[3px] rounded-full bg-cyan-300 shadow-[0_0_6px_#67e8f9] animate-idp-float-6 motion-reduce:animate-none"></span>
</div>
<div className="relative z-10 max-w-[58%] min-[701px]:max-[1100px]:max-w-[55%] max-[700px]:max-w-[62%]">
<h1 className="idp-animated-text mb-[9px] flex items-center gap-1.5 text-[clamp(15px,2.1vw,25px)] leading-[1.15] font-bold whitespace-nowrap transition-[opacity,translate] duration-700 ease-out starting:translate-y-2.5 starting:opacity-0 max-[700px]:text-[clamp(15px,4.4vw,21px)] max-[380px]:text-lg [@media(min-width:701px)_and_(max-height:760px)]:mb-[5px] animate-idp-text-rise motion-reduce:animate-none motion-reduce:transition-none">
                Welcome to <span className="bg-[linear-gradient(90deg,#60a5fa_0%,#22d3ee_25%,#c4b5fd_50%,#22d3ee_75%,#60a5fa_100%)] bg-[length:200%_100%] bg-clip-text text-transparent animate-idp-shine [-webkit-text-fill-color:transparent] motion-reduce:animate-none">IDP</span>
<span className="inline-block flex-none font-['Apple_Color_Emoji','Segoe_UI_Emoji','Noto_Color_Emoji',sans-serif] text-[1em] leading-none origin-[70%_70%] animate-idp-wave motion-reduce:animate-none" aria-hidden="true">👋</span>
</h1>
<p className="idp-animated-text-delay text-[11px] leading-[1.45] text-blue-50 transition-[opacity,translate] [.light_&]:text-[#334b6c] delay-[250ms] duration-700 ease-out starting:translate-y-2.5 starting:opacity-0 max-[380px]:text-[10px] [@media(min-width:701px)_and_(max-height:760px)]:text-[10px] animate-idp-text-rise-delayed motion-reduce:animate-none motion-reduce:transition-none">Upload your documents, and let our AI automatically extract, classify, and organize them.</p>
</div>
<svg className="hero-art pointer-events-none absolute top-1.5 bottom-1.5 left-[40%] right-0 h-[calc(100%-12px)] w-[60%] overflow-visible drop-shadow-[0_0_5px_rgba(56,189,248,.4)] drop-shadow-[0_0_10px_rgba(59,130,246,.25)] min-[701px]:max-[1100px]:left-[55%] min-[701px]:max-[1100px]:w-[45%] max-[700px]:left-[55%] max-[700px]:w-[45%] animate-idp-art-glow motion-reduce:animate-none motion-reduce:transition-none" viewBox="125 25 665 245" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
<defs>

<filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
<feGaussianBlur stdDeviation="8" result="blur"></feGaussianBlur>
<feMerge>
<feMergeNode in="blur"></feMergeNode>
<feMergeNode in="blur"></feMergeNode>
<feMergeNode in="SourceGraphic"></feMergeNode>
</feMerge>
</filter>

<filter id="glow-blue" x="-30%" y="-30%" width="160%" height="160%">
<feGaussianBlur stdDeviation="10" result="blur"></feGaussianBlur>
<feMerge>
<feMergeNode in="blur"></feMergeNode>
<feMergeNode in="blur"></feMergeNode>
<feMergeNode in="SourceGraphic"></feMergeNode>
</feMerge>
</filter>
<filter id="glow-line" filterUnits="userSpaceOnUse" x="100" y="-20" width="760" height="340">
<feGaussianBlur stdDeviation="8" result="blur"></feGaussianBlur>
<feMerge><feMergeNode in="blur"></feMergeNode><feMergeNode in="blur"></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge>
</filter>
<radialgradient id="halo-grad" cx="50%" cy="50%" r="50%">
<stop offset="55%" stopColor="#1e90ff" stopOpacity=".18"></stop>
<stop offset="100%" stopColor="#1e90ff" stopOpacity="0"></stop>
</radialgradient>
<radialgradient id="inner-bg" cx="50%" cy="50%" r="50%">
<stop offset="0" stopColor="#0c2086"></stop>
<stop offset="100%" stopColor="#0a1a6d"></stop>
</radialgradient>

<linearGradient id="grad-line" gradientUnits="userSpaceOnUse" x1="280" y1="0" x2="630" y2="0">
<stop offset="0%" stopColor="#00ffff" stopOpacity="0.8"></stop>
<stop offset="50%" stopColor="#0077ff" stopOpacity="0.9"></stop>
<stop offset="100%" stopColor="#0055ff" stopOpacity="1"></stop>
</linearGradient>

<linearGradient id="pdf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stopColor="#4d0066"></stop>
<stop offset="100%" stopColor="#1a0033"></stop>
</linearGradient>
<linearGradient id="docx-grad" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stopColor="#003399"></stop>
<stop offset="100%" stopColor="#001144"></stop>
</linearGradient>
<linearGradient id="jpg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stopColor="#3d008a"></stop>
<stop offset="100%" stopColor="#14003d"></stop>
</linearGradient>

<filter id="glow-btn" x="-20%" y="-20%" width="140%" height="140%">
<feGaussianBlur stdDeviation="4" result="blur"></feGaussianBlur>
<feMerge>
<feMergeNode in="blur"></feMergeNode>
<feMergeNode in="SourceGraphic"></feMergeNode>
</feMerge>
</filter>
</defs>

<g stroke="#0033aa" strokeOpacity="0.3" fill="none">
<circle cx="700" cy="150" r="140" strokeWidth="1"></circle>
<circle cx="700" cy="150" r="125" strokeDasharray="4 8" strokeWidth="1.5"></circle>
<circle cx="700" cy="150" r="105" strokeWidth="1"></circle>
</g>

<circle cx="580" cy="80" r="3" fill="#00ffff" opacity="0.6"></circle>
<circle cx="810" cy="220" r="2.5" fill="#0077ff" opacity="0.5"></circle>
<circle cx="760" cy="40" r="3.5" fill="#00ffff" opacity="0.4" filter="url(#glow-cyan)"></circle>
<circle cx="610" cy="240" r="2" fill="#0055ff" opacity="0.6"></circle>

<g fill="none" stroke="url(#grad-line)" strokeWidth="2.5">

<path d="M 280 140 C 340 140, 360 65, 430 65"></path>
<path d="M 520 65 C 570 65, 590 125, 630 135"></path>

<path d="M 280 150 L 420 150"></path>
<path d="M 530 150 L 610 150"></path>

<path d="M 280 160 C 340 160, 360 235, 430 235"></path>
<path d="M 520 235 C 570 235, 590 175, 630 165"></path>
</g>

<g fill="none" stroke="#00ffff" strokeWidth="1" opacity="0.4" filter="url(#glow-line)">
<path d="M 280 140 C 340 140, 360 65, 430 65"></path>
<path d="M 280 150 L 420 150"></path>
<path d="M 280 160 C 340 160, 360 235, 430 235"></path>
</g>

<g className="wave-lines" fill="none" stroke="#7df3ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-line)">
<path className="wave [stroke-dasharray:18_82] [stroke-dashoffset:0] motion-reduce:[stroke-dasharray:none] motion-reduce:transition-none animate-idp-data-flow motion-reduce:animate-none" pathLength="100" d="M 280.0 140.0 L 282.0 140.1 L 284.0 140.2 L 285.9 140.3 L 287.9 140.3 L 289.7 139.9 L 291.5 139.3 L 293.2 138.3 L 294.9 137.3 L 296.5 136.3 L 298.1 135.6 L 299.9 135.4 L 301.8 135.5 L 303.8 135.9 L 305.9 136.4 L 308.0 136.6 L 309.9 136.4 L 311.5 135.5 L 312.8 133.9 L 313.7 131.8 L 314.5 129.5 L 315.2 127.3 L 316.2 125.6 L 317.6 124.6 L 319.5 124.3 L 321.9 124.7 L 324.5 125.3 L 327.1 125.9 L 329.5 126.0 L 331.4 125.4 L 332.5 123.8 L 333.0 121.5 L 333.1 118.6 L 333.0 115.6 L 333.2 112.9 L 333.9 110.9 L 335.3 109.8 L 337.6 109.6 L 340.4 110.1 L 343.5 110.8 L 346.5 111.3 L 348.9 111.3 L 350.6 110.3 L 351.4 108.4 L 351.5 105.7 L 351.2 102.5 L 351.0 99.3 L 351.1 96.6 L 352.0 94.7 L 353.7 93.7 L 356.1 93.6 L 359.1 94.2 L 362.2 94.9 L 365.1 95.4 L 367.4 95.3 L 368.9 94.2 L 369.7 92.2 L 370.0 89.5 L 370.0 86.4 L 370.3 83.5 L 370.9 81.1 L 372.2 79.5 L 374.2 78.9 L 376.6 79.0 L 379.4 79.7 L 382.1 80.4 L 384.5 80.8 L 386.5 80.5 L 388.1 79.5 L 389.3 77.8 L 390.3 75.5 L 391.3 73.2 L 392.5 71.1 L 394.0 69.5 L 395.8 68.6 L 397.9 68.3 L 400.2 68.6 L 402.5 69.1 L 404.7 69.5 L 406.8 69.7 L 408.8 69.4 L 410.8 68.7 L 412.7 67.7 L 414.6 66.7 L 416.6 65.7 L 418.7 65.1 L 420.9 64.7 L 423.1 64.7 L 425.4 64.8 L 427.7 64.9 L 430.0 65.0"></path>
<path className="wave w2 [stroke-dasharray:18_82] [stroke-dashoffset:0] motion-reduce:[stroke-dasharray:none] motion-reduce:transition-none animate-idp-data-flow-slow motion-reduce:animate-none" pathLength="100" d="M 280.0 150.0 L 282.3 150.1 L 284.6 150.3 L 286.8 150.6 L 288.9 150.7 L 291.0 150.6 L 293.1 150.2 L 295.1 149.6 L 297.1 148.9 L 299.0 148.4 L 300.9 148.1 L 302.8 148.4 L 304.6 149.1 L 306.4 150.2 L 308.1 151.4 L 309.8 152.4 L 311.5 152.9 L 313.1 152.8 L 314.7 151.9 L 316.3 150.5 L 317.8 148.8 L 319.3 147.3 L 320.8 146.3 L 322.3 146.2 L 323.7 147.0 L 325.1 148.6 L 326.5 150.6 L 327.9 152.6 L 329.2 154.1 L 330.5 154.7 L 331.9 154.1 L 333.1 152.6 L 334.4 150.3 L 335.7 148.0 L 336.9 146.0 L 338.1 144.9 L 339.4 145.0 L 340.6 146.3 L 341.8 148.5 L 343.0 151.1 L 344.1 153.5 L 345.3 155.0 L 346.5 155.4 L 347.7 154.5 L 348.8 152.6 L 350.0 150.0 L 351.2 147.4 L 352.3 145.5 L 353.5 144.6 L 354.7 145.0 L 355.9 146.5 L 357.0 148.9 L 358.2 151.5 L 359.4 153.7 L 360.6 155.0 L 361.9 155.1 L 363.1 154.0 L 364.3 152.0 L 365.6 149.7 L 366.9 147.4 L 368.1 145.9 L 369.5 145.3 L 370.8 145.9 L 372.1 147.4 L 373.5 149.4 L 374.9 151.4 L 376.3 153.0 L 377.7 153.8 L 379.2 153.7 L 380.7 152.7 L 382.2 151.2 L 383.7 149.5 L 385.3 148.1 L 386.9 147.2 L 388.5 147.1 L 390.2 147.6 L 391.9 148.6 L 393.6 149.8 L 395.4 150.9 L 397.2 151.6 L 399.1 151.9 L 401.0 151.6 L 402.9 151.1 L 404.9 150.4 L 406.9 149.8 L 409.0 149.4 L 411.1 149.3 L 413.2 149.4 L 415.4 149.7 L 417.7 149.9 L 420.0 150.0"></path>
<path className="wave w3 [stroke-dasharray:18_82] [stroke-dashoffset:0] motion-reduce:[stroke-dasharray:none] motion-reduce:transition-none animate-idp-data-flow-medium motion-reduce:animate-none" pathLength="100" d="M 280.0 160.0 L 282.0 160.1 L 283.9 160.4 L 285.8 160.8 L 287.7 161.1 L 289.6 161.3 L 291.5 161.2 L 293.4 160.9 L 295.3 160.6 L 297.3 160.5 L 299.1 160.8 L 300.9 161.5 L 302.4 162.8 L 303.7 164.4 L 304.9 166.2 L 306.2 167.7 L 307.5 168.9 L 309.1 169.5 L 311.1 169.5 L 313.3 169.0 L 315.6 168.4 L 318.0 168.0 L 320.1 168.1 L 321.7 168.9 L 322.8 170.6 L 323.5 173.0 L 323.8 175.7 L 324.1 178.3 L 324.7 180.6 L 325.8 182.1 L 327.5 182.7 L 329.9 182.6 L 332.7 182.0 L 335.6 181.3 L 338.3 180.9 L 340.4 181.3 L 341.8 182.6 L 342.4 184.8 L 342.3 187.7 L 342.1 190.9 L 341.9 193.9 L 342.3 196.3 L 343.4 197.8 L 345.4 198.4 L 348.1 198.2 L 351.2 197.5 L 354.4 196.8 L 357.1 196.6 L 359.1 197.1 L 360.3 198.7 L 360.7 201.1 L 360.6 204.1 L 360.4 207.3 L 360.4 210.2 L 361.1 212.5 L 362.6 213.8 L 364.7 214.1 L 367.5 213.8 L 370.5 213.0 L 373.3 212.4 L 375.7 212.2 L 377.6 212.8 L 378.8 214.3 L 379.5 216.6 L 380.0 219.3 L 380.6 222.1 L 381.4 224.5 L 382.7 226.1 L 384.5 227.0 L 386.8 227.1 L 389.2 226.6 L 391.7 226.0 L 394.1 225.5 L 396.2 225.4 L 398.0 226.0 L 399.6 227.2 L 401.1 228.8 L 402.6 230.6 L 404.2 232.2 L 406.0 233.5 L 408.0 234.2 L 410.1 234.5 L 412.3 234.4 L 414.5 234.1 L 416.7 233.8 L 418.9 233.7 L 421.0 233.9 L 423.2 234.2 L 425.4 234.6 L 427.7 234.9 L 430.0 235.0"></path>
<path className="wave w4 [stroke-dasharray:18_82] [stroke-dashoffset:0] motion-reduce:[stroke-dasharray:none] motion-reduce:transition-none animate-idp-data-flow motion-reduce:animate-none" pathLength="100" d="M 520.0 65.0 L 521.7 65.1 L 523.3 65.4 L 524.9 65.8 L 526.4 66.1 L 528.0 66.1 L 529.6 66.0 L 531.2 65.7 L 532.9 65.3 L 534.5 65.1 L 536.1 65.3 L 537.5 65.9 L 538.8 67.1 L 539.9 68.6 L 540.9 70.2 L 541.8 71.7 L 542.9 72.7 L 544.3 73.2 L 546.0 73.0 L 547.9 72.4 L 550.0 71.6 L 552.1 71.0 L 553.9 71.0 L 555.3 71.7 L 556.2 73.2 L 556.6 75.3 L 556.7 77.9 L 556.7 80.4 L 557.0 82.4 L 557.8 83.7 L 559.3 84.2 L 561.4 83.9 L 564.0 83.1 L 566.7 82.2 L 569.1 81.7 L 571.0 81.9 L 572.1 83.1 L 572.4 85.1 L 572.1 87.7 L 571.4 90.7 L 570.9 93.4 L 570.9 95.6 L 571.7 96.9 L 573.4 97.3 L 575.8 97.0 L 578.8 96.2 L 581.7 95.5 L 584.1 95.2 L 585.9 95.7 L 586.7 97.1 L 586.6 99.3 L 586.0 102.0 L 585.2 104.9 L 584.7 107.5 L 584.9 109.5 L 585.9 110.7 L 587.7 111.0 L 590.2 110.7 L 592.9 110.1 L 595.5 109.5 L 597.7 109.4 L 599.1 110.1 L 599.8 111.5 L 599.8 113.6 L 599.5 116.0 L 599.3 118.5 L 599.3 120.7 L 599.9 122.3 L 601.1 123.2 L 602.9 123.3 L 605.0 123.1 L 607.2 122.6 L 609.1 122.4 L 610.8 122.5 L 612.0 123.2 L 612.8 124.4 L 613.3 126.0 L 613.9 127.7 L 614.5 129.4 L 615.3 130.7 L 616.5 131.6 L 617.8 132.0 L 619.3 132.2 L 620.9 132.1 L 622.3 132.1 L 623.7 132.3 L 625.0 132.7 L 626.2 133.3 L 627.5 134.0 L 628.7 134.6 L 630.0 135.0"></path>
<path className="wave w5 [stroke-dasharray:18_82] [stroke-dashoffset:0] motion-reduce:[stroke-dasharray:none] motion-reduce:transition-none animate-idp-data-flow-slow motion-reduce:animate-none" pathLength="100" d="M 530.0 150.0 L 531.3 150.1 L 532.6 150.3 L 533.9 150.6 L 535.1 150.7 L 536.3 150.6 L 537.5 150.2 L 538.6 149.6 L 539.8 148.9 L 540.9 148.4 L 542.0 148.1 L 543.0 148.4 L 544.1 149.1 L 545.1 150.2 L 546.1 151.4 L 547.0 152.4 L 548.0 152.9 L 548.9 152.8 L 549.8 151.9 L 550.7 150.5 L 551.6 148.8 L 552.5 147.3 L 553.3 146.3 L 554.2 146.2 L 555.0 147.0 L 555.8 148.6 L 556.6 150.6 L 557.4 152.6 L 558.1 154.1 L 558.9 154.7 L 559.6 154.1 L 560.4 152.6 L 561.1 150.3 L 561.8 148.0 L 562.5 146.0 L 563.2 144.9 L 563.9 145.0 L 564.6 146.3 L 565.3 148.5 L 566.0 151.1 L 566.7 153.5 L 567.3 155.0 L 568.0 155.4 L 568.7 154.5 L 569.3 152.6 L 570.0 150.0 L 570.7 147.4 L 571.3 145.5 L 572.0 144.6 L 572.7 145.0 L 573.3 146.5 L 574.0 148.9 L 574.7 151.5 L 575.4 153.7 L 576.1 155.0 L 576.8 155.1 L 577.5 154.0 L 578.2 152.0 L 578.9 149.7 L 579.6 147.4 L 580.4 145.9 L 581.1 145.3 L 581.9 145.9 L 582.6 147.4 L 583.4 149.4 L 584.2 151.4 L 585.0 153.0 L 585.8 153.8 L 586.7 153.7 L 587.5 152.7 L 588.4 151.2 L 589.3 149.5 L 590.2 148.1 L 591.1 147.2 L 592.0 147.1 L 593.0 147.6 L 593.9 148.6 L 594.9 149.8 L 595.9 150.9 L 597.0 151.6 L 598.0 151.9 L 599.1 151.6 L 600.2 151.1 L 601.4 150.4 L 602.5 149.8 L 603.7 149.4 L 604.9 149.3 L 606.1 149.4 L 607.4 149.7 L 608.7 149.9 L 610.0 150.0"></path>
<path className="wave w6 [stroke-dasharray:18_82] [stroke-dashoffset:0] motion-reduce:[stroke-dasharray:none] motion-reduce:transition-none animate-idp-data-flow-medium motion-reduce:animate-none" pathLength="100" d="M 520.0 235.0 L 521.7 235.1 L 523.3 235.2 L 524.9 235.4 L 526.6 235.4 L 528.1 235.1 L 529.7 234.5 L 531.1 233.6 L 532.4 232.6 L 533.8 231.7 L 535.1 231.1 L 536.6 231.0 L 538.2 231.2 L 540.0 231.7 L 541.8 232.3 L 543.6 232.7 L 545.3 232.6 L 546.6 231.8 L 547.6 230.4 L 548.3 228.4 L 548.9 226.3 L 549.4 224.2 L 550.1 222.7 L 551.3 221.8 L 552.9 221.7 L 555.0 222.3 L 557.4 223.1 L 559.8 223.9 L 561.9 224.2 L 563.5 223.7 L 564.4 222.3 L 564.6 220.1 L 564.4 217.5 L 564.0 214.7 L 563.9 212.2 L 564.3 210.4 L 565.5 209.5 L 567.5 209.5 L 570.1 210.1 L 572.9 211.0 L 575.7 211.6 L 577.9 211.7 L 579.3 210.9 L 579.8 209.2 L 579.5 206.7 L 578.8 203.8 L 578.0 200.8 L 577.7 198.4 L 578.1 196.7 L 579.5 195.9 L 581.6 195.9 L 584.4 196.4 L 587.3 197.2 L 590.0 197.6 L 591.9 197.5 L 593.1 196.5 L 593.4 194.6 L 593.0 192.2 L 592.4 189.4 L 591.9 186.8 L 591.9 184.6 L 592.7 183.2 L 594.2 182.6 L 596.3 182.6 L 598.7 183.1 L 601.2 183.6 L 603.3 183.9 L 604.9 183.5 L 605.9 182.5 L 606.4 180.9 L 606.5 178.8 L 606.6 176.6 L 606.9 174.6 L 607.5 173.0 L 608.6 172.1 L 610.1 171.7 L 611.8 171.7 L 613.7 172.0 L 615.4 172.2 L 616.9 172.1 L 618.2 171.7 L 619.3 170.8 L 620.2 169.7 L 621.2 168.5 L 622.2 167.4 L 623.3 166.5 L 624.5 166.0 L 625.9 165.6 L 627.3 165.4 L 628.6 165.3 L 630.0 165.0"></path>
</g>

<g className="float f1 [transform-box:fill-box] origin-center animate-idp-doc-hover will-change-transform motion-reduce:transition-none motion-reduce:animate-none" transform="translate(140, 45)">

<rect x="0" y="0" width="110" height="150" rx="14" fill="#00bfff" opacity="0.15" filter="url(#glow-cyan)"></rect>

<path d="M 0 14 
             A 14 14 0 0 1 14 0 
             L 80 0 
             L 110 30 
             L 110 136 
             A 14 14 0 0 1 96 150 
             L 14 150 
             A 14 14 0 0 1 0 136 Z" fill="#0b2a8f" stroke="#2f7bff" strokeWidth="2" strokeLinejoin="round" filter="url(#glow-cyan)"></path>

<path d="M 80 0 L 80 20 A 10 10 0 0 0 90 30 L 110 30 Z" fill="#1d4ed8" stroke="#2f7bff" strokeWidth="1.5" strokeLinejoin="round"></path>

<g fill="#6cb4ff" opacity="0.95">
<rect x="22" y="42" width="30" height="6" rx="3"></rect>
<rect x="22" y="60" width="66" height="6" rx="3"></rect>
<rect x="22" y="78" width="66" height="6" rx="3"></rect>
<rect x="22" y="96" width="55" height="6" rx="3"></rect>
<rect x="22" y="114" width="40" height="6" rx="3"></rect>
</g>
</g>


<g className="float f2 animate-idp-badge-hover-1 motion-reduce:transition-none motion-reduce:animate-none" transform="translate(415, 38)" filter="url(#glow-btn)">
<rect width="110" height="52" rx="10" fill="url(#pdf-grad)" stroke="#cc00ff" strokeWidth="1.5"></rect>

<path d="M 18 16 L 28 16 L 34 22 L 34 36 L 18 36 Z" fill="none" stroke="#ff33cc" strokeWidth="1.5" strokeLinejoin="round"></path>
<path d="M 22 24 L 30 24 M 22 28 L 30 28 M 22 32 L 26 32" stroke="#ff33cc" strokeWidth="1.2"></path>

<text x="44" y="32" fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="15" letterSpacing="0.5">PDF</text>
</g>

<g className="float f3 animate-idp-badge-hover-2 motion-reduce:transition-none motion-reduce:animate-none" transform="translate(425, 124)" filter="url(#glow-btn)">
<rect width="115" height="52" rx="10" fill="url(#docx-grad)" stroke="#0099ff" strokeWidth="2"></rect>

<path d="M 18 16 L 28 16 L 34 22 L 34 36 L 18 36 Z" fill="none" stroke="#00ffff" strokeWidth="1.5" strokeLinejoin="round"></path>
<path d="M 22 24 L 30 24 M 22 28 L 30 28 M 22 32 L 26 32" stroke="#00ffff" strokeWidth="1.2"></path>

<text x="44" y="32" fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="15" letterSpacing="0.5">DOCX</text>
</g>

<g className="float f4 animate-idp-badge-hover-3 motion-reduce:transition-none motion-reduce:animate-none" transform="translate(415, 208)" filter="url(#glow-btn)">
<rect width="110" height="52" rx="10" fill="url(#jpg-grad)" stroke="#9400d3" strokeWidth="1.5"></rect>

<rect x="18" y="17" width="16" height="18" rx="2" fill="none" stroke="#da70d6" strokeWidth="1.5"></rect>
<circle cx="23" cy="22" r="2" fill="#da70d6"></circle>
<path d="M 19 32 L 24 26 L 29 31 L 31 29 L 33 32 Z" fill="none" stroke="#da70d6" strokeWidth="1.5" strokeLinejoin="round"></path>

<text x="46" y="32" fill="#ffffff" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold" fontSize="15" letterSpacing="0.5">JPG</text>
</g>

<g transform="translate(700, 150)">
<circle cx="0" cy="0" r="112" fill="url(#halo-grad)"></circle>
<circle className="ripple [transform-box:fill-box] origin-center will-change-transform motion-reduce:transition-none motion-reduce:animate-none animate-idp-ripple" cx="0" cy="0" r="74" fill="none" stroke="#00e5ff" strokeWidth="2.5"></circle>
<circle className="ripple r2 [transform-box:fill-box] origin-center will-change-transform motion-reduce:transition-none motion-reduce:animate-none animate-idp-ripple-delayed" cx="0" cy="0" r="74" fill="none" stroke="#4f8dff" strokeWidth="2.5"></circle>
<circle className="ring-spin-rev [transform-box:fill-box] origin-center animate-idp-ring-turn-reverse will-change-transform motion-reduce:transition-none motion-reduce:animate-none" cx="0" cy="0" r="84" fill="none" stroke="#4f8dff" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 14" opacity=".8"></circle>

<circle className="core-glow animate-idp-processor-pulse motion-reduce:transition-none motion-reduce:animate-none" cx="0" cy="0" r="74" fill="none" stroke="#0055ff" strokeWidth="6" filter="url(#glow-blue)"></circle>
<circle className="core-glow c2 animate-idp-processor-pulse motion-reduce:transition-none motion-reduce:animate-none" cx="0" cy="0" r="74" fill="none" stroke="#00ffff" strokeWidth="2" filter="url(#glow-cyan)"></circle>
<circle cx="0" cy="0" r="71" fill="url(#inner-bg)"></circle>

<circle className="ring-spin [transform-box:fill-box] origin-center animate-idp-ring-turn will-change-transform motion-reduce:transition-none motion-reduce:animate-none" cx="0" cy="0" r="68" fill="none" stroke="#00ffff" strokeWidth="3" strokeLinecap="round" strokeDasharray="95 332" filter="url(#glow-cyan)"></circle>

<g className="brain animate-idp-chip-scan motion-reduce:transition-none motion-reduce:animate-none" transform="translate(0, 0)" filter="url(#glow-cyan)">

<rect x="-26" y="-26" width="52" height="52" rx="7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"></rect>

<rect x="-13" y="-13" width="26" height="26" rx="3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round"></rect>

<g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M -12 -26 V -34 M -12 26 V 34 M -26 -12 H -34 M 26 -12 H 34"></path><path d="M 0 -26 V -34 M 0 26 V 34 M -26 0 H -34 M 26 0 H 34"></path><path d="M 12 -26 V -34 M 12 26 V 34 M -26 12 H -34 M 26 12 H 34"></path></g>

<path d="M -6 0 H 0 V -6 M 0 0 H 6 V 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
<circle cx="-6" cy="0" r="2" fill="currentColor"></circle>
<circle cx="0" cy="-6" r="2" fill="currentColor"></circle>
<circle cx="6" cy="6" r="2" fill="currentColor"></circle>
<circle cx="-19" cy="-19" r="1.8" fill="currentColor"></circle>
<circle cx="19" cy="19" r="1.8" fill="currentColor"></circle>
</g>
</g>
</svg>
</section>
    <section className="feature-grid grid grid-cols-3 gap-2.5 min-[701px]:flex-none min-[701px]:max-[1100px]:grid-cols-2 max-[700px]:grid-cols-2">
<button type="button" data-scroll="#stats" className="ai-processing-card group relative min-h-[112px] min-w-0 rounded-[14px] border border-[rgba(168,85,247,.42)] bg-[radial-gradient(130%_100%_at_0%_0%,rgba(168,85,247,.16),transparent_62%),linear-gradient(180deg,rgba(16,30,105,.75),rgba(8,16,70,.75))] px-3.5 py-[13px] text-left shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition duration-300 hover:-translate-y-[2px] hover:border-[rgba(168,85,247,.8)] hover:shadow-[0_8px_26px_rgba(168,85,247,.25),inset_0_1px_0_rgba(255,255,255,.08)] [.light_&]:border-[#d7c9ee] [.light_&]:bg-[linear-gradient(145deg,#ffffff,#f7f2ff)] [.light_&]:shadow-[0_5px_18px_rgba(24,50,90,.08)] max-[1100px]:pt-[34px] max-[1100px]:last:odd:col-span-full [@media(min-width:701px)_and_(max-height:760px)]:min-h-[92px] [@media(min-width:701px)_and_(max-height:760px)]:px-[11px] [@media(min-width:701px)_and_(max-height:760px)]:py-[9px]">
<span className="mb-2.5 grid size-[38px] place-items-center rounded-full border-[1.5px] border-[rgba(168,85,247,.95)] bg-[rgba(168,85,247,.28)] text-white shadow-[0_0_14px_rgba(168,85,247,.6),inset_0_0_8px_rgba(168,85,247,.35)] [@media(min-width:701px)_and_(max-height:760px)]:mb-1.5 [@media(min-width:701px)_and_(max-height:760px)]:size-[30px]"><svg className="size-[19px] [@media(min-width:701px)_and_(max-height:760px)]:size-4"><use href="#i-chip"></use></svg></span><em className="premium-badge absolute top-2.5 right-2.5 inline-flex cursor-pointer items-center gap-1 overflow-hidden rounded-[7px] border border-[rgba(255,233,160,.75)] bg-[linear-gradient(135deg,#8d6a1c_0%,#d9a93a_30%,#f6d97a_50%,#c99319_72%,#8d6a1c_100%)] py-[3px] pr-[9px] pl-[7px] text-[9px] leading-[1.2] font-extrabold tracking-[.07em] text-white uppercase not-italic shadow-[0_0_12px_rgba(234,179,8,.45),inset_0_1px_0_rgba(255,255,255,.45)] [text-shadow:0_1px_1px_rgba(90,60,0,.6)] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fde68a]" id="premiumBadge" role="button" tabIndex="0" title="View Premium plans"><svg className="size-[11px] text-white drop-shadow-[0_1px_1px_rgba(90,60,0,.6)]" viewBox="0 0 24 24" aria-hidden="true"><use href="#i-crown"></use></svg>Premium</em>
<h3 className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-bold tracking-[.01em] text-white [.light_&]:text-[#263b59] [@media(min-width:701px)_and_(max-height:760px)]:text-xs">AI Processing <span className="inline-flex items-center gap-1 rounded-full border border-fuchsia-300/45 bg-fuchsia-500/15 px-1.5 py-px text-[8.5px] leading-[1.3] font-bold tracking-[.08em] text-fuchsia-100 uppercase [.light_&]:text-fuchsia-800"><span className="relative flex size-1.5" aria-hidden="true"><span className="absolute inline-flex size-full animate-ping rounded-full bg-fuchsia-300 opacity-75 motion-reduce:animate-none"></span><span className="relative inline-flex size-1.5 rounded-full bg-fuchsia-300"></span></span>Coming soon</span></h3>
<p className="text-[10.5px] leading-[1.5] text-[#c9b6f5] [.light_&]:text-[#5b4c77] [@media(min-width:701px)_and_(max-height:760px)]:text-[9.5px] [@media(min-width:701px)_and_(max-height:760px)]:leading-[1.4]">Extract text and understand content.</p>
</button>
<button type="button" onClick={() => navigate("/classification")} data-scroll="#stats" className="group relative min-h-[112px] min-w-0 rounded-[14px] border border-[rgba(34,211,238,.42)] bg-[radial-gradient(130%_100%_at_0%_0%,rgba(34,211,238,.16),transparent_62%),linear-gradient(180deg,rgba(16,30,105,.75),rgba(8,16,70,.75))] px-3.5 py-[13px] text-left shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition duration-300 hover:-translate-y-[2px] hover:border-[rgba(34,211,238,.8)] hover:shadow-[0_8px_26px_rgba(34,211,238,.25),inset_0_1px_0_rgba(255,255,255,.08)] [.light_&]:border-[#b9dce8] [.light_&]:bg-[linear-gradient(145deg,#ffffff,#effaff)] [.light_&]:shadow-[0_5px_18px_rgba(24,50,90,.08)] max-[1100px]:last:odd:col-span-full [@media(min-width:701px)_and_(max-height:760px)]:min-h-[92px] [@media(min-width:701px)_and_(max-height:760px)]:px-[11px] [@media(min-width:701px)_and_(max-height:760px)]:py-[9px]">
<span className="mb-2.5 grid size-[38px] place-items-center rounded-full border-[1.5px] border-[rgba(34,211,238,.95)] bg-[rgba(34,211,238,.28)] text-white shadow-[0_0_14px_rgba(34,211,238,.6),inset_0_0_8px_rgba(34,211,238,.35)] [@media(min-width:701px)_and_(max-height:760px)]:mb-1.5 [@media(min-width:701px)_and_(max-height:760px)]:size-[30px]"><svg className="size-[19px] [@media(min-width:701px)_and_(max-height:760px)]:size-4"><use href="#i-tag"></use></svg></span>
<h3 className="mb-1 text-[13px] font-bold tracking-[.01em] text-white [.light_&]:text-[#263b59] [@media(min-width:701px)_and_(max-height:760px)]:text-xs">Classification</h3>
<p className="text-[10.5px] leading-[1.5] text-[#9ddbea] [.light_&]:text-[#3e6378] [@media(min-width:701px)_and_(max-height:760px)]:text-[9.5px] [@media(min-width:701px)_and_(max-height:760px)]:leading-[1.4]">Automatically categorize your documents.</p>
</button>
<button type="button" onClick={() => navigate("/track-manage")} data-scroll="#activity" className="group relative min-h-[112px] min-w-0 rounded-[14px] border border-[rgba(245,158,11,.42)] bg-[radial-gradient(130%_100%_at_0%_0%,rgba(245,158,11,.16),transparent_62%),linear-gradient(180deg,rgba(16,30,105,.75),rgba(8,16,70,.75))] px-3.5 py-[13px] text-left shadow-[inset_0_1px_0_rgba(255,255,255,.06)] transition duration-300 hover:-translate-y-[2px] hover:border-[rgba(245,158,11,.8)] hover:shadow-[0_8px_26px_rgba(245,158,11,.25),inset_0_1px_0_rgba(255,255,255,.08)] [.light_&]:border-[#ead6ae] [.light_&]:bg-[linear-gradient(145deg,#ffffff,#fff9ed)] [.light_&]:shadow-[0_5px_18px_rgba(24,50,90,.08)] max-[1100px]:last:odd:col-span-full [@media(min-width:701px)_and_(max-height:760px)]:min-h-[92px] [@media(min-width:701px)_and_(max-height:760px)]:px-[11px] [@media(min-width:701px)_and_(max-height:760px)]:py-[9px]">
<span className="mb-2.5 grid size-[38px] place-items-center rounded-full border-[1.5px] border-[rgba(245,158,11,.95)] bg-[rgba(245,158,11,.28)] text-white shadow-[0_0_14px_rgba(245,158,11,.6),inset_0_0_8px_rgba(245,158,11,.35)] [@media(min-width:701px)_and_(max-height:760px)]:mb-1.5 [@media(min-width:701px)_and_(max-height:760px)]:size-[30px]"><svg className="size-[19px] [@media(min-width:701px)_and_(max-height:760px)]:size-4"><use href="#i-clock"></use></svg></span>
<h3 className="mb-1 text-[13px] font-bold tracking-[.01em] text-white [.light_&]:text-[#263b59] [@media(min-width:701px)_and_(max-height:760px)]:text-xs">Track &amp; Manage</h3>
<p className="text-[10.5px] leading-[1.5] text-[#cfc6d8] [.light_&]:text-[#6e5737] [@media(min-width:701px)_and_(max-height:760px)]:text-[9.5px] [@media(min-width:701px)_and_(max-height:760px)]:leading-[1.4]">View history and manage your files.</p>
</button>
</section>
  </>);
}
