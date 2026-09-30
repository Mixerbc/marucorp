(function () {
  'use strict';

  var cfg = window.MARU_SUPABASE || {};
  var configured = Boolean(cfg.url && cfg.anonKey);
  var base = configured ? String(cfg.url).replace(/\/+$/, '') : '';
  var fallbackUrl = document.currentScript
    ? new URL('../data/blogs.json', document.currentScript.src).href
    : 'data/blogs.json';

  function fromRow(row) {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      lead: row.lead_text || '',
      excerpt: row.excerpt || '',
      readingMinutes: row.reading_minutes || 5,
      status: row.status,
      coverImage: row.cover_image || '',
      sections: Array.isArray(row.sections) ? row.sections : [],
      position: row.position,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  function toRow(article) {
    return {
      slug: article.slug,
      title: article.title,
      category: article.category,
      lead_text: article.lead || '',
      excerpt: article.excerpt || '',
      reading_minutes: article.readingMinutes || 5,
      status: article.status === 'published' ? 'published' : 'draft',
      cover_image: article.coverImage || '',
      sections: article.sections || []
    };
  }

  function rest(query) {
    return fetch(base + '/rest/v1/blogs?' + query, {
      headers: { apikey: cfg.anonKey, Accept: 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('Supabase ' + res.status);
      return res.json();
    });
  }

  function loadJson() {
    return fetch(fallbackUrl + '?_=' + Date.now()).then(function (res) {
      if (!res.ok) throw new Error('No se pudo cargar blogs.json');
      return res.json();
    }).then(function (data) {
      return Array.isArray(data.articles) ? data.articles : [];
    });
  }

  function published(list) {
    return list.filter(function (a) { return (a.status || 'published') === 'published'; });
  }

  function list() {
    if (!configured) return loadJson().then(published);
    return rest('select=*&status=eq.published&order=position.asc,created_at.desc')
      .then(function (rows) { return rows.map(fromRow); })
      .catch(function () { return loadJson().then(published); });
  }

  function get(slug) {
    function fromJson() {
      return loadJson().then(function (items) {
        return published(items).filter(function (a) { return a.slug === slug; })[0] || null;
      });
    }
    if (!configured) return fromJson();
    return rest('select=*&status=eq.published&slug=eq.' + encodeURIComponent(slug) + '&limit=1')
      .then(function (rows) { return rows.length ? fromRow(rows[0]) : null; })
      .catch(fromJson);
  }

  window.MaruBlogs = {
    configured: configured,
    list: list,
    get: get,
    loadJson: loadJson,
    fromRow: fromRow,
    toRow: toRow
  };
})();
