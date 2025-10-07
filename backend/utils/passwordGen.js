const passwordGenerator = require("password-generator");

function generatePassword(options = {}) {
  const { length = 16, numbers = true, symbols = true, excludeLookAlikes = true } = options;

  const lettersLower = "abcdefghijklmnopqrstuvwxyz";
  const lettersUpper = lettersLower.toUpperCase();
  const nums = "0123456789";
  const syms = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let charset = lettersLower + lettersUpper;
  if (numbers) charset += nums;
  if (symbols) charset += syms;

  if (excludeLookAlikes) charset = charset.split("").filter(c => !"0OIl1|".includes(c)).join("");

  let pwd = "";
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * charset.length);
    pwd += charset[idx];
  }
  return pwd;
}

module.exports = generatePassword;
