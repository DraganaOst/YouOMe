import React from 'react';
import {Text, View, TextInput, TouchableOpacity, Image, Button, Modal, Alert} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import ImageAddUser from '../images/add-user.svg';
import ImageCancel from '../images/cancel.svg';
import ImageChecked from '../images/checked_2.svg';
import ImageBin from '../images/rubbish-bin.svg';
import { ScrollView } from 'react-native-gesture-handler';

class User extends React.Component {
    onDeleteUser = (userUid, username) => {
        //check if money and item balance is 0
        Alert.alert(
            'Alert',
            'Are you sure you want to delete: ' + username,
            [
              {text: 'NO', onPress: () => {}},
              {text: 'YES', onPress: async () => {
                let money_balance = 1;
                let items_balance_by = 1;
                let items_balance_to = 1;
                await Firebase.database.ref('balance/'+Firebase.uid).once('value').then((snapshot) => {
                    if(snapshot.child("/money/"+userUid).exists())
                        money_balance = snapshot.child("/money/"+userUid).val();
                    else
                        money_balance = 0;
                    
                    if(snapshot.child("/items/"+userUid).exists()){
                        items_balance_by = snapshot.child("/items/"+userUid).val().owed_by_me;
                        items_balance_to = snapshot.child("/items/"+userUid).val().owed_to_me;
                    }
                    else{
                        items_balance_by = 0;
                        items_balance_to = 0;
                    }
                });
        
                let error = "";
                if(money_balance != 0)
                    error += "- money balance isn't 0 \n";
                if(items_balance_by != 0)
                    error += "- you haven't returned all items \n";
                if(items_balance_to != 0)
                    error += "- user hasn't returned all items";

                if(error != ""){
                    Alert.alert(
                        'Alert',
                        'Not all transactions are done (other user will need to confirm): \n' + error,
                        [
                          {text: 'Cancel', onPress: () => {}},
                          {text: 'Delete anyway', onPress: () => {
                                this.data = Firebase.database.ref('/confirmations/connections');
                                let item = ref.push(
                                    {
                                        'request': Firebase.uid, 
                                        'to': userUid
                                    }
                                );
                                Firebase.database.ref('/confirmations/users/'+Firebase.uid+'/connections/'+uid).push(item.key);
                                Firebase.database.ref('/confirmations/users/'+uid+'/connections/'+Firebase.uid).push(item.key);

                                Firebase.database.ref().update(update);
                          }},
                        ],
                        {cancelable: false},
                    );
                }
                else{
                    if(error != ""){
                        Alert.alert(
                            'Alert',
                            'Do you want to keep histroy: \n' + error,
                            [
                              {text: 'No', onPress: () => {
                                let update = {
                                    ['/connections/'+Firebase.uid+'/'+userUid]: null,
                                    ['/connections/'+userUid+'/'+Firebase.uid]: "deleted_"+Firebase.uid,
                                };
                                Firebase.database.ref().update(update);
                              }},
                              {text: 'Yes', onPress: () => {
                                let update = {
                                    ['/connections/'+Firebase.uid+'/'+userUid]: "deleted",
                                    ['/connections/'+userUid+'/'+Firebase.uid]: "deleted_"+Firebase.uid,
                                };
                                Firebase.database.ref().update(update);
                              }},
                            ],
                            {cancelable: false},
                        );
                    }
                }
              }},
            ],
            {cancelable: false},
        );
        
    };

    render() {
        return (
            <View style={styles.Users.user}>
                <Text style={[styles.Users.text, {flex: 4}]}>
                    {this.props.username}
                </Text>
                <View style={{flexDirection: 'row', flex: 2}}>
                    <TouchableOpacity style={[styles.Users.button, {backgroundColor: 'red'}]} onPress={() => this.onDeleteUser(this.props.uid, this.props.username)}>
                        <ImageBin width={24} height={24} />
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

    render() {
        return (
            <View style={styles.Users.user}>
                <Text style={[styles.Users.text, {flex: 4}]}>
                    {this.props.username}
                </Text>
                <View style={{flexDirection: 'row', flex: 2}}>
                    <TouchableOpacity style={[styles.Users.button, {backgroundColor: 'red'}]} onPress={() => this.denyRequest(this.props.uid)}>
                        <ImageCancel width={24} height={24} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.Users.button, {backgroundColor: styles.mainColorGreen}]} onPress={() => this.acceptRequest(this.props.uid)}>
                        <ImageChecked width={24} height={24} />
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
    };

    componentDidUpdate(){
        Firebase.database.ref().update(update);
    }

    render() {
        return (
            <View style={styles.Users.user}>
                <Text style={[styles.Users.text, {flex: 4}]}>
                    {this.props.username}
                </Text>
                <View style={{flexDirection: 'row', flex: 2}}>
                    <TouchableOpacity style={[styles.Users.button, {backgroundColor: 'red'}]} onPress={() => this.cancelRequest(this.props.uid)}>
                        <ImageCancel width={24} height={24} />
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
    }

    componentDidMount(){
        this.getUsers();
    }

    componentWillUnmount(){
        this.data.off('value', this.offRef);
    }

    getUsers = () => {
        Firebase.database.ref('/').once('value').then(
            (snapshot) => {
                if (snapshot.child('connections/' + Firebase.uid).exists())
                {
                    this.data = Firebase.database.ref('/connections/' + Firebase.uid);
                    this.offRef = this.data.on('value', (snapshot) => {
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

    render() {
        return (
            <View style={{backgroundColor: styles.mainColorGrey, flex: 1}}>
                <ScrollView>
                    {this.state.array}
                </ScrollView>
            </View>
            
        );
    }
}