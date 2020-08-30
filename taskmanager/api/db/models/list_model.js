const mongoose=require('mongoose');

const listSchema= new mongoose.Schema({
    title:{
        required:true,
        type:String,
        minlength:1,
        trim:true
    }
})

const List=mongoose.model('List',listSchema);

module.exports={
    List
}