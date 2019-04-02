import React from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Button, Modal} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import ImageAddUser from '../images/add-user.svg';

class User extends React.Component {
    constructor(){
        super();
        this.state = {
            opacity: 1
        }
    }

    sendRequest = (uid) => {
        let update = {
            ['/connections/'+Firebase.uid+'/'+uid]: Firebase.uid,
            ['/connections/'+uid+'/'+Firebase.uid]: Firebase.uid,
        };
        Firebase.database.ref().update(update);
        this.setState({opacity: 0.3});
    };

    render() {
        return (
            <View style={[styles.AddUserScreen.user, {opacity: this.state.opacity}]}>
                <Text style={{fontSize: 20}}>
                    {this.props.username}
                </Text>
                <TouchableOpacity style={styles.Profile.button} onPress={() => this.sendRequest(this.props.userUid)}>
                    <ImageAddUser width={32} height={32}/>
                </TouchableOpacity>
            </View>
        );
    }
}

export default class AddUser extends React.Component{
    constructor(){
        super();
        this.state = {
            search: "",
            array: []
        }
    }

    async onSearch() {
        if(this.state.search !== ""){
            let connections = [];
            let exists = false;
            await Firebase.database.ref('/').once('value').then(
                function(snapshot) {
                    if (snapshot.child('connections/' + Firebase.uid).exists())
                    {
                        let data = Firebase.database.ref('/connections/' + Firebase.uid);
                        data.once('value', (snapshot) => {
                            snapshot.forEach((child) => connections.push(child));
                        });
                    }
                }
            );

            let data = Firebase.database.ref('/users');
            data.once('value', (snapshot) => {
                this.setState({array: []});
                snapshot.forEach((childSnapshot) =>{
                    if(childSnapshot.val().username.toLowerCase().includes(this.state.search.toLowerCase())
                        && childSnapshot.key !== Firebase.uid
                        && !connections.find(x => x.key === childSnapshot.key)
                    ){
                        let code = (
                            <User key={childSnapshot.key} userUid={childSnapshot.key} username={childSnapshot.val().username}/>
                        );
                        this.setState((previousState) => ({'array': [...previousState.array, code]}));
                    }
                })
            });
        }
        else{
            this.setState({array: []});
        }
    };

    render() {
        return (
            <View>
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                        style={[styles.AddUserScreen.search, {flex: 1}]}
                        placeholder={'Search'}
                        onChangeText={(text) => (this.setState({search: text}, this.onSearch))}
                        defaultValue={this.state.search}
                    />
                    {this.state.search !== ""
                        ? <TouchableOpacity style={{justifyContent: 'center'}} onPress={() => this.setState({search: "", array: []})}>
                            <Image
                                style={{margin: 10, marginLeft: 0, justifyContent: 'center', alignItems: 'center'}}
                                source={require('../images/cancel_2.png')}
                            />
                        </TouchableOpacity>
                        : null}
                </View>
                <View>{this.state.array}</View>
            </View>
        );
    }
}