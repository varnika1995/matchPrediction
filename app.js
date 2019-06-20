const express=require ('express')
const morgan =require('morgan')
const errorhandler=require('errorhandler')
const mongodb=require('mongodb')
const assert = require('assert');
const cors=require('cors')
const path=require('path')
//const assert=require('assert')
const bodyParser=require('body-parser')

const MongoClient=mongodb.MongoClient
const url='mongodb://localhost:27017'
const Dbname='newproject'
const client=new MongoClient(url)

const app=express()

app.use(cors())
app.use(morgan())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get('/sign_up.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'sign_up.html'))
})


app.get('/sign_in.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'sign_in.html'))
})


client.connect((error)=>{
    if(error) return process.exit(1)

    console.log('sucessful')
    const db =client.db(Dbname)
    console.log('connection')


    //sign up
    app.post('/test',(req,res,next)=>{
        let newDemo=req.body
        db.collection('demo1').insert(newDemo,(error,result)=>{
            if(error)
            {
                res.json({
                    statusCode:400,
                    message:"user not found",
                    data:{}
                })
            } 
            res.send(result)
            client.close();
        })
    })
   
    // sign in


   app.post('/signin',(req,res,next)=>{

    db.collection('demo1').findOne({ mail: req.body.mail}, function(err, user) {
        console.log('0000000')
        console.log(user)
        console.log(user.mail)
         if(user ===null){
             console.log('111111')
          res.send("Login invalid");
          console.log('2222222')

         }else if (user.mail === req.body.mail && user.password === req.body.password){
            console.log('333333')
          res.send('login sucessfully');

         } else {
    
           console.log("Credentials wrong");
            res.send("Login invalid");
        }
    })

   })

   //update prediction


   app.put('/prediction/:id',(req,res,next)=>{
   console.log('111111111')
   /*let demo=req.body;
   let obj=req.json();
   let array=object.keys(obj)

   */

    db.collection('prediction')
       .update({_id: mongodb.ObjectID(req.params.id).object(req.query)},
       //{$set:{vote:req.body}},
       
       { $inc: {vote:1}},
       (error,results)=>{
           if(error) {
               res.json({
                statusCode:400,
                message:"user not found",
                data:{}

               })  
           }

           res.send(results)
           client.close()
       })
       })

       /*let sequenceDocument = db.collection('prediction').findAndModify({
        query:{_id: mongodb.ObjectID(req.params.id) },
        update: {$inc:{vote:1}}
       })
                    res.send(results)
                    client.close()
   })*/


   // add list of matches

   app.post('/matchList',(req,res,next)=>{
    let newDemo=req.body
    console.log('11111111111')
    db.collection('prediction').insert(newDemo,(error,result)=>{
        console.log('2222222222222')
        if(error) {
            return res.json({
                statusCode:400,
                message:"user not found",
                data:{}

            })
        }
        res.send(result)
        client.close();
    })
})




    
})


app.listen(3000)