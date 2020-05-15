//configuirando o servidor 
const express = require("express")
const server = express()


//configurar o servidor para apresentar arquivos estaticos
server.use(express.static('public'))

//habilitar body do formulario
server.use(express.urlencoded({extended:true}))

// configurar a conexão com banco de dado




// configurando a template engine
const nunjuck = require("nunjucks")
nunjuck.configure("./",{
    express:server,
    noCache: true, //boolean ou booleano aceita dois valores true or false
})

const Pool =require('pg').Pool
const db = new Pool({
    user:'postgres',
    password:'0000',
    host: 'localhost',
    port: 5432,
    database:'doe'

})


// configurar a apresenção da pagina 
server.get("/",function(req, res){
    
    db.query("SELECT * FROM  donors ", function(err,result){
        if(err) return res.send("erro de banco de dados")

        const donors = result.rows
        return res.render("index.html",{donors})


    })

    
     
} )

server.post("/", function(req, res){
    //pegar dados do formulario
    const name= req.body.name
    const email= req.body.email
    const blood= req.body.blood


    //se o nome iguaL a vazio
    //ou email igual a vazio
    //ou sangue igual a vazio
    if (name ==""||email ==""||blood ==""){

        return res.send("Todos os campos sao obrigatroios")
    }


    // coloco valores dentro do banco de dados.
    const query = 
    `INSERT INTO  donors ("name", "email", "blood")
    VALUES($1, $2, $3)`



    const values = [name, email, blood]

    db.query(query, values ,function(err){
        // fluxo de erro
        if(err) return res.send ("erro no banco de dado")

        // fluxo ideal
        return res.redirect("/")
    } )
  
    
})


// LIGAR O SERVIDOR E PERMITIR O ACESSO NA PORTA 300
server.listen(3000, function(){
    console.log("iniciei o servidor bro bons estudos")
})