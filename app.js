const express=require('express');
const app=express();
const path=require('path');
const fs=require('fs');
var i=0;

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));


app.get('/',(req,res)=>{
    fs.readdir('./hisaab',(err,files)=>{
        if(err) res.status(500).send(err);
        res.render('index',{files: files});
    })
});

app.get('/create',(req,res)=>{
    res.render('create');
})

app.post('/createhisaab',(req,res)=>{
    let currentDate=new Date();
    let data= `${currentDate.getDate()}-${currentDate.getMonth()+1}-${currentDate.getFullYear()}`
    if(fs.existsSync(`./hisaab/${data}.txt`)){
        i++;
        data+=`__${i}`;
    }
    fs.writeFile(`./hisaab/${data}.txt`,req.body.content,(err)=>{
        if(err) return res.status(500).send(err);
        res.redirect('/');
    })
})

app.get('/edit/:filename',(req,res)=>{
    fs.readFile(`./hisaab/${req.params.filename}`,'utf-8',(err,filedata)=>{
        if(err) res.status(500).send(err);
        res.render('edit',{filedata,filename: req.params.filename});
    })
})

app.post('/update/:filename',(req,res)=>{
    fs.writeFile(`./hisaab/${req.params.filename}`,req.body.content,(err)=>{
        if(err) res.status(500).send(err);
        res.redirect('/');
    })
})

app.get('/hisaab/:filename',(req,res)=>{
    fs.readFile(`./hisaab/${req.params.filename}`,'utf-8',(err,filedata)=>{
        if(err) res.status(500).send(err);
        res.render('hisaab',{filedata , filename: req.params.filename});
    })
})

app.get('/delete/:filename',(req,res)=>{
    fs.unlink(`./hisaab/${req.params.filename}`,(err)=>{
        if(err) res.status(500).send(err);
        res.redirect('/');
    })
})

app.listen(3000);