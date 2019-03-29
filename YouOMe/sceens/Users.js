import React from 'react';
import {Text, View, TextInput, TouchableOpacity, Image, Button, Modal} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";


class User extends React.Component {
    render(): React.ReactNode {
        return (
            <View style={styles.AddUserScreen.user}>
                <Text style={{fontSize: 20}}>
                    {this.props.username}
                </Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.Users.button} onPress={() => {}}>
                        <Image source={require('../images/rubbish-bin.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


class Request extends React.Component {
    denyRequest = (uid) => {
        let update = {
            ['/connections/'+Firebase.uid+'/'+uid]: null,
            ['/connections/'+uid+'/'+Firebase.uid]: null,
        };
        Firebase.database.ref().update(update);
    };

    acceptRequest = (uid) => {
        let update = {
            ['/connections/'+Firebase.uid+'/'+uid]: true,
            ['/connections/'+uid+'/'+Firebase.uid]: true,
        };
        Firebase.database.ref().update(update);
    };

    render(): React.ReactNode {
        return (
            <View style={styles.AddUserScreen.user}>
                <Text style={{fontSize: 20}}>
                    {this.props.username}
                </Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.Users.button} onPress={() => this.denyRequest(this.props.uid)}>
                        <Image source={require('../images/error.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.Users.button} onPress={() => this.acceptRequest(this.props.uid)}>
                        <Image source={require('../images/checked.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

class CancelRequest extends React.Component {
    cancelRequest = (uid) => {
        let update = {
            ['/connections/'+Firebase.uid+'/'+uid]: null,
            ['/connections/'+uid+'/'+Firebase.uid]: null,
        };
        Firebase.database.ref().update(update);
    };

    render(): React.ReactNode {
        return (
            <View style={styles.AddUserScreen.user}>
                <Text style={{fontSize: 20}}>
                    {this.props.username}
                </Text>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.Users.button} onPress={() => this.cancelRequest(this.props.uid)}>
                        <Image source={require('../images/error.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default class Users extends React.Component {
    constructor(){
        super();
        this.state = {
            array: []
        };
        this.getUsers();
    }

    getUsers = () => {
        Firebase.database.ref('/').once('value').then(
            (snapshot) => {
                if (snapshot.child('connections/' + Firebase.uid).exists())
                {
                    let data = Firebase.database.ref('/connections/' + Firebase.uid);
                    data.on('value', (snapshot) => {
                        this.setState({array: []});
                        snapshot.forEach((child) => {
                            let ref = Firebase.database.ref('/users/' + child.key).once('value').then(
                                (snapshotUser) => {
                                    let code = "";
                                    if(child.val() === true){
                                        code = (
                                            <User key={child.key} uid={child.key} state={child.val()} username={snapshotUser.val().username}/>
                                        );
                                    }
                                    else if(child.val() !== Firebase.uid){
                                        code = (
                                            <Request key={child.key} uid={child.key} state={child.val()} username={snapshotUser.val().username}/>
                                        );
                                    }
                                    else if(child.val() === Firebase.uid){
                                        code = (
                                            <CancelRequest key={child.key} uid={child.key} state={child.val()} username={snapshotUser.val().username}/>
                                        );
                                    }
                                    this.setState((previousState) => ({'array': [...previousState.array, code]}));
                                }
                            );
                        });
                    });
                }
            }
        );
    };

    render(): React.ReactNode {
        return (
            <View>
                {this.state.array}
            </View>
        );
    }
}