import sys
import re

html_path = r'c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\index.html'
css_path = r'c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\css\styles.css'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Update Navbar HTML
nav_start = html.find('<nav class="navbar"')
nav_end = html.find('</nav>', nav_start) + 6

new_navbar = """<nav class="navbar" role="navigation" aria-label="Main navigation">
  <div class="nav-inner">
    <a class="nav-logo" href="#home" aria-label="Aarwins home">
      <span class="nav-logo-text">AARWINS</span>
    </a>
    <div class="nav-links">
      <a href="#home">Home</a>
      <a href="#products">Products</a>
      <a href="#story">Story</a>
      <a href="#ingredients">Ingredients</a>
      <a href="#contact">Contact</a>
    </div>
    <button class="nav-btn" id="nav-shop-btn" onclick="document.getElementById('products').scrollIntoView({behavior:'smooth'})">
      <span>Shop Now</span>
    </button>
  </div>
</nav>"""

html = html[:nav_start] + new_navbar + html[nav_end:]

# Update Hero HTML
hero_start = html.find('<section class="hero-new"')
hero_end = html.find('</section>', hero_start) + 10

new_hero = """<section class="hero-new" id="home">
  <div class="container">
    <div class="hero-new-inner">
      <!-- Background / Atmosphere -->
      <div class="hero-atmosphere"></div>
      <div class="hero-glow-circle"></div>
      
      <!-- 3-Column Grid -->
      <div class="hero-grid-3col">
        
        <!-- LEFT: 38% -->
        <div class="hero-col-left">
          <h1 class="hero-new-title">YOUR DAILY<br/>ADVENTURE<br/>PARTNERS</h1>
          <div class="hero-pill-card">
            <img src="https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=150&auto=format&fit=crop" alt="Coconut Beverage" class="hero-pill-thumb"/>
            <div class="hero-pill-text">
              <strong>Coconut Refresh</strong>
              <span>Transform your daily hydration with pure tropical wellness.</span>
            </div>
          </div>
        </div>
        
        <!-- CENTER: 42% -->
        <div class="hero-col-center">
          <img src="https://images.unsplash.com/photo-1542452255191-c85a98f2c5d1?q=80&w=600&auto=format&fit=crop" class="hero-main-lifestyle" alt="Lifestyle image" style="position:absolute; width:100%; height:100%; object-fit:cover; z-index:-1; opacity: 0.9; mix-blend-mode: multiply; border-radius: 40px;" />
          <img class="hero-center-product" src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=900&auto=format&fit=crop" alt="Aarwins Bottle" />
        </div>
        
        <!-- RIGHT: 20% -->
        <div class="hero-col-right">
          <div class="hero-right-card">
            <div class="hero-card-tags">
              <span class="hc-tag">Aesthetic</span>
              <span class="hc-tag">Skin</span>
              <span class="hc-tag">Cream</span>
            </div>
            <div class="hero-card-header">
              <div class="hero-card-title-wrap">
                <span class="hc-subtitle">New / 2025</span>
                <h3 class="hc-title">Hand Cream<br/>Fig Fizz</h3>
              </div>
              <button class="hc-icon-btn" aria-label="View product">↗</button>
            </div>
            <div class="hero-card-img-wrap">
              <img src="https://images.unsplash.com/photo-1629198725799-a1d2f0eb3a7b?q=80&w=300&auto=format&fit=crop" alt="Hand Cream" class="hc-img"/>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</section>"""

html = html[:hero_start] + new_hero + html[hero_end:]

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("HTML updated.")

# Update CSS
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Remove old navbar styles
css = re.sub(r'\.navbar\s*\{[^}]*\}', '', css)
css = re.sub(r'\.nav-inner\s*\{[^}]*\}', '', css)
css = re.sub(r'\.nav-logo-text\s*\{[^}]*\}', '', css)
css = re.sub(r'\.nav-links\s*\{[^}]*\}', '', css)
css = re.sub(r'\.nav-links\s+a\s*\{[^}]*\}', '', css)
css = re.sub(r'\.nav-btn\s*\{[^}]*\}', '', css)
css = re.sub(r'\.hero-new\s*\{[^}]*\}', '', css)
css = re.sub(r'\.hero-new-inner\s*\{[^}]*\}', '', css)
css = re.sub(r'\.hero-bg-img\s*\{[^}]*\}', '', css)
css = re.sub(r'\.hero-new-title\s*\{[^}]*\}', '', css)
css = re.sub(r'\.hero-bottom-left\s*\{[^}]*\}', '', css)
css = re.sub(r'\.hero-pill-card\s*\{[^}]*\}', '', css)
css = re.sub(r'\.hero-right-card\s*\{[^}]*\}', '', css)
css = re.sub(r'\.container\s*\{[^}]*\}', '', css)
css = re.sub(r'body\s*\{[^}]*\}', '', css)

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
  color: #fff;
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

with open(css_path, 'a', encoding='utf-8') as f:
    f.write(new_css)

print("CSS updated.")
