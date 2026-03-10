module.exports = {
    validar: (req,res, next) => {
        const { pass = null } = req.query

        if(!pass || pass != 'tecnolift'){
            return res.status(400).json({status: false, err: 'Contraseña Incorrecta '});
        }else{
            next()
        }
    }
}