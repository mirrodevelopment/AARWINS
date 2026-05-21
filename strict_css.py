import sys
import re

css_path = r'c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\css\styles.css'

with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# I will use re.sub to modify existing blocks or add them at the end.
# First, remove all traces of navbar and hero from the CSS to avoid duplicates.
patterns_to_remove = [
    r'\.navbar\s*\{[^}]*\}',
    r'\.nav-inner\s*\{[^}]*\}',
    r'\.nav-logo-text\s*\{[^}]*\}',
    r'\.nav-links\s*\{[^}]*\}',
    r'\.nav-links\s+a\s*\{[^}]*\}',
    r'\.nav-btn\s*\{[^}]*\}',
    r'\.hero-new\s*\{[^}]*\}',
    r'\.hero-new-inner\s*\{[^}]*\}',
    r'\.hero-atmosphere\s*\{[^}]*\}',
    r'\.hero-glow-circle\s*\{[^}]*\}',
    r'\.hero-grid-3col\s*\{[^}]*\}',
    r'\.hero-col-left\s*\{[^}]*\}',
    r'\.hero-new-title\s*\{[^}]*\}',
    r'\.hero-badge-small\s*\{[^}]*\}',
    r'\.badge-dot\s*\{[^}]*\}',
    r'\.hero-new-desc\s*\{[^}]*\}',
    r'\.hero-btn-group\s*\{[^}]*\}',
    r'\.hero-btn-primary\s*\{[^}]*\}',
    r'\.hero-btn-secondary\s*\{[^}]*\}',
    r'\.hero-col-center\s*\{[^}]*\}',
    r'\.hero-center-product\s*\{[^}]*\}',
    r'\.hero-col-right\s*\{[^}]*\}',
    r'\.hero-right-card\s*\{[^}]*\}',
    r'\.hero-card-tags\s*\{[^}]*\}',
    r'\.hero-card-header\s*\{[^}]*\}',
    r'\.container\s*\{[^}]*\}',
    r'body\s*\{[^}]*\}',
]

for p in patterns_to_remove:
    css = re.sub(p, '', css)

# Now I'll append the exact requested CSS to the end of the file.

exact_css = """
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
  padding: 0 38px;
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
  font-size: 18px; /* Slightly smaller as requested */
  font-weight: 800;
  color: var(--turquoise);
  letter-spacing: -1px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 48px; /* 48px spacing between items */
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
  box-shadow: 0 4px 15px rgba(68,127,152,0.15);
}

/* HERO EXACT */
.hero-new {
  padding: 120px 0 100px; /* Section spacing 80-120px */
  display: flex;
  justify-content: center;
}

.hero-new-inner {
  position: relative;
  width: 100%;
  height: 760px; /* EXACTLY 760px */
  max-height: 760px;
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
  padding: 0 60px; /* Give some internal breathing room */
}

.hero-col-left {
  width: 38%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 40px;
}

.hero-badge-small {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 14px;
  border-radius: 100px;
  background: rgba(255,255,255,0.22);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.4);
  font-family: var(--font-body);
  font-size: 11px; /* Smaller thin typography */
  font-weight: 500;
  color: var(--dark-text);
  margin-bottom: 24px;
  width: max-content;
}

.badge-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--turquoise);
}

.hero-new-title {
  font-family: var(--font-display);
  font-size: 92px;
  line-height: 0.88;
  letter-spacing: -5px;
  font-weight: 900;
  color: var(--dark-text);
  margin-bottom: 24px;
  text-transform: uppercase;
}

.hero-new-desc {
  max-width: 420px;
  font-size: 20px;
  line-height: 1.9;
  color: var(--dark-text);
  margin-bottom: 32px;
}

.hero-btn-group {
  display: flex;
  gap: 18px; /* Spacing between buttons: 18px */
}

.hero-btn-primary, .hero-btn-secondary {
  height: 56px;
  padding: 0 34px;
  border-radius: 100px;
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hero-btn-primary {
  background: linear-gradient(135deg, var(--turquoise) 0%, var(--slate-blue) 100%);
  color: #fff;
  box-shadow: 0 8px 20px rgba(68,127,152,0.2);
}

.hero-btn-secondary {
  background: rgba(255,255,255,0.7);
  color: var(--dark-text);
  border: 1px solid rgba(255,255,255,0.8);
  backdrop-filter: blur(8px);
}

.hero-btn-primary:hover, .hero-btn-secondary:hover {
  transform: translateY(-2px);
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
  50% { transform: translateY(-8px); } /* Gentle floating motion */
}

.hero-col-right {
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
}

.hero-right-card {
  width: 240px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px; /* Gap inside card: 18px */
}

.hero-card-tags {
  display: flex;
  gap: 6px;
}
"""

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css + "\n" + exact_css)

print("CSS updated perfectly to spec.")
