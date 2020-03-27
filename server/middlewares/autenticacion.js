var jwt = require('jsonwebtoken');
// ==================
// Verifica Token
// ==================

let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();

    });
}

// ==================
// Verifica Admin Rol
// ==================

let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;
    console.log(usuario);

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

    next();

}

module.exports = {
    verificaToken,
    verificaAdminRole
}