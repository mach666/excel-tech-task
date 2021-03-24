const MONGOOSE=require('mongoose')

const candidateSchema= new MONGOOSE.Schema({
    name:{type:String,required:true,trim:true},
    email:{type:String,required:true,trim:true,unique:true},
    firstround:{type:Number,trim:true},
    secondround:{type:Number,trim:true},
    thirdround:{type:Number,trim:true}
})

module.exports=Candidates=MONGOOSE.model('Candidates',candidateSchema)