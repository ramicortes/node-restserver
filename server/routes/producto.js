const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

app.get('/producto', verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0;
    let cantidad = Number(req.query.cantidad) || 10;

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(cantidad)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    productos,
                    total
                });

            });
        });

});

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        })
});

app.get('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "El producto no existe."
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: "El producto no pudo ser creado."
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let updatedProduct = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    }

    Producto.findByIdAndUpdate(id, updatedProduct, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: "El producto no existe."
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: "El producto no existe."
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

module.exports = app;