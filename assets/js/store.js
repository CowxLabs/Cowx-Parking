var PASSES_KEY = 'parkpass_passes';
var TENANTS_KEY = 'parkpass_tenants';
var LOGGED_USER_KEY = 'parkpass_user';

function getPasses() {
  try {
    return JSON.parse(localStorage.getItem(PASSES_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function savePasses(passes) {
  localStorage.setItem(PASSES_KEY, JSON.stringify(passes));
}

function addPass(pass) {
  var passes = getPasses();
  passes.unshift(pass);
  savePasses(passes);
  return pass;
}

function getPass(id) {
  return getPasses().find(function (p) { return p.id === id; });
}

function updatePass(id, updates) {
  var passes = getPasses();
  var idx = passes.findIndex(function (p) { return p.id === id; });
  if (idx === -1) return null;
  passes[idx] = Object.assign({}, passes[idx], updates);
  savePasses(passes);
  return passes[idx];
}

function revokePass(id) {
  return updatePass(id, { status: 'revoked' });
}

function getTenants() {
  try {
    return JSON.parse(localStorage.getItem(TENANTS_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveTenants(tenants) {
  localStorage.setItem(TENANTS_KEY, JSON.stringify(tenants));
}

function getLoggedUser() {
  try {
    return JSON.parse(localStorage.getItem(LOGGED_USER_KEY));
  } catch (e) {
    return null;
  }
}

function setLoggedUser(user) {
  if (user) {
    localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(LOGGED_USER_KEY);
  }
}

function logout() {
  setLoggedUser(null);
  window.location.href = '../index.html';
}

function exportPassesCSV(filter) {
  var passes = filter === 'all' ? getPasses() : getPasses().filter(function (p) {
    return getStatus(p) === filter;
  });

  if (passes.length === 0) {
    alert('No passes to export.');
    return;
  }

  var headers = ['Pass ID', 'Tenant', 'Unit', 'Visitor Name', 'Vehicle Plate', 'Spot', 'Created', 'Expires', 'Status'];
  var rows = passes.map(function (p) {
    return [
      '"' + p.id + '"',
      '"' + p.tenantName + '"',
      '"' + p.unit + '"',
      '"' + p.visitorName + '"',
      '"' + p.vehiclePlate + '"',
      '"' + p.spot + '"',
      '"' + formatDate(p.createdAt) + '"',
      '"' + formatDate(p.expiresAt) + '"',
      '"' + getStatus(p) + '"'
    ].join(',');
  });

  var csv = headers.join(',') + '\n' + rows.join('\n');
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'parkpass-' + filter + '-' + new Date().toISOString().slice(0, 10) + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getTenantPasses(tenantName) {
  return getPasses().filter(function (p) {
    return p.tenantName.toLowerCase() === tenantName.toLowerCase();
  });
}
