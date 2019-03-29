import React from 'react';
import {Text, View, TextInput, TouchableOpacity, Image, Button, Picker} from 'react-native';
import {NavigationActions, StackActions} from "react-navigation";
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";

export default class AddMoney extends React.Component {
    constructor(){
        super();
        this.state = {
            option: 'i_gave',
            array: []
        };
        this.loadUsers();
    }

    loadUsers = () => {
        Firebase.database.ref('/').once('value',
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
                                            <Picker.Item key={child.key} label={snapshotUser.val().username} value={child.key} />
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
                <View style={{alignItems: 'center', marginTop: 10}}>
                    <Text style={{fontSize: 20}}>Select</Text>
                </View>
                <View style={{flexDirection: 'row',alignItems: 'stretch', marginHorizontal: 15}}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: 'i_gave'}))} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button, {opacity: this.state.option === "i_gave" ? 1 : 0.5}]}>
                            <Text style={styles.AddMoneyItem.buttonText}>I Gave</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: "i_received"}))} underlayColor="white">
                        <View style={[styles.AddMoneyItem.button, {opacity: this.state.option === "i_received" ? 1 : 0.5}]}>
                            <Text style={styles.AddMoneyItem.buttonText}>I Received</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flexDirection: 'row', marginHorizontal: 25, alignItems: 'center'}}>
                    <Text style={{fontSize: 20}}>{this.state.option === 'i_gave' ? "To: " : "From: "}</Text>
                    <Picker
                        selectedValue={this.state.language}
                        style={{height: 50, flex: 1}}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({language: itemValue})
                        }>
                        {this.state.array}
                    </Picker>
                </View>
                <View style={{flexDirection: 'row', marginHorizontal: 25, alignItems: 'center'}}>
                    <Text style={{fontSize: 20}}>Amount: </Text>

                </View>
            </View>
        );
    }
}