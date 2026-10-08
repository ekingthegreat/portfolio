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
            '<button type="button" class="btn" style="font-size:.9rem;padding:4px 12px;" onclick="alert(\'Verified certificate from ' + esc(c.org) + ' (' + esc(c.date) + ')\')">Verified Credential</button>' +
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
});
