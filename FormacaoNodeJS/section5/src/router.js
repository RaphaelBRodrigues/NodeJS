const express = require("express");
const router = express.Router();
const PerguntaModel = require("../db/Pergunta");

router.get("/", (req, res) => {

    let perguntas;

    PerguntaModel.findAll({raw:true,order:[["id","desc"]]}).then((query)=>{
         perguntas = query;
         console.log(perguntas)
        res.render("index",{perguntas});
    }).catch(()=>{
        res.render("index");
    });


});

router.get("/pergunta/:id",(req,res)=>{
    const id = req.params.id;

    PerguntaModel.findOne({where:{id}}).then((pergunta)=>{
        if(pergunta) {
            res.render("pergunta", {pergunta});
        }else{
            res.redirect("/");
        }}).catch(()=>{

            res.send("Erro");

    });
});

router.get("/perguntar",(req,res)=>{
    res.render("perguntar.ejs");
});

router.post("/perguntar",(req,res)=>{
        const title = req.body.title;
        const content = req.body.content;

        PerguntaModel.create({
            titulo:title,
            descricao:content
        }).then(()=>{
            res.redirect("/");
    }).catch(()=>{
        res.redirect("/perguntar");
    });




})

module.exports = router;
