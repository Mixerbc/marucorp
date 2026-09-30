(function () {
  'use strict';

  var slug = new URLSearchParams(window.location.search).get('slug') || '';
  var titleEl = document.getElementById('articleTitle');
  var leadEl = document.getElementById('articleLead');
  var metaEl = document.getElementById('articleMeta');
  var body = document.getElementById('articleBody');
  var cover = document.getElementById('articleCover');
  var coverImg = document.getElementById('articleCoverImg');

  function el(tag, text) {
    var node = document.createElement(tag);
    node.textContent = text;
    return node;
  }

  function notFound() {
    document.title = 'Artículo no encontrado — MARU CORP';
    titleEl.textContent = 'Artículo no encontrado';
    body.innerHTML = '';
    body.appendChild(el('p', 'El artículo que buscas no existe o ya no está disponible.'));
  }

  function renderParagraphs(content) {
    String(content).split(/\n{2,}/).forEach(function (para) {
      para = para.trim();
      if (!para) return;
      var p = document.createElement('p');
      para.split('\n').forEach(function (line, i) {
        if (i) p.appendChild(document.createElement('br'));
        p.appendChild(document.createTextNode(line));
      });
      body.appendChild(p);
    });
  }

  function render(article) {
    var lead = article.lead || article.excerpt || '';
    document.title = article.title + ' | Insights — MARU CORP';
    var desc = document.querySelector('meta[name="description"]');
    if (desc && lead) desc.setAttribute('content', lead);

    titleEl.textContent = article.title;
    document.getElementById('articleCategory').textContent = article.category || '';
    document.getElementById('articleTime').textContent = 'Lectura estimada: ' + (article.readingMinutes || 5) + ' min';
    metaEl.hidden = false;
    if (lead) {
      leadEl.textContent = lead;
      leadEl.hidden = false;
    }

    if (article.coverImage) {
      coverImg.src = article.coverImage;
      coverImg.alt = article.title;
      cover.hidden = false;
    }

    body.innerHTML = '';
    (article.sections || []).forEach(function (section) {
      if (section.heading) body.appendChild(el('h2', section.heading));
      if (section.content) renderParagraphs(section.content);
    });
  }

  if (!slug) {
    notFound();
    return;
  }

  window.MaruBlogs.get(slug)
    .then(function (article) {
      if (article) render(article);
      else notFound();
    })
    .catch(notFound);
})();
