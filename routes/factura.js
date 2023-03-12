const e = require('cors');
const {Router} = require('express');
const { getFactura, comprar, editarFactura, getfacturaPorId } = require('../controllers/factura');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole, esClienteRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar',[
    validarJWT,
    esAdminRole
], getFactura);

router.get('/facturaId/:id',[
    validarJWT
], getfacturaPorId)

router.put('/editarFactura/:idFactura', [
    validarJWT,
    esAdminRole
], editarFactura);

router.get('/comprar',[
    validarJWT,
    esClienteRole
], comprar)


module.exports = router