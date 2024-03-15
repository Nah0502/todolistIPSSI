const {hashSync, compareSync} = require("bcrypt");

/**
 *
 * @param myPlaintextPassword {string}
 * @param saltRounds {int}
 * @return {string}
 */
const hashPassword = (myPlaintextPassword, saltRounds = 10) => {
    return hashSync(myPlaintextPassword, saltRounds);
}
/**
 *
 * @return {boolean}
 */
const checkPassword =  (myPlaintextPassword, passwordHash) => {
    // Load hash from your password DB.
    return  compareSync(myPlaintextPassword, passwordHash);

}

module.exports = {
    hashPassword,
    checkPassword
}
