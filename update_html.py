import sys
import re

file_path = r'c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# First, find the end of hero-new
hero_end = content.find('</section>', content.find('class="hero-new"')) + 10

# Find the start of ingredients
ingredients_start = content.find('<!-- ═══════════════════════════════════════════════════════\n     INGREDIENTS')

if hero_end != -1 and ingredients_start != -1:
    new_html = """
<!-- ═══════════════════════════════════════════════════════
     TICKER NEW
     ═══════════════════════════════════════════════════════ -->
<div class="ticker-new" aria-hidden="true">
  <div class="ticker-track-new">
    <div class="ticker-item-new">VOGUE</div>
    <div class="ticker-item-new">GQ</div>
    <div class=\"ticker-item-new\">ELLE</div>
    <div class="ticker-item-new">VANITY FAIR</div>
    <div class="ticker-item-new">HARPER'S BAZAAR</div>
    <div class="ticker-item-new">COSMOPOLITAN</div>
    
    <div class="ticker-item-new">VOGUE</div>
    <div class="ticker-item-new">GQ</div>
    <div class=\"ticker-item-new\">ELLE</div>
    <div class="ticker-item-new">VANITY FAIR</div>
    <div class="ticker-item-new">HARPER'S BAZAAR</div>
    <div class="ticker-item-new">COSMOPOLITAN</div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════
     PRODUCTS NEW (GRID + BRAND MISSION)
     ═══════════════════════════════════════════════════════ -->
<section class="products-new" id="products">
  <div class="container">
    <!-- 4 Column Grid -->
    <div class="pn-grid">
      <!-- Card 1 -->
      <div class="pn-card">
        <div class="pn-card-header">
          <span class="pn-cat">[classic]</span>
          <button class="pn-icon-btn">↗</button>
        </div>
        <img src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=200&auto=format&fit=crop" alt="Product 1" class="pn-img"/>
      </div>
      <!-- Card 2 -->
      <div class="pn-card">
        <div class="pn-card-header">
          <span class="pn-cat">[infused]</span>
          <button class="pn-icon-btn">↗</button>
        </div>
        <img src="https://images.unsplash.com/photo-1595981234058-a9302bfcb4cb?q=80&w=200&auto=format&fit=crop" alt="Product 2" class="pn-img"/>
      </div>
      <!-- Card 3 -->
      <div class="pn-card">
        <div class="pn-card-header">
          <span class="pn-cat">[wellness]</span>
          <button class="pn-icon-btn">↗</button>
        </div>
        <img src="https://images.unsplash.com/photo-1629198725799-a1d2f0eb3a7b?q=80&w=200&auto=format&fit=crop" alt="Product 3" class="pn-img"/>
      </div>
      <!-- Card 4 -->
      <div class="pn-card">
        <div class="pn-card-header">
          <span class="pn-cat">[sparkling]</span>
          <button class="pn-icon-btn">↗</button>
        </div>
        <img src="https://images.unsplash.com/photo-1606775017178-028f80455fb4?q=80&w=200&auto=format&fit=crop" alt="Product 4" class="pn-img"/>
      </div>
    </div>
    
    <!-- Brand Mission Area -->
    <div class="pn-mission">
      <div class="pn-mission-left">
        crafted refreshment
      </div>
      <div class="pn-mission-right">
        <p><strong>AARWINS is a premium wellness brand that wants to build a better future for your body and humanity.</strong> Our drinks redefine the pleasure of hydration through a disruptive approach where sustainability and effectiveness meet style.</p>
        <button class="pn-btn-dark">Learn more</button>
      </div>
    </div>
  </div>
</section>
"""
    
    final_html = content[:hero_end] + '\n\n' + new_html + '\n' + content[ingredients_start:]
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(final_html)
    print('HTML updated successfully.')
else:
    print('Could not find markers.')
