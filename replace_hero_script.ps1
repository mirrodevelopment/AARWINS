$file = 'c:\Users\girit\OneDrive\Documents\aarwins\src\main\resources\static\collections.html'
$lines = Get-Content $file -Encoding UTF8

# Remove old script lines 1856-2134
$out = @()
for ($i = 0; $i -lt $lines.Count; $i++) {
    $lineNum = $i + 1
    if ($lineNum -lt 1856 -or $lineNum -gt 2134) {
        $out += $lines[$i]
    }
}

# Build the new script block to insert at position of old line 1856
$newScript = @'
  <script src="/js/aarwins.js"></script>
  <script>
(function() {
    const catalog = {
        plasma:  { index: 0, glow: 0x0ea5e9, opacityGlow: "rgba(14, 165, 233, 0.18)", accent: "#0ea5e9", name: "PLASMA",  title: "PLASMA SHOCK",  tagline: "HARNESS THE ENERGY OF PURE PLASMA",    ingredients: "ELECTRIFYING CITRUS & BLUE RASPBERRY",    desc: "A BURST OF ELECTRIC CITRUS AND EXPLOSIVE BLUE RASPBERRY WILL IGNITE YOUR SENSES FOR PEAK PERFORMANCE.",                                    canImg: '/images/hero/plasma_can.png',  fragments: ['\u{1F347}','\u{1F34B}','\u{1F4A7}','\u{1F34A}'] },
        titan:   { index: 1, glow: 0xf97316, opacityGlow: "rgba(249, 115, 22, 0.15)",  accent: "#f97316", name: "TITAN",   title: "TITAN BURN",    tagline: "MOLTEN ENERGY FOR LIMITLESS POWER",       ingredients: "MOLTEN BLOOD ORANGE & DRAGONFRUIT",        desc: "FEEL THE HEAT WITH TITAN BURN, A FIERY EXPLOSION OF BLOOD ORANGE, EXOTIC DRAGONFRUIT, AND MOLTEN CORE POWER.",                             canImg: '/images/hero/titan_can.png',   fragments: ['\u{1F525}','\u{1F34A}','\u{1F336}','\u{1F525}'] },
        nebula:  { index: 2, glow: 0x9333ea, opacityGlow: "rgba(147, 51, 234, 0.18)",  accent: "#a855f7", name: "NEBULA",  title: "NEBULA BERRY",  tagline: "ENERGY BEYOND THE STARS",                ingredients: "BLUEBERRY, ACAI & SPACEFRUIT FUSION",      desc: "UNLOCK THE INFINITE WITH NEBULA BERRY, A COSMIC BLEND OF BLUEBERRY, ACAI, AND THE MYSTERIOUS SPACEFRUIT.",                                 canImg: '/images/hero/nebula_can.png',  fragments: ['\u{1F347}','\u{1FAD0}','\u{1F52E}','\u{1F347}'] },
        quantum: { index: 3, glow: 0x22c55e, opacityGlow: "rgba(34, 197, 94, 0.15)",   accent: "#22c55e", name: "QUANTUM", title: "QUANTUM FUEL",  tagline: "CHARGED FOR THE NEXT LEVEL",              ingredients: "LIME, MINT & QUANTUM BOTANICAL HERBS",     desc: "FUEL YOUR FUTURE WITH QUANTUM FUEL, A CLEAN AND ENERGIZING COMBINATION OF LIME, REFRESHING MINT, AND ENERGY HERBS.",                       canImg: '/images/hero/quantum_can.png', fragments: ['\u{1F33F}','\u{1F34B}','\u{1F343}','\u{1F33F}'] }
    };

    let activeKey = "plasma";
    let stateLock = false;
    let autoplayTimer = null;
    const catalogKeys = Object.keys(catalog);

    /* ---- THREE.JS SCENE SETUP ---- */
    const mountNode = document.getElementById('hero-webgl-layer-mount');
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030304, 0.03);

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 22);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mountNode.appendChild(renderer.domElement);

    /* ---- LIGHTS ---- */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45); scene.add(ambientLight);
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8); keyLight.position.set(5, 10, 8); scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2); rimLight.position.set(-5, 4, -8); scene.add(rimLight);
    const sceneSpotlight = new THREE.SpotLight(catalog.plasma.glow, 15, 40, Math.PI / 4, 0.5, 1);
    sceneSpotlight.position.set(0, 5, 10); scene.add(sceneSpotlight);

    /* ---- CAN MESHES ---- */
    const globalGroupTrack = new THREE.Group(); scene.add(globalGroupTrack);
    const textureLoader = new THREE.TextureLoader();
    const productCanGeo = new THREE.PlaneGeometry(3.6, 6.2);
    const slicePlaneGeo = new THREE.PlaneGeometry(0.9, 0.9);
    const modelsMeshMap = [];

    function buildEmojiTexture(emoji) {
        const c = document.createElement('canvas'); c.width = 128; c.height = 128;
        const cx = c.getContext('2d'); cx.font = "84px serif"; cx.textAlign = "center"; cx.textBaseline = "middle"; cx.fillText(emoji, 64, 68);
        return new THREE.CanvasTexture(c);
    }

    catalogKeys.forEach((key, index) => {
        const itemGroup = new THREE.Group();
        const labelTex = textureLoader.load(catalog[key].canImg);
        const canMat = new THREE.MeshStandardMaterial({ map: labelTex, transparent: true, alphaTest: 0.05, roughness: 0.2, metalness: 0.8 });
        itemGroup.add(new THREE.Mesh(productCanGeo, canMat));

        catalog[key].fragments.forEach((emoji, fIdx) => {
            const pMat = new THREE.MeshStandardMaterial({ map: buildEmojiTexture(emoji), transparent: true, alphaTest: 0.15, depthWrite: true, depthTest: true, side: THREE.DoubleSide });
            const pMesh = new THREE.Mesh(slicePlaneGeo, pMat);
            pMesh.position.set((fIdx < 2 ? -1 : 1) * (2.2 + Math.random() * 1.8), (Math.random() - 0.5) * 4.8, fIdx < 2 ? -1.2 : 1.5);
            pMesh.userData = { driftVelocity: 0.5 + Math.random(), sineSeed: Math.random() * 10 };
            itemGroup.add(pMesh);
        });

        itemGroup.position.x = (index * 15) - (catalog[activeKey].index * 15);
        globalGroupTrack.add(itemGroup);
        modelsMeshMap.push(itemGroup);
    });

    /* ---- PARTICLES ---- */
    const pointsCount = 280;
    const particleGeometry = new THREE.BufferGeometry();
    const posMatrix = new Float32Array(pointsCount * 3);
    const sinusOffsets = new Float32Array(pointsCount);
    for (let i = 0; i < pointsCount; i++) {
        posMatrix[i*3]   = (Math.random()-0.5)*45;
        posMatrix[i*3+1] = (Math.random()-0.5)*25;
        posMatrix[i*3+2] = -6 - Math.random()*6;
        sinusOffsets[i]  = Math.random() * Math.PI * 2;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posMatrix, 3));

    const dotCanvas = document.createElement('canvas'); dotCanvas.width = 64; dotCanvas.height = 64;
    const dotCtx = dotCanvas.getContext('2d');
    const dotGrad = dotCtx.createRadialGradient(32,32,0,32,32,32);
    dotGrad.addColorStop(0,'rgba(255,255,255,1)'); dotGrad.addColorStop(1,'rgba(255,255,255,0)');
    dotCtx.fillStyle = dotGrad; dotCtx.fillRect(0,0,64,64);

    const particlePointsMaterial = new THREE.PointsMaterial({ size: 0.35, map: new THREE.CanvasTexture(dotCanvas), color: catalog.plasma.glow, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending, depthWrite: false });
    const volumetricParticlesSystem = new THREE.Points(particleGeometry, particlePointsMaterial);
    scene.add(volumetricParticlesSystem);

    /* ---- MOUSE PARALLAX ---- */
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 1024) return;
        mouseX = (e.clientX - window.innerWidth/2) * 0.015;
        mouseY = (e.clientY - window.innerHeight/2) * 0.015;
    });

    /* ---- RENDER LOOP ---- */
    const runClock = new THREE.Clock();
    function runRenderLoop() {
        requestAnimationFrame(runRenderLoop);
        const t = runClock.getElapsedTime();
        modelsMeshMap.forEach((group, id) => {
            group.position.y = Math.sin(t * 1.4 + id) * 0.15;
            group.children.forEach((child, cIdx) => {
                if (cIdx > 0) {
                    child.rotation.z += 0.01 * child.userData.driftVelocity;
                    child.position.y += Math.sin(t * 2 + child.userData.sineSeed) * 0.0025;
                }
            });
        });
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
        const arr = volumetricParticlesSystem.geometry.attributes.position.array;
        for (let i = 0; i < pointsCount; i++) { arr[i*3+1] += Math.sin(t + sinusOffsets[i]) * 0.012; }
        volumetricParticlesSystem.geometry.attributes.position.needsUpdate = true;
        volumetricParticlesSystem.rotation.z += 0.0003;
        renderer.render(scene, camera);
    }
    runRenderLoop();

    /* ---- SLIDE ENGINE ---- */
    window.executeSlideEngine = function(targetKey) {
        if (stateLock || targetKey === activeKey) return;
        stateLock = true;
        clearTimeout(autoplayTimer);
        const incoming = catalog[targetKey];

        // Update nav buttons
        document.querySelectorAll('#nav-triggers-group button').forEach(btn => {
            btn.style.color = "#71717a"; btn.style.fontWeight = "400"; btn.style.borderBottom = "2px solid transparent";
        });
        const activeBtn = document.getElementById('btn-' + targetKey);
        if (activeBtn) { activeBtn.style.color = "#ffffff"; activeBtn.style.fontWeight = "700"; activeBtn.style.borderBottom = "2px solid " + incoming.accent; }

        // Background glow
        const fluidBg = document.getElementById('hero-fluid-bg');
        if (fluidBg) fluidBg.style.background = "radial-gradient(circle at center, " + incoming.opacityGlow + " 0%, #030304 70%)";

        // Three.js color changes
        const targetColorObj = new THREE.Color(incoming.glow);
        gsap.to(sceneSpotlight.color, { r: targetColorObj.r, g: targetColorObj.g, b: targetColorObj.b, duration: 1.0 });
        gsap.to(particlePointsMaterial.color, { r: targetColorObj.r, g: targetColorObj.g, b: targetColorObj.b, duration: 1.0 });

        const tl = gsap.timeline({ onComplete: () => { activeKey = targetKey; stateLock = false; triggerAutoplayLoop(); } });

        tl.to(['#wt-mask','#sl-title','#sl-tagline','#sl-desc','#sl-ingredients'], { opacity: 0, y: -15, duration: 0.35, stagger: 0.015, ease: "power2.in" });

        tl.call(() => {
            // Shift can tracks
            modelsMeshMap.forEach((group, index) => {
                gsap.to(group.position, { x: (index * 15) - (incoming.index * 15), duration: 1.1, ease: "power4.inOut" });
                gsap.to(group.children[0].material, { opacity: index === incoming.index ? 1 : 0, duration: 0.6 });
                group.children.forEach((child, cIdx) => { if (cIdx > 0) gsap.to(child.material, { opacity: index === incoming.index ? 0.95 : 0, duration: 0.5 }); });
            });

            // Update HTML text
            const wtMask = document.getElementById('wt-mask');
            const slTitle = document.getElementById('sl-title');
            const slTagline = document.getElementById('sl-tagline');
            const slDesc = document.getElementById('sl-desc');
            const slIngredients = document.getElementById('sl-ingredients');
            const arAccent = document.getElementById('ar-accent');

            if (wtMask) wtMask.innerText = incoming.name;
            if (slTitle) slTitle.innerText = incoming.title;
            if (slTagline) { slTagline.innerText = incoming.tagline; slTagline.style.color = incoming.accent; }
            if (slDesc) slDesc.innerText = incoming.desc;
            if (slIngredients) slIngredients.innerText = incoming.ingredients;
            if (arAccent) arAccent.style.color = incoming.accent;

            gsap.set(['#wt-mask','#sl-title','#sl-tagline','#sl-desc','#sl-ingredients'], { y: 15 });
        });

        tl.to(['#wt-mask','#sl-title','#sl-tagline','#sl-desc','#sl-ingredients'], { opacity: 1, y: 0, duration: 0.55, stagger: 0.02, ease: "power3.out" });
    };

    /* ---- ARROW NAV ---- */
    window.navigateSlide = function(direction) {
        let idx = catalogKeys.indexOf(activeKey);
        if (direction === 'next') { idx = (idx + 1) % catalogKeys.length; }
        else { idx = (idx - 1 + catalogKeys.length) % catalogKeys.length; }
        executeSlideEngine(catalogKeys[idx]);
    };

    function triggerAutoplayLoop() { autoplayTimer = setTimeout(() => { navigateSlide('next'); }, 6000); }
    triggerAutoplayLoop();

    /* ---- SCROLL REVEAL ---- */
    (function() {
        const io = new IntersectionObserver(entries => entries.forEach(en => {
            if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
        }), { threshold: 0.12 });
        document.querySelectorAll('.cp-reveal').forEach(el => io.observe(el));
    }());

    /* ---- RESIZE ---- */
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
</script>
'@

# Insert at position 1855 (0-indexed: 1854)
$insertAt = 1854
$finalOut = $out[0..($insertAt-1)] + $newScript.Split("`n") + $out[$insertAt..($out.Count-1)]
$finalOut | Set-Content $file -Encoding UTF8
Write-Host "Done. New line count: $($finalOut.Count)"
