import sys
import re

css_path = r'c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\css\styles.css'

with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Remove old styles explicitly
patterns_to_remove = [
    r'\.navbar\s*\{[^}]*\}',
    r'\.nav-inner\s*\{[^}]*\}',
    r'\.nav-logo-text\s*\{[^}]*\}',
    r'\.nav-links\s*\{[^}]*\}',
    r'\.nav-links\s+a\s*\{[^}]*\}',
    r'\.nav-btn\s*\{[^}]*\}',
    r'\.hero-new\s*\{[^}]*\}',
    r'\.hero-new-inner\s*\{[^}]*\}',
    r'\.hero-bg-img\s*\{[^}]*\}',
    r'\.hero-new-title\s*\{[^}]*\}',
    r'\.hero-bottom-left\s*\{[^}]*\}',
    r'\.hero-pill-card\s*\{[^}]*\}',
    r'\.hero-right-card\s*\{[^}]*\}',
    r'\.container\s*\{[^}]*\}',
    r'body\s*\{[^}]*\}',
]

for p in patterns_to_remove:
    css = re.sub(p, '', css)

new_css = """
body {
  font-family: var(--font-body);
  background: #ffffff;
  color: var(--dark-text);
  overflow-x: hidden;
  line-height: 1.6;
}

.container {
  width: 100%;
  max-width: 1450px;
  margin: auto;
  padding-left: 32px;
  padding-right: 32px;
}

/* NAVBAR EXACT */
.navbar {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: 92%;
  max-width: 1450px;
  z-index: 1000;
}

.nav-inner {
  height: 78px;
  border-radius: 28px;
  padding-left: 38px;
  padding-right: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255,255,255,0.72);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255,255,255,0.45);
  box-shadow: 0 8px 30px rgba(68,127,152,0.08);
}

.nav-logo-text {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  color: var(--turquoise);
  letter-spacing: -1px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 48px;
}

.nav-links a {
  font-size: 17px;
  font-weight: 500;
  color: var(--dark-text);
  transition: var(--transition-fast);
}

.nav-links a:hover {
  color: var(--turquoise);
}

.nav-btn {
  height: 50px;
  padding: 0 30px;
  border-radius: 100px;
  background: linear-gradient(135deg, var(--turquoise) 0%, var(--slate-blue) 100%);
  color: #fff;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
}

/* HERO EXACT */
.hero-new {
  padding: 120px 0 80px;
  display: flex;
  justify-content: center;
}

.hero-new-inner {
  position: relative;
  width: 100%;
  height: 760px;
  border-radius: 40px;
  overflow: hidden;
  background: linear-gradient(135deg, #f0f7f9 0%, #e1eff4 100%);
  display: flex;
  align-items: center;
}

.hero-atmosphere {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(185,219,225,0.4), transparent 60%);
  z-index: 1;
}

.hero-glow-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 520px;
  height: 520px;
  background: var(--ice-blue);
  opacity: 0.42;
  filter: blur(25px);
  border-radius: 50%;
  z-index: 1;
}

.hero-grid-3col {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 40px;
}

.hero-col-left {
  width: 38%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 20px;
}

.hero-new-title {
  font-family: var(--font-display);
  font-size: 92px;
  line-height: 0.88;
  letter-spacing: -5px;
  font-weight: 900;
  color: var(--dark-text);
  margin-bottom: 40px;
  text-transform: uppercase;
}

.hero-pill-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.4);
  padding: 8px 24px 8px 8px;
  border-radius: 100px;
  gap: 16px;
  width: max-content;
}

.hero-col-center {
  width: 42%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hero-center-product {
  width: 280px;
  position: relative;
  z-index: 3;
  animation: float-bottle 4s ease-in-out infinite;
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.15));
}

@keyframes float-bottle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.hero-col-right {
  width: 20%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.hero-right-card {
  width: 240px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
}
"""

css = css + '\n' + new_css

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS updated successfully.")
