const {Router} = require('express');
const { check } = require('express-validator');
const { getCarrito, postCarrito, agregarAlCarrito } = require('../controllers/carrito');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/mostrar', getCarrito);

router.put('/agregarproducto/:idProducto',[
    validarJWT,
    check('idProducto', 'No es un ID valido').isMongoId(),
    validarCampos
], agregarAlCarrito);

router.post('/agregar',[
    validarJWT
], postCarrito);

module.exports = router;