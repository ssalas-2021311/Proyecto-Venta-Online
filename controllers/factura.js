const {response, request} = require('express');
const Factura = require('../models/factura');
const Carrito = require('../models/carrito');
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');

const getFactura = async (req = request, res = response) => {
    const factura = await Promise.all([
        Factura.countDocuments(),
        Factura.find()
    ])

    res.json({
        msg: 'Facturas encontradas',
        factura
    })
}

const getfacturaPorId = async (req = request , res = response) => {
    const {id} = req.params;
    const usuario = req.usuario._id;
    const carrito = await Carrito.findOne({usuario: usuario});
    const detalle = carrito.producto;
    const facturaID = new Factura({usuario, detalle});

    res.status(201).json({
        msg: 'GET Facturas por ID',
        facturaID
    });
}

const editarFactura = async (req = request, res = response) => {
    const { idFactura } = req.params;
    const factura = await Factura.findById( idFactura )
                                            .populate('usuario', 'detalle');

    const { _id, ...data } = req.body;
    data.usuario = req.usuario._id; //hacemos referencia al usuario que hizo el put por medio del token

    //Edición de categoria                                         // new: true Sirve para enviar el nuevo documento actualizado     
    const producto = await Factura.findByIdAndUpdate( factura, data, { new: true } );

    res.json({
        msg: 'Factura editada',
        producto
    });
}

const comprar = async (req = request, res = response) => {
    const usuario = req.usuario._id;
    const carrito = await Carrito.findOne({usuario: usuario});
    const total = carrito.subtotal;
    const detalle = carrito.producto;
    const facturaDB = new Factura({usuario, total, detalle});

    await facturaDB.save();

    res.status(201).json({
        msg: 'Factura',
        facturaDB
    })
}

module.exports = {
    getFactura,
    getfacturaPorId,
    comprar,
    editarFactura
}