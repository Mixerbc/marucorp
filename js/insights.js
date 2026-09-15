(function () {
  'use strict';

  var grid = document.getElementById('insightsGrid');
  var search = document.getElementById('insightsSearch');
  var empty = document.getElementById('insightsEmpty');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.insights-filter__btn'));
  var activeCategory = 'all';
  var articles = [];

  if (!grid) return;

  function normalize(str) {
    return String(str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function articleUrl(article) {
    return 'insight.php?slug=' + encodeURIComponent(article.slug);
  }

  function render() {
    var query = normalize(search ? search.value : '');
    var visible = 0;
    var html = '';

    articles.forEach(function (article) {
      if ((article.status || 'published') !== 'published') return;

      var category = article.category || '';
      var haystack = normalize([article.title, article.excerpt, article.lead, category].join(' '));
      var matchCategory = activeCategory === 'all' || category === activeCategory;
      var matchQuery = !query || haystack.indexOf(query) !== -1;
      if (!matchCategory || !matchQuery) return;

      visible += 1;
      var mins = article.readingMinutes || 5;
      var cover = article.coverImage
        ? '<div class="article-card__visual article-card__visual--image" style="background-image:url(\'' + escapeHtml(article.coverImage) + '\')"></div>'
        : '<div class="article-card__visual" aria-hidden="true"></div>';

      html +=
        '<article class="article-card" data-category="' + escapeHtml(category) + '">' +
        cover +
        '<div class="article-card__body">' +
        '<div class="article-card__meta">' +
        '<span class="article-card__category">' + escapeHtml(category) + '</span>' +
        '<span class="article-card__time">' + mins + ' min de lectura</span>' +
        '</div>' +
        '<h2>' + escapeHtml(article.title) + '</h2>' +
        '<p class="article-card__excerpt">' + escapeHtml(article.excerpt || article.lead || '') + '</p>' +
        '<a href="' + escapeHtml(articleUrl(article)) + '" class="article-card__link">Leer artículo <span aria-hidden="true">→</span></a>' +
        '</div></article>';
    });

    grid.innerHTML = html;
    if (empty) {
      empty.classList.toggle('visually-hidden', visible > 0);
    }
  }

  function loadArticles() {
    return fetch('data/blogs.json?_=' + Date.now())
      .then(function (res) {
        if (!res.ok) throw new Error('No se pudo cargar blogs');
        return res.json();
      })
      .then(function (data) {
        articles = Array.isArray(data.articles) ? data.articles : [];
        render();
      })
      .catch(function () {
        // Fallback: si blogs.json falla, mantiene tarjetas estáticas si existen
        var staticCards = grid.querySelectorAll('.article-card');
        if (!staticCards.length && empty) {
          empty.textContent = 'No se pudieron cargar los artículos.';
          empty.classList.remove('visually-hidden');
        }
      });
  }

  if (search) {
    search.addEventListener('input', render);
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeCategory = btn.getAttribute('data-category') || 'all';
      buttons.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      render();
    });
  });

  loadArticles();
})();
