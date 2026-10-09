/* ==========================================================================
   Michael Martinez Portfolio - Shared JavaScript
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  // 1. Scroll Reveal Animation
  try {
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            io.unobserve(en.target);
          }
        });
      }, { threshold: 0.08 });

      document.querySelectorAll('.sec-head, section .box, .filters, .skill-category, .page-header').forEach(function (el) {
        if (el.getBoundingClientRect().top > window.innerHeight) {
          el.classList.add('reveal-pre');
          io.observe(el);
        }
      });
    }
  } catch (err) {
    console.warn('Scroll reveal error:', err);
  }

  // Helper HTML escape
  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Certificate Modal Viewer (Styled based on style.css)
  function createCertModalElement() {
    var modal = document.createElement('div');
    modal.id = 'certModal';
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'certModalTitle');
    modal.innerHTML =
      '<div class="modal-card cert-modal-card">' +
        '<button type="button" class="modal-close" id="certModalCloseBtn" aria-label="Close certificate viewer">&times;</button>' +
        '<div class="modal-badge-row" style="justify-content:flex-start;margin-bottom:6px;">' +
          '<span class="tag gold" id="certModalTag">Certificate</span>' +
        '</div>' +
        '<h2 id="certModalTitle" class="cert-modal-title"></h2>' +
        '<div id="certModalMeta" class="cert-modal-meta"></div>' +
        '<div id="certModalImgWrap" class="cert-modal-img-wrap"></div>' +
        '<div id="certModalDetails" class="modal-details" style="margin-bottom:20px;"></div>' +
        '<div class="btn-row" style="justify-content:flex-end;gap:10px;">' +
          '<a id="certModalFullLink" href="#" target="_blank" rel="noopener noreferrer" class="btn" style="font-size:.95rem;padding:6px 16px;">Open Full Image ↗</a>' +
          '<button type="button" class="btn primary" id="certModalDoneBtn" style="font-size:.95rem;padding:6px 20px;">Close</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);

    var closeBtn = modal.querySelector('#certModalCloseBtn');
    var doneBtn = modal.querySelector('#certModalDoneBtn');

    if (closeBtn) closeBtn.addEventListener('click', closeCertModal);
    if (doneBtn) doneBtn.addEventListener('click', closeCertModal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeCertModal();
      }
    });

    return modal;
  }

  function openCertModal(c) {
    if (!c) return;
    var modal = document.getElementById('certModal') || createCertModalElement();
    var title = c.title || c.name || '';
    var img = c.image || c.imagePath || '';

    var tagEl = modal.querySelector('#certModalTag');
    var titleEl = modal.querySelector('#certModalTitle');
    var metaEl = modal.querySelector('#certModalMeta');
    var imgWrapEl = modal.querySelector('#certModalImgWrap');
    var detailsEl = modal.querySelector('#certModalDetails');
    var fullLinkEl = modal.querySelector('#certModalFullLink');

    if (tagEl) tagEl.textContent = c.cat || 'Certificate';
    if (titleEl) titleEl.textContent = title;
    if (metaEl) {
      metaEl.innerHTML = '<strong>Issued by:</strong> ' + esc(c.org || 'Official Authority') +
        (c.date ? ' &bull; <strong>Date:</strong> ' + esc(c.date) : '');
    }

    if (img) {
      imgWrapEl.style.display = 'flex';
      imgWrapEl.innerHTML = '<img src="' + esc(img) + '" alt="' + esc(title) + '" loading="lazy">';
      if (fullLinkEl) {
        fullLinkEl.href = img;
        fullLinkEl.style.display = 'inline-flex';
      }
    } else {
      imgWrapEl.style.display = 'flex';
      imgWrapEl.innerHTML =
        '<div style="padding:28px 16px;text-align:center;width:100%;color:var(--ink-soft);">' +
          '<span style="font-size:2.5rem;display:block;margin-bottom:6px;">📜</span>' +
          '<strong style="color:var(--ink);font-size:1.1rem;display:block;">Physical Certificate Record</strong>' +
          '<p style="font-size:.95rem;margin:6px auto 0;max-width:38ch;">Official printed and verified credential copy available upon request during application review.</p>' +
        '</div>';
      if (fullLinkEl) {
        fullLinkEl.style.display = 'none';
      }
    }

    if (detailsEl) {
      detailsEl.innerHTML =
        '<div class="item">' +
          '<span class="bullet">✦</span>' +
          '<span>' + esc(c.desc || 'Verified academic and professional credential.') + '</span>' +
        '</div>';
    }

    modal.classList.add('active');
    document.body.classList.add('modal-open');

    var doneBtn = modal.querySelector('#certModalDoneBtn');
    if (doneBtn) {
      setTimeout(function () {
        doneBtn.focus();
      }, 50);
    }
  }

  function closeCertModal() {
    var modal = document.getElementById('certModal');
    if (modal) {
      modal.classList.remove('active');
    }
    document.body.classList.remove('modal-open');
  }

  window.openCertModal = openCertModal;
  window.closeCertModal = closeCertModal;

  // 2. Interactive Certificate Filtering & Grid Population
  var certGrid = document.getElementById('certGrid');
  var certFilters = document.getElementById('certFilters');

  if (certGrid && certFilters) {
    var certs = [

        {
        title: 'Foundations of Cybersecurity',
        image: 'assets/img/cert/Foundations_of_Cybersecurity.jpg',
        cat: 'Cybersecurity',
        org: 'Google',
        date: '2026',
        desc: 'Foundational certification in core cybersecurity principles, threat landscape analysis, and modern security operations frameworks.'
      },
      {
        title: 'Hack4Gov Provincial Competition - 1st Place',
        image: 'assets/img/cert/Provincial_Hack4Gov.jpg',
        cat: 'Cybersecurity',
        org: 'Department of Information and Communications Technology (DICT)',
        date: '2025',
        desc: 'Active participation in government-led cybersecurity operations, hands-on threat defense, and competitive capture-the-flag (CTF) challenges.'
      },
      {
        title: 'Hack4Gov Regional Competition - 7th Place Finalist',
        image: 'assets/img/cert/Regional Hack4Gov_2025.jpg',
        cat: 'Cybersecurity',
        org: 'DICT Regional Cybersecurity Bureau',
        date: '2025',
        desc: 'Regional-level participation in government cybersecurity defense, practical threat mitigation, and competitive capture-the-flag (CTF) operations.'
      },
      {
        title: 'Web Application Security',
        image: 'assets/img/cert/Web_Application_Security.jpg',
        cat: 'Cybersecurity',
        org: 'DICT / Technical Training',
        date: '2025',
        desc: 'Practical training in web application security, vulnerability identification, and defensive countermeasure implementation.'
      },
      {
        title: 'Python Programming Essentials',
        image: 'assets/img/cert/Python_Programming_Essentials.jpg',
        cat: 'Programming',
        org: 'DICT / Technical Training',
        date: '2025',
        desc: 'Completion of intensive 40-hour technical training in Python programming essentials, core syntax, and software development foundations.'
      },
      {
        title: 'Website Development for Web Developers',
        image: 'assets/img/cert/Website_Development_for _Web_Developer.jpg',
        cat: 'Web Development',
        org: 'DICT Technical Training',
        date: '2025',
        desc: 'Completion of intensive 40-hour technical training in web development principles, frontend/backend architecture, and modern website deployment.'
      },
      {
        title: 'WordPress Essentials',
        image: 'assets/img/cert/WordPress_Essentials.jpg',
        cat: 'Web Development',
        org: 'DICT Training',
        date: '2025',
        desc: 'Hands-on workshop training in WordPress essentials, content management system (CMS) configuration, and website administration.'
      },
      {
        title: 'Networking Basics',
        image: 'assets/img/cert/Networking_Basics.jpg',
        cat: 'IT & Networking',
        org: 'Cisco Networking Academy',
        date: '2025',
        desc: 'Foundational certification in computer networking principles, network architecture, and Cisco academy fundamentals.'
      },
      {
        title: 'Exploring Networking with Cisco Packet Tracer',
        image: 'assets/img/cert/Exploring_Networking_with_Cisco_Packet_Tracer.jpg',
        cat: 'IT & Networking',
        org: 'Cisco Networking Academy',
        date: '2025',
        desc: 'Hands-on certification in network simulation, virtual topology design, and Cisco Packet Tracer network configuration.'
      },
      {
        title: 'Getting Started with Cisco Packet Tracer',
        image: 'assets/img/cert/Getting_Started_with_Cisco_Packet_Tracer.jpg',
        cat: 'IT & Networking',
        org: 'Cisco Networking Academy',
        date: '2025',
        desc: 'Foundational training in network modeling, Cisco Packet Tracer interface navigation, and basic network design.'
      },
      {
        title: 'Design Made Simple: Canva Training',
        image: 'assets/img/cert/Design_Made_Simple_Canva_Training.jpg',
        cat: 'Digital Skills',
        org: 'DICT Digital Transformation Workshop',
        date: '2025',
        desc: 'Hands-on training in digital design and visual content creation using Canva, combined with government digital services orientation through the eGovPH Super App.'
      },
      {
        title: 'DICT Government Internship Certificate of Completion',
        image: '',
        cat: 'DICT Training',
        org: 'Department of Information and Communications Technology',
        date: '2026',
        desc: 'Hands-on government internship developing public-facing software including the Queue Management System.'
      },
    
      
    ];

    function renderCerts(cat) {
      var filtered = certs.filter(function (c) {
        return cat === 'all' || c.cat === cat;
      });

      certGrid.innerHTML = filtered.map(function (c, i) {
        var title = c.title || c.name || '';
        var actionHtml = '<button type="button" class="btn js-view-cert" data-title="' + esc(title) + '" style="font-size:.9rem;padding:5px 14px;">View Certificate</button>';

        return '<article class="box cert' + (i % 2 ? ' alt' : '') + '">' +
          '<span class="tag gold">' + esc(c.cat) + '</span>' +
          '<div class="nm">' + esc(title) + '</div>' +
          '<div class="muted"><strong>Issued by:</strong> ' + esc(c.org) + '</div>' +
          '<div class="muted"><strong>Date:</strong> ' + esc(c.date) + '</div>' +
          '<p style="font-size:.95rem;margin-top:4px;">' + esc(c.desc) + '</p>' +
          '<div style="margin-top:auto;padding-top:10px;">' +
            actionHtml +
          '</div>' +
        '</article>';
      }).join('');
    }

    renderCerts('all');

    certFilters.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      certFilters.querySelectorAll('button').forEach(function (x) {
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      renderCerts(b.getAttribute('data-cat'));
    });

    certGrid.addEventListener('click', function (e) {
      var trigger = e.target.closest('.js-view-cert');
      if (!trigger) return;
      e.preventDefault();
      var title = trigger.getAttribute('data-title');
      var found = certs.find(function (c) {
        return (c.title || c.name) === title;
      });
      if (found) {
        openCertModal(found);
      }
    });
  }

  // 3. Contact Form Submission (Web3Forms API & Local PHPMailer Support)
  var WEB3FORMS_ACCESS_KEY = '6c5a62f3-d91c-48b9-ae03-ede1886ae398';

  // Sent Confirmation Modal
  function createSentModalElement() {
    var modal = document.createElement('div');
    modal.id = 'sentModal';
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'sentModalTitle');
    modal.setAttribute('aria-describedby', 'sentModalDesc');
    modal.innerHTML =
      '<div class="modal-card sent-modal-card">' +
        '<button type="button" class="modal-close" id="sentModalCloseBtn" aria-label="Close notification">&times;</button>' +
        '<div class="modal-badge-row">' +
          '<span class="tag gold">&#10003; Message Dispatched</span>' +
        '</div>' +
        '<svg class="modal-doodle" viewBox="0 0 120 100" role="img" aria-label="Mail sent doodle">' +
          '<g fill="none" stroke="var(--ink)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<ellipse cx="60" cy="88" rx="38" ry="7" fill="var(--paper-2)" stroke-width="2.5"/>' +
            '<rect x="22" y="30" width="76" height="50" rx="8" fill="var(--paper)" stroke-width="3.5"/>' +
            '<path d="M24 33 L60 60 L96 33" stroke-width="3.5"/>' +
            '<path d="M24 78 L48 52" stroke-width="2.5"/>' +
            '<path d="M96 78 L72 52" stroke-width="2.5"/>' +
            '<rect x="74" y="36" width="16" height="18" rx="3" fill="var(--gold)" stroke-width="2"/>' +
            '<path d="M78 45 Q82 41 86 45 Q82 50 82 50 Z" fill="var(--red)" stroke="var(--ink)" stroke-width="1.5"/>' +
            '<path d="M12 28 Q18 20 26 24" stroke-width="2.5"/>' +
            '<path d="M96 18 L104 18" stroke-width="2.5"/>' +
            '<path d="M100 14 L100 22" stroke-width="2.5"/>' +
            '<path d="M88 12 Q94 8 98 12" stroke="var(--gold)" stroke-width="2"/>' +
          '</g>' +
        '</svg>' +
        '<h2 id="sentModalTitle">Message <span class="hl">Sent!</span></h2>' +
        '<p id="sentModalDesc">Thank you! Your message has been sent successfully to Michael Martinez.</p>' +
        '<div class="modal-details">' +
          '<div class="item">' +
            '<span class="bullet">&#10003;</span>' +
            '<span><strong>Delivered To:</strong> Michael B. Martinez (<a href="mailto:michaelmrtnz10@gmail.com" style="color:var(--ink);text-decoration:underline;font-weight:bold;">michaelmrtnz10@gmail.com</a>)</span>' +
          '</div>' +
          '<div class="item">' +
            '<span class="bullet">&#9201;</span>' +
            '<span><strong>Response Time:</strong> Typically within 24 to 48 hours.</span>' +
          '</div>' +
          '<div class="item">' +
            '<span class="bullet">&#9998;</span>' +
            '<span><strong>Direct Channels:</strong> You can also connect via <a href="https://linkedin.com/in/ekingthegreat" target="_blank" rel="noopener noreferrer" style="color:var(--ink);text-decoration:underline;">LinkedIn</a> or <a href="https://github.com/ekingthegreat" target="_blank" rel="noopener noreferrer" style="color:var(--ink);text-decoration:underline;">GitHub</a>.</span>' +
          '</div>' +
        '</div>' +
        '<div class="btn-row" style="justify-content:center;">' +
          '<button type="button" class="btn primary" id="sentModalDoneBtn">Awesome, Got It! &rarr;</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    bindSentModalEvents(modal);
    return modal;
  }

  function bindSentModalEvents(modal) {
    if (!modal || modal.dataset.eventsBound === 'true') return;
    modal.dataset.eventsBound = 'true';

    var doneBtn = modal.querySelector('#sentModalDoneBtn');
    var closeBtn = modal.querySelector('#sentModalCloseBtn');

    if (doneBtn) doneBtn.addEventListener('click', closeSentModal);
    if (closeBtn) closeBtn.addEventListener('click', closeSentModal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeSentModal();
      }
    });
  }

  function openSentModal(senderName) {
    var modal = document.getElementById('sentModal') || createSentModalElement();
    bindSentModalEvents(modal);

    var desc = modal.querySelector('#sentModalDesc');
    if (desc) {
      var displayName = senderName ? esc(senderName) : 'there';
      desc.innerHTML = 'Thank you, <strong>' + displayName + '</strong>! Your message has been sent successfully. Michael has received your inquiry and will be in touch shortly.';
    }

    modal.classList.add('active');
    document.body.classList.add('modal-open');

    var doneBtn = modal.querySelector('#sentModalDoneBtn');
    if (doneBtn) {
      setTimeout(function () {
        doneBtn.focus();
      }, 50);
    }
  }

  function closeSentModal() {
    var modal = document.getElementById('sentModal');
    if (modal) {
      modal.classList.remove('active');
    }
    if (!document.querySelector('.modal-overlay.active')) {
      document.body.classList.remove('modal-open');
    }
  }

  window.openSentModal = openSentModal;
  window.closeSentModal = closeSentModal;

  var contactForms = document.querySelectorAll('form#contactForm');
  contactForms.forEach(function (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = contactForm.querySelector('#formMsg') || document.getElementById('formMsg');
      var nameInput = contactForm.querySelector('#cName') || contactForm.querySelector('[name="name"]');
      var emailInput = contactForm.querySelector('#cEmail') || contactForm.querySelector('[name="email"]');
      var subjectInput = contactForm.querySelector('#cSubject') || contactForm.querySelector('[name="subject"]');
      var msgInput = contactForm.querySelector('#cMsg') || contactForm.querySelector('[name="message"]');
      var submitBtn = contactForm.querySelector('button[type="submit"]');

      var name = nameInput ? nameInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var subject = subjectInput ? subjectInput.value.trim() : 'General Inquiry';
      var msg = msgInput ? msgInput.value.trim() : '';

      if (!name || !email || !msg) {
        if (m) {
          m.style.color = 'var(--red)';
          m.textContent = 'Please fill in your name, email, and message.';
        }
        return;
      }

      var formData = new FormData(contactForm);

      // Resolve Access Key & formal metadata
      var formKey = formData.get('access_key');
      var currentKey = (formKey && formKey !== 'YOUR_ACCESS_KEY_HERE') ? formKey : WEB3FORMS_ACCESS_KEY;
      formData.set('access_key', currentKey);
      formData.set('from_name', name + ' (Portfolio Contact)');
      formData.set('replyto', email);
      formData.set('subject', '[Portfolio Contact] ' + (subject ? subject : 'New message from ' + name));

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending Message...';
      }
      if (m) {
        m.style.color = 'var(--ink-soft)';
        m.textContent = 'Sending your message to Michael...';
      }

      function onSuccess() {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message →';
        }
        if (m) {
          m.style.color = '#1b7430';
          m.textContent = 'Thank you, ' + name + '! Your message has been sent successfully. I will get back to you shortly.';
        }
        contactForm.reset();
        openSentModal(name);
      }

      function onError(errMsg) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message →';
        }
        if (m) {
          m.style.color = 'var(--red)';
          m.textContent = errMsg || 'Could not send message. Please try again.';
        }
      }

      var isLocalPhp = (window.location.protocol === 'http:' || window.location.protocol === 'https:') &&
                       (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

      if (isLocalPhp) {
        fetch('send-mail.php', {
          method: 'POST',
          body: formData
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.status === 'success' || data.success) {
            onSuccess();
          } else {
            sendViaWeb3Forms();
          }
        })
        .catch(function () {
          sendViaWeb3Forms();
        });
      } else {
        sendViaWeb3Forms();
      }

      function sendViaWeb3Forms() {
        if (!currentKey || currentKey === 'YOUR_ACCESS_KEY_HERE') {
          onError('Setup required: Please add your free Web3Forms Access Key in contact.html.');
          return;
        }

        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          if (data.success) {
            onSuccess();
          } else {
            onError(data.message || 'Could not send message. Please try again.');
          }
        })
        .catch(function () {
          onError('Unable to connect to the mail service. Please check your internet connection or email directly.');
        });
      }
    });
  });

  // 4. Skills Filter (for skills.html)
  var skillFilters = document.getElementById('skillFilters');
  if (skillFilters) {
    skillFilters.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      var cat = b.getAttribute('data-filter');
      skillFilters.querySelectorAll('button').forEach(function (x) {
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });

      var cards = document.querySelectorAll('.skill-filter-card');
      cards.forEach(function (card) {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // 5. Work in Progress Modal
  function createWipModalElement() {
    var modal = document.createElement('div');
    modal.id = 'wipModal';
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'wipModalTitle');
    modal.setAttribute('aria-describedby', 'wipModalDesc');
    modal.innerHTML =
      '<div class="modal-card">' +
        '<button type="button" class="modal-close" id="modalCloseBtn" aria-label="Close modal">&times;</button>' +
        '<div class="modal-badge-row">' +
          '<span class="tag gold">Project Notice</span>' +
        '</div>' +
        '<svg class="modal-doodle" viewBox="0 0 120 110" role="img" aria-label="Work in progress doodle illustration">' +
          '<g fill="none" stroke="var(--ink)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">' +
            '<ellipse cx="60" cy="94" rx="42" ry="8" fill="var(--paper-2)" stroke-width="3.5"/>' +
            '<path d="M36 90 L52 24 C55 14 65 14 68 24 L84 90 Z" fill="var(--gold)"/>' +
            '<path d="M44 64 L76 64 L72 44 L48 44 Z" fill="var(--paper)"/>' +
            '<path d="M44 64 L76 64"/>' +
            '<path d="M48 44 L72 44"/>' +
            '<path d="M54 28 L66 28"/>' +
            '<g transform="rotate(25 80 50)">' +
              '<path d="M72 16 L84 16 L84 76 L72 76 Z" fill="var(--paper)" stroke-width="3"/>' +
              '<path d="M72 76 L78 88 L84 76 Z" fill="var(--gold)" stroke-width="3"/>' +
              '<path d="M76 84 L80 84" stroke-width="3"/>' +
              '<path d="M72 26 L84 26" stroke-width="2.5"/>' +
              '<path d="M72 16 Q78 12 84 16" fill="var(--red)" stroke-width="3"/>' +
            '</g>' +
            '<path d="M22 28 L30 28" stroke-width="3"/>' +
            '<path d="M26 24 L26 32" stroke-width="3"/>' +
            '<path d="M96 22 L104 22" stroke-width="3"/>' +
            '<path d="M100 18 L100 26" stroke-width="3"/>' +
            '<path d="M16 62 Q20 58 24 64" stroke-width="2.5"/>' +
          '</g>' +
        '</svg>' +
        '<h2 id="wipModalTitle">Work in <span class="hl">Progress</span></h2>' +
        '<p id="wipModalDesc">' +
          'Welcome to my portfolio! This project is currently a <strong>work in progress</strong> as I finalize case studies, responsive features, and live demonstrations.' +
        '</p>' +
        '<div class="modal-details">' +
          '<div class="item">' +
            '<span class="bullet">✎</span>' +
            '<span>Some pages and interactive previews are actively being updated.</span>' +
          '</div>' +
          '<div class="item">' +
            '<span class="bullet">✦</span>' +
            '<span>You are welcome to explore my skills, experience, achievements, and resume!</span>' +
          '</div>' +
        '</div>' +
        '<div class="btn-row" style="justify-content:center;">' +
          '<button type="button" class="btn primary" id="modalContinueBtn">Continue &rarr;</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(modal);
    bindModalEvents(modal);
    return modal;
  }

  function bindModalEvents(modal) {
    if (!modal || modal.dataset.eventsBound === 'true') return;
    modal.dataset.eventsBound = 'true';

    var continueBtn = modal.querySelector('#modalContinueBtn');
    var closeBtn = modal.querySelector('#modalCloseBtn');

    if (continueBtn) {
      continueBtn.addEventListener('click', function () {
        closeWipModal();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeWipModal();
      });
    }

    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        closeWipModal();
      }
    });
  }

  function openWipModal() {
    var modal = document.getElementById('wipModal');
    if (!modal) {
      modal = createWipModalElement();
    }
    bindModalEvents(modal);
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    var continueBtn = modal.querySelector('#modalContinueBtn');
    if (continueBtn) {
      setTimeout(function () {
        continueBtn.focus();
      }, 50);
    }
  }

  function closeWipModal() {
    var modal = document.getElementById('wipModal');
    if (modal) {
      modal.classList.remove('active');
    }
    document.body.classList.remove('modal-open');
  }

  window.openWipModal = openWipModal;
  window.closeWipModal = closeWipModal;

  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.key === 'Esc') && document.body.classList.contains('modal-open')) {
      closeWipModal();
      closeCertModal();
      closeSentModal();
    }
  });

  // Attach click listener for any element with .js-open-wip-modal
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.js-open-wip-modal');
    if (trigger) {
      e.preventDefault();
      openWipModal();
    }
  });

  // Auto-open modal on page load for opening this project
  var existingModal = document.getElementById('wipModal');
  if (existingModal) {
    bindModalEvents(existingModal);
    setTimeout(function () {
      openWipModal();
    }, 120);
  }
});
