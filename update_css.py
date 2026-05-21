import sys
import re

file_path = r'c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\css\styles.css'

new_css = """
/* ═══════════════════════════════════════════════════════════
   TICKER NEW
   ═══════════════════════════════════════════════════════════ */
.ticker-new {
  padding: 30px 0;
  background: var(--white);
  overflow: hidden;
  position: relative;
}

.ticker-track-new {
  display: flex;
  width: max-content;
  animation: ticker-scroll 30s linear infinite;
}

.ticker-item-new {
  display: flex;
  align-items: center;
  padding: 0 40px;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #000;
}

/* ═══════════════════════════════════════════════════════════
   PRODUCTS NEW
   ═══════════════════════════════════════════════════════════ */
.products-new {
  padding: 40px 0 100px;
  background: var(--white);
}

.pn-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 80px;
}

.pn-card {
  background: #f8f9fa;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: var(--transition);
  border: 1px solid rgba(0,0,0,0.04);
}

.pn-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.06);
  background: #fff;
}

.pn-card-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.pn-cat {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pn-icon-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border: 1px solid transparent;
  transition: var(--transition-fast);
  cursor: pointer;
}

.pn-card:hover .pn-icon-btn {
  background: #fff;
  border-color: rgba(0,0,0,0.1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.pn-img {
  width: 100%;
  max-width: 140px;
  height: 180px;
  object-fit: contain;
  margin-bottom: 20px;
  transition: transform 0.4s ease;
}

.pn-card:hover .pn-img {
  transform: scale(1.05);
}

/* Brand Mission */
.pn-mission {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  align-items: start;
  max-width: 1000px;
  margin: 0 auto;
}

.pn-mission-left {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  color: #777;
}

.pn-mission-right p {
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 24px;
}

.pn-mission-right p strong {
  font-weight: 700;
  color: #000;
}

.pn-btn-dark {
  background: #222;
  color: #fff;
  padding: 12px 28px;
  border-radius: 100px;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: var(--transition-fast);
}

.pn-btn-dark:hover {
  background: #000;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}
"""

with open(file_path, 'a', encoding='utf-8') as f:
    f.write(new_css)
print('CSS appended successfully.')
