import React from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import AddUser from "./AddUser";

export default class Profile extends React.Component {
    constructor(){
        super();
        this.state = {
            money: {
                owed_by_me: 0,
                owed_to_me: 0
            },
            items: {
                owed_by_me_number: 0,
                owed_by_me_items: "",
                owed_to_me_number: 0,
                owed_to_me_items: ""
            },
            modalVisible: false
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: Firebase.username,
        headerStyle: styles.Profile.header,
        headerTitleStyle: styles.Profile.headerText
    });

    render() {
        return (
            <View style={styles.Profile.container} >
                <View style={[styles.Profile.subContainer, {flex: 2}]}>
                    <View style={styles.Profile.containerHeader}>
                        <View style={styles.Profile.containerText}>
                            <Text style={styles.Profile.text}>Money</Text>
                        </View>
                        <View style={styles.Profile.containerButton}>
                            <TouchableOpacity style={styles.Profile.button} onPress={() => {}}>
                                <Image source={require('../images/list_button2_smaller.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Profile.button} onPress={() => this.props.navigation.navigate('AddMoney')}>
                                <Image source={require('../images/plus_button_smaller.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 25}}>
                        <View style={{justifyContent: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Owed BY me: </Text>
                                <Text style={{fontSize: 20}}>{this.state.money.owed_by_me}€</Text>

                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Owed TO me: </Text>
                                <Text style={{fontSize: 20}}>{this.state.money.owed_to_me}€</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                            <Text style={{fontSize: 20}}>
                                {this.state.money.owed_by_me > this.state.money.owed_to_me
                                    ? "Owed by me"
                                    : (this.state.money.owed_by_me === this.state.money.owed_to_me ? "" : "Owed to me")}
                            </Text>
                            <Text style={{fontSize: 40, fontWeight: 'bold'}}>{Math.abs(this.state.money.owed_by_me - this.state.money.owed_to_me)}€</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.Profile.subContainer, {flex: 3}]}>
                    <View style={styles.Profile.containerHeader}>
                        <View style={styles.Profile.containerText}>
                            <Text style={styles.Profile.text}>Items</Text>
                        </View>
                        <View style={styles.Profile.containerButton}>
                            <TouchableOpacity style={styles.Profile.button} onPress={() => {}}>
                                <Image source={require('../images/list_button2_smaller.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Profile.button} onPress={() => {}}>
                                <Image source={require('../images/plus_button_smaller.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 25}}>
                        <View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Owed BY me: </Text>
                                <Text style={{fontSize: 20}}>{this.state.items.owed_by_me_number}</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: 20}}>{this.state.items.owed_by_me_items} </Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 20, fontWeight: 'bold'}}>Owed TO me: </Text>
                                <Text style={{fontSize: 20}}>{this.state.items.owed_to_me_number}</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: 20}}>{this.state.items.owed_to_me_items}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[styles.Profile.subContainer, {marginBottom: 20, flex: 1}]}>
                    <View style={[styles.Profile.containerHeader, {borderColor: 'white'}]}>
                        <View style={[styles.Profile.containerText, {alignItems: 'center'}]}>
                            <Text style={styles.Profile.text}>Users</Text>
                        </View>
                        <View style={styles.Profile.containerButton}>
                            <TouchableOpacity style={styles.Profile.button} onPress={() => {}}>
                                <Image source={require('../images/list_button2_smaller.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Profile.button} onPress={() => this.props.navigation.navigate('AddUser')}>
                                <Image source={require('../images/plus_button_smaller.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
