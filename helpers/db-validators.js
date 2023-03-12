const Usuario = require('../models/usuario');
const Categoria = require('../models/categoria');
const Role = require('../models/role');
const Producto = require('../models/producto');

//Validamos en contro de la db si ese correo ya existe
const emailExiste = async( correo = '' ) => {
    //Verficar si el correo existe
    const existeEmailDeUsuario = await Usuario.findOne( { correo } );
    if ( existeEmailDeUsuario) {
        throw new Error(`El correo ${ correo }, ya esta registrado en la DB `);
    }
}

const esRoleValido = async( rol = '') => {
    //Verificar si el rol es valido y existe en la DB
    const existeRolDB = await Role.findOne( { rol } );
    if ( !existeRolDB ) {
        throw new Error(`El rol ${ rol }, no existe en la DB `);
    }
}


const existeUsuarioPorId = async( id ) => {

    //Verificar si existe el ID
    const existIdOfUser = await Usuario.findById( id );
    if ( !existIdOfUser ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }

}

const existeProducto = async(nombre = '')=> {
    const existeProductDB = await Producto.findOne({nombre});
    if (!existeProductDB){
        throw new Error(`El producto ${ nombre }, no existe en la DB `);
    }
}

const categoriaExiste = async( nombre = '') => {
    //Verificar si el rol es valido y existe en la DB
    const existeCategoria = await Categoria.findOne( { nombre } );
    if ( existeCategoria) {
        throw new Error(`La categoria ${ nombre }, ya esta registrado en la DB `);
    }
}

const existeCategoriaPorId = async( id ) => {

    //Verificar si existe el ID
    const existIdOfCategory = await Categoria.findById( id );
    if ( !existIdOfCategory ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }

}


const existeProductoPorId = async( id ) => {
    //Verificar si existe el ID
    const existIdOfProduct = await Producto.findById( id );
    if ( !existIdOfProduct ) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }

}


module.exports = {
    emailExiste,
    esRoleValido,
    existeProducto,
    categoriaExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}