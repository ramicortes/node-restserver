const express = require('express');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

// Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    categorias,
                    total
                });

            });
        })
});

// Mostrar una categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    Categoria.findById(req.params.id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                err
            });
        }

        if (!categoria) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "La categoría no existe."
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});

// Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: "La categoría no pudo ser creada."
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

// Modificar categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.usuario._id;
    let body = req.body;

    Categoria.findByIdAndUpdate(req.params.id, { descripcion: body.descripcion, usuario: id }, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "La categoría no existe."
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

// Eliminar fisicamente categoria (solo ADMIN)
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: "La categoría no existe."
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

module.exports = app;