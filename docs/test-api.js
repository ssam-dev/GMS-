// Quick API test to verify trainers endpoint
fetch('http://localhost:5000/api/trainers')
  .then(res => res.json())
  .then(data => {
    console.log(`✅ Successfully fetched ${data.length} trainers`);
    if (data.length > 0) {
      const trainer = data[0];
      console.log(`\nFirst trainer: ${trainer.first_name} ${trainer.last_name}`);
      console.log(`  Email: ${trainer.email}`);
      console.log(`  Specialization: ${trainer.specialization}`);
      console.log(`  Status: ${trainer.status}`);
    }
  })
  .catch(err => console.error('❌ Error:', err.message));
