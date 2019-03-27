import firebase from "firebase";

const config = {
    apiKey: "AIzaSyD8q3UoNhIGJiu0VFOiuPm0emQk6LeinQg",
    authDomain: "youome.firebaseapp.com",
    databaseURL: "https://youome.firebaseio.com",
    projectId: "youome",
    storageBucket: "youome.appspot.com",
    messagingSenderId: "644106863317"
};

//const _firebase = firebase;

const _firebase = firebase.initializeApp(config);

export default class Firebase {
    static auth;
    static uid;
    static database;

    static init(){
        //firebase.initializeApp(config);
        Firebase.auth = _firebase.auth();
        Firebase.database = _firebase.database();
    }

    static async login(email, password){
        try{
            if(Firebase.auth.currentUser.emailVerified){
                await Firebase.auth.signInWithEmailAndPassword(email, password);
                Firebase.uid = Firebase.auth.currentUser.uid;
                return true;
            }
            else{
                await Firebase.auth.currentUser.sendEmailVerification().then(()=>{

                }).catch((error) => {
                    alert(error);
                });
            }
            //App().haj();
            //App().loadNotes(Firebase.database().ref('/'+Firebase.uid));
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
                }else{
                    await Firebase.auth.createUserWithEmailAndPassword(email, password);
                    alert("Please verify your email address.");

                    let ref = Firebase.database.ref('users/'+Firebase.auth.currentUser.uid).set({
                        'email': email,
                        'username': username
                    });

                    Firebase.auth.currentUser.sendEmailVerification().then(()=>{

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

