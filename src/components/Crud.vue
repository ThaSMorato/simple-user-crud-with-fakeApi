<template>
  <div class="crud-wrapper">
      <div class="crud-header">
          <h5 class="crud-title">
              Crud Usuario
          </h5>
          <div class="button-wrapper">
            <button :class="!error? 'error-button': 'success-button'" @click="error = !error"> Forçar {{!error? 'Erro' : 'Sucesso'}} </button>
            <button class='load-button' @click="loadClickHandler()" >Carregar Lista</button>
          </div>
      </div>
      <div class="crud-body">
        <div class="create-update">
            <div class="form-wrapper">
                <div class="form-header">
                        <h5 class="id">
                            {{ userId == null? "New User" : `User ${userId}` }}
                        </h5>
                </div>
                <div class="form-body">
                    <div class="input-wrapper">
                        <input class="input" type="text" v-model="userName" placeholder="Nome do Usuário">

                    </div>
                    <small v-if="errors.name != ''" class="has-errors"> {{errors.name }} </small>
                    <div class="input-wrapper">
                        <input class="input" type="text" v-model="userEmail" placeholder="Email do Usuário">
                    </div>
                    <small v-if="errors.email != ''" class="has-errors"> {{errors.email }} </small>
                    <div v-if="userId == null" class="input-wrapper">
                        <div class="password-wrapper">
                            <input :type="passwordType" class="input" v-model="userPassword" placeholder="Senha do Usuário">
                            <button class='showPassword' @click="passwordType = passwordType === 'password'? 'text': 'password' ">{{passwordType === 'password'? "Mostrar": "Esconder"}} Senha</button>
                        </div>
                    </div> 
                    <small v-if="errors.password != ''" class="has-errors"> {{errors.password }} </small>
                    <div v-if="userId == null" class="input-wrapper">
                        <div class="password-wrapper">
                            <input :type="passwordType" class="input" v-model="userCheckPassword" placeholder="Confirme a Senha">
                            <button class='showPassword' @click="passwordType = passwordType === 'password'? 'text': 'password' ">{{passwordType === 'password'? "Mostrar": "Esconder"}} Senha</button>
                        </div>
                    </div>
                    <small v-if="errors.checkPassword != ''" class="has-errors"> {{errors.checkPassword }} </small>
                    <button v-if="userId != null" class="default-button" @click="clearVars()">Novo</button>
                    <button class="save-button" @click="saveClickHandler()">Save</button>
                </div>

            </div>
        </div>
        <div class="list">
            <div v-if='users.length <= 0' class="loading-list">
                <h2 v-if="!loading" class="info">
                    Crie um usuário ou carregue a Lista
                </h2>
                <button v-else class="loading"></button>
            </div>
            <div v-else class="list-wrapper">
                <div class="form-header">
                    <h5 class="id">
                        Usuários
                    </h5>
                </div>
                <div class="user-component" v-for="user in users" :key="user.id">
                    <div class="user-component-wrapper">
                        <div @click="readUserHandler(user.id)" class="user-keys">
                            <h5 class="user-key">
                                {{user.id}}
                            </h5>
                            <h5 class="user-key">
                                {{user.name}}
                            </h5>
                            <h5 class="user-key">
                                {{user.email}}
                            </h5>
                        </div>
                        
                        <button @click="deleteClickHandler(user.id)" class="del-user">
                            Del
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
       <Modal v-show="messageModal">
            <div class="modal-wrapper">
                <h5>{{ mensage }}</h5>
                <button class="ok-button" @click="messageModal = !messageModal">Ok</button>
            </div>
        </Modal>
          <Modal v-show="delModal">
            <div class="modal-wrapper">
                <h5>Deseja deletar o usuário {{ trakedId }}?</h5>
                <div class="button-wrapper">
                    <button class="default-button" @click="delModal = !delModal"> Cancelar </button>
                    <button class="save-button" @click="deleteHandler()">Ok</button>
                </div>
            </div>
        </Modal>
        <Modal v-show="loadingModal">
            <div class="modal-wrapper">
                <button class="loading"></button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Api from "@/service/fakeapi";
