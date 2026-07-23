const BASE_URL = 'http://localhost:5113/api';

async function seed() {
  console.log('Starting database seeding...');

  // 1. Create a test admin user and login
  let token = '';
  try {
    const regRes = await fetch(`${BASE_URL}/Auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@assetflow.com',
        password: 'Password123!',
        firstName: 'System',
        lastName: 'Admin'
      })
    });
    console.log('Register admin status:', regRes.status);
  } catch (e) {
    console.log('Admin registration skipped (might already exist).');
  }

  // Login
  const loginRes = await fetch(`${BASE_URL}/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@assetflow.com',
      password: 'Password123!'
    })
  });

  if (!loginRes.ok) {
    console.error('Failed to log in as admin. Seeding aborted.');
    return;
  }

  const loginData = await loginRes.json();
  token = loginData.token;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  console.log('Logged in successfully. Token acquired.');

  // Helper POST function
  async function post(endpoint, body) {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`POST ${endpoint} failed: ${res.status} - ${errText}`);
    }
    return res.json();
  }

  // Helper GET function
  async function get(endpoint) {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'GET',
      headers
    });
    if (!res.ok) {
      throw new Error(`GET ${endpoint} failed: ${res.status}`);
    }
    return res.json();
  }

  // 2. Seed Departments
  console.log('Checking Departments...');
  const existingDepts = await get('Department');
  const departments = [...existingDepts];
  const deptNames = [
    'Information Technology', 'Human Resources', 'Finance & Accounting',
    'Marketing & PR', 'Operations & Logistics', 'Legal & Compliance',
    'Research & Development', 'Sales & BizDev', 'Customer Success', 'Facilities'
  ];
  for (let i = 0; i < 10; i++) {
    const name = deptNames[i];
    if (departments.some(d => d.name === name)) continue;
    const code = name.split(' ').map(w => w[0]).join('').substring(0, 4).toUpperCase() + (i + 1);
    try {
      const d = await post('Department', {
        name,
        code,
        description: `${name} Corporate Division`,
        isActive: true
      });
      departments.push(d);
      console.log(`Created Department: ${name}`);
    } catch (e) {
      console.log(`Failed to create Department ${name}:`, e.message);
    }
  }

  // 3. Seed Employees
  console.log('Checking Employees...');
  const existingEmps = await get('Employee');
  const employees = [...existingEmps];
  const empNames = [
    { first: 'Alice', last: 'Smith' }, { first: 'Bob', last: 'Jones' },
    { first: 'Charlie', last: 'Brown' }, { first: 'Diana', last: 'Prince' },
    { first: 'Ethan', last: 'Hunt' }, { first: 'Fiona', last: 'Gallagher' },
    { first: 'George', last: 'Clark' }, { first: 'Hannah', last: 'Abbott' },
    { first: 'Ian', last: 'Malcolm' }, { first: 'Julia', last: 'Roberts' }
  ];
  for (let i = 0; i < 10; i++) {
    const emp = empNames[i];
    const email = `${emp.first.toLowerCase()}.${emp.last.toLowerCase()}@assetflow.com`;
    if (employees.some(e => e.email === email)) continue;
    const dept = departments[i % departments.length];
    try {
      const e = await post('Employee', {
        employeeCode: `EMP${1000 + i}`,
        firstName: emp.first,
        lastName: emp.last,
        email,
        phone: `555-010${i}`,
        departmentId: dept.id,
        designation: 'Specialist',
        status: 1 // active
      });
      employees.push(e);
      console.log(`Created Employee: ${emp.first} ${emp.last}`);
    } catch (e) {
      console.log(`Failed to create Employee ${emp.first}:`, e.message);
    }
  }

  // 4. Seed Vendors
  console.log('Checking Vendors...');
  const existingVendors = await get('Vendor');
  const vendors = [...existingVendors];
  const vendorNames = [
    'Apex Technology Solutions', 'Global Office Supplies', 'NetLink Networking Inc.',
    'Prime Software Licences', 'Secure Safe Storage', 'BlueStar Logistics',
    'Pinnacle Furnitures Ltd', 'InnoTech Hardware', 'SysCare Systems', 'Core Networks'
  ];
  for (let i = 0; i < 10; i++) {
    const name = vendorNames[i];
    if (vendors.some(v => v.vendorName === name)) continue;
    try {
      const v = await post('Vendor', {
        vendorCode: `VND-${1000 + i}`,
        vendorName: name,
        contactPerson: `Contact Person ${i + 1}`,
        email: `sales@${name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
        phoneNumber: `555-020${i}`,
        gstNumber: `29ABCDE${1000 + i}F1Z5`,
        address: `Industrial Avenue ${i + 1}, Building B`,
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        postalCode: '98101',
        website: 'www.vendor.com'
      });
      vendors.push(v);
      console.log(`Created Vendor: ${name}`);
    } catch (e) {
      console.log(`Failed to create Vendor ${name}:`, e.message);
    }
  }

  // 5. Seed Categories
  console.log('Checking Categories...');
  const existingCats = await get('AssetCategory');
  const categories = [...existingCats];
  const catNames = [
    'Laptops', 'Desktops', 'Monitors', 'Smartphones', 'Printers',
    'Servers', 'Switches & Routers', 'Office Chairs', 'Conference Tables', 'Software Licences'
  ];
  for (let i = 0; i < 10; i++) {
    const name = catNames[i];
    if (categories.some(c => c.name === name)) continue;
    try {
      const c = await post('AssetCategory', {
        name,
        code: name.substring(0, 3).toUpperCase() + (i + 1),
        description: `${name} assets register`
      });
      categories.push(c);
      console.log(`Created Category: ${name}`);
    } catch (e) {
      console.log(`Failed to create Category ${name}:`, e.message);
    }
  }

  // 6. Seed Locations
  console.log('Checking Locations...');
  const existingLocs = await get('Location');
  const locations = [...existingLocs];
  const locNames = [
    'HQ Building A, Floor 1', 'HQ Building A, Floor 2', 'HQ Building B, Floor 1',
    'Silicon Valley Branch Office', 'New York Logistics Hub', 'Texas Data Center',
    'London UK Regional Office', 'Tokyo JP Sales Branch', 'Sydney AU Desk Space', 'Warehouse C Site'
  ];
  for (let i = 0; i < 10; i++) {
    const name = locNames[i];
    if (locations.some(l => l.name === name)) continue;
    try {
      const l = await post('Location', {
        name,
        code: 'LOC' + (i + 1),
        description: `Office space details for ${name}`
      });
      locations.push(l);
      console.log(`Created Location: ${name}`);
    } catch (e) {
      console.log(`Failed to create Location ${name}:`, e.message);
    }
  }

  // 7. Seed Assets
  console.log('Checking Assets...');
  const existingAssets = await get('Asset');
  const assets = [...existingAssets];
  const assetNames = [
    'MacBook Pro 16"', 'Dell OptiPlex 7090', 'LG UltraFine 4K Monitor',
    'iPhone 15 Pro Max', 'HP LaserJet Enterprise', 'PowerEdge R750 Server',
    'Cisco Catalyst Switch', 'Herman Miller Aeron Chair', 'Boardroom Oak Table', 'Office 365 Enterprise Lic'
  ];
  for (let i = 0; i < 10; i++) {
    const name = assetNames[i];
    if (assets.some(a => a.assetName === name)) continue;
    const cat = categories[i % categories.length];
    const loc = locations[i % locations.length];
    const ven = vendors[i % vendors.length];
    const purchaseDate = new Date();
    purchaseDate.setMonth(purchaseDate.getMonth() - 6);
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);

    try {
      const a = await post('Asset', {
        assetCode: `AST-${1000 + i}`,
        assetName: name,
        categoryId: cat.id,
        serialNumber: `SN-ABCD-${1000 + i}`,
        model: `Model X-${i + 1}`,
        manufacturer: `Manufacturer M-${i + 1}`,
        purchaseDate: purchaseDate.toISOString(),
        purchaseCost: 500 + (i * 250),
        warrantyExpiryDate: expiryDate.toISOString(),
        status: 'Available',
        locationId: loc.id,
        vendorId: ven.id,
        description: `${name} premium quality business unit.`
      });
      assets.push(a);
      console.log(`Created Asset: ${name}`);
    } catch (e) {
      console.log(`Failed to create Asset ${name}:`, e.message);
    }
  }

  // 8. Seed Allocations
  console.log('Checking Allocations...');
  const existingAllocations = await get('Allocation');
  if (existingAllocations.length === 0) {
    // Allocate first 3 assets to employees
    for (let i = 0; i < 3; i++) {
      const asset = assets[i];
      const emp = employees[i];
      const dept = departments[i];
      try {
        await post('Allocation/allocate', {
          assetId: asset.id,
          employeeId: emp.id,
          departmentId: dept.id,
          allocatedBy: 'System Seeding',
          remarks: 'Allocated during database seeding'
        });
        console.log(`Allocated Asset ${asset.assetName} to ${emp.firstName}`);
      } catch (e) {
        console.log(`Failed to allocate asset ${asset.assetName}:`, e.message);
      }
    }
  }

  // 9. Seed Maintenance Records
  console.log('Checking Maintenance Records...');
  const existingMaintenance = await get('AssetMaintenance');
  if (existingMaintenance.length === 0) {
    // Add maintenance for 2 assets
    for (let i = 3; i < 5; i++) {
      const asset = assets[i];
      const ven = vendors[i];
      try {
        await post('AssetMaintenance', {
          assetId: asset.id,
          vendorId: ven.id,
          maintenanceDate: new Date().toISOString(),
          maintenanceType: 'Scheduled Repair',
          description: 'Monthly scheduled routine hardware check and diagnostic testing.',
          cost: 150.00
        });
        console.log(`Created Maintenance Log for ${asset.assetName}`);
      } catch (e) {
        console.log(`Failed to create Maintenance Log for ${asset.assetName}:`, e.message);
      }
    }
  }

  console.log('Database seeding status check finished!');
}

seed().catch(err => {
  console.error('Error seeding database:', err);
});
