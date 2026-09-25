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

export function mountThermometer(root) {
  if (!root) return () => {};
  mounted.get(root)?.();

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

  const scrollLog = () => {
    log.scrollTop = log.scrollHeight;
  };

  const message = (text, role = 'bot') => {
    const bubble = document.createElement('div');
    bubble.className = `minoda-chat-message is-${role}`;
    const content = document.createElement('p');
    content.textContent = text;
    bubble.append(content);
    log.append(bubble);
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
      `Pergunta ${questionIndex + 1} de 5`;
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
        const mod = await import('/assets/jspdf.umd.min.js');
        jsPDFClass = mod?.jsPDF || window.jspdf?.jsPDF;
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
      doc.text('Minoda Consultoria · minodaconsultoria.com.br · WhatsApp: (11) 96892-0901', 20, 281);

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
    if (mode === 'demo') restartDemo();
  };

  // Event Listeners
  listen(start, 'click', () => begin());

  listen(form, 'submit', event => {
    event.preventDefault();
    handleSend();
  });

  if (sendBtn) {
    listen(sendBtn, 'click', event => {
      event.preventDefault();
      handleSend();
    });
  }

  listen(input, 'keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  });

  listen(controls, 'click', event => {
    const el = event.target.closest('[data-chat-action]');
    if (!el || busy) return;
    const action = el.dataset.chatAction;
    if (action === 'begin') begin();
    if (action === 'skip') submitProfile('');
    if (action === 'download') download();
    if (action === 'answer' && mode === 'questions') {
      const val = el.dataset.value;
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
    observer.disconnect();
    controller.abort();
    mounted.delete(root);
  };
  mounted.set(root, cleanup);
  return cleanup;
}
