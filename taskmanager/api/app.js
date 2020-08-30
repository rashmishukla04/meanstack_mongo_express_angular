const express=require('express');
const bodparser=require('body-parser');
const {mongoose}=require('./db/mongoose')
const app=express();
app.use(bodparser.json())   //load middleware
const {List,Task}=require('./db/models') //load mongoose models
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,HEAD,OPTIONS,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get('/lists',(req,res)=>{
  List.find({}).then((lists)=>{
        res.send(lists);
  }).catch((e)=>{
      res.send(e)
  })
})

app.post('/lists',(req,res)=>{
    let title=req.body.title;
    let newList= new List({title})
    newList.save().then((lisdoc)=>{
        res.send(lisdoc);
    }).catch((e)=>{
        res.send(e)
    })
})

app.patch('/lists/:id',(req,res)=>{
    List.findOneAndUpdate({_id:req.params.id},
        {
            $set:req.body,
        }).then(()=>{
            res.send({message:"updated successfully"});
                }
        )

})

app.delete('/lists/:id',(req,res)=>{
    List.findOneAndDelete({_id:req.params.id}).then((removedListdocs)=>{
        res.send(removedListdocs);
    })
})


app.get('/lists/:listId/tasks',(req,res)=>{
    Task.find({
    _listId:req.params.listId
    }).then((taskdocs)=>{
        res.send(taskdocs);
    }).catch((e)=>{
            res.send("Exception occurs");
            console.log(e);
    })
})

app.post('/lists/:listid/tasks',(req,res)=>{
    let newTask=new Task({
        title:req.body.title,
        _listId:req.params.listid
    })

    newTask.save().then((savedDoc)=>{
        res.send(savedDoc)
    }).catch((e)=>{
        res.send(e);
    })
})

app.patch('/lists/:listid/tasks/:taskid',(req,res)=>{
    Task.findOneAndUpdate({_listId:req.params.listid ,_id:req.params.taskid},{
        $set:req.body
    }).then(()=>{
        res.send({message:"Updated Successfully"});
    }).catch((e)=>{
        res.send(e);
    })
})

app.delete('/lists/:listid/tasks/:taskid',(req,res)=>{
    Task.findOneAndDelete({_listId:req.params.listid ,_id:req.params.taskid}).then((docdeleteddata)=>{
            res.send(docdeleteddata)
    }).catch((e)=>{
        res.send(e);
    })
})

app.listen(3000,()=>{
    console.log("Server is listening port 3000")
});