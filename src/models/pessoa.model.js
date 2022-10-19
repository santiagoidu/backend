const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const DataSchema = new mongoose.Schema({
    nome_pessoa:String,
    email_pessoa:String,
    tipo_pessoa:{type:Number, default: 1},
    senha_pessoa:String,
},{
    timestamps:true
})

DataSchema.pre('save', function(next){
    if(!this.isModified("senha_pessoa)")){
        return next()
    }
    this.senha_pessoa = bcrypt.hashSync(this.senha_pessoa, 10)
    next()
})

DataSchema.pre('findOneAndUpdate', function(next){
    var password = this.getUpdate().senha_pessoa+''
    if(password.length<55){
        this.getUpdate().senha_pessoa = bcrypt.hashSync(password, 10)
    }
    next()
})

DataSchema.methods.isCorrectPassword = function (password, callback ){
    bcrypt.compare(password,this.senha_pessoa,function(err,same){
        if(err){
            callback(err);
        }else{
            callback(err, same);
        }
    })
}
const pessoas = mongoose.model('Pessoas', DataSchema)

module.exports = pessoas