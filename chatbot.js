(function () {

  /* ─────────────────────────────────────────
     MOBILE-SAFE DESIGN:
     • FAB: bottom-right, smaller on mobile
     • Panel: opens upward, max-height capped
     • Hides FAB when contact popup is open
     • z-index below lightbox & contact popup
  ───────────────────────────────────────── */

  const css = `
  #cb-btn {
    position:fixed;
    bottom:28px;right:28px;
    z-index:900;
    width:58px;height:58px;border-radius:50%;
    background:linear-gradient(135deg,#3d8c3d,#2a6b2a);
    border:none;cursor:pointer;
    box-shadow:0 6px 28px rgba(61,140,61,.55);
    display:flex;align-items:center;justify-content:center;
    transition:transform .2s,box-shadow .2s,opacity .3s;
    animation:cb-bounce 3s infinite;
    -webkit-tap-highlight-color:transparent;
  }
  #cb-btn.hidden{opacity:0;pointer-events:none}
  #cb-btn:hover{transform:scale(1.1);box-shadow:0 10px 36px rgba(61,140,61,.7)}
  #cb-btn svg{width:26px;height:26px;fill:#fff;transition:opacity .2s}
  #cb-btn .cb-icon-close{display:none}
  #cb-btn.open .cb-icon-chat{display:none}
  #cb-btn.open .cb-icon-close{display:block}
  #cb-btn.open{animation:none}
  @keyframes cb-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

  #cb-badge{
    position:absolute;top:-3px;right:-3px;
    background:#ef4444;color:#fff;
    font-size:.62rem;font-weight:800;
    width:18px;height:18px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    border:2px solid #fff;
    animation:cb-pulse 2s infinite;
  }
  @keyframes cb-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}

  #cb-panel {
    position:fixed;
    bottom:100px;right:28px;
    z-index:899;
    width:340px;
    max-height:min(520px, calc(100vh - 160px));
    background:#0d1b2a;
    border:1px solid rgba(255,255,255,.1);
    border-radius:20px;
    display:flex;flex-direction:column;
    box-shadow:0 24px 64px rgba(0,0,0,.65);
    transform:scale(.88) translateY(16px);opacity:0;
    pointer-events:none;
    transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .25s;
    overflow:hidden;
  }
  #cb-panel.open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}

  #cb-header{
    background:linear-gradient(135deg,#3d8c3d,#2a6b2a);
    padding:14px 16px;
    display:flex;align-items:center;gap:12px;flex-shrink:0;
  }
  .cb-avatar{
    width:40px;height:40px;border-radius:50%;
    background:rgba(255,255,255,.2);border:2px solid rgba(255,255,255,.4);
    display:flex;align-items:center;justify-content:center;flex-shrink:0;
  }
  .cb-avatar svg{width:20px;height:20px;fill:#fff}
  .cb-hinfo{flex:1;min-width:0}
  .cb-hinfo h4{font-size:.92rem;font-weight:800;color:#fff;margin:0 0 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .cb-hinfo p{font-size:.72rem;color:rgba(255,255,255,.85);margin:0;display:flex;align-items:center;gap:4px}
  .cb-dot{width:7px;height:7px;background:#4ade80;border-radius:50%;display:inline-block;flex-shrink:0}
  #cb-close-header{
    background:rgba(255,255,255,.15);border:none;color:#fff;
    width:30px;height:30px;border-radius:50%;cursor:pointer;
    font-size:1rem;display:flex;align-items:center;justify-content:center;
    flex-shrink:0;transition:background .2s;
  }
  #cb-close-header:hover{background:rgba(255,255,255,.3)}

  #cb-messages{
    flex:1;overflow-y:auto;padding:14px;
    display:flex;flex-direction:column;gap:10px;
    scroll-behavior:smooth;min-height:0;
  }
  #cb-messages::-webkit-scrollbar{width:4px}
  #cb-messages::-webkit-scrollbar-thumb{background:rgba(61,140,61,.4);border-radius:2px}

  .cb-msg{display:flex;flex-direction:column;gap:6px;max-width:90%}
  .cb-msg.bot{align-self:flex-start}
  .cb-msg.user{align-self:flex-end}
  .cb-bubble{padding:10px 13px;border-radius:14px;font-size:.85rem;line-height:1.55;font-family:'Inter',sans-serif}
  .cb-msg.bot .cb-bubble{background:#152238;color:#e2e8f0;border-bottom-left-radius:4px;border:1px solid rgba(255,255,255,.07)}
  .cb-msg.user .cb-bubble{background:linear-gradient(135deg,#3d8c3d,#2a6b2a);color:#fff;border-bottom-right-radius:4px}

  .cb-actions{display:flex;flex-direction:column;gap:6px}
  .cb-action-btn{
    display:flex;align-items:center;gap:8px;
    background:rgba(61,140,61,.12);border:1px solid rgba(61,140,61,.3);
    color:#4ade80;padding:9px 13px;border-radius:10px;
    font-size:.8rem;font-weight:700;cursor:pointer;text-decoration:none;
    font-family:'Inter',sans-serif;transition:background .2s;
    -webkit-tap-highlight-color:transparent;
  }
  .cb-action-btn:hover{background:rgba(61,140,61,.25)}
  .cb-action-btn.primary{background:#3d8c3d;color:#fff;border-color:#3d8c3d}
  .cb-action-btn.primary:hover{background:#2a6b2a}
  .cb-action-btn svg{width:15px;height:15px;flex-shrink:0;fill:currentColor}

  .cb-typing{display:flex;align-items:center;gap:5px;padding:10px 14px;background:#152238;border-radius:14px;border-bottom-left-radius:4px;border:1px solid rgba(255,255,255,.07);width:fit-content}
  .cb-typing span{width:7px;height:7px;background:#3d8c3d;border-radius:50%;animation:cb-type 1.2s infinite}
  .cb-typing span:nth-child(2){animation-delay:.2s}
  .cb-typing span:nth-child(3){animation-delay:.4s}
  @keyframes cb-type{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-5px);opacity:1}}

  #cb-faqs{
    padding:8px 10px 6px;border-top:1px solid rgba(255,255,255,.07);
    display:flex;flex-wrap:wrap;gap:5px;flex-shrink:0;
  }
  .cb-faq-btn{
    background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
    color:#94a3b8;padding:5px 11px;border-radius:999px;
    font-size:.74rem;font-weight:600;cursor:pointer;
    font-family:'Inter',sans-serif;transition:all .2s;white-space:nowrap;
    -webkit-tap-highlight-color:transparent;
  }
  .cb-faq-btn:hover{background:rgba(61,140,61,.15);border-color:rgba(61,140,61,.4);color:#4ade80}

  #cb-input-row{
    padding:8px 10px 12px;display:flex;gap:8px;align-items:center;
    flex-shrink:0;border-top:1px solid rgba(255,255,255,.07);
  }
  #cb-input{
    flex:1;background:#152238;border:1px solid rgba(255,255,255,.1);
    color:#fff;padding:9px 13px;border-radius:999px;
    font-size:.85rem;font-family:'Inter',sans-serif;outline:none;
    transition:border-color .2s;
  }
  #cb-input::placeholder{color:#64748b}
  #cb-input:focus{border-color:rgba(61,140,61,.5)}
  #cb-send{
    width:36px;height:36px;border-radius:50%;
    background:#3d8c3d;border:none;cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    flex-shrink:0;transition:background .2s,transform .15s;
  }
  #cb-send:hover{background:#2a6b2a;transform:scale(1.08)}
  #cb-send svg{width:15px;height:15px;fill:#fff}

  /* ── MOBILE SAFE ── */
  @media(max-width:600px){
    #cb-btn{
      width:50px;height:50px;
      bottom:22px;right:16px;
    }
    #cb-btn svg{width:22px;height:22px}
    #cb-panel{
      /* Anchored to right edge, well above the FAB button */
      width:calc(100vw - 32px);
      right:16px;
      bottom:84px;
      /* Never taller than 55% of screen so page content stays usable */
      max-height:min(440px, 55vh);
      border-radius:16px;
    }
    #cb-faqs{
      flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;
      -webkit-overflow-scrolling:touch;padding-bottom:8px;
      scrollbar-width:none;
    }
    #cb-faqs::-webkit-scrollbar{display:none}
    .cb-faq-btn{flex-shrink:0;font-size:.7rem;padding:5px 10px}
    .cb-action-btn{font-size:.78rem;padding:8px 12px}
  }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── CONTENT ── */
  const PHONE    = '9255674018';
  const PHONE_D  = '(925) 567-4018';
  const WA_URL   = `https://wa.me/1${PHONE}`;
  const SMS_URL  = `sms:+1${PHONE}`;

  const contactBtns = [
    { label: '💬 WhatsApp',       href: WA_URL,   cls: 'primary' },
    { label: `📱 Text ${PHONE_D}`, href: SMS_URL,  cls: '' },
  ];

  const faqs = [
    {
      q: '✅ Do you offer free estimates?',
      a: 'Yes! We provide <strong>free on-site estimates</strong> with no obligation. We come to you, assess your project, and give you a detailed quote at zero cost.',
      btns: contactBtns,
    },
    {
      q: '📍 Where do you serve?',
      a: 'We serve the <strong>entire Bay Area</strong> including San Francisco, Oakland, Berkeley, San Jose, Fremont, Hayward, Concord, Walnut Creek, Pleasanton, Dublin, Livermore, Richmond, and more.',
      btns: [{ label: '📍 See all areas', href: '#areas', cls: '' }, ...contactBtns.slice(0,1)],
    },
    {
      q: '💰 How much does it cost?',
      a: 'Cost depends on the project — length of fence, type of wood, terrain, etc. We always give you a <strong>clear, detailed quote before any work starts</strong>. No hidden fees.',
      btns: contactBtns,
    },
    {
      q: '🔧 What services do you offer?',
      a: '✅ Fence Installation\n✅ Fence Repair\n✅ Decks\n✅ Arbors & Pergolas\n✅ Retaining Walls\n✅ Wood Staining\n✅ Power Washing',
      btns: [{ label: '🔍 View all services', href: '#services', cls: '' }, ...contactBtns.slice(0,1)],
    },
    {
      q: '🪵 What materials do you use?',
      a: 'We work with premium <strong>cedar, redwood, and pressure-treated lumber</strong> — materials that look beautiful and hold up to the Bay Area climate for years.',
      btns: contactBtns,
    },
    {
      q: '⏱️ How long does a project take?',
      a: 'It depends on the scope:\n• <strong>Fence repair:</strong> same day\n• <strong>New fence install:</strong> 1–2 days\n• <strong>Deck or arbor:</strong> 2–5 days\n\nWe always give you a timeline before we start.',
      btns: contactBtns,
    },
  ];

  const WELCOME = 'Hi! 👋 I\'m the <strong>Garcia\'s Fencing</strong> assistant.\n\nHow can I help you today?';

  const keywords = [
    { keys: ['free','estimate','quote','free estimate'],        idx: 0 },
    { keys: ['area','where','city','serve','bay area','cover'], idx: 1 },
    { keys: ['price','cost','how much','charge','pricing'],     idx: 2 },
    { keys: ['service','services','offer','what do','fence','deck','arbor','pergola','stain','wash'], idx: 3 },
    { keys: ['wood','material','cedar','redwood','lumber','type of wood'], idx: 4 },
    { keys: ['time','long','take','days','how long','fast'],    idx: 5 },
    { keys: ['hi','hello','hey','good morning','good afternoon','hola'], idx: -1 },
  ];

  /* ── BUILD DOM ── */
  document.body.insertAdjacentHTML('beforeend', `
    <button id="cb-btn" aria-label="Open chat" aria-expanded="false">
      <span id="cb-badge" style="display:none">1</span>
      <svg class="cb-icon-chat" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
      <svg class="cb-icon-close" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <div id="cb-panel" role="dialog" aria-label="Garcia's Fencing Chat" aria-hidden="true">
      <div id="cb-header">
        <div class="cb-avatar">
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
        </div>
        <div class="cb-hinfo">
          <h4>Garcia's Fencing</h4>
          <p><span class="cb-dot"></span> Online · ${PHONE_D}</p>
        </div>
        <button id="cb-close-header" aria-label="Close chat">✕</button>
      </div>

      <div id="cb-messages"></div>

      <div id="cb-faqs">
        ${faqs.map((f, i) => `<button class="cb-faq-btn" data-idx="${i}">${f.q}</button>`).join('')}
      </div>

      <div id="cb-input-row">
        <input id="cb-input" type="text" placeholder="Type your question…" autocomplete="off" maxlength="200" enterkeyhint="send">
        <button id="cb-send" aria-label="Send">
          <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
  `);

  /* ── REFS ── */
  const btn    = document.getElementById('cb-btn');
  const panel  = document.getElementById('cb-panel');
  const msgs   = document.getElementById('cb-messages');
  const input  = document.getElementById('cb-input');
  const sendEl = document.getElementById('cb-send');
  const badge  = document.getElementById('cb-badge');
  const popup  = document.getElementById('contact-popup');

  /* ── HELPERS ── */
  function renderText(t) {
    return t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  function addMsg(role, html, actions) {
    const div = document.createElement('div');
    div.className = `cb-msg ${role}`;
    let inner = `<div class="cb-bubble">${html}</div>`;
    if (actions && actions.length) {
      inner += `<div class="cb-actions">${actions.map(a =>
        `<a href="${a.href}" class="cb-action-btn ${a.cls||''}"
           target="${a.href.startsWith('http')?'_blank':'_self'}"
           rel="noopener">${a.label}</a>`
      ).join('')}</div>`;
    }
    div.innerHTML = inner;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping() {
    const t = document.createElement('div');
    t.className = 'cb-msg bot'; t.id = 'cb-typing-msg';
    t.innerHTML = '<div class="cb-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function removeTyping() {
    const t = document.getElementById('cb-typing-msg');
    if (t) t.remove();
  }

  function botReply(faqIdx) {
    showTyping();
    setTimeout(() => {
      removeTyping();
      if (faqIdx === -1) {
        addMsg('bot', 'Hi! 👋 Feel free to ask me anything about our fencing services, or choose a quick option below:', contactBtns);
      } else {
        const f = faqs[faqIdx];
        addMsg('bot', renderText(f.a), f.btns);
      }
    }, 800);
  }

  function handleInput(text) {
    if (!text.trim()) return;
    addMsg('user', text);
    input.value = '';
    const lower = text.toLowerCase();
    let match = -99;
    for (const rule of keywords) {
      if (rule.keys.some(k => lower.includes(k))) { match = rule.idx; break; }
    }
    if (match === -99) {
      showTyping();
      setTimeout(() => {
        removeTyping();
        addMsg('bot', 'Good question! 😊 Our team can give you the best answer directly:', contactBtns);
      }, 850);
    } else {
      botReply(match);
    }
  }

  /* ── OPEN / CLOSE ── */
  function openChat() {
    panel.classList.add('open');
    btn.classList.add('open');
    btn.setAttribute('aria-expanded','true');
    panel.setAttribute('aria-hidden','false');
    badge.style.display = 'none';
    if (msgs.children.length === 0) {
      setTimeout(() => addMsg('bot', renderText(WELCOME), contactBtns), 350);
    }
    if (window.innerWidth > 600) input.focus();
  }

  function closeChat() {
    panel.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    panel.setAttribute('aria-hidden','true');
  }

  /* ── HIDE FAB when contact popup is open ── */
  const popupObserver = new MutationObserver(() => {
    if (popup && popup.classList.contains('open')) {
      btn.classList.add('hidden');
      closeChat();
    } else {
      btn.classList.remove('hidden');
    }
  });
  if (popup) popupObserver.observe(popup, { attributes: true, attributeFilter: ['class'] });

  /* ── EVENTS ── */
  btn.addEventListener('click', () => {
    panel.classList.contains('open') ? closeChat() : openChat();
  });

  document.getElementById('cb-close-header').addEventListener('click', closeChat);

  document.querySelectorAll('.cb-faq-btn').forEach(b => {
    b.addEventListener('click', () => {
      const idx = parseInt(b.dataset.idx);
      addMsg('user', faqs[idx].q);
      botReply(idx);
    });
  });

  sendEl.addEventListener('click', () => handleInput(input.value));
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleInput(input.value); });

  /* Close panel when clicking outside (desktop) */
  document.addEventListener('click', e => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && !btn.contains(e.target)) {
      closeChat();
    }
  });

  /* Close panel on Escape key */
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeChat(); });

  /* Show badge after 4s */
  setTimeout(() => { badge.style.display = 'flex'; }, 4000);

})();
