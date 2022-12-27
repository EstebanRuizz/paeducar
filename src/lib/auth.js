const { isEmptyStatement } = require('typescript');
const pool = require('../database');


module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    },
    
    
    isLoggedInAdmin (req, res, next) {
        // let correo_usuario = typeof req.user.correo_usuario === "undefined" ? req.user.correo_usuario : false;     
        // if ( typeof correo_usuario === undefined || typeof req.user?.correo_usuario === '') {
        //     return res.redirect('/signin');
        // }
        try {
            let compare_email_admin = req.user.correo_usuario;
            if (req.isAuthenticated() && Admin_email(compare_email_admin)) {
                return next();
            }
            return res.redirect('/signin');    
        } catch (error) {
            return res.redirect('/signin');
        }
        
    }

    /*
    let correo_usuario; 
    if ( typeof correo_usuario === undefined || typeof correo_usuario === 'undefined') { console.log('NO DEFINIDO');
    }else{console.log('VALOR DEFINIDO');}

    if (req.isAuthenticated() && Admin_email)) {
            return next();
        }//linea 18 aproxima
    
    
    isLoggedInAdmin (req, res, next) {
        if (req.isAuthenticated() && req.user.correo_usuario == 'cartama@10.com') {
            return next();
        }
        return res.redirect('/signin');
    }*/
    
};

async function Admin_email(compare_email_admin) {
    
    const query_correo_admin = await pool.query('SELECT administrador_correo FROM administrador WHERE administrador_correo = ?',[compare_email_admin]);

    if (query_correo_admin != '') {
        return true;
    } else {
        return false;      
    }
}

function email_admin(compare_email_admin) {

    var correo_administrador = compare_email_admin;
    console.log(correo_administrador, ' <<<<<<<<<<correo_administrador>>>>>>>>>>>>>');
    return correo_administrador;
}

module.exports.email_admin = email_admin;
