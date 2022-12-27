const pool = require('../database');
const helpers = require('../lib/helpers');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');

 
// SIGNUP GET
router.get('/signup', (req, res) => {

  return res.render('auth/signup', {mobile:"crear_cuenta.css", tablet:"empthy", desktop:"crear_Cuenta_desktop.css", componentes:"componentes.css"}); 
});

// SIGNUP POST
router.post('/signup', async (req, res) => {
  console.log(req.body);

var data = 
{
  id_usuario: req.body.id_usuario,
  correo_usuario: req.body.correo_usuario,
  nombres: req.body.nombres,
  apellidos: req.body.apellidos,
  telefono: req.body.telefono,
  password: req.body.password
}

const compare_id = await pool.query('SELECT id_usuario FROM usuario WHERE id_usuario = ?', [data.id_usuario]);
const compare_email = await pool.query('SELECT correo_usuario FROM usuario WHERE correo_usuario = ?', [data.correo_usuario]);


if (data.password != req.body.confirmar_clave) 
{

  return res.render('auth/ro', {mobile:"email_not_found_mobile.css", tablet:"empty.css", desktop:"email_not_found_desktop.css", componentes:"componentes.css"}); 
}

if (compare_id != '' || compare_email != '') 
{
  
  return res.render('auth/re', {mobile:"email_not_found_mobile.css", tablet:"empty.css", desktop:"email_not_found_desktop.css", componentes:"componentes.css"}); 
} 
else
{
  data.password = await helpers.encryptPassword(data.password);
  console.log(data, ' <-este es data');

  await  pool.query('INSERT INTO usuario SET ? ', data);

  return res.redirect('./inicio_usuario');
}});



//SIGNIN GET 
router.get('/signin', (req, res) => {
  
  return res.render('auth/signin', {mobile:"iniciar_sesion.css", tablet:"empty.css", desktop:"Iniciar_Sesion_Desktop.css", componentes:"componentes.css"});
});

//SIGNIN POST
router.post('/signin', async (req, res, next) => {

   
  console.log(req.body.correo_usuario, '  <- desde authentication');
  console.log(req.body.password, '  <- desde authentication');

  const email_request = req.body.correo_usuario;
  const query_correo_admin = await pool.query('SELECT administrador_correo FROM administrador WHERE administrador_correo = ?',[email_request]);
  
  var correo_admin = query_correo_admin != '' ? query_correo_admin[0].administrador_correo : false;
  
  console.log(email_request,' <== email_request AQUI***');
  console.log(correo_admin,' <== correo_admin AQUI***');

  if (correo_admin == email_request) 
  {
    console.log('ENTRO*********************');
    passport.authenticate('local.signin', {
      successRedirect: '/admin_inicio',      
      failureRedirect: '/signin',

      failureFlash: true
    })(req, res, next);
  }
  else
  {
    passport.authenticate('local.signin', {
      successRedirect: '/inicio_usuario',   
      failureRedirect: '/signin',
      failureFlash: true
    })(req, res, next);
  }
})


router.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/signin');
});


passport.serializeUser((user, done) => {
  done(null, user.id_usuario);
});

passport.deserializeUser(async (id_usuario, done) => {
  const rows = await pool.query('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario]);
  console.log(rows, '<----- deserializacion');
  done(null, rows[0]);
});

module.exports = router;
