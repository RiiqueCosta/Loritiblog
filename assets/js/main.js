const phoneNumber = '5511985258655';

function sendToWhatsApp(text){
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function initQuickActions(){
  document.querySelectorAll('[data-wa-message]').forEach((btn)=>{
    btn.addEventListener('click', ()=> sendToWhatsApp(btn.dataset.waMessage));
  });
}

function initContactForm(){
  const form = document.getElementById('leadForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = form.querySelector('[name=name]').value.trim();
    const phone = form.querySelector('[name=phone]').value.trim();
    const service = form.querySelector('[name=service]').value;
    const neighborhood = form.querySelector('[name=neighborhood]').value.trim();
    const message = form.querySelector('[name=message]').value.trim();
    const text = `Olá, meu nome é ${name}.%0ATelefone: ${phone}%0AServiço: ${service}%0ABairro/Cidade: ${neighborhood}%0ADetalhes: ${message}`;
    sendToWhatsApp(decodeURIComponent(text));
  });
}

function initChatWidget(){
  const widget = document.getElementById('chatWidget');
  if(!widget) return;
  const closeBtn = document.getElementById('closeChat');
  const restartBtn = document.getElementById('restartChat');
  const step1 = document.getElementById('chatStep1');
  const step2 = document.getElementById('chatStep2');
  const result = document.getElementById('chatResult');
  let selectedService = '';

  closeBtn?.addEventListener('click', ()=> widget.classList.add('hidden'));
  restartBtn?.addEventListener('click', ()=>{
    selectedService = '';
    step1.classList.remove('hidden');
    step2.classList.add('hidden');
    result.classList.add('hidden');
  });

  widget.querySelectorAll('[data-service]').forEach((btn)=>{
    btn.addEventListener('click', ()=>{
      selectedService = btn.dataset.service;
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    });
  });

  widget.querySelectorAll('[data-urgency]').forEach((btn)=>{
    btn.addEventListener('click', ()=>{
      const urgency = btn.dataset.urgency;
      step2.classList.add('hidden');
      result.classList.remove('hidden');
      const textEl = document.getElementById('chatSummary');
      const message = `Olá, preciso de atendimento para ${selectedService}. Urgência: ${urgency}. Gostaria de um orçamento.`;
      textEl.textContent = `Triagem pronta: ${selectedService} | ${urgency}.`;
      document.getElementById('chatGoWhatsApp').onclick = ()=> sendToWhatsApp(message);
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  initQuickActions();
  initContactForm();
  initChatWidget();
  initMobileHeader();
});


function initMobileHeader(){
  const topbar = document.querySelector('.topbar');
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if(!topbar) return;

  if(toggle && navLinks){
    toggle.addEventListener('click', ()=>{
      const isOpen = navLinks.classList.toggle('is-open');
      toggle.classList.toggle('is-open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link=>{
      link.addEventListener('click', ()=>{
        navLinks.classList.remove('is-open');
        toggle.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  let lastY = window.scrollY || 0;
  window.addEventListener('scroll', ()=>{
    if(window.innerWidth > 760) return;
    const currentY = window.scrollY || 0;
    const menuOpen = navLinks && navLinks.classList.contains('is-open');

    if(menuOpen || currentY < 30 || currentY < lastY){
      topbar.classList.remove('is-hidden');
    }else if(currentY > lastY && currentY > 80){
      topbar.classList.add('is-hidden');
    }
    lastY = currentY;
  }, {passive:true});

  window.addEventListener('resize', ()=>{
    if(window.innerWidth > 760 && navLinks && toggle){
      navLinks.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      topbar.classList.remove('is-hidden');
    }
  });
}
