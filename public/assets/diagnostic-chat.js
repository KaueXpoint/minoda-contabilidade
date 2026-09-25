const QUESTIONS = [
  ['Você sabe quanto dinheiro sua empresa tem disponível em caixa agora?', 'Visibilidade de caixa'],
  ['Suas contas são pagas no prazo, sem lembretes de última hora ou juros por atraso?', 'Contas a pagar em dia'],
  ['Você sabe quem te deve, quanto e há quanto tempo?', 'Controle de recebíveis'],
  ['O saldo do extrato bate com seu controle, sem surpresas no fim do mês?', 'Conciliação bancária'],
  ['Você sabe quanto pode retirar de pró-labore sem comprometer o caixa?', 'Pró-labore equilibrado']
];

const PROFILE = [
  { key: 'name', question: 'Primeiro, como você se chama?', placeholder: 'Seu nome', autocomplete: 'given-name' },
  { key: 'company', question: name => `Prazer, ${name}! Qual é o nome da sua empresa?`, placeholder: 'Nome da empresa', autocomplete: 'organization' },
  { key: 'segment', question: company => `Em qual segmento a ${company} atua?`, placeholder: 'Ex.: comércio, tecnologia, serviços', autocomplete: 'off' },
  { key: 'cnpj', question: () => 'Quer incluir o CNPJ no relatório? Você também pode pular.', placeholder: 'CNPJ (opcional)', autocomplete: 'off', optional: true },
  { key: 'contact', question: () => 'Qual é o melhor telefone ou e-mail para contato? É opcional.', placeholder: 'WhatsApp ou e-mail (opcional)', autocomplete: 'off', optional: true }
];

const ARROW_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10M7 17 17 7"/></svg>';

const DEMO = [
  ['bot', 'Olá! Sou o assistente da Minoda.'],
  ['bot', 'Vamos olhar para o financeiro do seu negócio?'],
  ['user', 'Quero entender por onde começar.'],
  ['bot', 'Você sabe quanto tem disponível em caixa hoje?'],
  ['user', 'Ainda não tenho essa clareza.'],
  ['bot', 'Esse é um ótimo ponto de partida. Em 5 perguntas, encontramos os pontos que merecem atenção!']
];

const mounted = new WeakMap();

export function setupSectionAnimations() {
  if (typeof window === 'undefined') return;
  let active = true;
  let animationContext;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const runAnimations = (gsap, ScrollTrigger) => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Diagnóstico Financeiro Section
    const diagSection = document.getElementById('termometro-financeiro');
    if (diagSection) {
      const copy = diagSection.querySelector('.minoda-diagnostic-copy');
      const lines = diagSection.querySelectorAll('.minoda-diagnostic-copy .minoda-masked-line > span');
      const eyebrow = diagSection.querySelector('.minoda-diagnostic-copy .eyebrow');
      const otherCopy = diagSection.querySelectorAll('.minoda-diagnostic-description, .minoda-diagnostic-start, .minoda-diagnostic-facts, .minoda-diagnostic-disclaimer');
      const phoneStage = diagSection.querySelector('.minoda-phone-stage');

      if (prefersReduced) {
        if (lines.length) gsap.set(lines, { y: '0%' });
        if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
        if (otherCopy.length) gsap.set(otherCopy, { opacity: 1, y: 0 });
        if (phoneStage) gsap.set(phoneStage, { opacity: 1, y: 0, scale: 1 });
      } else {
        if (eyebrow) {
          gsap.fromTo(eyebrow,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
              scrollTrigger: { trigger: copy || diagSection, start: 'top 85%', once: true }
            }
          );
        }
        if (lines.length) {
          gsap.fromTo(lines, { y: '110%' }, {
            y: '0%',
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: copy || diagSection, start: 'top 85%', once: true }
          });
        }
        if (otherCopy.length) {
          gsap.fromTo(otherCopy,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.09, delay: 0.15, ease: 'power3.out',
              scrollTrigger: { trigger: copy || diagSection, start: 'top 85%', once: true }
            }
          );
        }
        if (phoneStage) {
          gsap.fromTo(phoneStage,
            { opacity: 0, y: 35, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.95, delay: 0.15, ease: 'power3.out',
              scrollTrigger: { trigger: phoneStage, start: 'top 85%', once: true }
            }
          );
        }
      }
    }

    // 2. Gestão Financeira (Checkout) Section
    const checkoutSection = document.getElementById('gestao-financeira');
    if (checkoutSection) {
      const grid = checkoutSection.querySelector('.minoda-checkout-grid');
      const eyebrow = checkoutSection.querySelector('.eyebrow');
      const lines = checkoutSection.querySelectorAll('.minoda-masked-line > span');
      const action = checkoutSection.querySelector('.minoda-checkout-action');

      if (prefersReduced) {
        if (lines.length) gsap.set(lines, { y: '0%' });
        if (eyebrow) gsap.set(eyebrow, { opacity: 1, y: 0 });
        if (action) gsap.set(action, { opacity: 1, y: 0 });
      } else {
        if (eyebrow) {
          gsap.fromTo(eyebrow,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
              scrollTrigger: { trigger: grid || checkoutSection, start: 'top 85%', once: true }
            }
          );
        }
        if (lines.length) {
          gsap.fromTo(lines, { y: '110%' }, {
            y: '0%',
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: grid || checkoutSection, start: 'top 85%', once: true }
          });
        }
        if (action) {
          gsap.fromTo(action,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.8, delay: 0.15, ease: 'power3.out',
              scrollTrigger: { trigger: grid || checkoutSection, start: 'top 85%', once: true }
            }
          );
        }
      }
    }
  };

  Promise.all([
    import('/js/gsap.js'),
    import('/js/scroll-trigger.js')
  ]).then(([{ gsap }, { ScrollTrigger }]) => {
    if (active) animationContext = gsap.context(() => runAnimations(gsap, ScrollTrigger));
  }).catch(err => {
    if (!active) return;
    console.warn('GSAP reveal animations fallback:', err);
    document.querySelectorAll('.minoda-masked-line > span').forEach(s => {
      s.style.transform = 'translateY(0%)';
    });
  });
  return () => { active = false; animationContext?.revert(); };
}

