const express = require('express');
const router = express.Router();
const pool = require('../database');
const multer = require('multer');
const upload = multer({storage:multer.memoryStorage()});
// const maxSize = 50000000 // 50mb
// const upload = multer({storage:multer.memoryStorage(), limits: { fileSize: maxSize}});
const { isLoggedInAdmin } = require('../lib/auth');
const passport = require('passport');//
const bcrypt = require('bcryptjs');//
const helpers = require('../lib/helpers');//
const email_admin = require('../lib/auth')

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//ADMIN INICIO
router.get('/admin_inicio', isLoggedInAdmin, async (req, res) => {

    const query_publications = await pool.query('SELECT * FROM publicacion ORDER BY id_publicacion DESC');
    
    res.render('../views/actor_administrador/inicio/admin_inicio.hbs', {query_publications, mobile:"style_administrador_inicio.css", tablet:"empty.css", desktop:"style_administrador_inicio_desktop.css", componentes:"componentes.css"});
});

//admin_nueva_publicacion GET & POST
router.get('/admin_nueva_publicacion', isLoggedInAdmin,async (req, res) => {

    res.render('../views/actor_administrador/inicio/admin_nueva_publicacion.hbs', {mobile:"style_administrador_inicio_nueva_publicacion.css", tablet:"empty.css", desktop:"empty.css", componentes:"componentes.css"});
});

router.post('/admin_nueva_publicacion', isLoggedInAdmin, upload.single('imagen'), async (req, res) => {

    try {
        const imagen = req.file.buffer.toString('base64');
        
        const data = {
            titulo_publicacion: req.body.titulo_publicacion,
            tipo_publicacion: req.body.tipo_publicacion,
            link_form_publicacion: req.body.link_form_publicacion,
            descripcion: req.body.descripcion,
            imagen: imagen
        };
        
        console.log(data);
        
    
        await pool.query('INSERT INTO publicacion set ?', [data]);
        
        const query_publications = await pool.query('SELECT * FROM publicacion ORDER BY id_publicacion DESC');
        return res.render('../views/actor_administrador/inicio/admin_inicio.hbs', {query_publications, mobile:"style_administrador_inicio.css", tablet:"empty.css", desktop:"style_administrador_inicio_desktop.css", componentes:"componentes.css"});
        
    } catch (error) {
        const query_publications = await pool.query('SELECT * FROM publicacion ORDER BY id_publicacion DESC');
        return res.render('../views/actor_administrador/inicio/admin_inicio.hbs', {query_publications, mobile:"style_administrador_inicio.css", tablet:"empty.css", desktop:"style_administrador_inicio_desktop.css", componentes:"componentes.css"});    
    }

});
//admin_nueva_publicacion GET & POST FIN


router.get('/delete_publication/:id_publicacion', isLoggedInAdmin, async (req, res) => {
    
    const request_id = req.params.id_publicacion;
    
    await pool.query('DELETE FROM inscripcion WHERE id_publicacion = ?', [request_id]);
    await pool.query('DELETE FROM publicacion WHERE id_publicacion = ?', [request_id]);

    res.redirect('/admin_inicio');
});

 
router.get('/edit_publication/:id_publicacion',isLoggedInAdmin, async (req, res) => {
    
    const request_id = req.params.id_publicacion;
    const data_publication = await pool.query('SELECT * FROM publicacion WHERE id_publicacion = ?', [request_id]);

    console.log(data_publication);
        //res.send('ESTAMOS EN EDIT');
    res.render('../views/actor_administrador/inicio/admin_inicio_editar_publicacion.hbs', {data_publication: data_publication[0], mobile:"style_administrador_editar_publicacion_movil.css", tablet:"empty.css", desktop:"style_administrador_inicio_nueva_publicacion.css", componentes:"componentes.css"});
});

router.post('/edit_publication/:id_publicacion', isLoggedInAdmin, async (req, res) => {
    
    const { id_publicacion } = req.params;
    const { titulo_publicacion, tipo_publicacion, descripcion} = req.body;
    const new_publication = { titulo_publicacion, tipo_publicacion, descripcion };

    await pool.query('UPDATE publicacion SET ? WHERE id_publicacion = ?', [new_publication, id_publicacion]);

    const query_publications = await pool.query('SELECT * FROM publicacion');
    res.render('../views/actor_administrador/inicio/admin_inicio.hbs', {query_publications, mobile:"style_administrador_inicio.css", tablet:"empty.css", desktop:"style_administrador_inicio_desktop.css", componentes:"componentes.css"});
});





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//* Admin Educacion
router.get('/admin_educacion', isLoggedInAdmin, async (req, res) => {
    
    const educacion = 'Educacion';
    const query_education_publications = await pool.query('SELECT * FROM publicacion WHERE tipo_publicacion = ? ORDER BY id_publicacion DESC', [educacion]);

    return res.render('../views/actor_administrador/educacion/admin_educacion.hbs', { query_education_publications, mobile:"style_administrador_educacion.css", tablet:"empty.css", desktop:"style_administrador_educacion_desktop.css", componentes:"componentes.css"}); 
});

