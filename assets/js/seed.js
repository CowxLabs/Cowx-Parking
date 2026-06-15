(function () {
  if (localStorage.getItem(PASSES_KEY)) return;

  var tenantNames = [
    'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer',
    'Michael', 'Linda', 'David', 'Barbara', 'William', 'Elizabeth',
    'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah',
    'Charles', 'Karen'
  ];

  var visitorNames = [
    'Christopher', 'Amanda', 'Daniel', 'Ashley', 'Matthew', 'Emily',
    'Anthony', 'Megan', 'Mark', 'Stephanie', 'Donald', 'Nicole',
    'Steven', 'Rachel', 'Paul', 'Lauren', 'Andrew', 'Kimberly',
    'Joshua', 'Christina', 'Kenneth', 'Vanessa', 'Kevin', 'Angela',
    'Brian', 'Melissa', 'George', 'Deborah', 'Timothy', 'Laura',
    'Ronald', 'Lisa', 'Edward', 'Nancy', 'Jason', 'Sandra',
    'Jeffrey', 'Cynthia', 'Ryan', 'Kathleen', 'Jacob', 'Shirley',
    'Gary', 'Amy', 'Nicholas', 'Anna', 'Eric', 'Rebecca',
    'Jonathan', 'Virginia', 'Stephen', 'Heather', 'Larry', 'Diane',
    'Justin', 'Julie', 'Scott', 'Michele', 'Brandon', 'Tiffany'
  ];

  var units = [];
  for (var i = 1; i <= 30; i++) units.push(String(i * 10 + 1 + Math.floor(i / 10)));

  var spots = [];
  for (var i = 1; i <= 30; i++) spots.push('Guest-' + String(i).padStart(2, '0'));

  function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomPlate() {
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var nums = '0123456789';
    var l = '';
    for (var i = 0; i < 3; i++) l += letters[Math.floor(Math.random() * 26)];
    var n = '';
    for (var i = 0; i < 4; i++) n += nums[Math.floor(Math.random() * 10)];
    return l + '-' + n;
  }

  function hoursAgo(n) {
    return new Date(Date.now() - n * 60 * 60 * 1000).toISOString();
  }

  function hoursFromNow(n) {
    return new Date(Date.now() + n * 60 * 60 * 1000).toISOString();
  }

  var statuses = [];
  var statusWeights = { active: 40, expired: 50, revoked: 10 };

  for (var i = 0; i < 30; i++) {
    var roll = Math.random() * 100;
    if (roll < statusWeights.active) statuses.push('active');
    else if (roll < statusWeights.active + statusWeights.expired) statuses.push('expired');
    else statuses.push('revoked');
  }

  var passes = [];
  for (var i = 0; i < 30; i++) {
    var tenantName = randomPick(tenantNames);
    var unit = randomPick(units);
    var visitorName = randomPick(visitorNames);
    var vehiclePlate = randomPlate();
    var spot = randomPick(spots);
    var status = statuses[i];

    var createdAt, expiresAt;

    if (status === 'active') {
      var hoursAgoCreated = Math.floor(Math.random() * 3);
      var durationHours = [2, 4, 8, 12, 24][Math.floor(Math.random() * 5)];
      createdAt = hoursAgo(hoursAgoCreated);
      expiresAt = hoursFromNow(durationHours - hoursAgoCreated);
    } else if (status === 'revoked') {
      createdAt = hoursAgo(Math.floor(Math.random() * 48) + 1);
      expiresAt = hoursFromNow(Math.floor(Math.random() * 24));
    } else {
      var hoursSinceExpiry = Math.floor(Math.random() * 72) + 1;
      createdAt = hoursAgo(hoursSinceExpiry + Math.floor(Math.random() * 4) + 1);
      expiresAt = hoursAgo(hoursSinceExpiry);
    }

    passes.push({
      id: generateId(),
      tenantName: tenantName,
      unit: unit,
      visitorName: visitorName,
      vehiclePlate: vehiclePlate,
      spot: spot,
      createdAt: createdAt,
      expiresAt: expiresAt,
      status: status
    });
  }

  savePasses(passes);

  var tenants = tenantNames.map(function (name, i) {
    return {
      name: name,
      unit: units[i % units.length],
      email: name.toLowerCase() + '@parkpass.demo'
    };
  });
  localStorage.setItem(TENANTS_KEY, JSON.stringify(tenants));
})();