import Modal from '@/components/Modal.vue';

const regexEmail = /([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|"([!#-[^-~ \t]|(\\[\t -~]))+")@([0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*|\[((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|IPv6:((((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){6}|::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){5}|[0-9A-Fa-f]{0,4}::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){4}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):)?(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){3}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,2}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){2}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,3}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,4}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,5}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,6}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)|(?!IPv6:)[0-9A-Za-z-]*[0-9A-Za-z]:[!-Z^-~]+)])/;
    
export default {
    components: {
        Modal
    },
    data : function() {
        return {
            users : [],
            loading : false,
            userName : "",
            userEmail : '',
            userPassword : "",
            userCheckPassword : "",
            userId : null,
            error : false,
            passwordType: "password",
            messageModal : false,
            mensage : "Mensage teste",
            loadingModal: false, 
            delModal : false,
            trakedId: 0,
            errors: {name: "", email: "", password: "", checkPassword: ""}
        }
    },
    methods:{
        checkUserInputs(){
            let ret = true;
            this.errors = {name: "", email: "", password: "", checkPassword: ""};
            if(this.userName == ""){
                ret = false;
                this.errors.name = "Nome precisa ser preenchido"
            }
            if(this.userEmail == ""){
                ret = false;
                this.errors.email = "Email precisa ser preenchido"
            }else if(!this.userEmail.match(regexEmail) ){
                ret = false;
                this.errors.email = "Email nao valido"
            }
            if(this.userId == null){
                if(this.userPassword == ""){
                    ret = false;
                    this.errors.password = "Senha precisa ser preenchida";
                }
                if(this.userCheckPassword == ""){
                    ret = false;
                    this.errors.checkPassword = "Senha precisa ser confirmada"
                }else if(this.userCheckPassword != this.userPassword){
                    ret = false;
                    this.errors.checkPassword = "As senhas informadas sao diferentes";
                }
            }
            return ret;
        },
        saveClickHandler(){
            if(this.checkUserInputs()){
                this.loadingModal = true;
                if(this.userId != null) Api.updateUser(this.userId,this.formatBody(), this.error)
                .then(
                    data => {
                        this.users = data;
                        console.log("success updated")
                        this.clearVars();
                        this.loadingModal = false;
                        this.mensage = "Alterado com sucesso"
                        this.messageModal = true;
                    }
                ).catch(
                    err => {
                        console.log(err);
                        console.log('Error on update');
                        this.loadingModal = false;
                        this.mensage = "Ops, algo deu errado, verifique sua conexão e tente novamente"
                        this.messageModal = true;
                    }
                );
                else Api.createUser(this.formatBody(), this.error)
                    .then(
                    data => {
                        this.users = data;
                        console.log("success created")
                        this.clearVars()
                        this.loadingModal = false;
                        this.mensage = "Criado com sucesso"
                        this.messageModal = true;
                    }
                ).catch(
                    err => {
                        console.log(err);
                        console.log('Error on create');
                        this.loadingModal = false;
                        this.mensage = "Ops, algo deu errado, verifique sua conexão e tente novamente"
                        this.messageModal = true;
                    }
                );
            }
          
        },
        formatBody(){
            let ret = {
                name: this.userName,
                email: this.userEmail
            }
            if(this.userId == null) ret.password = this.userPassword
            console.log(ret)
            return ret;
        },
        loadClickHandler(){
            this.loading = true;
            Api.readUsers(this.error)
            .then(
                data => {
                    this.users = data
                    this.loading = false;
                }
            ).catch(
                err => {
                    console.log('Error on loading');
                    console.log(err);
                    this.loading = false;
                    this.mensage = "Ops, algo deu errado, verifique sua conexão e tente novamente"
                    this.messageModal = true;
                }
            )
        },
        readUserHandler(id){
            this.loadingModal = true;
            Api.readUser(id, this.error)
            .then(
                data => {
                    this.uploadVars(data);
                    console.log('Success on reading user');
                    this.loadingModal = false;
                }
            ).catch(
                err => {
                    console.log('Error on reading user');
                    console.log(err);
                    this.loadingModal = false;
                    this.mensage = "Ops, algo deu errado, verifique sua conexão e tente novamente"
                    this.messageModal = true;
                }
            );
        },
        uploadVars(data){
            this.userName = data.name;
            this.userEmail = data.email;
            this.userId = data.id;
        },
        clearVars(){
            this.userName = "";
            this.userEmail = '';
            this.userPassword = "";
            this.userCheckPassword = "";
            this.userId = null;
        },
        deleteClickHandler(id){
            this.trakedId = id;
            this.delModal = true;
        },
        deleteHandler(){
            this.loadingModal = true;
            this.delModal = false;
            Api.deleteUser(this.trakedId, this.error)
            .then(
                data => {
                    console.log('Success on deleting user');
                    this.users = data;
                    this.loadingModal = false;
                    this.mensage = "Deletado com sucesso"
                    this.messageModal = true;
                }
            ).catch(
                err => {
                    console.log('Error on deleting user');
                    console.log(err);
                    this.loadingModal = false;
                    this.mensage = "Ops, algo deu errado, verifique sua conexão e tente novamente"
                    this.messageModal = true;
                }
            )
        }
    }
}
</script>

