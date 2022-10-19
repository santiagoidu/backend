const Pessoas = require('../models/pessoa.model')
const jwt = require("jsonwebtoken");
const secret = "mysecret"

module.exports = {
    async index(req, res){
        const pessoa = await Pessoas.find()
        res.json(pessoa)
    },
    async create(req, res){
        try {
        const body = req.body
        console.log('body', body)
        let pessoa = await Pessoas.findOne(body)
        if(!pessoa){
            pessoa = await Pessoas.create(body)
            return res.status(200).send(pessoa)
        } else {
            return res.status(500).send('Pessoa já existe')
        } } catch (e){
            res.send(e)
        }
    },
    async datails(req, res){
        const {_id} = req.params
        const pessoa = await Pessoas.findOne({_id})
        res.json(pessoa)
    },
    async delete(req, res) {
        const { _id } = req.params

        const pessoa = await Pessoas.findByIdAndDelete({_id})

        return res.json(pessoa)
    },
    async update(req, res) {
        const  { _id, nome_pessoa, email_pessoa, senha_pessoa, tipo_pessoa } = req.body

        const data = {nome_pessoa, email_pessoa, senha_pessoa, tipo_pessoa}

        const pessoa = await Pessoas.findOneAndUpdate({_id}, data, {new: true})

        res.json(pessoa)
    },
    async login(req,res){
        const { email_pessoa, senha_pessoa } = req.body;
        Pessoas.findOne({email_pessoa}, function(err,user){
            if(err){
                console.log(err);
                res.status(200).json({erro: "Erro no servidor. Por favor, tente novamente"});
            }else if (!user){
                res.status(200).json({status:2, error: 'E-mail não encontrado no banco de dados'});
            }else{
                user.isCorrectPassword(senha_pessoa, async function (err, same){
                    if(err){
                        res.status(200).json({error: "Erro no servidor. Por favor, tente novamente"});
                    }else if(!same){
                        res.status(200).json({status:3, error: "A senha não confere"});
                    }else{
                        const payload = { email_pessoa };
                        const token = jwt.sign(payload, secret, {
                            expiresIn: '24h'
                        })
                        res.cookie('token', token, {httpOnly: true});
                        res.status(200).json({status:1, auth:true, token:token,id_client: user._id,user_name:user.nome_usuario,user_type:user.tipo_usuario});
                    }
                })
               
            }
        })
    },
}