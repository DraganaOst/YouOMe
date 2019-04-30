import firebase from "firebase";
import {NavigationActions, StackActions} from "react-navigation";

const config = {
    apiKey: "AIzaSyD8q3UoNhIGJiu0VFOiuPm0emQk6LeinQg",
    authDomain: "youome.firebaseapp.com",
    databaseURL: "https://youome.firebaseio.com",
    projectId: "youome",
    storageBucket: "youome.appspot.com",
    messagingSenderId: "644106863317"
};

const _firebase = firebase.initializeApp(config); //we can only have one instance of Firebase

export default class Firebase {
    static auth;
    static uid;
    static database;
    static username;
    static loggedIn = true;

    static init(){
        Firebase.auth = _firebase.auth();
        Firebase.database = _firebase.database();
    }

    static defaultLogin(navigation){
        if(Firebase.auth.currentUser.emailVerified){
            Firebase.uid = Firebase.auth.currentUser.uid;
            let data = Firebase.database.ref('/users/'+Firebase.uid);
            data.once('value').then((snapshot) => {
                Firebase.username = snapshot.val().username
                navigation.dispatch(StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'Profile'}),
                    ],
                }))
            });
        }
    }
    
    static login(email, password){
        try{
            //setPersistence - LOCAL ... is signed until sign out, NONE ... needs to sign in everytime app is opened
            Firebase.auth.setPersistence(Firebase.loggedIn ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.NONE).then(async () => {
                Firebase.auth.signInWithEmailAndPassword(email, password).then( () => {
                    //check if user verified email else send it again
                    if(Firebase.auth.currentUser.emailVerified){
                        Firebase.uid = Firebase.auth.currentUser.uid;
                        let data = Firebase.database.ref('/users/'+Firebase.uid);
                        data.once('value', (snapshot) => {
                            Firebase.username = snapshot.val().username;
                        });
                    }
                    else{
                        Firebase.auth.currentUser.sendEmailVerification()
                        .then(()=>
                            alert("Email was send to confirm your email address"))
                        .catch((error) => {
                            alert(error);
                        });
                    }
                }
                        
                );
            });
        }
        catch (e) {
            alert(e);
        }
    }

    static async signUp(email, password, username, navigation){
        try{
            Firebase.database.ref().child("users").orderByChild("username").equalTo(username).once("value", async function(snapshot) {
                //check if username exists
                if (snapshot.exists()) {
                    alert("Username already exists.")
                    console.log("exists");
                    return false;
                }
                else{
                    Firebase.auth.createUserWithEmailAndPassword(email, password).then(() => {     
                        alert("Please verify your email address.");

                        let ref = Firebase.database.ref('users/'+Firebase.auth.currentUser.uid).set({
                            'email': email,
                            'username': username
                        });
    
                        Firebase.auth.currentUser.sendEmailVerification()
                        .then(()=>{
                            Firebase.auth.signOut();
                        }).catch((error) => {
                            alert(error);
                        });
                    });
                }
            });
        }
        catch (e) {
            alert(e);
        }
    }
}

