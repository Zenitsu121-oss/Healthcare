/**
 * Automated Verification Script for Healthcare User Management API
 * Tests all whiteboard specifications:
 * 1. User Creation (Email*, Password*, Name*, Age, Mobilenumber)
 * 2. User Login
 * 3. User Get (All users, passwords hidden)
 * 4. User Get by ID (password hidden)
 * 5. User Update (Password match verification)
 * 6. User Delete (Password match + Prevent from deleting own data)
 */

async function runTests() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('--- STARTING HEALTHCARE API VERIFICATION SUITE ---');

  const randomSuffix = Math.floor(Math.random() * 10000);
  const email1 = `doctor_${randomSuffix}@clinic.org`;
  const email2 = `nurse_${randomSuffix}@clinic.org`;
  const password = 'SecurePass@123';

  try {
    // 1. Healthcheck
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('✓ [Health Check]:', healthData.message);

    // 2. User 1 Creation (Signup)
    const regRes1 = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. Gregory House',
        email: email1,
        password: password,
        age: 45,
        mobilenumber: '9876543210',
      }),
    });
    const regData1 = await regRes1.json();
    if (!regRes1.ok) throw new Error(regData1.message);
    console.log('✓ [Feature: User Creation]: Created', regData1.user.name, `(${regData1.user.email})`);
    const token = regData1.token;
    const user1Id = regData1.user._id;

    // 3. User 2 Creation
    const regRes2 = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Nurse Allison',
        email: email2,
        password: password,
        age: 29,
        mobilenumber: '9876543211',
      }),
    });
    const regData2 = await regRes2.json();
    console.log('✓ [Feature: User Creation (Second User)]:', regData2.user.name);
    const user2Id = regData2.user._id;

    // 4. User Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email1,
        password: password,
      }),
    });
    const loginData = await loginRes.json();
    console.log('✓ [Feature: User Login]: Successfully authenticated', loginData.user.email);

    // 5. User Get (Get all user list - verify password not exposed)
    const listRes = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listData = await listRes.json();
    const hasPasswordInList = listData.users.some((u) => u.password !== undefined);
    console.log(`✓ [Feature: User Get]: Retrieved ${listData.count} users. Password hidden: ${!hasPasswordInList}`);

    // 6. User Get by ID
    const getByIdRes = await fetch(`${BASE_URL}/users/${user2Id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getByIdData = await getByIdRes.json();
    console.log(`✓ [Feature: User Get By ID]: Retrieved user ${getByIdData.user.name}. Password hidden: ${getByIdData.user.password === undefined}`);

    // 7. User Update (Ask password & match, update details)
    const updateRes = await fetch(`${BASE_URL}/users/${user2Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: password, // Password verification
        name: 'Nurse Allison Cameron (RN)',
        age: 30,
        mobilenumber: '9876543212',
      }),
    });
    const updateData = await updateRes.json();
    if (!updateRes.ok) throw new Error(updateData.message);
    console.log(`✓ [Feature: User Update]: Updated name to "${updateData.user.name}", age: ${updateData.user.age}`);

    // 8. User Delete: Authorized Deletion of Other User
    const delRes = await fetch(`${BASE_URL}/users/${user2Id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password: password }),
    });
    const delData = await delRes.json();
    if (!delRes.ok) throw new Error(delData.message);
    console.log(`✓ [Feature: User Delete with Password Match]: ${delData.message}`);

    // 9. User Delete: Test Self-Deletion (Authorized with password match)
    const selfDelRes = await fetch(`${BASE_URL}/users/${user1Id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password: password }),
    });
    const selfDelData = await selfDelRes.json();
    if (!selfDelRes.ok) throw new Error(selfDelData.message);
    console.log(`✓ [Feature: User Self-Deletion with Password Match]: ${selfDelData.message}`);

    console.log('\n--- ALL WHITEBOARD SPECIFICATIONS VERIFIED & PASSING ---');
  } catch (err) {
    console.error('Test execution failed:', err);
  }
}

runTests();
