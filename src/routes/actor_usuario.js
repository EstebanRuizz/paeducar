const express = require('express');
const router = express.Router();

const pool = require('../database');
const multer = require('multer');//<------------------
const upload = multer({storage:multer.memoryStorage()});//<------------------
const { isLoggedIn } = require('../lib/auth');

router.get('/', isLoggedIn, async (req, res) => { 
    
    const query_publications = await pool.query('SELECT * FROM publicacion');

    return res.render('../views/actor_usuario/inicio/inicio_usuario.hbs', { query_publications,mobile:"style_usuario_inicio.css", tablet:"empty.css", desktop:"style_usuario_inicio_deskop.css", componentes:"componentes.css"}); 
});

//*Inicio usuario
router.get('/inicio_usuario',isLoggedIn, async (req, res) => {

    
    const query_publications = await pool.query('SELECT * FROM publicacion ORDER BY id_publicacion DESC');
    const count = await pool.query('SELECT id_publicacion FROM publicacion WHERE id_publicacion = id_publicacion ;');

    for (let index = 0; index < count.length; index++) 
    {
        if (query_publications[index].tipo_publicacion == 'educacion' || query_publications[index].tipo_publicacion == 'Educacion') 
        {
            query_publications[index].edu = true;
        }
        else
        {
            query_publications[index].edu = false;
        }
    } 

    return res.render('../views/actor_usuario/inicio/inicio_usuario.hbs', { query_publications, mobile:"style_usuario_inicio.css", tablet:"empty.css", desktop:"style_usuario_inicio_deskop.css", componentes:"componentes.css"}); 
});

router.get('/inicio_usuario/inscripcion/:id_publicacion', isLoggedIn, (req, res) => {

    
    
    res.render('../views/actor_usuario/inicio/formulario_inscripcion.hbs', {req_id_inscription: req.params.id_publicacion, mobile:"style_administrador_inicio_nueva_publicacion_movil.css", tablet:"empty.css", desktop:"style_administrador_inicio_nueva_publicacion.css", componentes:"componentes.css"});
});

router.post('/inicio_usuario/inscripcion/:id_publicacion', isLoggedIn, async (req, res) => {

    
    const request_inscription = {
        id_publicacion: req.body.req_id_inscription,
        id_usuario: req.body.id_usuario,
    }  
    
    console.log(request_inscription, ' <-- CONSULTA INSCRITO');

    const validacion_curso = await pool.query('SELECT * FROM inscripcion WHERE id_usuario = ? AND id_publicacion = ?',[request_inscription.id_usuario, request_inscription.id_publicacion]);

    
    if (validacion_curso != '' || request_inscription.id_usuario != req.user.id_usuario) 
    {
        return res.render('../views/auth/mensaje.hbs', {error: 'Usted ya se encuentra inscrito en esta publicacion o su identificacion no corresponde',go_to:'/inicio_usuario', mobile:'mensaje.css'});
    }
    else
    {
        try
        {
            const new_incription = await pool.query('INSERT INTO inscripcion SET ?', [request_inscription]);
        }
        catch
        {
            return res.render('../views/auth/mensaje.hbs', {error: 'El documento de identificacion debe estar registrado en el sistema', go_to:'/inicio_usuario', mobile:'mensaje.css'});
           
        }
    }
        
        const var_id_publicacion = request_inscription.id_publicacion;

        const query_link_publication = await pool.query('SELECT link_form_publicacion, tipo_publicacion FROM publicacion WHERE id_publicacion = ?', [var_id_publicacion]);
           
        return res.render('../views/actor_usuario/inicio/inicio_redireccion_formulario.hbs', {query_link_publication, mobile:'style_usuario_inicio_redireccion.css', componentes:"componentes.css"}); 
});


//*Inicio usuario


//*Educacion usuario
router.get('/educacion_usuario', isLoggedIn, async (req, res) => {
    
    const tipo_publicacion = 'educacion';
    const query_education = await pool.query('SELECT * FROM publicacion WHERE tipo_publicacion = ? ORDER BY id_publicacion DESC', [tipo_publicacion]);
    
    return res.render('../views/actor_usuario/educacion/educacion_usuario.hbs', { req_id_inscription: req.params.id_publicacion, query_education,mobile:"style_usuario_educacion.css", tablet:"empthy", desktop:"style_usuario_educacion_desktop.css", componentes:"componentes.css"}); 
});
 //*Educacion usuario

 //*Reservas usuario
router.get("/reservas_usuario", isLoggedIn, (req, res) => {

  
    return res.render('../views/actor_usuario/reservas/reservas_usuario.hbs', {mobile:"style_usuario_reservas.css", tablet:"empthy", desktop:"style_usuario_reserva_desktop.css", componentes:"componentes.css"});
});

//sala insonorizada
router.get('/reservas_usuario/reservar_espacio/reserva_salon', isLoggedIn, (req, res) => {

    
    return res.render('../views/actor_usuario/reservas/formulario_reserva_usuario.hbs', {mobile:"style_usuario_reservas_formulario_reserva_usuario.css", tablet:"empthy", desktop:"style_usuario_educacion_desktop.css", componentes:"componentes.css"});
});

