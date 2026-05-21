import sys
import re

file_path = r'c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\css\styles.css'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update CSS variables
old_vars = """:root {
  --green-deep:     #08251D;
  --green-dark:     #0E3D30;
  --green-mid:      #0E5C4A;
  --green-light:    #1A8C6E;
  --teal:           #00C9B8;
  --teal-bright:    #14D8CC;
  --lime:           #9EF01A;
  --cream:          #F6F5F0;
  --cream-light:    #FAFAF7;
  --cream-warm:     #F0EDE4;
  --white:          #FFFFFF;"""

new_vars = """:root {
  --turquoise:      #447F98;
  --slate-blue:     #629BB6;
  --platinum:       #DADEE1;
  --glacier:        #B9DBE1;
  --ice-blue:       #D6EBF3;
  --dark-text:      #17313B;
  --light-text:     #5D7884;
  --white:          #FFFFFF;"""

if old_vars in content:
    content = content.replace(old_vars, new_vars)
else:
    # Fallback if exact match fails
    content = re.sub(r':root\s*\{[^}]*--white:\s*#FFFFFF;', new_vars, content, flags=re.DOTALL)

# 2. Replace old variable usage with new ones
replacements = {
    'var(--green-deep)': 'var(--dark-text)',
    'var(--green-dark)': 'var(--dark-text)',
    'var(--green-mid)': 'var(--turquoise)',
    'var(--green-light)': 'var(--slate-blue)',
    'var(--teal)': 'var(--slate-blue)',
    'var(--teal-bright)': 'var(--glacier)',
    'var(--lime)': 'var(--ice-blue)',
    'var(--cream)': 'var(--white)',
    'var(--cream-light)': '#fafafa',
    'var(--cream-warm)': '#f5f5f5',
}

for old, new in replacements.items():
    content = content.replace(old, new)

# 3. Update Navbar to floating glassmorphism
# Currently it's absolute, transparent. We need it fixed, glass pill with turquoise/slate gradient.
navbar_old = """.navbar {
  position: absolute;
  top: 36px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 80px);
  max-width: 1340px;
  z-index: 1000;
  transition: var(--transition);
}"""
navbar_new = """.navbar {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 48px);
  max-width: 1340px;
  z-index: 1000;
  transition: var(--transition);
}"""

navinner_old = """.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: transparent;
  border: none;
  box-shadow: none;
}"""
navinner_new = """.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 28px;
  border-radius: 100px;
  background: linear-gradient(135deg, rgba(68,127,152,0.85) 0%, rgba(98,155,182,0.85) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.4);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5);
  transition: var(--transition);
}"""

content = content.replace(navbar_old, navbar_new)
content = content.replace(navinner_old, navinner_new)

# Ensure nav links are white
content = re.sub(r'\.nav-logo-text\s*\{[^}]*color:[^;]+;', '.nav-logo-text {\n  font-family: var(--font-display);\n  font-size: 24px;\n  font-weight: 800;\n  letter-spacing: -1.5px;\n  color: #fff;', content)

# 4. Update Buttons to use turquoise/slate gradient
content = re.sub(r'linear-gradient\([^)]*var\(--slate-blue\)[^)]*var\(--turquoise\)[^)]*\)', 'linear-gradient(135deg, var(--turquoise) 0%, var(--slate-blue) 100%)', content)

# Also update existing linear gradients in btn-primary to use turquoise and slate
content = content.replace('linear-gradient(135deg, var(--slate-blue) 0%, var(--turquoise) 100%)', 'linear-gradient(135deg, var(--turquoise) 0%, var(--slate-blue) 100%)')

# 5. Update Footer background
content = re.sub(r'footer\s*\{\s*padding:[^;]+;\s*background:[^;]+;', 'footer {\n  padding: 120px 0 60px;\n  background: linear-gradient(135deg, var(--turquoise) 0%, var(--slate-blue) 100%);', content)

# 6. Hero New Container Background to gradient
content = re.sub(r'\.hero-new-inner\s*\{[^}]*background:[^;]+;', '.hero-new-inner {\n  position: relative;\n  width: 100%;\n  max-width: 1400px;\n  height: 80vh;\n  min-height: 600px;\n  border-radius: 40px;\n  overflow: hidden;\n  background: linear-gradient(135deg, var(--ice-blue) 0%, var(--glacier) 100%);', content)

# Hardcode colors that might have been lost
content = content.replace('color: #4a645e;', 'color: var(--light-text);')
content = content.replace('color: #6a8880;', 'color: var(--light-text);')
content = content.replace('color: #5a786e;', 'color: var(--light-text);')
content = content.replace('color: #777;', 'color: var(--light-text);')
content = content.replace('color: #555;', 'color: var(--light-text);')
content = content.replace('color: #333;', 'color: var(--dark-text);')
content = content.replace('color: #000;', 'color: var(--dark-text);')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Restyled successfully.")
