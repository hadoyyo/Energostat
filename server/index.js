const express = require('express');
const { sequelize, Country, AppUser, syncModels } = require('./models');

const app = express();


const PORT = process.env.SERVER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server works on port: ${PORT}`);
});


// async function main() {
//   await syncModels();

//   const newUser = await AppUser.create({
//     firstName: 'Jan',
//     lastName: 'Kowalski',
//     email: 'jan@example.com',
//     password: 'secure123',
//   });

//   console.log('New user created:', newUser.toJSON());
// }

// main().catch(console.error);