const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const TodoitemModel = require('../models/ToDoItem');

const jwtSign = async (payload) => {
    try {
        return jwt.sign(payload, process.env.SECRET_PASS, {
            expiresIn: '1d'
        });
    } catch (e) {
        return e.message;
    }
};

const jwtVerify = async (token) => {
    try {
        // décoder le token et obtenir le payload
        const decoded = jwt.verify(token, process.env.SECRET_PASS);
        // vérifie la date d'expiration
        if (decoded.exp < Date.now() / 1000) {
            return false; // token expiré
        }
        const user = await UserModel.findByPk(decoded.id);
        if (!user || user.token !== token) {
            return false;
        }
        // return !!user // token valide
        return decoded; // retourne le payload du token
    }
    catch (e) {
        console.log(e.message);
        return false;
    }
};

const checkIsAuth = async (req, res, next) => {
    try {
        if(req.originalUrl.includes(process.env.API_PATH)){
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                return res.status(401).json({ msg: 'Authorization header missing' });
            }
            const token = authHeader.split(" ")[1];
            const decoded = await jwtVerify(token);
            console.log('Decoded Token:', decoded); // Ajouter ce log
            if (!decoded){
                return res.status(401).json({msg: 'Unauthorized'});
            }
            req.user = decoded; // Définit req.user avec le payload du token
            console.log('User Role:', req.user.role); // Ajouter ce log
            next();
        } else {
            next();
        }
    } catch (e) {
        console.log(e.message);
        return res.status(400).json({msg: 'BAD REQUEST'});
    }
};

const checkRole = (requiredRole) => async (req, res, next) => {
    try {
        await checkIsAuth(req, res, async () => {
            console.log(req.user.role)
            if (!req.user || req.user.role !== requiredRole) {
                console.log("Rôle non autorisé");
                return res.status(403).json({ msg: 'Vous n\'avez pas les permissions' });
            }
            next();
        });
    } catch (error) {
        console.error('Erreur lors de la vérification du rôle:', error.message);
        return res.status(500).json({ msg: 'Erreur Interne du Serveur' });
    }
};

const checkPermission = (model) => async (req, res, next) => {
    let urlId;
    const token = recupToken(req);

    try {
        await checkIsAuth(req, res, async () => {
            urlId = req.params.urlId;
            console.log("urlId extrait :", urlId);

            if (!urlId) {
                console.log("ID de l'URL manquant");
                return res.status(400).json({ msg: 'ID de l\'URL manquant' });
            }

            const decoded = jwt.verify(token, process.env.SECRET_PASS);
            const contenu = await model.findByPk(urlId);

            console.log("urlId :", urlId);
            console.log("Contenu trouvé :", contenu);

            if (!contenu) {
                return res.status(404).json({ msg: 'Contenu non trouvé' });
            }

            // Vérifiez si l'utilisateur est l'auteur de la ressource
            if (contenu.userId !== decoded.id) {
                console.log("Utilisateur non autorisé");
                return res.status(403).json({ msg: 'Vous n\'êtes pas l\'auteur de cette ressource' });
            }
            next();
        });
    } catch (error) {
        console.error('Erreur lors de la vérification:', error.message);
        return res.status(500).json({ msg: 'Vous n\'avez pas la permission' });
    }
};

const checkTodoitemPermission = checkPermission(TodoitemModel);

module.exports = {
    checkPermission,
    checkTodoitemPermission,
    checkRole,
    jwtSign,
    jwtVerify,
    checkIsAuth
};
