(function () {
  'use strict';

  var sections = document.getElementById('sections');
  var addBtn = document.getElementById('addSection');
  var template = document.getElementById('sectionTemplate');
  var coverInput = document.getElementById('cover');
  var preview = document.getElementById('coverPreview');
  var previewImg = document.getElementById('coverPreviewImg');
  var previewText = document.getElementById('coverPreviewText');

  function bindRemove(root) {
    (root || document).querySelectorAll('.js-remove-section').forEach(function (btn) {
      btn.onclick = function () {
        var block = btn.closest('.admin-section');
        if (!block || !sections) return;
        if (sections.querySelectorAll('.admin-section').length <= 1) {
          block.querySelectorAll('input, textarea').forEach(function (el) {
            el.value = '';
          });
          return;
        }
        block.remove();
      };
    });
  }

  if (addBtn && template && sections) {
    addBtn.addEventListener('click', function () {
      var node = template.content.cloneNode(true);
      sections.appendChild(node);
      bindRemove(sections);
    });
  }

  bindRemove();

  if (coverInput && previewImg) {
    coverInput.addEventListener('change', function () {
      var file = coverInput.files && coverInput.files[0];
      if (!file) return;
      var url = URL.createObjectURL(file);
      previewImg.src = url;
      previewImg.hidden = false;
      if (previewText) previewText.hidden = true;
      if (preview) preview.classList.remove('is-empty');
    });
  }
})();
