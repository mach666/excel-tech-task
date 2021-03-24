// Importing all necessary packages to use
const EXPRESS=require('express')
const APP=EXPRESS()
const MONGOOSE=require('mongoose')
const Candidates=require('./DBMODELS/candidates')
const PORT=5000


//using express inbuilt body parser
APP.use(EXPRESS.json())

//Coonecting to database(Database is on clound with MongodbAtlas)
MONGOOSE.connect('mongodb+srv://databasedeveloper:warrior666@cluster0.pg4sw.mongodb.net/EXCELTECHDB?retryWrites=true&w=majority',{
    useUnifiedTopology:true, useNewUrlParser:true
}).then(Res=>{
    console.log('-----DATABASE CONNECTED---------')
}).catch(Err=>{
    console.log(Err)
})

//Route to  handle the insert request
APP.post('/insertcandidate',(req,res)=>{
    const {name,email}=req.body
    Candidates.findOne({email}).then(candidate=>{
        
        if(candidate){
            res.status(200).json({msg:"Candidate Already Register with this email"})
        }else{
            const newCandidate=new Candidates({
                name:name,
                email:email
            })
            newCandidate.save()
            .then(Res=>{
                res.status(200).json({Res,msg:"Candidate Inserted Successfully"})
            })
        }
    }).catch(Err=>{
        res.status(500).json({msg:'Internel Server Error', Err})
    })
})


//Route to handle the score-assignment-request
APP.post('/assignscores',(req,res)=>{
    const {email,round1,round2,round3}=req.body
    Candidates.findOneAndUpdate({email},{firstround:round1,secondround:round2,thirdround:round3},{returnOriginal:false,useFindAndModify:false})
    .then(Res=>{
        if(Res){
            res.status(200).json({Res,msg:'Scores Updated Successfully'})
        }else{
            res.status(200).json({msg:'No Candidate Found With This Email'})
        }
    }).catch(Err=>{res.status(500).json({msg:'Internal Server Error'})})
})


//Route to get the average score for every round individually
APP.post('/averagescore',(req,res)=>{
    const data=[]
    let sum=0

switch(req.body.roundname){
    case 'firstround':return(
        Candidates.find({})
        .then(Res=>{
            
            Res.map((item)=>{
                data.push(item.firstround)
               
            })
            for(let i=0;i<data.length;i++){
                sum=sum+data[i]
            }
            const average=sum/data.length
            res.status(200).json({msg:`Average Score For First Round is:${average}`})
        })
    )
    case 'secondround':return(
        Candidates.find({})
        .then(Res=>{
            
            Res.map((item)=>{
                data.push(item.secondround)
               
            })
            for(let i=0;i<data.length;i++){
                sum=sum+data[i]
            }
            const average=sum/data.length
            res.status(200).json({msg:`Average Score For First Round is:${average}`})
        })
    )
    case 'thirdround': return( Candidates.find({})
    .then(Res=>{
        
        Res.map((item)=>{
            data.push(item.thirdround)
           
        })
        for(let i=0;i<data.length;i++){
            sum=sum+data[i]
        }
        const average=sum/data.length
        res.status(200).json({msg:`Average Score For Third Round is:${average}`})
    }))
    default :return null
}  
})



//Route to get the intell of highest scorer for individual rounds
APP.get('/highestscorer',(req,res)=>{
    const data=[]
    switch(req.body.roundname){
        case 'round1':return(Candidates.find({})
        .then(Res=>{
            Res.map((item)=>{
                data.push({name:item.name,email:item.email,score:item.firstround})
               
            })
            let largest=null
            let index=null
            for(let i=0;i<data.length;i++){
                if(data[i].score>largest){
                    largest=data[i].score
                    index=i
               }
            }
              res.status(200).json({msg:`Details for Top Scorer For First Round Is:`,TopScorer:data[index]}) 
            }))
            case 'round2':return(Candidates.find({})
            .then(Res=>{
                Res.map((item)=>{
                    data.push({name:item.name,email:item.email,score:item.secondround})
                   
                })
                let largest=null
                let index=null
                for(let i=0;i<data.length;i++){
                    if(data[i].score>largest){
                        largest=data[i].score
                        index=i
                   }
                }
                  res.status(200).json({msg:`Details for Top Scorer For Second Round Is:`,TopScorer:data[index]}) 
                }))
                case 'round3':return(Candidates.find({})
                .then(Res=>{
                    Res.map((item)=>{
                        data.push({name:item.name,email:item.email,score:item.thirdround})
                       
                    })
                    let largest=null
                    let index=null
                    for(let i=0;i<data.length;i++){
                        if(data[i].score>largest){
                            largest=data[i].score
                            index=i
                       }
                    }
                      res.status(200).json({msg:`Details for Top Scorer For Third Round Is:`,TopScorer:data[index]}) 
                    }))
                    default : return null
    }

})




APP.listen(PORT,()=>{
    console.log(`SERVER IS LISTENING ON PORT:${PORT}`)
})
