
const knex = require("../database/connection");
const bcrypt = require("bcrypt");
const PasswordToken = require("../models/PasswordToken");
class User{
    async new(email,password,name) {
        const dataDB = await this.findEmail(email);
            try {
                const hash = await bcrypt.hash(password, 10);
                await knex.insert({
                    email,
                    name,
                    password: hash,
                    role: 0
                }).table("users");
            } catch (err) {
                console.log(err);
            }
    }
    async findEmail(email){
      const emailDB = await knex.select("email").from("users").where({email});
      console.log(emailDB);
      return emailDB == false ? {
          exists: false
      } : {
          exists: true,
          user:emailDB[0]
      };
    }

    async findAll(){
        try{
            const data = await knex.select(["name","email"]).from("users");
            console.log(data);
            return data;
        }catch (err){
            console.log(err);
            return [];
        }
    }
    async findById(id){
        try{
            const data = await knex.select(["name","email"]).from("users").where({id});
            console.log(data);
            return data;
        }catch (err){
            console.log(err);
            return [];
        }
    }

    async findByEmail(email){
        try{
            const data = await knex.select(["name","email","id","password"]).from("users").where({email});
            return data;
        }catch (err){
            console.log(err);
            return [];
        }
    }
    async updateUser(id,email,name,role){

       const user = await this.findById(id);

       if(user != undefined){

        const editUser = {};

        if(email != undefined){
            editUser.email = email;
        }
        if(name != undefined){
            editUser.name = name;
        }
        if(role != undefined){
            editUser.role = role;
        }

        try{
          const user = await knex.update({...editUser}).where({id}).table("users");
          return {user}
        }catch(err){
            return {
                status:false,
                err
            }
        }

       }else{
           return {
               status:false,
               error:"Usuário não existe"
           }
       }
    }
    async deleteUser(id){
        try{
            const userDelete = await knex.delete().from("users").where({id});
            return {
                userDelete
            };
        }catch (err){
            return false;
        }
    }

    async changePassword(newPassword,id,token){
        const hash = await bcrypt.hash(newPassword, 10);

        console.log(id);

        const user = knex.update({password:hash}).from("users").where({id});

        await PasswordToken.setUsed(token);


        return user;
    }
}

module.exports = new User();