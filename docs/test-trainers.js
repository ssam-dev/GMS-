// Quick script to add sample trainers via API using native Node.js http
import http from 'http';

const sampleTrainers = [
  {
    first_name: "John",
    last_name: "Smith",
    email: "john.smith@gym.com",
    phone: "555-0101",
    specialization: "Strength Training",
    certifications: "NASM-CPT, CrossFit Level 1",
    status: "active"
  },
  {
    first_name: "Sarah",
    last_name: "Johnson",
    email: "sarah.j@gym.com",
    phone: "555-0102",
    specialization: "Yoga",
    certifications: "RYT-200, Prenatal Yoga",
    status: "active"
  },
  {
    first_name: "Mike",
    last_name: "Chen",
    email: "mike.chen@gym.com",
    phone: "555-0103",
    specialization: "Cardio",
    certifications: "ACE-CPT, Spinning Instructor",
    status: "active"
  },
  {
    first_name: "Emma",
    last_name: "Davis",
    email: "emma.d@gym.com",
    phone: "555-0104",
    specialization: "Pilates",
    certifications: "PMA-CPT, Mat Pilates",
    status: "active"
  }
];

function postTrainer(trainer) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(trainer);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/trainers',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error('HTTP request error:', err);
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

function getTrainers() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/trainers',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        resolve(JSON.parse(body));
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function addTrainers() {
  for (const trainer of sampleTrainers) {
    try {
      const result = await postTrainer(trainer);
      console.log(`✓ Added: ${trainer.first_name} ${trainer.last_name}`);
    } catch (err) {
      console.error(`✗ Failed to add ${trainer.first_name}:`, err.message);
    }
  }
  
  // Verify trainers were added
  try {
    const trainers = await getTrainers();
    console.log(`\n✓ Total trainers in database: ${trainers.length}`);
    trainers.forEach(t => console.log(`  - ${t.name} (${t.specialization || t.specializations})`));
  } catch (err) {
    console.error('✗ Error fetching trainers:', err.message);
  }
}

addTrainers();
