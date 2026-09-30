(function () {
  'use strict';

  var cfg = window.MARU_SUPABASE || {};
  var page = document.body.getAttribute('data-page');
  var BUCKET = 'blog-covers';
  var MAX_IMAGE_BYTES = 3 * 1024 * 1024;
  var IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
  var DEFAULT_CATEGORIES = ['Supervisión empresarial', 'Prevención fiscal y laboral', 'Operación integrada'];
  var FLASH_KEY = 'maruAdminFlash';

  function $(id) { return document.getElementById(id); }
  function show(el, on) { if (el) el.hidden = !on; }
  function errMsg(e) { return e && e.message ? e.message : String(e); }

  if (!window.MaruBlogs || !window.MaruBlogs.configured || !window.supabase) {
    if (page === 'list') show($('setupView'), true);
    else window.location.replace('./');
    return;
  }

  var sb = window.supabase.createClient(cfg.url, cfg.anonKey);

  function getSession() {
    return sb.auth.getSession().then(function (r) { return r.data.session; });
  }

  function checkAdmin() {
    return sb.rpc('is_admin').then(function (r) {
      if (r.error) throw r.error;
      return r.data === true;
    });
  }

  function fetchAll() {
    return sb.from('blogs').select('*')
      .order('position', { ascending: true })
      .order('created_at', { ascending: false })
      .then(function (r) {
        if (r.error) throw r.error;
        return r.data.map(window.MaruBlogs.fromRow);
      });
  }

  function slugify(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 120) || 'blog';
  }

  function imageUrl(url) {
    if (!url) return '';
    return /^https?:\/\//.test(url) ? url : '../' + String(url).replace(/^\/+/, '');
  }

  function coverPath(url) {
    var marker = '/storage/v1/object/public/' + BUCKET + '/';
    var i = String(url || '').indexOf(marker);
    return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length).split('?')[0]);
  }

  function deleteCover(url) {
    var path = coverPath(url);
    if (!path) return Promise.resolve();
    return sb.storage.from(BUCKET).remove([path]).then(function () {}, function () {});
  }

  function formatDate(value) {
    var d = value ? new Date(value) : null;
    if (!d || isNaN(d)) return { date: '—', time: '' };
    return {
      date: d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
    };
  }

  var ICONS = {
    top: '<path d="M7 11l5-5 5 5M7 18l5-5 5 5"/>',
    up: '<path d="M7 14l5-5 5 5"/>',
    down: '<path d="M7 10l5 5 5-5"/>',
    grip: '<circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
    view: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
    trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 12.5h9l1-12.5M10 11v5M14 11v5"/>',
    image: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 15.5l-5-5-8.5 8.5"/>'
  };

  function icon(name) {
    var span = document.createElement('span');
    span.className = 'admin-icon';
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + '</svg>';
    return span;
  }

  function node(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  /* ---------- Listado ---------- */

  function initList() {
    var loginView = $('loginView');
    var appView = $('appView');
    var table = $('blogTable');
    var tbody = table.tBodies[0];
    var listError = $('listError');
    var flash = $('flash');
    var articles = [];
    var dragging = null;

    function showLogin(message) {
      document.body.className = 'admin-login';
      show(appView, false);
      show(loginView, true);
      var error = $('loginError');
      error.textContent = message || '';
      show(error, Boolean(message));
    }

    function showFlash(message) {
      flash.textContent = message;
      show(flash, Boolean(message));
    }

    function showError(message) {
      listError.textContent = message;
      show(listError, Boolean(message));
    }

    function showApp() {
      document.body.className = 'admin-app';
      show(loginView, false);
      show(appView, true);
      var pending = sessionStorage.getItem(FLASH_KEY);
      if (pending) {
        showFlash(pending);
        sessionStorage.removeItem(FLASH_KEY);
      }
      load();
    }

    function load() {
      return fetchAll()
        .then(function (list) {
          articles = list;
          render();
        })
        .catch(function (e) { showError('No se pudieron cargar los blogs: ' + errMsg(e)); });
    }

    function orderButton(dir, label, disabled) {
      var btn = node('button', 'admin-order-btn js-move');
      btn.type = 'button';
      btn.title = label;
      btn.setAttribute('aria-label', label);
      btn.setAttribute('data-dir', dir);
      btn.disabled = disabled;
      btn.appendChild(icon(dir));
      return btn;
    }

    function actionLink(href, iconName, label, className) {
      var el = node(href ? 'a' : 'button', 'admin-action ' + (className || ''));
      if (href) el.href = href;
      else el.type = 'button';
      el.title = label;
      el.appendChild(icon(iconName));
      el.appendChild(node('span', 'admin-action-label', label));
      return el;
    }

    function render() {
      var total = articles.length;
      var publishedCount = articles.filter(function (a) { return a.status === 'published'; }).length;
      $('statTotal').textContent = total;
      $('statPublished').textContent = publishedCount;
      $('statDraft').textContent = total - publishedCount;
      show($('emptyState'), total === 0);
      show($('listWrap'), total > 0);
      show($('listHelp'), total > 1);
      tbody.innerHTML = '';

      articles.forEach(function (article, index) {
        var tr = document.createElement('tr');
        tr.setAttribute('data-id', article.id);

        var orderTd = node('td', 'col-order');
        var order = node('div', 'admin-order');
        var drag = node('span', 'admin-drag');
        drag.draggable = true;
        drag.title = 'Arrastrar para mover';
        drag.appendChild(icon('grip'));
        var btns = node('div', 'admin-order-btns');
        btns.appendChild(orderButton('top', 'Subir al inicio', index === 0));
        btns.appendChild(orderButton('up', 'Subir', index === 0));
        btns.appendChild(orderButton('down', 'Bajar', index === total - 1));
        order.appendChild(drag);
        order.appendChild(node('span', 'admin-order-num', String(index + 1)));
        order.appendChild(btns);
        orderTd.appendChild(order);
        tr.appendChild(orderTd);

        var articleTd = node('td', 'col-article');
        var articleBox = node('div', 'admin-article');
        var thumb = node('div', 'admin-thumb');
        if (article.coverImage) {
          var img = document.createElement('img');
          img.src = imageUrl(article.coverImage);
          img.alt = '';
          img.loading = 'lazy';
          thumb.appendChild(img);
        } else {
          thumb.classList.add('is-empty');
          thumb.appendChild(icon('image'));
        }
        var text = node('div', 'admin-article-text');
        text.appendChild(node('strong', '', article.title));
        text.appendChild(node('small', '', '/' + article.slug));
        articleBox.appendChild(thumb);
        articleBox.appendChild(text);
        articleTd.appendChild(articleBox);
        tr.appendChild(articleTd);

        var catTd = node('td', 'col-category');
        catTd.appendChild(node('span', 'admin-category', article.category));
        tr.appendChild(catTd);

        var statusTd = node('td', 'col-status');
        var published = article.status === 'published';
        statusTd.appendChild(node('span', 'admin-status admin-status--' + (published ? 'published' : 'draft'), published ? 'Publicado' : 'Borrador'));
        var when = formatDate(article.updatedAt);
        statusTd.appendChild(node('small', 'admin-date', when.date + (when.time ? ' · ' + when.time : '')));
        tr.appendChild(statusTd);

        var actionsTd = node('td', 'col-actions');
        var actions = node('div', 'admin-actions');
        actions.appendChild(actionLink('editar.html?id=' + encodeURIComponent(article.id), 'edit', 'Editar', 'admin-action--edit'));
        var view = actionLink('../insight.html?slug=' + encodeURIComponent(article.slug), 'view', 'Ver');
        view.target = '_blank';
        view.rel = 'noopener';
        actions.appendChild(view);
        actions.appendChild(actionLink('', 'trash', 'Eliminar', 'admin-action--danger js-delete'));
        actionsTd.appendChild(actions);
        tr.appendChild(actionsTd);

        tbody.appendChild(tr);
      });
    }

    function saveOrder() {
      var ids = articles.map(function (a) { return a.id; });
      return sb.rpc('reorder_blogs', { ids: ids }).then(function (r) {
        if (r.error) throw r.error;
        showError('');
      }).catch(function () {
        showError('No se pudo guardar el orden. Recarga la página e inténtalo de nuevo.');
      });
    }

    function move(id, dir) {
      var i = articles.findIndex(function (a) { return a.id === id; });
      if (i === -1) return;
      var item = articles.splice(i, 1)[0];
      var target = dir === 'top' ? 0 : dir === 'up' ? Math.max(0, i - 1) : Math.min(articles.length, i + 1);
      articles.splice(target, 0, item);
      render();
      saveOrder();
    }

    function remove(id) {
      var article = articles.filter(function (a) { return a.id === id; })[0];
      if (!article) return;
      if (!window.confirm('¿Eliminar este blog? Esta acción no se puede deshacer.')) return;
      sb.from('blogs').delete().eq('id', id).then(function (r) {
        if (r.error) throw r.error;
        deleteCover(article.coverImage);
        articles = articles.filter(function (a) { return a.id !== id; });
        render();
        showFlash('Blog eliminado.');
      }).catch(function (e) { showError('No se pudo eliminar: ' + errMsg(e)); });
    }

    function importInitial() {
      var btn = $('importBtn');
      btn.disabled = true;
      window.MaruBlogs.loadJson().then(function (list) {
        var rows = list.map(function (a, i) {
          var row = window.MaruBlogs.toRow(a);
          if (a.id) row.id = String(a.id);
          row.position = i;
          if (a.createdAt) row.created_at = a.createdAt;
          row.updated_at = a.updatedAt || new Date().toISOString();
          return row;
        });
        return sb.from('blogs').insert(rows).then(function (r) {
          if (r.error) throw r.error;
          showFlash('Se importaron ' + rows.length + ' blogs.');
          return load();
        });
      }).catch(function (e) {
        showError('No se pudo importar: ' + errMsg(e));
      }).then(function () { btn.disabled = false; });
    }

    tbody.addEventListener('click', function (e) {
      var row = e.target.closest('tr');
      if (!row) return;
      var id = row.getAttribute('data-id');
      var moveBtn = e.target.closest('.js-move');
      if (moveBtn) move(id, moveBtn.getAttribute('data-dir'));
      if (e.target.closest('.js-delete')) remove(id);
    });

    tbody.addEventListener('dragstart', function (e) {
      var handle = e.target.closest('.admin-drag');
      if (!handle) return;
      dragging = handle.closest('tr');
      dragging.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragging.getAttribute('data-id'));
      e.dataTransfer.setDragImage(dragging, 20, 20);
    });

    tbody.addEventListener('dragover', function (e) {
      if (!dragging) return;
      var row = e.target.closest('tr');
      if (!row || row === dragging || row.parentNode !== tbody) return;
      e.preventDefault();
      var box = row.getBoundingClientRect();
      var after = e.clientY > box.top + box.height / 2;
      tbody.insertBefore(dragging, after ? row.nextSibling : row);
    });

    tbody.addEventListener('drop', function (e) {
      if (dragging) e.preventDefault();
    });

    tbody.addEventListener('dragend', function () {
      if (!dragging) return;
      dragging.classList.remove('is-dragging');
      dragging = null;
      var byId = {};
      articles.forEach(function (a) { byId[a.id] = a; });
      articles = Array.prototype.map.call(tbody.rows, function (row) {
        return byId[row.getAttribute('data-id')];
      });
      render();
      saveOrder();
    });

    $('importBtn').addEventListener('click', importInitial);

    document.querySelectorAll('.js-logout').forEach(function (btn) {
      btn.addEventListener('click', function () {
        sb.auth.signOut().then(function () { window.location.reload(); });
      });
    });

    loginView.addEventListener('submit', function (e) {
      e.preventDefault();
      var submit = loginView.querySelector('button[type="submit"]');
      submit.disabled = true;
      sb.auth.signInWithPassword({ email: $('email').value.trim(), password: $('password').value })
        .then(function (r) {
          if (r.error) throw r.error;
          return checkAdmin();
        })
        .then(function (ok) {
          if (ok) return showApp();
          return sb.auth.signOut().then(function () {
            showLogin('Este usuario no tiene permiso de administrador.');
          });
        })
        .catch(function (err) {
          showLogin(/invalid login credentials/i.test(errMsg(err)) ? 'Correo o contraseña incorrectos.' : errMsg(err));
        })
        .then(function () { submit.disabled = false; });
    });

    getSession()
      .then(function (session) {
        if (!session) return showLogin();
        return checkAdmin().then(function (ok) {
          if (ok) showApp();
          else showLogin('Este usuario no tiene permiso de administrador.');
        });
      })
      .catch(function (e) { showLogin(errMsg(e)); });
  }

  /* ---------- Formulario ---------- */

  function initEdit() {
    var form = $('blogForm');
    var errorsBox = $('formErrors');
    var sections = $('sections');
    var template = $('sectionTemplate');
    var coverInput = $('cover');
    var preview = $('coverPreview');
    var previewImg = $('coverPreviewImg');
    var previewText = $('coverPreviewText');
    var removeImage = $('removeImage');
    var id = new URLSearchParams(window.location.search).get('id') || '';
    var article = null;
    var all = [];

    function showErrors(list) {
      errorsBox.innerHTML = '';
      list.forEach(function (msg) { errorsBox.appendChild(node('p', '', msg)); });
      show(errorsBox, list.length > 0);
      if (list.length) window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function relabel() {
      sections.querySelectorAll('.js-section-label').forEach(function (label, i) {
        label.textContent = 'Sección ' + (i + 1);
      });
    }

    function addSection(heading, content) {
      var frag = template.content.cloneNode(true);
      frag.querySelector('.js-section-heading').value = heading || '';
      frag.querySelector('.js-section-content').value = content || '';
      sections.appendChild(frag);
      relabel();
    }

    function setPreview(url) {
      previewImg.src = url || '';
      show(previewImg, Boolean(url));
      show(previewText, !url);
      preview.classList.toggle('is-empty', !url);
    }

    function fill() {
      var cats = DEFAULT_CATEGORIES.slice();
      all.forEach(function (a) { if (a.category && cats.indexOf(a.category) === -1) cats.push(a.category); });
      var datalist = $('categoryList');
      cats.forEach(function (c) {
        var opt = document.createElement('option');
        opt.value = c;
        datalist.appendChild(opt);
      });

      var a = article || { title: '', slug: '', category: cats[0], readingMinutes: 5, status: 'draft', excerpt: '', lead: '', coverImage: '', sections: [] };
      $('pageTitle').textContent = article ? 'Editar blog' : 'Nuevo blog';
      $('saveBtn').textContent = article ? 'Guardar cambios' : 'Crear blog';
      document.title = (article ? 'Editar' : 'Nuevo') + ' blog — Admin MARU CORP';
      $('title').value = a.title;
      $('slug').value = a.slug;
      $('category').value = a.category;
      $('readingMinutes').value = a.readingMinutes || 5;
      $('status').value = a.status === 'published' ? 'published' : 'draft';
      $('excerpt').value = a.excerpt || '';
      $('lead').value = a.lead || '';
      setPreview(imageUrl(a.coverImage));
      show($('removeImageWrap'), Boolean(a.coverImage));

      var list = a.sections && a.sections.length ? a.sections : [{ heading: '', content: '' }];
      list.forEach(function (s) { addSection(s.heading, s.content); });
      show(form, true);
    }

    function uniqueSlug(base) {
      var taken = {};
      all.forEach(function (a) { if (!article || a.id !== article.id) taken[a.slug] = true; });
      var slug = base;
      var n = 2;
      while (taken[slug]) slug = base + '-' + n++;
      return slug;
    }

    function collectSections() {
      var list = [];
      sections.querySelectorAll('.admin-section').forEach(function (block) {
        var heading = block.querySelector('.js-section-heading').value.trim();
        var content = block.querySelector('.js-section-content').value.trim();
        if (heading || content) list.push({ heading: heading, content: content });
      });
      return list;
    }

    function uploadCover(file, slug) {
      var path = slug + '-' + Date.now() + '.' + IMAGE_TYPES[file.type];
      return sb.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false })
        .then(function (r) {
          if (r.error) throw r.error;
          return sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
        });
    }

    function save(e) {
      e.preventDefault();
      var title = $('title').value.trim();
      var category = $('category').value.trim();
      var excerpt = $('excerpt').value.trim();
      var lead = $('lead').value.trim();
      var file = coverInput.files && coverInput.files[0];
      var errors = [];

      if (!title) errors.push('El título es obligatorio.');
      if (!category) errors.push('La categoría es obligatoria.');
      if (!excerpt && !lead) errors.push('El extracto es obligatorio.');
      if (file && !IMAGE_TYPES[file.type]) errors.push('Formato de imagen no permitido. Usa JPG, PNG, WEBP o GIF.');
      if (file && file.size > MAX_IMAGE_BYTES) errors.push('La imagen no debe superar 3 MB.');
      if (errors.length) return showErrors(errors);

      var slug = uniqueSlug(slugify($('slug').value.trim() || title));
      var oldCover = article ? article.coverImage : '';
      var saveBtn = $('saveBtn');
      var saveLabel = saveBtn.textContent;
      var uploaded = '';
      saveBtn.disabled = true;
      saveBtn.textContent = 'Guardando…';
      showErrors([]);

      (file ? uploadCover(file, slug) : Promise.resolve(''))
        .then(function (url) {
          uploaded = url;
          var cover = url || (removeImage.checked ? '' : oldCover);
          var row = window.MaruBlogs.toRow({
            slug: slug,
            title: title,
            category: category,
            lead: lead || excerpt,
            excerpt: excerpt || lead,
            readingMinutes: Math.min(60, Math.max(1, parseInt($('readingMinutes').value, 10) || 5)),
            status: $('status').value,
            coverImage: cover,
            sections: collectSections().length ? collectSections() : [{ heading: 'Contenido', content: '' }]
          });
          row.updated_at = new Date().toISOString();

          if (article) return sb.from('blogs').update(row).eq('id', article.id);
          row.position = all.length ? Math.min.apply(null, all.map(function (a) { return a.position || 0; })) - 1 : 0;
          return sb.from('blogs').insert(row);
        })
        .then(function (r) {
          if (r.error) throw r.error;
          if (oldCover && (uploaded || removeImage.checked)) deleteCover(oldCover);
          sessionStorage.setItem(FLASH_KEY, article ? 'Blog actualizado.' : 'Blog creado. Aparece al inicio de la lista.');
          window.location.href = './';
        })
        .catch(function (err) {
          if (uploaded) deleteCover(uploaded);
          showErrors(['No se pudo guardar: ' + errMsg(err)]);
          saveBtn.disabled = false;
          saveBtn.textContent = saveLabel;
        });
    }

    $('addSection').addEventListener('click', function () { addSection('', ''); });

    sections.addEventListener('click', function (e) {
      var btn = e.target.closest('.js-remove-section');
      if (!btn) return;
      var block = btn.closest('.admin-section');
      if (sections.querySelectorAll('.admin-section').length <= 1) {
        block.querySelectorAll('input, textarea').forEach(function (el) { el.value = ''; });
        return;
      }
      block.remove();
      relabel();
    });

    coverInput.addEventListener('change', function () {
      var file = coverInput.files && coverInput.files[0];
      if (file) setPreview(URL.createObjectURL(file));
    });

    form.addEventListener('submit', save);

    getSession()
      .then(function (session) {
        if (!session) return window.location.replace('./');
        return checkAdmin().then(function (ok) {
          if (!ok) return window.location.replace('./');
          return fetchAll().then(function (list) {
            all = list;
            if (id) {
              article = list.filter(function (a) { return a.id === id; })[0] || null;
              if (!article) return showErrors(['No se encontró el blog. Puede que se haya eliminado.']);
            }
            fill();
          });
        });
      })
      .catch(function (e) { showErrors(['Error: ' + errMsg(e)]); });
  }

  if (page === 'list') initList();
  if (page === 'edit') initEdit();
})();
