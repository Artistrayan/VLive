const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'src', 'styles');
const pagesDir = path.join(stylesDir, 'pages');

if (!fs.existsSync(stylesDir)) fs.mkdirSync(stylesDir);
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir);

const files = {
  'colors.scss': `// colors.scss
$bg-dark: #070913;
$bg-card: rgba(15, 23, 42, 0.75);
$bg-card-hover: rgba(30, 41, 59, 0.85);

$neon-cyan: #00f3ff;
$neon-pink: #ff007f;
$neon-purple: #9d4edd;
$neon-gold: #ffb703;
$neon-green: #00ff88;

$text-main: #f8fafc;
$text-muted: #94a3b8;
$border-neon-cyan: rgba(0, 243, 255, 0.25);

:root {
  --bg-dark: #{$bg-dark};
  --bg-card: #{$bg-card};
  --bg-card-hover: #{$bg-card-hover};
  
  --neon-cyan: #{$neon-cyan};
  --neon-pink: #{$neon-pink};
  --neon-purple: #{$neon-purple};
  --neon-gold: #{$neon-gold};
  --neon-green: #{$neon-green};
  
  --text-main: #{$text-main};
  --text-muted: #{$text-muted};
  
  --border-neon: #{$border-neon-cyan};
}
`,

  'typography.scss': `// typography.scss
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800;900&display=swap');

$font-family-base: 'Vazirmatn', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`,

  'spacing.scss': `// spacing.scss
$border-radius-card: 20px;
$scrollbar-width: 4px;
`,

  'functions.scss': `// functions.scss
@function hex-to-rgba($color, $opacity: 1) {
  @return rgba($color, $opacity);
}
`,

  'mixins.scss': `// mixins.scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin neon-text($color) {
  color: $color;
  text-shadow: 0 0 8px rgba($color, 0.5);
}

@mixin neon-button($base-color, $gradient-end, $glow-color) {
  background: linear-gradient(135deg, rgba($base-color, 0.25), rgba($gradient-end, 0.35));
  border: 1px solid $base-color;
  color: #fff;
  box-shadow: 0 0 15px rgba($glow-color, 0.35);
  transition: all 0.25s ease;

  &:hover {
    background: linear-gradient(135deg, rgba($base-color, 0.45), rgba($gradient-end, 0.55));
    box-shadow: 0 0 25px rgba($glow-color, 0.65);
    transform: translateY(-2px);
  }
}
`,

  'animations.scss': `// animations.scss
@keyframes pulseGlow {
  0% { box-shadow: 0 0 0 0 rgba(255, 0, 127, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 0, 127, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 0, 127, 0); }
}

@keyframes slideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes giftFloatAnim {
  0% {
    transform: scale(0.3) translateY(30px) rotate(-10deg);
    opacity: 0;
    filter: drop-shadow(0 0 0px rgba(245, 158, 11, 0));
  }
  20% {
    transform: scale(1.3) translateY(0px) rotate(5deg);
    opacity: 1;
    filter: drop-shadow(0 0 30px rgba(245, 158, 11, 1));
  }
  50% {
    transform: scale(1.15) translateY(-25px) rotate(-5deg);
    opacity: 1;
    filter: drop-shadow(0 0 40px rgba(236, 72, 153, 1));
  }
  80% {
    transform: scale(1.0) translateY(-65px) rotate(3deg);
    opacity: 0.85;
  }
  100% {
    transform: scale(0.6) translateY(-100px) rotate(0deg);
    opacity: 0;
  }
}
`,

  'variables.scss': `// variables.scss
@import './colors';
@import './typography';
@import './spacing';
`,

  'main.scss': `@import "tailwindcss";

@import './variables';
@import './functions';
@import './mixins';
@import './animations';

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: $font-family-base;
  user-select: auto !important;
  -webkit-user-select: auto !important;
  -webkit-tap-highlight-color: transparent;
}

body, html {
  background-color: #090d16 !important;
  color: var(--text-main);
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  direction: ltr;
}

.cyber-bg, .cyber-container {
  background-color: #090d16 !important;
  background: radial-gradient(circle at 50% 0%, rgba(0, 243, 255, 0.08) 0%, transparent 60%),
              radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.06) 0%, transparent 60%),
              #090d16 !important;
  background-attachment: fixed;
  min-height: 100vh;
}

::-webkit-scrollbar {
  width: $scrollbar-width;
  height: $scrollbar-width;
}

::-webkit-scrollbar-track {
  background: rgba(10, 15, 30, 0.5);
}

::-webkit-scrollbar-thumb {
  background: var(--neon-purple);
  border-radius: $scrollbar-width;
}

.card-3d {
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: $border-radius-card;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;

  &:hover {
    border-color: rgba(0, 243, 255, 0.4);
    box-shadow: 0 15px 35px -10px rgba(0, 243, 255, 0.25),
                0 0 15px rgba(0, 243, 255, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateY(-3px) scale(1.01);
  }
}

.card-neon-pink:hover {
  border-color: rgba(255, 0, 127, 0.5);
  box-shadow: 0 15px 35px -10px rgba(255, 0, 127, 0.3),
              0 0 15px rgba(255, 0, 127, 0.2);
}

.card-neon-gold:hover {
  border-color: rgba(255, 183, 3, 0.5);
  box-shadow: 0 15px 35px -10px rgba(255, 183, 3, 0.3),
              0 0 15px rgba(255, 183, 3, 0.2);
}

.neon-text-cyan { @include neon-text(var(--neon-cyan)); }
.neon-text-pink { @include neon-text(var(--neon-pink)); }
.neon-text-gold { @include neon-text(var(--neon-gold)); }

.btn-neon-cyan {
  @include neon-button(#00f3ff, #0096ff, #00f3ff);
}

.btn-neon-pink {
  @include neon-button(#ff007f, #9d4edd, #ff007f);
}

.btn-neon-purple {
  @include neon-button(#9d4edd, #7209b7, #9d4edd);
}

.live-pulse {
  animation: pulseGlow 2s infinite;
}

.toast-animate {
  animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-gift-float {
  animation: giftFloatAnim 2.3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

@import './pages/Home';
@import './pages/Profile';
@import './pages/Match';
@import './pages/Messages';
@import './pages/Wallet';
@import './pages/Admin';
@import './pages/Settings';
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(stylesDir, filename), content);
}

const pages = ['Home.scss', 'Profile.scss', 'Match.scss', 'Messages.scss', 'Wallet.scss', 'Admin.scss', 'Settings.scss'];
for (const page of pages) {
  fs.writeFileSync(path.join(pagesDir, page), `// ${page}\n`);
}

console.log('SCSS files generated successfully.');
