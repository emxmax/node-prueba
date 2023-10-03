const { response, request } = require('express');
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        const usuario = await Usuario.findOne({correo});

        if(!usuario){
            return res.status(400).json({
                msg: "Usuario / Password son incorrectos - Correo"
            });
        }

        if(!usuario.estado){
            return res.status(400).json({
                msg: "Usuario / Password son incorrectos - status:false"
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if(!validPassword){
            return res.status(400).json({
                msg: "Usuario / Password son incorrectos -  Password"
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Comunicate con el administrador'
        })
    }

    
}

module.exports = {
    login
}