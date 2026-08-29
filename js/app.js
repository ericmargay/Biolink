(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const defaults = { avatar: 'jelly', palette: 'lagoon', accent: '#a7ff4f', density: 70, motion: 64, grain: true, cursor: true };
  let settings = { ...defaults, ...JSON.parse(localStorage.getItem('eric-biolink-theme') || '{}') };
  let audio = null;
  let soundOn = false;

  async function loadProfile() {
    try {
      const response = await fetch('data.json', { cache: 'no-store' });
      const data = await response.json();
      $('#profileName').textContent = data.profile.name;
      $('#profileRole').textContent = data.profile.role;
      $('#profileBio').textContent = data.profile.bio;
      $('#socials').innerHTML = (data.socials || []).map(item => `<a href="${safe(item.url)}" ${item.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''} aria-label="${safe(item.label)}">${iconMarkup(item.icon)}</a>`).join('');
      $('#links').innerHTML = data.links.map(link => {
        const tag = link.collection ? 'button' : 'a';
        const attrs = link.collection ? `type="button" data-collection="${safe(link.collection)}"` : `href="${safe(link.url)}" target="_blank" rel="noopener"`;
        return `<${tag} class="link-card" ${attrs}>
          <span class="link-icon">${iconMarkup(link.icon)}</span>
          <span class="link-copy"><span class="kicker">${safe(link.eyebrow)}</span><h3>${safe(link.title)}</h3><p>${safe(link.description)}</p></span>
          <span class="link-arrow" aria-hidden="true">${link.collection ? '+' : '↗'}</span>
        </${tag}>`;
      }).join('');
      bindCollections(data.collections || {});
      bindCardGlow();
    } catch (_) {
      $('#links').innerHTML = '<p>No fue posible cargar los enlaces.</p>';
    }
  }

  function iconMarkup(id) {
    const official = ['website','email','github','x','linkedin','instagram','facebook','youtube','tiktok','discord','telegram','whatsapp','spotify','soundcloud','twitch','bandcamp','medium','substack','paypal','patreon','kofi','amazon','shopify'];
    if (official.includes(id)) return `<svg aria-hidden="true" viewBox="0 0 24 24"><use href="icons/icons.svg#${id}"></use></svg>`;
    const symbols = { education:'⌂', certificate:'✓', document:'▤', spark:'✦', book:'▥', code:'〈/〉' };
    return `<span aria-hidden="true">${symbols[id] || safe(id)}</span>`;
  }

  function bindCollections(collections) {
    const modal = $('#collectionModal'), scrim = $('#scrim');
    const close = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); scrim.classList.remove('open'); };
    $$('[data-collection]').forEach(button => button.addEventListener('click', () => {
      const collection = collections[button.dataset.collection]; if (!collection) return;
      $('#collectionKicker').textContent = collection.kicker || 'Colección'; $('#collectionTitle').textContent = collection.title; $('#collectionIntro').textContent = collection.intro || '';
      $('#collectionGrid').innerHTML = (collection.items || []).map(item => `<a class="collection-item" href="${safe(item.url)}" target="_blank" rel="noopener"><span class="collection-logo">${iconMarkup(item.icon)}</span><span><span class="kicker">${safe(item.meta)}</span><strong>${safe(item.title)}</strong><small>${safe(item.description)}</small></span><i aria-hidden="true">↗</i></a>`).join('');
      modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); scrim.classList.add('open'); $('#closeCollection').focus();
    }));
    $('#closeCollection').addEventListener('click', close);
    scrim.addEventListener('click', () => { if (modal.classList.contains('open')) close(); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape' && modal.classList.contains('open')) close(); });
  }

  function safe(value) {
    return String(value || '').replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
  }

  function hexRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return `${n >> 16},${(n >> 8) & 255},${n & 255}`;
  }

  function applySettings(save = true) {
    const root = document.documentElement;
    root.dataset.palette = settings.palette;
    root.style.setProperty('--accent', settings.accent);
    root.style.setProperty('--accent-rgb', hexRgb(settings.accent));
    root.style.setProperty('--speed', Math.max(.2, settings.motion / 64));
    root.style.setProperty('--density', settings.density / 100);
    $('.grain').classList.toggle('off', !settings.grain);
    $$('.avatar-art').forEach(el => { el.hidden = el.dataset.avatar !== settings.avatar; });
    $$('.avatar-options button').forEach(button => button.classList.toggle('active', button.dataset.avatarChoice === settings.avatar));
    $('#avatarStage').setAttribute('aria-label', `Avatar ${settings.avatar}. Activar o silenciar paisaje sonoro`);
    $('#palette').value = settings.palette; $('#accent').value = settings.accent; $('#density').value = settings.density; $('#motion').value = settings.motion;
    $('#grainToggle').checked = settings.grain; $('#cursorToggle').checked = settings.cursor;
    if (save) localStorage.setItem('eric-biolink-theme', JSON.stringify(settings));
  }

  function bindCustomizer() {
    const panel = $('#customizer'), scrim = $('#scrim');
    const setOpen = open => { panel.classList.toggle('open', open); scrim.classList.toggle('open', open); panel.setAttribute('aria-hidden', !open); if (open) $('#closeCustomizer').focus(); };
    $('#openCustomizer').addEventListener('click', () => setOpen(true));
    $('#closeCustomizer').addEventListener('click', () => setOpen(false));
    scrim.addEventListener('click', () => setOpen(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    $$('.avatar-options button').forEach(button => button.addEventListener('click', () => { settings.avatar = button.dataset.avatarChoice; applySettings(); }));
    $('#palette').addEventListener('change', e => { settings.palette = e.target.value; const accents = { lagoon:'#a7ff4f', ember:'#ff7849', violet:'#bca5ff', paper:'#2d61ff' }; settings.accent = accents[settings.palette]; applySettings(); });
    $('#accent').addEventListener('input', e => { settings.accent = e.target.value; applySettings(); });
    $('#density').addEventListener('input', e => { settings.density = +e.target.value; applySettings(); });
    $('#motion').addEventListener('input', e => { settings.motion = +e.target.value; applySettings(); });
    $('#grainToggle').addEventListener('change', e => { settings.grain = e.target.checked; applySettings(); });
    $('#cursorToggle').addEventListener('change', e => { settings.cursor = e.target.checked; applySettings(); });
    $('#resetSettings').addEventListener('click', () => { settings = { ...defaults }; applySettings(); toast('Diseño original restaurado'); });
  }

  function bindCardGlow() {
    $$('.link-card').forEach(card => card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect(); card.style.setProperty('--card-x', `${e.clientX - rect.left}px`); card.style.setProperty('--card-y', `${e.clientY - rect.top}px`);
    }));
  }

  function initCanvas() {
    const canvas = $('#ambient'), ctx = canvas.getContext('2d');
    let points = [], width = 0, height = 0, mouse = { x: -999, y: -999 };
    function resize() {
      const ratio = Math.min(devicePixelRatio, 2); width = innerWidth; height = innerHeight;
      canvas.width = width * ratio; canvas.height = height * ratio; canvas.style.width = width + 'px'; canvas.style.height = height + 'px'; ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.floor((width * height / 16000) * (settings.density / 70));
      points = Array.from({ length: Math.min(count, 90) }, () => ({ x: Math.random()*width, y: Math.random()*height, r: Math.random()*1.6+.3, vx:(Math.random()-.5)*.18, vy:(Math.random()-.5)*.18 }));
    }
    addEventListener('resize', resize); addEventListener('pointermove', e => { mouse.x=e.clientX; mouse.y=e.clientY; if(settings.cursor){ document.documentElement.style.setProperty('--mx',`${e.clientX}px`); document.documentElement.style.setProperty('--my',`${e.clientY}px`); updateAudio(e.clientX/width,e.clientY/height); }});
    function draw() {
      ctx.clearRect(0,0,width,height); const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim();
      points.forEach((p,i) => { p.x += p.vx*(settings.motion/50); p.y += p.vy*(settings.motion/50); if(p.x<0)p.x=width;if(p.x>width)p.x=0;if(p.y<0)p.y=height;if(p.y>height)p.y=0;
        if(settings.cursor){ const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);if(d<120){p.x+=dx/(d||1)*.5;p.y+=dy/(d||1)*.5;} }
        ctx.beginPath();ctx.fillStyle=`rgba(${accent},${.14+p.r*.08})`;ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
        points.slice(i+1,i+5).forEach(q=>{const d=Math.hypot(p.x-q.x,p.y-q.y);if(d<85){ctx.beginPath();ctx.strokeStyle=`rgba(${accent},${.045*(1-d/85)})`;ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}});
      }); requestAnimationFrame(draw);
    }
    resize(); draw();
  }

  function initAudio() {
    function curve(amount, mode) {
      const samples = 4096, values = new Float32Array(samples);
      for (let i=0; i<samples; i++) {
        const x = i * 2 / (samples - 1) - 1;
        values[i] = mode === 'distortion'
          ? ((1 + amount) * x / (1 + amount * Math.abs(x)))
          : Math.tanh(x * (1 + amount * .55)) / Math.tanh(1 + amount * .55);
      }
      return values;
    }
    async function toggleSound() {
      if (!audio) {
        const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return toast('Audio no disponible');
        const context = new Ctx(), media = new Audio('assets/trtasfiq-cyberpunk-background-music-286116.mp3');
        media.loop = true; media.preload = 'auto';
        const source=context.createMediaElementSource(media),dry=context.createGain(),distortion=context.createWaveShaper(),distortionGain=context.createGain(),saturation=context.createWaveShaper(),saturationGain=context.createGain(),compressor=context.createDynamicsCompressor(),master=context.createGain();
        distortion.curve=curve(42,'distortion');distortion.oversample='4x';saturation.curve=curve(8,'saturation');saturation.oversample='4x';
        dry.gain.value=1;distortionGain.gain.value=0;saturationGain.gain.value=0;master.gain.value=.0001;compressor.threshold.value=-12;compressor.knee.value=18;compressor.ratio.value=5;compressor.attack.value=.004;compressor.release.value=.22;
        source.connect(dry).connect(compressor);source.connect(distortion).connect(distortionGain).connect(compressor);source.connect(saturation).connect(saturationGain).connect(compressor);compressor.connect(master).connect(context.destination);
        audio={context,media,master,dry,distortionGain,saturationGain};
      }
      await audio.context.resume(); soundOn=!soundOn; const now=audio.context.currentTime;audio.master.gain.cancelScheduledValues(now);audio.master.gain.setValueAtTime(Math.max(audio.master.gain.value,.0001),now);
      if(soundOn){await audio.media.play();audio.master.gain.exponentialRampToValueAtTime(.72,now+.45);}else{audio.master.gain.exponentialRampToValueAtTime(.0001,now+.35);setTimeout(()=>{if(!soundOn)audio.media.pause();},380);}
      $('#soundToggle').setAttribute('aria-pressed',soundOn); $('#avatarStage').setAttribute('aria-pressed',soundOn); $('#soundLabel').textContent=soundOn?'Soundtrack activo · toca para silenciar':'Toca el avatar para activar el soundtrack'; toast(soundOn?'Soundtrack interactivo activo':'Soundtrack en pausa');
    }
    $('#soundToggle').addEventListener('click', toggleSound);
    $('#avatarStage').addEventListener('click', toggleSound);
  }
  function updateAudio(x,y){
    if(!audio||!soundOn)return;
    const t=audio.context.currentTime,intensity=Math.max(0,Math.min(1,y)),left=1-Math.max(0,Math.min(1,x)),right=1-left;
    const distortionMix=intensity*Math.pow(left,1.35),saturationMix=intensity*Math.pow(right,1.35),wet=Math.min(.9,distortionMix+saturationMix);
    audio.dry.gain.setTargetAtTime(1-wet*.58,t,.045);audio.distortionGain.gain.setTargetAtTime(distortionMix*1.15,t,.045);audio.saturationGain.gain.setTargetAtTime(saturationMix*1.05,t,.045);
  }
  function toast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),1800);}
  function bindShare(){ $('#shareButton').addEventListener('click',async()=>{try{if(navigator.share)await navigator.share({title:document.title,url:location.href});else{await navigator.clipboard.writeText(location.href);toast('Enlace copiado');}}catch(e){if(e.name!=='AbortError')toast('No fue posible compartir');}}); }
  function bindInfo(){ const messages={cookies:'Esta plantilla no usa cookies.',privacy:'Las preferencias permanecen en tu dispositivo.',report:'Puedes reportar problemas desde GitHub.',about:'Biolink es una plantilla open source y personalizable.'}; $$('[data-info]').forEach(button=>button.addEventListener('click',()=>toast(messages[button.dataset.info]))); }
  function reveal(){const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}}),{threshold:.12});$$('.reveal').forEach(el=>io.observe(el));}
  applySettings(false); bindCustomizer(); initCanvas(); initAudio(); bindShare(); bindInfo(); reveal(); loadProfile(); $('#year').textContent=new Date().getFullYear();
})();
