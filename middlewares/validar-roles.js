const { request, response  } = require('express');

const esAdminRole = ( req = request, res = response, next ) => {

    if ( !req.usuario ) {
        return res.status(500).json({
            msg: 'Antes de validar tu rol, debes estar logueado'
        });
    }

    //Verificación solo el rol de Admi puede realizar la eliminación
    //Si cumple con el rol de admin se envia al controllador deleteUsuario
    const { rol, nombre  } = req.usuario
    if ( rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ nombre } no es admin - solo el admin puede acceder`
        });
    }

    next();

}

const esClienteRole = (req = request, res = response) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Antes de validar tu rol, debes estar logueado.'
        })
    }

    const {rol, nombre} = req.usuario
    if (rol === 'CLIENTE_ROLE') {
        return res.status(200).json({
            msg: `${ nombre } eres un cliente`
        })
    }

    next();
}

module.exports = {
    esAdminRole,
    esClienteRole
}