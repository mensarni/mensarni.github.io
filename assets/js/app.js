document.querySelectorAll('[data-spa]').forEach(link => {
  link.addEventListener('click', e => {
    if (!link.origin || link.origin !== location.origin) return;

    e.preventDefault();

    fetch(link.href)
      .then(res => res.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        document.querySelector('#content').innerHTML =
          doc.querySelector('#content').innerHTML;

        history.pushState(null, '', link.href);
      });
  });
});

window.addEventListener('popstate', () => location.reload());
