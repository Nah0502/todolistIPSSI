const UserModel = require('../../models/user')
const { checkPassword } = require('../../utils/bcrypt')
const { hashPassword } = require('../../utils/bcrypt');
const {jwtSign} = require("../../config/jwtConfig");

exports.signIn = async (req, res) => {
    if (!req.body) return res.status(400).json({ msg: 'BAD REQUEST BODY IS REQUIRED'})
    try {
        const { email, password} = req.body
        const user = await UserModel.findOne({where: { email}})
        if (user.dataValues.email !== email || !checkPassword(password, user.password)){
            return res.status(400).json({msg: 'BAD REQUEST PASSWORD OR EMAIL NOT VALID'})
        }
        const token = await jwtSign({ id: user.id, email: user.email})
        console.log(token)
        await UserModel.update({ token }, { where: { id: user.id } })
        console.log(user)
        return res.status(200).json({msg: 'OK', user: {...user.dataValues, token}})
    } catch (e) {
        console.error('Error signing in:', e.message);
        return res.status(500).json({ msg: 'INTERNAL SERVER ERROR' });
    }
}

exports.signUp = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ msg: 'BAD REQUEST BODY IS REQUIRED' });
        }
        const { email, password, role } = req.body;
        const existingUser = await UserModel.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        const hashedPassword = await hashPassword(password);
        const newUser = await UserModel.create({
            email,
            role,
            password: hashedPassword,
        });
        const token = await jwtSign({ id: newUser.id, email: newUser.email});
        await UserModel.update({ token }, { where: { id: newUser.id } });
        return res.status(200).json({ msg: 'User created successfully', user: { ...newUser.dataValues, token } });
    } catch (e) {
        console.error('Error signing up:', e.message);
        return res.status(500).json({ msg: 'INTERNAL SERVER ERROR' });
    }
};


