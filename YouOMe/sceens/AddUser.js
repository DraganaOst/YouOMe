import React from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Button, Modal} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";

class User extends React.Component {
    sendRequest = () => {

    };

    render(): React.ReactNode {
        return (
            <View key={this.props.userKey} style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 25, marginVertical: 5}}>
                <Text style={{fontSize: 20}}>
                    {this.props.username}
                </Text>
                <TouchableOpacity style={styles.Profile.button} onPress={() => this.sendRequest}>
                    <Image source={require('../images/add-user.png')} />
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

    onSearch = () => {
        if(this.state.search !== ""){
            let data = Firebase.database.ref('/users');
            data.once('value', (snapshot) => {
                this.setState({array: []});
                snapshot.forEach((childSnapshot) =>{
                    if(childSnapshot.val().username.toLowerCase().includes(this.state.search.toLowerCase())
                        && childSnapshot.key !== Firebase.uid){
                        let code = (
                            <User userKey={childSnapshot.key} username={childSnapshot.val().username}/>
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

    render(): React.ReactNode {
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