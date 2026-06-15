function generateId() {
  return 'P-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function formatDate(iso) {
  var d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit'
  });
}

function formatDateShort(iso) {
  var d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit'
  });
}

function getDurationLabel(ms) {
  var h = ms / (1000 * 60 * 60);
  if (h < 1) return Math.round(ms / (1000 * 60)) + ' min';
  if (h === 1) return '1 hour';
  if (h < 24) return h + ' hours';
  return Math.round(h / 24) + ' day' + (Math.round(h / 24) > 1 ? 's' : '');
}

function getTimeRemaining(expiresAt) {
  var diff = new Date(expiresAt) - Date.now();
  if (diff <= 0) return { total: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  var hours = Math.floor(diff / (1000 * 60 * 60));
  var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { total: diff, hours: hours, minutes: minutes, seconds: seconds, expired: false };
}

function getStatus(pass) {
  if (pass.status === 'revoked') return 'revoked';
  if (new Date(pass.expiresAt) <= Date.now()) return 'expired';
  return 'active';
}

function pluralize(n, word) {
  return n + ' ' + (n === 1 ? word : word + 's');
}

function qs(sel) {
  return document.querySelector(sel);
}

function qsa(sel) {
  return document.querySelectorAll(sel);
}

function on(sel, event, fn) {
  document.addEventListener(event, function (e) {
    var el = e.target.closest(sel);
    if (el) fn.call(el, e);
  });
}
