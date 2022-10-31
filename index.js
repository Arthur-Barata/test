import express  from "express";
import mysql from"mysql";
import cors from "cors";

let app= express()

app.use(cors())
app.use(express.json())
const db =mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"password",
    database:"library2",
})



app.post("/cadastro",(req,res)=>{
    const ISBN=req.body.ISBN
    const title=req.body.title
    const author=req.body.author
    const pages=req.body.pages
    const copies=req.body.copies


    db.query("INSERT INTO books (ISBN,title,author,pages,copies) VALUES (?,?,?,?,?)",
        [ISBN,title,author,pages,copies],
        (err,result)=>{
            if(err){
                if(err.errno==1062){
                    console.log("livro já cadastrado")
                    res.send("Esse livro já foi cadastrado")
                }
                else if(err.errno==1366 || err.errno==1048 ){
                    console.log("preencha todos os campos")
                    res.send("preencha todos os campos")
                }
                else if(err.errno==1406){
                    console.log("Insira um ISBN válido")
                    res.send("Insira um ISBN válido")
                }
                else{
                    console.log(err)
                }
            }
            else {
                console.log(res)
                res.send("livro cadastrado")
            }

        })


})

app.get("/consulta",(req,res)=>{

    const ISBNc=req.query.ISBNc
   

    db.query(`SELECT * FROM books WHERE ISBN =?`,ISBNc,(err,result)=>{
        if(err){
            console.log(err)
            res.send(err)
        }  
        else{
            console.log("consulta realizada com sucesso")
            console.log(result)
            res.send(result)
        }
    })
})

app.put("/editar",(req,res)=>{
    const newISBN=req.body.newISBN
    const newTitle=req.body.newTitle
    const newAuthor=req.body.newAuthor
    const newPages=req.body.newPages
    const newCopies=req.body.newCopies

    db.query("UPDATE books SET title=?, author=?, pages=?, copies=? WHERE ISBN =?",
    [newTitle,newAuthor,newPages,newCopies,newISBN],
    (err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log("editado com sucesso")
            res.send(result)
            
        }
    })


})

app.delete("/deletar/:ISBN",(req,res)=>{
    let ISBN=req.params.ISBN

    db.query("DELETE FROM books WHERE ISBN=?",[ISBN],(err,result)=>{
        if(err){
            console.log(err)
        }
        else{
            res.send(result)
            console.log(result)
            console.log('livro Deletado')
        }
    })

})


app.listen(3001,()=> {
    console.log("hey your server is running perfectly")
})