<style>
input:focus, button:focus{
        outline: none;
}

.has-errors{
    color: red;
    font-weight: 900;
    margin-bottom: 10px;
    letter-spacing: 1px;
}

.crud-wrapper{
    max-width: 100vw;
    min-height: 100vw;
    background: #aaa;
    padding: 30px 0;
}

.crud-header{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 30px 0;
    background: rgb(255, 255, 255);
}

.crud-title{
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: 2px;
    color: rgb(56, 50, 50);
}

.button-wrapper{
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 60%;
    padding: 10px 0;
}

.crud-body{
    display: flex;
    flex-direction: row;
    padding: 10px;
}

.list{
    width: 50%;
    display: flex;
    flex-direction: column;
    padding: 10px;
}
.create-update{    
    display: flex;
    flex-direction: column;
    padding: 10px;
    width:50%;
}

@media (max-width: 750px){
    .list{
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .create-update{
        display: flex;
        flex-direction: column;
        width:100%;
    }
    
}

.form-wrapper{
    border: 1px solid #aaa;
    border-radius: 16px;
    padding: 10px 0;
    background: white;
}

.list-wrapper{
    border: 1px solid #aaa;
    border-radius: 16px;
    padding: 10px 0;
    background: white;
}

.form-header{
    display: flex;
    align-items: center;
    justify-content:center;
}

.form-body{
    padding: 10px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}

.input-wrapper{
    width: 100%;
    padding: 10px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.input{
    border: 1px solid #aaa;
    border-radius: 8px;
    font-size: 1.2rem;
    line-height: 2rem;
    padding: 3px 10px;
    min-width: 400px;
    width: 100%
}

.password-wrapper{
    width:100%;
    display: flex;
}

.password-wrapper>.input{
    border-radius: 8px 0 0 8px ;
    width: 80%;
    min-width: 220px;
}
.showPassword{
    border: 1px solid rgb(219, 145, 33) ;
    background: rgb(219, 176, 33);
    border-radius:  0 8px 8px 0 ;
    font-size: 1.2rem;
    line-height: 2rem;
    padding: 3px 10px;
    width: 20%;
    min-width: 180px;
}

.showPassword:hover{
    cursor: pointer;
    border-color: rgb(219, 101, 33);
    background:rgb(219, 145, 33);
    color:white;
}

.save-button{
    width: 50%;
    min-width: 80px;
    height: 30px;
    background: rgb(13, 226, 13);
    border: 1px solid rgb(31, 196, 31);
    border-radius: 8px;
}

.save-button:hover{
    cursor: pointer;
    border-color: rgb(3, 102, 3);
    background:rgb(5, 161, 5);
    color:white;
}

.default-button{
    width: 50%;
    min-width: 80px;
    height: 30px;
    background:rgb(171, 175, 171);
    border: 1px solid rgb(123, 126, 123);
    border-radius: 8px;
    margin: 10px 0;
}

.default-button:hover{
    cursor: pointer;
    border-color: rgb(33, 34, 33);
    background:rgb(54, 56, 54);
    color:white;
}

.id{
    font-size: 1.5rem;
    letter-spacing: 1.2px;
    color:rgb(70, 63, 63);
}

.error-button{
    background: none;
    border: 1px solid red;
    padding: 15px;
    border-radius: 25px;
    font-weight: 600;
    font-size: 1rem;
}

.error-button:hover{
    background: red;
    color:aliceblue;
    cursor: pointer;
}

.success-button{
    background: none;
    border: 1px solid greenyellow;
    padding: 15px;
    border-radius: 25px;
    font-weight: 600;
    font-size: 1rem;
}

.success-button:hover{
    background: greenyellow;
    color:aliceblue;
    cursor: pointer;
}

.load-button{
    background: none;
    border: 1px solid lightskyblue;
    padding: 15px;
    border-radius: 25px;
    font-weight: 600;
    font-size: 1rem;
}

.load-button:hover{
    background: lightskyblue;
    color:aliceblue;
    cursor: pointer;
}

.user-component:last-child .user-component-wrapper{
    border: none !important;
}

.user-component-wrapper{
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-bottom: 1px solid #aaa;
}

.user-keys{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    padding: 20px;
}

.user-key{
    color:rgb(63, 47, 47);
    text-align: center;
    flex: 1;
}

.user-component-wrapper:hover{
    background: lightblue;
    cursor: pointer;
}

.del-user{
    padding: 12px;
    border-radius: 50%;
    background: red;
    color:white;
    font-weight: 600;
    border: 1px solid red;
    margin-right: 10px;
}

.del-user:hover{
    background: white;
    color: red;
    cursor: pointer;
}

@keyframes loading {
  0%   {border-bottom: 5px solid red ;border-left:none ;border-top:none ;border-right:none ;}
  25%  {border-bottom: none ;border-left:5px solid yellow ;border-top:none ;border-right:none ;}
  50%  {border-bottom: none ;border-left:none ;border-top:5px solid blue ;border-right:none ;}
  75% {border-bottom: none ;border-left:none ;border-top:none ;border-right:5px solid green ;}
  100% {border-bottom: 5px solid red ;border-left:none ;border-top:none ;border-right:none ;}
}

.loading-list{
    display: flex;
    align-items: center;
    justify-content:center;
    background:white;
    padding: 30px;
    border-radius: 25px;
    height: 300px;
}


.loading{
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    animation-name: loading;
    animation-duration: 0.3s;
    animation-iteration-count: infinite;
    background: none;
}

.modal-wrapper{
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.ok-button{
    background:none;
    border: 3px solid rgb(255, 217, 0);
    color: rgb(78, 77, 26);
    border-radius: 4px;
    padding: 10px;
    letter-spacing: 2px;
    font-size: 1.5rem;
    font-weight: 600;
    text-transform: uppercase;
    margin-top: 10px;
}

.ok-button:hover{
    background:  rgb(255, 217, 0);
    border: 3px solid rgb(78, 77, 26);
    color: white;
    font-weight: 900;
    cursor: pointer;
}

.modal-wrapper h5{
    letter-spacing: 1.5px;
    font-size: 1.6rem;
    color: rgb(43, 37, 37);
    text-align: center;
}
</style>