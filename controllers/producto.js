//Importacion
const { response, request } = require('express');
const categoria = require('../models/categoria');
const Categoria = require('../models/categoria');
const producto = require('../models/producto');
//Modelos
const Producto = require('../models/producto');

const obtenerProductos = async(req = request, res = response) => {

     //Condición, me busca solo los productos que tengan estado en true
     const query = { estado: true };

     const listaProductos = await Promise.all([
         Producto.countDocuments(query),
         Producto.find(query)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
     ]);
 
     res.json({
         msg: 'GET API de productos',
         listaProductos
     });

}

const masVendidos = async (req = request, res = response) => {

    const listaMasVendidos = await Promise.all([

        Producto.find({ vendidos: { $gt: 1 } })
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ])

    res.json({
        msg: 'Productos mas vendidos',
        listaMasVendidos
    })
}
const productosAgotados = async (req = request, res = response) => {

    const query = { estado: false };

     const listaProductoss = await Promise.all([
         Producto.countDocuments(query),
         Producto.find(query)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
     ]);
 
     res.json({
         msg: 'Productos agotados',
         listaProductoss
     });
}

const obtenerProductoPorId = async(req = request, res = response) => {

    const { id } = req.params;
    const producto = await Producto.findById( id )
                                            .populate('usuario', 'nombre')
                                            .populate('categoria', 'nombre');

    res.json({
        msg: 'producto por id',
        producto
    });

}

const getObtenerProductoPorNombre = async(req = request, res = response) => {

    const {nombre} = req.body;

    const buscarProducto = await Producto.findOne({nombre}).populate('categoria', 'nombre')

    res.json({
        buscarProducto
    })
}

const getObtenerPorNombreCategoria = async(req = request, res = response) => {
    const { idProductoCategoria } = req.params;
    const query = { categoria: idProductoCategoria }

    const listaProducto = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query).populate('categoria', 'nombre')
    ]);

    res.json({
        msg: 'productos por id de categoria',
        listaProducto
    })
}


const crearProducto = async (req = request, res = response) => {
                                //operador spread
        const { estado, usuario, ...body } = req.body;

        //validación si existe un producto en la db
        const productoEnDB = await Producto.findOne( { nombre: body.nombre } );

        if ( productoEnDB ) {
            return res.status(400).json({
                mensajeError: `El producto ${ productoEnDB.nombre } ya existe en la DB`
            });
        }


        //Generar data a guardar
        const data = {
            ...body,
            nombre: body.nombre.toUpperCase(),
            usuario: req.usuario._id
        }

        const producto = new Producto( data );

        //Guardar en DB
        await producto.save();

        res.status(201).json({
            msg: 'Post Producto',
            producto
        });


}


const actualizarProducto = async(req = request, res = response) => {

    const { id } = req.params;
    const { _id, estado, usuario, ...data } = req.body;

    if ( data.nombre ) {
        data.nombre = data.nombre.toUpperCase();
    }
    
    data.usuario = req.usuario._id; //hacemos referencia al usuario que hizo el put por medio del token

    //Edición de producto               // new: true Sirve para enviar el nuevo documento actualizado     
    const producto = await Producto.findByIdAndUpdate( id, data, { new: true } );

    res.json({
        msg: 'Put de producto',
        producto
    });

}


const eliminarProducto = async(req = request, res = response) => {

    const { id } = req.params;

    //eliminar fisicamente y guardar
    const productoBorrado = await Producto.findByIdAndDelete(id);

    // O bien cambiando el estado del usuario

    //editar y guardar
    //const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        msg: 'delete producto',
        productoBorrado
    });

}



module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    getObtenerProductoPorNombre,
    getObtenerPorNombreCategoria,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    masVendidos,
    productosAgotados
}