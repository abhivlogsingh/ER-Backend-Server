// hashPassword.js gen hash pass thats why here this file

const bcrypt = require("bcrypt");

async function hashPassword() {
  const password = "12345"; // Replace with the actual password
  const saltRounds = 10;

  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Hashed password:", hash);
}

hashPassword();