export function mountThermometer(root) {
  if (!root) return () => {};
  mounted.get(root)?.();

  // Run GSAP ScrollTrigger reveal animations for these sections
  const cleanupAnimations = setupSectionAnimations();

  const find = name => root.querySelector(`[data-chat-${name}]`);
  const log = find('log');
  const form = find('composer');
  const input = form?.querySelector('input');
  const sendBtn = form?.querySelector('button[type="submit"]');
  const controls = find('controls');
  const start = find('start');
  const label = start?.querySelector('[data-chat-start-label]');
  const phone = find('phone');
  const status = find('status');
  const progress = find('progress');
  const progressLabel = find('progress-label');
  const count = find('progress-count');
  const error = find('error');
  const reset = find('reset');
  const demoToggle = find('demo-toggle');

  if (!log || !input || !start || !controls) return () => {};

  const controller = new AbortController();
  const listen = (target, type, callback) => target?.addEventListener(type, callback, { signal: controller.signal });
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const timers = new Set();

  let mode = 'demo';
  let profileIndex = 0;
  let questionIndex = 0;
  let busy = false;
  let profile = {};
  let answers = [];
  let visible = false;
  let demoPaused = false;
  let demoIndex = 0;

  const later = (callback, delay) => {
    const id = setTimeout(() => {
      timers.delete(id);
      callback();
    }, delay);
    timers.add(id);
    return id;
  };

  const cancelPending = () => {
    timers.forEach(clearTimeout);
    timers.clear();
    log.querySelectorAll('.is-typing').forEach(el => el.remove());
  };

  const updateMessageFading = () => {
    const bubbles = [...log.querySelectorAll('.minoda-chat-message:not(.is-typing)')];
    const total = bubbles.length;
    bubbles.forEach((b, idx) => {
      const distFromEnd = total - 1 - idx;
      if (distFromEnd >= 3) {
        b.classList.add('is-faded');
      } else {
        b.classList.remove('is-faded');
      }
      if (distFromEnd >= 5) {
        b.classList.add('is-hidden');
      } else {
        b.classList.remove('is-hidden');
      }
    });
  };

  const scrollLog = (instant = false) => {
    requestAnimationFrame(() => {
      log.scrollTo({
        top: log.scrollHeight,
        behavior: instant || reduced.matches ? 'instant' : 'smooth'
      });
    });
  };

  const message = (text, role = 'bot') => {
    const bubble = document.createElement('div');
    bubble.className = `minoda-chat-message is-${role}`;
    const content = document.createElement('p');
    content.textContent = text;
    bubble.append(content);
    log.append(bubble);
    updateMessageFading();
    scrollLog();
  };

  const typing = () => {
    const bubble = document.createElement('div');
    bubble.className = 'minoda-chat-message is-bot is-typing';
    bubble.innerHTML = '<p aria-label="Assistente digitando"><i></i><i></i><i></i></p>';
    log.append(bubble);
    scrollLog();
    return bubble;
  };

  const updateProgress = () => {
    if (!progress || !count || !progressLabel) return;
    const answered = answers.length;
    const pct = mode === 'result' ? 1 : mode === 'questions' ? answered / QUESTIONS.length : 0;
    progress.style.transform = `scaleX(${pct})`;
    count.textContent = mode === 'questions' || mode === 'result' ? `${answered} / 5` : '0 / 5';
    progressLabel.textContent =
      mode === 'demo' ? 'Demonstração' :
      mode === 'profile' ? 'Identificação' :
      mode === 'result' ? 'Diagnóstico concluído' :
      `Pergunta ${Math.min(questionIndex + 1, QUESTIONS.length)} de 5`;
  };

  const button = (text, action, value) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.textContent = text;
    el.dataset.chatAction = action;
    if (value) el.dataset.value = value;
    controls.append(el);
    return el;
  };

  const setInput = field => {
    form.hidden = false;
    input.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
    input.value = '';
    input.placeholder = field.placeholder;
    input.autocomplete = field.autocomplete;
    input.setAttribute('aria-label', field.placeholder);
    input.inputMode = field.key === 'cnpj' ? 'numeric' : 'text';
    const labelEl = form.querySelector('label');
    if (labelEl) labelEl.textContent = field.placeholder;
    input.focus({ preventScroll: true });
  };

  const showPrompt = () => {
    controls.replaceChildren();
    if (error) error.textContent = '';
    busy = false;

    if (mode === 'profile') {
      const field = PROFILE[profileIndex];
      const qText = typeof field.question === 'function'
        ? field.question(profile.company || profile.name || 'sua empresa')
        : field.question;
      message(qText);
      setInput(field);
      if (field.optional) {
        button('Pular esta etapa', 'skip');
      }
    } else if (mode === 'questions') {
      form.hidden = true;
      message(QUESTIONS[questionIndex][0]);
      button('Sim', 'answer', 'sim');
      button('Ainda não', 'answer', 'nao');
    }
    updateProgress();
    scrollLog();
  };

  const respond = callback => {
    busy = true;
    if (sendBtn) sendBtn.disabled = true;
    input.disabled = true;
    controls.replaceChildren();
    const indicator = typing();
    later(() => {
      indicator.remove();
      busy = false;
      callback();
    }, reduced.matches ? 0 : 380);
  };

  const begin = (focus = true) => {
    if (mode !== 'demo') {
      if (focus && !form.hidden) input.focus({ preventScroll: true });
      return;
    }
    cancelPending();
    mode = 'profile';
    profileIndex = 0;
    questionIndex = 0;
    answers = [];
    profile = {};
    busy = false;

    // Clear demo messages cleanly
    log.replaceChildren();
    log.setAttribute('aria-live', 'polite');
    if (status) status.textContent = 'Diagnóstico ativo';
    if (demoToggle) demoToggle.hidden = true;
    if (label) label.textContent = 'Continuar diagnóstico';
    phone.classList.add('is-active');
    if (reset) reset.hidden = false;

    message('Olá! Vou te guiar pelo diagnóstico financeiro da sua empresa.');
    showPrompt();

    if (focus) {
      phone.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'center' });
      input.focus({ preventScroll: true });
    }
  };

  const submitProfile = value => {
    if (mode !== 'profile' || busy) return;
    const field = PROFILE[profileIndex];

    if (!value && !field.optional) {
      if (error) error.textContent = 'Digite sua resposta para continuar.';
      input.focus({ preventScroll: true });
      return;
    }

    if (error) error.textContent = '';
    profile[field.key] = value;
    message(value || 'Prefiro não informar', 'user');
    input.value = '';
    profileIndex++;

    if (profileIndex >= PROFILE.length) {
      mode = 'questions';
    }
    respond(showPrompt);
  };

  const handleSend = () => {
    const text = input.value.trim();
    if (mode === 'demo') {
      begin(false);
      if (text) submitProfile(text);
    } else if (mode === 'profile') {
      submitProfile(text);
    }
  };

  const finish = () => {
    mode = 'result';
    form.hidden = true;
    controls.replaceChildren();
    const score = answers.filter(a => a === 'sim').length * 20;
    const classification = ['Emergencial', 'Crítica', 'Vulnerável', 'Em atenção', 'Estável', 'Sólida'][score / 20];
    const clientName = profile.name || 'Empresário(a)';

    message(`${clientName}, seu diagnóstico resultou em ${score}% — ${classification}.`);

    const attention = QUESTIONS.filter((_, idx) => answers[idx] !== 'sim').map(q => q[1].toLowerCase());
    if (attention.length > 0) {
      message(`Pontos prioritários para ajuste: ${attention.join(', ')}.`);
    } else {
      message('Excelente! Todos os cinco pilares avaliados estão sob controle.');
    }

    button('Baixar relatório PDF', 'download');

    const whatsappBtn = document.createElement('a');
    whatsappBtn.className = 'minoda-chat-whatsapp';
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener noreferrer';
    const msg = `Olá! Sou ${profile.name || ''}, da empresa ${profile.company || ''}. Fiz o diagnóstico financeiro da Minoda e meu resultado foi ${score}% (${classification}). Gostaria de conversar com um consultor.`;
    whatsappBtn.href = `https://wa.me/5511968920901?text=${encodeURIComponent(msg)}`;
    whatsappBtn.innerHTML = `Falar com consultor ${ARROW_SVG}`;
    controls.append(whatsappBtn);

    updateProgress();
    scrollLog();
  };

  const download = async () => {
    try {
      let jsPDFClass = window.jspdf?.jsPDF;
      if (!jsPDFClass) {
        if (!window.jspdf) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = '/assets/jspdf.umd.min.js';
            s.onload = resolve;
            s.onerror = () => reject(new Error('Erro ao carregar jsPDF'));
            document.head.appendChild(s);
          });
        }
        jsPDFClass = window.jspdf?.jsPDF;
      }
      if (!jsPDFClass) throw new Error('jsPDF indisponível');

      const doc = new jsPDFClass();
      const score = answers.filter(a => a === 'sim').length * 20;
      const classification = ['Emergencial', 'Crítica', 'Vulnerável', 'Em atenção', 'Estável', 'Sólida'][score / 20];

      // Header
      doc.setFillColor(8, 8, 8);
      doc.rect(0, 0, 210, 36, 'F');
      doc.setTextColor(245, 245, 245);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('MINODA CONSULTORIA', 20, 20);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Diagnóstico de Saúde Financeira', 20, 28);

      // Info Block
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('Dados da Empresa', 20, 50);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Empresa: ${profile.company || 'Não informada'}`, 20, 58);
      doc.text(`Responsável: ${profile.name || 'Não informado'}`, 20, 65);
      doc.text(`Segmento: ${profile.segment || 'Não informado'}`, 20, 72);
      if (profile.cnpj) doc.text(`CNPJ: ${profile.cnpj}`, 20, 79);

      // Score Box
      doc.setFillColor(242, 242, 242);
      doc.roundedRect(20, 88, 170, 24, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`Índice Financeiro: ${score}%  —  Situação: ${classification}`, 26, 103);

      // Questions breakdown
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Avaliação dos Pilares', 20, 126);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      let y = 136;
      QUESTIONS.forEach((q, i) => {
        const isOk = answers[i] === 'sim';
        const statusText = isOk ? '[ OK ] Sim' : '[ ATENÇÃO ] Ainda não';
        doc.setFont('helvetica', 'bold');
        doc.text(`${i + 1}. ${q[1]}:`, 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(statusText, 80, y);
        y += 8;
        const wrapped = doc.splitTextToSize(q[0], 165);
        doc.setTextColor(90, 90, 90);
        doc.text(wrapped, 24, y);
        doc.setTextColor(30, 30, 30);
        y += wrapped.length * 5 + 4;
      });

      // Disclaimer
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('Diagnóstico baseado em autoavaliação. Não substitui uma auditoria e consultoria contábil individualizada.', 20, 275);
      doc.text('Minoda Contabilidade · minodacontabilidade.com.br · WhatsApp: (11) 96892-0901', 20, 281);

      doc.save(`diagnostico-minoda-${(profile.company || 'empresa').toLowerCase().replace(/\s+/g, '-')}.pdf`);
    } catch (err) {
      console.error(err);
      if (error) error.textContent = 'Não foi possível gerar o PDF agora. Fale diretamente com nosso consultor.';
    }
  };

  const demoStep = () => {
    if (mode !== 'demo' || !visible || document.hidden || demoPaused || reduced.matches) return;
    if (demoIndex >= DEMO.length) {
      later(() => {
        log.replaceChildren();
        demoIndex = 0;
        demoStep();
      }, 3500);
      return;
    }
    const [role, text] = DEMO[demoIndex++];
    const indicator = role === 'bot' ? typing() : null;
    later(() => {
      indicator?.remove();
      message(text, role);
      later(demoStep, 1800);
    }, role === 'bot' ? 850 : 400);
  };

  const restartDemo = () => {
    cancelPending();
    log.replaceChildren();
    demoIndex = 0;
    if (reduced.matches || demoPaused) {
      DEMO.slice(0, 3).forEach(([role, text]) => message(text, role));
      return;
    }
    demoStep();
  };

  const syncDemo = () => {
    if (mode !== 'demo') return;
    if (visible && !document.hidden && !demoPaused && !reduced.matches) {
      if (timers.size === 0) demoStep();
    } else {
      cancelPending();
    }
  };

  // Listeners
  listen(start, 'click', () => begin(true));

  listen(form, 'submit', e => {
    e.preventDefault();
    handleSend();
  });

  listen(input, 'keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  });

  listen(controls, 'click', e => {
    const btn = e.target.closest('button');
    if (!btn || busy) return;
    const action = btn.dataset.chatAction;
    const val = btn.dataset.value;

    if (action === 'begin') {
      begin(true);
    } else if (action === 'skip') {
      submitProfile('');
    } else if (action === 'download') {
      download();
    } else if (action === 'answer' && val) {
      answers.push(val);
      message(val === 'sim' ? 'Sim' : 'Ainda não', 'user');
      questionIndex++;
      respond(questionIndex < QUESTIONS.length ? showPrompt : finish);
      updateProgress();
    }
  });

  listen(reset, 'click', () => {
    cancelPending();
    mode = 'demo';
    busy = false;
    if (error) error.textContent = '';
    if (demoToggle) demoToggle.hidden = false;
    profileIndex = 0;
    questionIndex = 0;
    answers = [];
    profile = {};
    phone.classList.remove('is-active');
    if (status) status.textContent = 'Conversa demonstrativa';
    if (label) label.textContent = 'Começar meu diagnóstico';
    if (reset) reset.hidden = true;
    form.hidden = true;
    controls.replaceChildren();
    button('Iniciar meu diagnóstico', 'begin');
    log.setAttribute('aria-live', 'off');
    updateProgress();
    restartDemo();
  });

  if (demoToggle) {
    listen(demoToggle, 'click', () => {
      demoPaused = !demoPaused;
      demoToggle.textContent = demoPaused ? 'Reproduzir demonstração' : 'Pausar demonstração';
      syncDemo();
    });
  }

  listen(document, 'visibilitychange', syncDemo);
  listen(reduced, 'change', syncDemo);

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncDemo();
  }, { threshold: 0.2 });
  observer.observe(phone);

  // Initial State: Demo Mode
  form.hidden = true;
  controls.replaceChildren();
  button('Iniciar meu diagnóstico', 'begin');
  log.setAttribute('aria-live', 'off');
  if (reset) reset.hidden = true;
  updateProgress();

  const cleanup = () => {
    cancelPending();
    cleanupAnimations?.();
    observer.disconnect();
    controller.abort();
    mounted.delete(root);
  };
  mounted.set(root, cleanup);
  return cleanup;
}
