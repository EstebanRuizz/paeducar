const pool = require('../database');
const helpers = require('../lib/helpers');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const randomstring = require("randomstring");
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

router.post('/recuperar_cuenta', async (req, res) => {
    
    const query_email_user = await pool.query('SELECT correo_usuario FROM usuario WHERE correo_usuario = ?',[req.body.correo_usuario]);
    
    
    if (query_email_user != '') {
      const destinatario = query_email_user[0].correo_usuario;
  
      let tipo_correo = 'recuperacion';
      const query_correo_respuesta = await pool.query('SELECT nombre_correo_respuesta, password FROM correo_respuesta WHERE tipo_correo_respuesta = ?',[tipo_correo]);
          
      
      var randomVarToRecoverPassword = randomstring.generate(7);
      const newPassword = await helpers.encryptPassword(randomVarToRecoverPassword);
      
      await pool.query('UPDATE usuario SET password = ? WHERE correo_usuario = ?',[newPassword, req.body.correo_usuario])
      
      
      async function main() {
        console.log('___________________________________________');
        console.log(randomVarToRecoverPassword, ' randomVarToRecoverPassword');
        console.log(query_email_user, ' DML query_email_user');
            console.log(destinatario, ' DML Email destinatario');
            console.log('___________________________________________');
            
            let transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              secure: true, // true for 465, false for other ports
              aport: 465,
              auth: {
                user: query_correo_respuesta[0].nombre_correo_respuesta,
                pass: query_correo_respuesta[0].password
              }
            });
            
            // send mail with defined transport object
            let info = await transporter.sendMail({
              from: query_correo_respuesta[0].nombre_correo_respuesta,
              to: destinatario, // list of receivers
              subject: "Recuperacion de Clave", // Subject line
              text: `Parque Educativo Cartama, un encuentro de Saberes`, // plain text body
              html: `Para ingresar nuevamente al Sitio Web del Parque Educativo Cartama, ingresa la siguiente clave de recuperacion: ${randomVarToRecoverPassword}` // html body
            });
            
            console.log("Message sent: %s", info.messageId);
            
            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          }
          
          main().catch(console.error);
          
          return res.render('auth/signin', {mobile:"iniciar_sesion.css", tablet:"empty.css", desktop:"Iniciar_Sesion_Desktop.css", componentes:"componentes.css"});
          
        }else{
          
          return res.render('auth/email_not_found', {mobile:"email_not_found_mobile.css", tablet:"empty.css", desktop:"email_not_found_desktop.css", componentes:"componentes.css"}); 
        }
});


router.get('/recuperar_cuenta', (req, res) => {
    
    return res.render('auth/retrieve_password', {mobile:"retrieve_password_mobile.css", tablet:"empty.css", desktop:"retrieve_password_desktop.css", componentes:"componentes.css"}); 
});

module.exports = router, helpers;
