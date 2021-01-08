let users = [{
    id: 1,
    name: "User 1",
    email: "user1@exemple.com",
    password: "1234qwert"
},{
    id: 2,
    name: "User 2",
    email: "user2@exemple.com",
    password: "1234qwert"
},{
    id: 3,
    name: "User 3",
    email: "user3@exemple.com",
    password: "1234qwert"
},{
    id: 4,
    name: "User 4",
    email: "user4@exemple.com",
    password: "1234qwert"
},{
    id: 5,
    name: "User 5",
    email: "user5@exemple.com",
    password: "1234qwert"
}];

const formatUser = (user) =>{
    let formatedUser = {}
    Object.keys(user).forEach(key => {if(key != 'password') formatedUser[key] = user[key]});
    return formatedUser;
}

const formatUsers = (userArray) => {
    return userArray.sort((user, nextUser) => user.id  < nextUser.id? -1 : 1).map(user =>
         formatUser(user)
    );
}

const createUserHandler = (newUser) => {
    let id = users.slice(-1)[0].id +1
    users.push({id, ...newUser});
    return users;
}

const deleteUserHandler = (id) => {
    users.splice(users.indexOf(searchUserById(id)), 1);
    return users;
}

const updateUserHandler = (id, args) => {
    let user = searchUserById(id);
    deleteUserHandler(id);
    users.push({...user, ...args});
    return users
}

const searchUserById = (id) => {
    return users.filter(user => user.id === id)[0];
}

export default {
    readUsers(error = false){
        return new Promise((resolve, reject) => {
            if(error)setTimeout(()=>reject({status_code: "500", error: "Something went wrong"}),1500);
            else setTimeout(()=>resolve(formatUsers(users)), 1500);
        });
    },
    readUser(id, error = false){
        return new Promise((resolve, reject) => {
            if(error)setTimeout(()=>reject({status_code: "500", error: "Something went wrong"}),1500);
            else setTimeout(()=>resolve(formatUser(searchUserById(id))), 1500);
        });
    },
    createUser(newUser, error = false){
        return new Promise((resolve, reject) => {
            if(error)setTimeout(()=>reject({status_code: "500", error: "Something went wrong"}),1500);
            else setTimeout(()=>resolve(formatUsers(createUserHandler(newUser))), 1500);
        })
    },
    updateUser(id, args, error = false){
        return new Promise((resolve, reject) => {
            if(error)setTimeout(()=>reject({status_code: "500", error: "Something went wrong"}),1500);
            else setTimeout(()=>resolve(formatUsers(updateUserHandler(id, args))), 1500);
        })
    },
    deleteUser(id, error = false){
        return new Promise((resolve, reject)=>{
            if(error)setTimeout(()=>reject({status_code: "500", error: "Something went wrong"}),1500);
            else setTimeout(()=>resolve(formatUsers(deleteUserHandler(id))), 1500);
        })
    }
}