router.post('/reservas_usuario/reservar_espacio/reserva_salon', isLoggedIn, async (req, res) => {
    
    const sala_reserva = {
        id_ambiente: req.body.ambiente,
        id_usuario: req.body.id_usuario,
        telefono: req.body.telefono,
        descripcion: req.body.descripcion
    }   
    
    if (sala_reserva.id_usuario == req.user.id_usuario) { 
        
        try
        {
            const query_reserva = await pool.query('INSERT INTO reserva SET ?', [sala_reserva]);
        }
        catch
        {
            return res.render('../views/auth/mensaje.hbs', {error: 'El documento de identificacion debe estar registrado en el sistema', go_to:'/inicio_usuario', mobile:'mensaje.css'});
        }
       
        return res.redirect('/inicio_usuario');
        
    }else{

        return res.render('../views/auth/mensaje.hbs', {error: 'la identificacion no corresponde',go_to:'/inicio_usuario', mobile:'mensaje.css'});
    }
});

 //*Reservas usuario
 

  //*contacto usuario
router.get('/contacto_usuario', isLoggedIn, (req, res) => {

    return res.render('../views/actor_usuario/contacto/contacto_usuario.hbs', {mobile:"style_usuario_contacto_usuario.css", tablet:"empthy", desktop:"style_usuario_contacto_usuario_desktop.css", componentes:"componentes.css"})
});

//router.post('')

router.get('/contacto_desarrolladores', (req, res) => {

    return res.render('../views/actor_usuario/contacto/contacto_desarrolladores.hbs', {mobile:"style_usuario_contacto_desarrolladores.css", tablet:"empthy", desktop:"style_usuario_contacto_usuario_desktop.css", componentes:"componentes.css"})
});
 //*contacto usuario


 //* cartama usuario
router.get('/cartama_usuario', isLoggedIn, (req, res) => {

    res.render('../views/actor_usuario/cartama/cartama_usuario.hbs', {mobile:"style_usuario_cartama_usuario.css", tablet:"empty.css", desktop:"style_usuario_cartama_usuario_desktop.css", componentes:"componentes.css"});
});

router.get('/usuario_cartama/periodicos', isLoggedIn, async (req, res) => {
    
    
    return res.render('../views/actor_usuario/cartama/usuario_periodicos.hbs', {mobile:"style_usuario_cartama_periodicos.css", tablet:"style_usuario_cartama_usuario_tablet.css", desktop:"style_usuario_cartama_usuario_desktop.css", componentes:"componentes.css"});
});

router.get('/usuario/periodicos/el_relator', isLoggedIn, async (req, res) => {

      const el_relator = 'el_relator';
    const query_paper = await pool.query('SELECT * FROM periodico WHERE editorial_periodico = ? ORDER BY created_at DESC', [el_relator]);
   
    return res.render('../views/actor_usuario/cartama/usuario_listar_periodicos.hbs', {query_paper, mobile: 'style_administrador_cartama_admin_add_new_paper.css', tablet:"empty.css",desktop:"empty.css", componentes:"componentes.css"});  
});


router.get('/usuario/periodicos/saman', isLoggedIn, async  (req, res) => {
            
    const el_saman = 'el_saman';
    const query_paper = await pool.query('SELECT * FROM periodico WHERE editorial_periodico = ? ORDER BY created_at DESC', [el_saman]);

    return res.render('../views/actor_usuario/cartama/usuario_listar_periodicos.hbs', {query_paper, mobile: 'style_administrador_cartama_admin_add_new_paper.css', tablet:"empty.css",desktop:"empty.css", componentes:"componentes.css"});  
})



router.get('/usuario/periodicos/petroglifo', isLoggedIn, async (req, res) => {

    
    const el_petroglifo = 'el_petroglifo';
   const query_paper = await pool.query('SELECT * FROM periodico WHERE editorial_periodico = ? ORDER BY created_at DESC', [el_petroglifo]);

   return res.render('../views/actor_usuario/cartama/usuario_listar_periodicos.hbs', {query_paper, mobile: 'style_administrador_cartama_admin_add_new_paper.css', tablet:"empty.css",desktop:"empty.css", componentes:"componentes.css"});  
    
  
});

//alianzas 

router.get('/usuario_cartama/alianzas',isLoggedIn, async (req, res) =>{
 
    const query_aliances = await pool.query('SELECT * FROM alianza');

        res.render('../views/actor_usuario/cartama/usuario_alianzas.hbs', { query_aliances, mobile:"usuario_alianzas.css", tablet:"empty.css", desktop:"empty.css", componentes:"componentes.css"});
});

router.get('/usuario_cartama/historia', isLoggedIn, async (req, res) =>{
 
    
    res.render('../views/actor_usuario/cartama/usuario_cartama_historia.hbs', {  mobile:"style_usuario_cartama_historia.css", tablet:"empty.css", desktop:"empty.css", componentes:"componentes.css"});
});



 //* cartama usuario




 //*Usuario usuario
router.get('/usuario_usuario',isLoggedIn, (req, res) => {
    res.render('../views/actor_usuario/usuario/usuario_usuario.hbs', {mobile:"style_usuario_usuario_usuario.css", tablet:"empthy.css", desktop:"style_usuario_usuario_usuario_desktop.css", componentes:"componentes.css"})
});

 //*Usuario usuario



module.exports = router ;