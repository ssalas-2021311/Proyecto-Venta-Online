const { Router } = require('express');
const { check } = require('express-validator');

const { existeProductoPorId, existeProducto, categoriaExiste } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');

//Controllers
const { obtenerProductos,
        obtenerProductoPorId,
        crearProducto,
        actualizarProducto,
        eliminarProducto, 
        masVendidos,
        productosAgotados,
        getObtenerProductoPorNombre,
        getObtenerPorNombreCategoria} = require('../controllers/producto');

const router = Router();

router.get('/masvendidos', masVendidos)

router.get('/agotados', [
    validarJWT,
    esAdminRole
], productosAgotados)

// Obtener todas los productos - publico
router.get('/mostrar', obtenerProductos);

router.get('/obtenerProductoPorNombre', [
    check('nombre').custom(existeProducto),
    validarCampos
], getObtenerProductoPorNombre);

router.get('/productosNombreCategoria/:idProductoCategoria', [
    check('nombre').custom(categoriaExiste),
    validarCampos
], getObtenerPorNombreCategoria);

// Obtener un producto por el id - publico
router.get('/:id', [
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
],obtenerProductoPorId);

// Crear Producto - privado - cualquier persona con un token valido
router.post('/agregar', [
    validarJWT,
    esAdminRole,
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('categoria', 'El id de la categoria del producto es obligatorio').not().isEmpty(),
    check('precio', 'El precio del producto es obligatorio').not().isEmpty(),
    validarCampos
], crearProducto);

// Actualizar Producto - privado - se requiere id y un token valido
router.put('/editar/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    validarCampos
], actualizarProducto);

// Borrar una categoria - privado - se requiere id y un token valido - solo el admin puede borrar
router.delete('/eliminar/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], eliminarProducto);

module.exports = router;