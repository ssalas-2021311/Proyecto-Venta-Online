//Importacion
const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

//Modelos
const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');


const getUsuarios = async (req = request, res = response) => {

    //Condición, me busca solo los usuarios que tengan estado en true
    const query = { estado: true };

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        msg: 'Mostrando todos los usuarios existentes',
        listaUsuarios
    });

}

const postUsuario = async (req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuarioDB = new Usuario({ nombre, correo, password, rol });

    //Encriptar password
    const salt = bcryptjs.genSaltSync();
    usuarioDB.password = bcryptjs.hashSync(password, salt);

    //Guardar en Base de datos
    await usuarioDB.save();

    res.status(201).json({
        msg: 'Usuario creado con exito',
        usuarioDB
    });

}

const putUsuario = async (req = request, res = response) => {

    const { id } = req.params;

    //Ignoramos el _id, rol, estado y google al momento de editar y mandar la petición en el req.body
    const { _id, rol, estado, ...resto } = req.body;

    if ( rol == 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: "No se puede editar a un admin"
        });
    }

    // //Encriptar password
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(resto.password, salt);

    //editar y guardar
    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT API de usuario',
        usuarioEditado
    });

}


const deleteUsuario = async (req = request, res = response) => {

    const { id } = req.params;
    const rol = req.usuario.rol;
    if (rol != 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: "No se puede eliminar a un admin"
        });
    }

    //eliminar fisicamente y guardar
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    // O bien cambiando el estado del usuario

    //editar y guardar
    //const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        msg: 'DELETE API de usuario',
        usuarioEliminado
    });

}

const registroUsuario = async (req = request, res = response) => {
    const {nombre, correo, password} = req.body;
    const usuarioRegistrado = new Usuario({nombre, correo, password});
    const salt = bcryptjs.genSaltSync();
    usuarioRegistrado.password = bcryptjs.hashSync(password, salt);
    
    await usuarioRegistrado.save();

    res.status(201).json({
        msg: 'Nuevo cliente registrado',
        usuarioRegistrado
        
    })
    

}

const deleteCuentaUsuario = async(req = request, res = response) => {
    const {id} = req.params;
    const usuarioId = req.usuario._id;

    if(id === usuarioId){
        const usuarioEliminado = await Usuario.findByIdAndDelete(id);
        usuarioEliminado
    } else{
        return res.status(401).json({
            msg: 'No tienes permiso para eliminar este usuario'
        })
    }

}

const updateCuentaUsuario = async(req = request, res = response) => {
    const {id} = req.params;
    const usuarioId = req.usuario._id;
    if(id === usuarioId){
        const {_id, estado, rol, ...resto} = req.body;

        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(resto.password, salt);
    
        const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);
        res.json({
            msg: 'Usuario editado',
            usuarioEditado
        })
    } else{
        return res.status(401).json({
            msg: 'No tienes permiso para editar este usuario'
        })
    }
}



module.exports = {
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario,
    registroUsuario,
    deleteCuentaUsuario,
    updateCuentaUsuario
}