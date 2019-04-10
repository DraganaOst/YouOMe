import firebase from "firebase";

const config = {
    apiKey: "AIzaSyD8q3UoNhIGJiu0VFOiuPm0emQk6LeinQg",
    authDomain: "youome.firebaseapp.com",
    databaseURL: "https://youome.firebaseio.com",
    projectId: "youome",
    storageBucket: "youome.appspot.com",
    messagingSenderId: "644106863317"
};

const _firebase = firebase.initializeApp(config);

export default class Firebase {
    static auth;
    static uid;
    static database;
    static username;

    static init(){
        //firebase.initializeApp(config);
        Firebase.auth = _firebase.auth();
        Firebase.database = _firebase.database();
    }

    static async defaultLogin(){
        if(Firebase.auth.currentUser.emailVerified){
            Firebase.uid = Firebase.auth.currentUser.uid;
            let data = Firebase.database.ref('/users/'+Firebase.uid);
            await data.once('value').then((snapshot) => {
                Firebase.username = snapshot.val().username
            });
            return true;
        }
        else{
            return false;
        }
    }
    
    static async login(email, password){
        try{
            await Firebase.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => Firebase.auth.signInWithEmailAndPassword(email, password));
            if(Firebase.auth.currentUser.emailVerified){
                Firebase.uid = Firebase.auth.currentUser.uid;
                let data = Firebase.database.ref('/users/'+Firebase.uid);
                await data.once('value', (snapshot) => {Firebase.username = snapshot.val().username});
                return true;
            }
            else{
                await Firebase.auth.currentUser.sendEmailVerification().then(()=>{

                }).catch((error) => {
                    alert(error);
                });
            }
        }
        catch (e) {
            alert(e);
            return false;
        }
    }

    static async signUp(email, password, username){
        try{
            Firebase.database.ref().child("users").orderByChild("username").equalTo(username).once("value", async function(snapshot) {
                if (snapshot.exists()) {
                    alert("Username already exists.")
                    console.log("exists");
                    return false;
                }else{
                    await Firebase.auth.createUserWithEmailAndPassword(email, password);
                    alert("Please verify your email address.");

                    let ref = Firebase.database.ref('users/'+Firebase.auth.currentUser.uid).set({
                        'email': email,
                        'username': username
                    });

                    Firebase.auth.currentUser.sendEmailVerification().then(()=>{
                        return true;
                    }).catch((error) => {
                        alert(error);
                    });
                }
            });
        }
        catch (e) {
            alert(e);
        }
    }
}