router.get('/admin_educacion/ver_postulados_educacion/:id_publicacion', isLoggedInAdmin, async (req, res) => {

    const { id_publicacion } = req.params
   
    const ver_postulados_educacion = await pool.query('SELECT usuario.correo_usuario, usuario.nombres, usuario.telefono FROM usuario INNER JOIN inscripcion ON usuario.id_usuario = inscripcion.id_usuario  WHERE  inscripcion.id_publicacion = ?', [id_publicacion]);

    
    return res.render('../views/actor_administrador/educacion/postulados_curso_educacion.hbs', { ver_postulados_educacion, mobile: "style_admin_educacion_postulados_curso_educacion.css", componentes:"componentes.css"})

});
////* Admin Educacion
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////* Admin reservas



router.get('/admin_reservas', isLoggedInAdmin, async (req, res) => {
    
    
    const query_reservation = await pool.query('SELECT * FROM reserva ORDER BY created_at DESC');

    return res.render('../views/actor_administrador/reservas/admin_reservas.hbs', { query_reservation, mobile:"style_administrador_reservas.css", tablet:"empty.css", desktop:"style_administrador_reservas_desktop.css", componentes:"componentes.css"}); /////////////////////////\\\\\\\\\\\\\
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//////* Admin reservas
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

router.get('/admin_contacto', isLoggedInAdmin, (req, res) => {

        
    return res.render('../views/actor_administrador/contacto/admin_contacto.hbs', {mobile:"style_administrador_contacto.css", tablet:"empty.css", desktop:".css", componentes:"componentes.css"}); 
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////* Admin Cartama
router.get('/admin_cartama', isLoggedInAdmin, (req, res) => {
    
    return res.render('../views/actor_administrador/cartama/admin_cartama.hbs', {mobile:"style_administrador_cartama.css", tablet:"empty.css", desktop:"style_administrador_cartama_desktop.css", componentes:"componentes.css"}); 
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//TODO Admin Cartama Alianzas

    router.get('/admin_cartama/alianzas', isLoggedInAdmin, async (req, res) => {
        
        
    
        const query_aliances = await pool.query('SELECT * FROM alianza ORDER BY id_alianza DESC');


        return res.render('../views/actor_administrador/cartama/admin_alianzas.hbs', { query_aliances, mobile: 'style_administrador_cartama_alianzas.css', tablet:"empty.css",desktop:"empty.css", componentes:"componentes.css"})
    });

    //Crear alianza

    router.get('/admin_cartama/alianzas/add',isLoggedInAdmin, (req, res) => {

        
        return res.render('../views/actor_administrador/cartama/admin_publicar_nueva_alianza.hbs', {mobile: 'style_admin_publicar_nueva_alianza.css', tablet:"empty.css",desktop:"empty.css", componentes:"componentes.css"}
        );
    });



    router.post('/admin_cartama/alianzas/add', isLoggedInAdmin, upload.single('imagen_alianza'), async (req, res) => {
        

        const imagen_alianza = req.file.buffer.toString('base64');
        //id_alianza, nombre_alianza, tipo_alianza, imagen_alianza, created_at◘
        const data = 
        {
            nombre_alianza: req.body.nombre_alianza,
            tipo_alianza: req.body.tipo_alianza,
            imagen_alianza: imagen_alianza
        };


        await pool.query('INSERT INTO alianza set ?', [data]);
        
        return res.redirect('/admin_cartama/alianzas');
    });


    router.get('/delete_alianza/:id_alianza', isLoggedInAdmin, async (req, res) => {
    
        const request_id_aliance = req.params.id_alianza;
        await pool.query('DELETE FROM alianza WHERE id_alianza = ?', [request_id_aliance]);
    
        return res.redirect('/admin_cartama/alianzas');
    });

    //* ADmin periodicos

router.get('/admin_cartama/periodicos', isLoggedInAdmin, async (req, res) => {
            
    
    
    res.render('../views/actor_administrador/cartama/admin_apartado_periodicos.hbs', { mobile: 'style_administrador_cartama_apartado_periodicos.css', tablet:"empty.css",desktop:"empty.css", componentes:"componentes.css"});
 });
 
router.get('/admin_cartama/periodicos/relator', isLoggedInAdmin, async (req, res) => {
    
    const el_relator = 'el_relator';
    const query_paper = await pool.query('SELECT * FROM periodico WHERE editorial_periodico = ? ORDER BY created_at DESC', [el_relator]);

    res.render('../views/actor_administrador/cartama/admin_add_new_paper.hbs', { query_paper, mobile: 'style_administrador_cartama_admin_add_new_paper.css', tablet:"empty.css",desktop:"empty.css", componentes:"componentes.css"});
});



        router.get('/admin_cartama/periodicos/saman',isLoggedInAdmin,async  (req, res) => {
            
            const el_saman = 'el_saman';
            const query_paper = await pool.query('SELECT * FROM periodico WHERE editorial_periodico = ? ORDER BY created_at DESC', [el_saman]);

            res.render('../views/actor_administrador/cartama/admin_add_new_paper.hbs', { query_paper, mobile: 'style_administrador_cartama_admin_add_new_paper.css', tablet:"empty.css",desktop:"empty.css", componentes:"componentes.css"});
        })



        router.get('/admin_cartama/periodicos/petroglifo',isLoggedInAdmin, async (req, res) => {

            
            const el_petroglifo = 'el_petroglifo';
           const query_paper = await pool.query('SELECT * FROM periodico WHERE editorial_periodico = ? ORDER BY created_at DESC', [el_petroglifo]);

           res.render('../views/actor_administrador/cartama/admin_add_new_paper.hbs', { query_paper, mobile: 'style_administrador_cartama_admin_add_new_paper.css', tablet:"empty.css",desktop:"empty.css", componentes:"componentes.css"});
            
          
        });


        
        router.get('/admin_cartama/periodicos/add',isLoggedInAdmin, (req, res) => {
            
            //admin_apartado_periodicos
            res.render('../views/actor_administrador/cartama/admin_agregar_periodicos.hbs', { mobile: 'style_administrador_cartama_agregar_periodicos.css', tablet:"empty.css",desktop:"empty.css", componentes:"componentes.css"});
        })


        router.post('/admin_cartama/periodicos/add',isLoggedInAdmin, upload.single('periodico'), async (req, res) => {
            
            const periodico = req.file.buffer.toString('base64');

            const paper = 
            {
                editorial_periodico: req.body.editorial_periodico,
                nombre_periodico: req.body.nombre_periodico,
                periodico: periodico    
            };

            await pool.query('INSERT INTO periodico set ?', [paper]);
            
            res.redirect('/admin_cartama/periodicos');
        });
 




        router.get('/delete_periodico/:id_periodico', isLoggedInAdmin, async (req, res) => {
    
            const request_id = req.params.id_periodico;
            await pool.query('DELETE FROM periodico WHERE id_periodico = ?', [request_id]);
        
            res.redirect('/admin_cartama/periodicos');
        });


     //* ADmin periodicos
//TODO Admin Cartama Alianzas

//* Admin Cartama
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//* Admin Usuario
router.get('/admin_usuario', isLoggedInAdmin, (req, res) => {
    
    return res.render('../views/actor_administrador/usuario/admin_usuario.hbs', {mobile:"style_administrador_usuario.css", tablet:"empty.css", desktop:"style_administrador_usuario_desktop.css", componentes:"componentes.css"}); 
}); 

router.get('/admin_usuario/listar_usuarios', isLoggedInAdmin, async (req, res) => {

    const id_admin = 10;
    const all_users = await pool.query('SELECT id_usuario, correo_usuario, nombres, apellidos, telefono, created_at FROM usuario WHERE id_usuario != ?', [id_admin]);    
    
    return res.render('../views/actor_administrador/usuario/admin_usuario_all_users.hbs', { all_users, mobile:"style_adminstrador_usuario_all_users.css", tablet:"empty.css", desktop:"style_adminstrador_usuario_all_users_desktop.css", componentes:"componentes.css"}); 
});


router.get('/eliminar_usuario/:id_usuario', isLoggedInAdmin, async (req, res) => {

    const request_id_person = req.params.id_usuario;
    await pool.query('DELETE FROM inscripcion WHERE id_usuario = ?', [request_id_person]);
    await pool.query("DELETE FROM reserva WHERE id_usuario = ? ", [request_id_person]);
    await pool.query('DELETE FROM usuario WHERE id_usuario = ?', [request_id_person]);

    res.redirect('/admin_usuario/listar_usuarios');
});
 

/////
router.get('/nueva_clave',  isLoggedInAdmin, async (req, res) => {

    return res.render('../views/actor_administrador/usuario/nueva_clave.hbs', { mobile:"", tablet:"empty.css", desktop:"", componentes:"componentes.css"}); 
});

router.post('/nueva_clave',  isLoggedInAdmin, async (req, res) => {

    console.log(req.body.password,' <****** REQ.BODY.PASSWORD');
    console.log(req.body.confirm_password,' <****** REQ.BODY.confirm_password');
    console.log(req.user.id_usuario,' <<<<<<<<<<<< req.user.id_usuario >>>>>>>>>>>>>');
    
    if (req.body.password == req.body.confirm_password) {

        let email_administrator = req.user.id_usuario;
        console.log(email_administrator,' <<<<email_administrator>>>>');

        const newPassword = await helpers.encryptPassword(req.body.password);

        console.log(newPassword,' <- password');
        
        

        await pool.query('UPDATE administrador SET password = ? WHERE administrador_id = ?',[newPassword, email_administrator])

        return res.render('../views/actor_administrador/usuario/nueva_clave.hbs', { mobile:"", tablet:"empty.css", desktop:"", componentes:"componentes.css"}); 
        
    } else {  
        return res.send('no coinciden las claves');
    }
});

////* Admin USuario
module.exports = router;

