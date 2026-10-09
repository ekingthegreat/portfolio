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

  // 2. Interactive Certificate Filtering (for certificates.html & index.html if present)
  var certGrid = document.getElementById('certGrid');
  var certFilters = document.getElementById('certFilters');

  if (certGrid && certFilters) {
    var certs = [
      {
        cat: 'Cybersecurity',
        name: 'Hack4Gov Provincial Competition - 1st Place Champion',
        org: 'Department of Information and Communications Technology (DICT)',
        date: '2025',
        desc: 'Champion recognition for excellence in government cybersecurity, vulnerability analysis, and incident triage.'
      },
      {
        cat: 'Cybersecurity',
        name: 'Hack4Gov Regional Competition - 7th Place Finalist',
        org: 'DICT Regional Cybersecurity Bureau',
        date: '2025',
        desc: 'Advanced finalist representing provincial winners in multi-tier regional CTF and defensive security challenges.'
      },
      {
        cat: 'DICT Training',
        name: 'DICT Government Internship Certificate of Completion',
        org: 'Department of Information and Communications Technology',
        date: '2026',
        desc: 'Hands-on government internship developing public-facing software including the Queue Management System.'
      },
      {
        cat: 'Programming',
        name: 'Computer Programming Foundations & Problem Solving',
        org: 'Western Mindanao State University',
        date: 'Academic',
        desc: 'Core computer science degree certification covering algorithms, C++, and object-oriented architecture.'
      },
      {
        cat: 'Web Development',
        name: 'Full-Stack Web Development (HTML, CSS, JS, PHP, MySQL)',
        org: 'DICT / Technical Training',
        date: '2025 - 2026',
        desc: 'Practical web development coursework covering responsive design, relational databases, and server-side scripting.'
      },
      {
        cat: 'Web Development',
        name: 'Web Mapping & Geospatial Information Systems (GIS)',
        org: 'Undergraduate Capstone / Thesis Research',
        date: '2026',
        desc: 'Interactive disaster reporting and geospatial mapping systems development for Ipil, Zamboanga Sibugay.'
      },
      {
        cat: 'IT & Networking',
        name: 'Computer Networking & Systems Troubleshooting',
        org: 'Technical Training / Academic Curriculum',
        date: '2025',
        desc: 'Local area network (LAN) setup, router configuration, IP subnetting, and hardware diagnosis.'
      },
      {
        cat: 'Digital Skills',
        name: 'Digital Literacy & Secure Public Service Systems',
        org: 'DICT Digital Transformation Workshop',
        date: '2025',
        desc: 'Implementation of accessible, user-friendly digital tools for community and government workflows.'
      }
    ];

    function esc(s) {
      return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function renderCerts(cat) {
      var filtered = certs.filter(function (c) {
        return cat === 'all' || c.cat === cat;
      });

      certGrid.innerHTML = filtered.map(function (c, i) {
        return '<article class="box cert' + (i % 2 ? ' alt' : '') + '">' +
          '<span class="tag gold">' + esc(c.cat) + '</span>' +
          '<div class="nm">' + esc(c.name) + '</div>' +
          '<div class="muted"><strong>Issued by:</strong> ' + esc(c.org) + '</div>' +
          '<div class="muted"><strong>Date:</strong> ' + esc(c.date) + '</div>' +
          '<p style="font-size:.95rem;margin-top:4px;">' + esc(c.desc) + '</p>' +
          '<div style="margin-top:auto;padding-top:10px;">' +
            '<button type="button" class="btn js-open-wip-modal" style="font-size:.9rem;padding:4px 12px;">Work in Progress</button>' +
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
  }

  // 3. Contact Form Submission Feedback
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = document.getElementById('formMsg');
      var name = document.getElementById('cName') ? document.getElementById('cName').value.trim() : '';
      var email = document.getElementById('cEmail') ? document.getElementById('cEmail').value.trim() : '';
      var msg = document.getElementById('cMsg') ? document.getElementById('cMsg').value.trim() : '';

      if (!name || !email || !msg) {
        if (m) {
          m.style.color = 'var(--red)';
          m.textContent = 'Please fill in your name, email, and message.';
        }
        return;
      }

      if (m) {
        m.style.color = '#1b7430';
        m.textContent = 'Thank you, ' + name + '! Your message is ready to send. You can also reach me directly at your.email@example.com.';
      }
      contactForm.reset();
    });
  }

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
