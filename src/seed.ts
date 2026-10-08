import { getDb, getAuth } from './database/firestore';

export async function seedDatabase() {
  const db = getDb();
  const auth = getAuth();

  const now = new Date().toISOString();

  // Real initial accounts
  const realUsers = [
    {
      email: 'admin@college.edu',
      password: 'Admin@123456',
      name: 'System Administrator',
      role: 'admin',
      department: 'Central Administration',
      phone: '+91 98765 00001',
      status: 'ACTIVE',
    },
    {
      email: 'coordinator@college.edu',
      password: 'Coord@123456',
      name: 'Event Coordinator',
      role: 'coordinator',
      department: 'Student Affairs',
      phone: '+91 98765 00002',
    },
    {
      email: 'jury@college.edu',
      password: 'Jury@123456',
      name: 'Evaluation Jury',
      role: 'jury',
      department: 'Academic Panel',
      phone: '+91 98765 00003',
    },
    {
      email: 'admin@campuspulse.edu',
      password: 'Admin@123456',
      name: 'System Administrator',
      role: 'admin',
      department: 'Central Administration',
      phone: '+91 98765 00001',
    },
    {
      email: 'coordinator@campuspulse.edu',
      password: 'Coord@123456',
      name: 'Event Coordinator',
      role: 'coordinator',
      department: 'Student Affairs',
      phone: '+91 98765 00002',
    },
    {
      email: 'jury@campuspulse.edu',
      password: 'Jury@123456',
      name: 'Evaluation Jury',
      role: 'jury',
      department: 'Academic Panel',
      phone: '+91 98765 00003',
    },
    {
      email: 'coordinator1@campuspulse.edu',
      password: 'Coord@123456',
      name: 'Technical Coordinator (Coord 1)',
      role: 'coordinator',
      department: 'Computer Science & Engineering',
      phone: '+91 98765 00011',
    },
    {
      email: 'coordinator2@campuspulse.edu',
      password: 'Coord@123456',
      name: 'Cultural Coordinator (Coord 2)',
      role: 'coordinator',
      department: 'Student Affairs & Arts',
      phone: '+91 98765 00012',
    },
    {
      email: 'coordinator3@campuspulse.edu',
      password: 'Coord@123456',
      name: 'Logistics Coordinator (Coord 3)',
      role: 'coordinator',
      department: 'Operations & Media',
      phone: '+91 98765 00013',
    },
    {
      email: 'coordinator4@campuspulse.edu',
      password: 'Coord@123456',
      name: 'Event Coordinator 4',
      role: 'coordinator',
      department: 'Event Operations',
      phone: '+91 98765 00014',
    },
    {
      email: 'jury1@campuspulse.edu',
      password: 'Jury@123456',
      name: 'Dr. Ramesh Kumar (Jury 1)',
      role: 'jury',
      department: 'Technical Evaluation Panel',
      phone: '+91 98765 00021',
    },
    {
      email: 'jury2@campuspulse.edu',
      password: 'Jury@123456',
      name: 'Prof. Ananya Sen (Jury 2)',
      role: 'jury',
      department: 'Cultural Evaluation Panel',
      phone: '+91 98765 00022',
    },
    {
      email: 'jury3@campuspulse.edu',
      password: 'Jury@123456',
      name: 'Dr. Vikram Malhotra (Jury 3)',
      role: 'jury',
      department: 'Creative Arts & Media Panel',
      phone: '+91 98765 00023',
    },
    {
      email: 'jury4@campuspulse.edu',
      password: 'Jury@123456',
      name: 'Evaluation Jury 4',
      role: 'jury',
      department: 'Special Evaluation Panel',
      phone: '+91 98765 00024',
    },
  ];

  for (const account of realUsers) {
    let uid = '';
    // If live Firebase Auth is available, ensure user exists with credentials
    if (auth) {
      try {
        const existing = await auth.getUserByEmail(account.email);
        uid = existing.uid;
      } catch (err: any) {
        if (err.code === 'auth/user-not-found') {
          try {
            const created = await auth.createUser({
              email: account.email,
              password: account.password,
              displayName: account.name,
            });
            uid = created.uid;
          } catch (createErr) {
            console.warn(`Could not create auth user ${account.email}:`, createErr);
          }
        }
      }
    }

    if (!uid) {
      // In local store or fallback mode, check existing doc by email
      const existingDoc = await db.collection('users').where('email', '==', account.email).get();
      if (!existingDoc.empty) {
        uid = existingDoc.docs[0].id;
      } else {
        uid = `user_${account.role}_${Math.random().toString(36).substring(2, 8)}`;
      }
    }

    const userDocRef = db.collection('users').doc(uid);
    const docSnap = await userDocRef.get();
    if (!docSnap.exists) {
      await userDocRef.set({
        uid,
        email: account.email,
        name: account.name,
        role: account.role,
        department: account.department,
        phone: account.phone,
        status: 'ACTIVE',
        createdAt: now,
        updatedAt: now,
      });
      console.log(`👤 Initialized system user: ${account.email} (${account.role}) [UID: ${uid}]`);
    }
  }

  console.log('✅ Real database initialized: No mock events or data.');
}
