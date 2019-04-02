import React from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import AddUser from "./AddUser";
import ImageList from '../images/list.svg';
import ImagePlus from '../images/plus.svg';
import ImageListNotification from '../images/list_notification2.svg';

export default class Profile extends React.Component {
    constructor(){
        super();
        this.state = {
            money_owed_by_me: 0,
            money_owed_to_me: 0,
            items_owed_by_me: 0,
            items_owed_to_me: 0,
            usersImage: (<ImageList width={48} height={48} />)
        };
        
    }

    componentDidMount(){
        this.checkConnections();
        this.loadBalance();
    }

    static navigationOptions = ({ navigation }) => ({
        title: Firebase.username,
        headerStyle: styles.Profile.header,
        headerTitleStyle: styles.Profile.headerText
    });

    loadBalance = () => {
        let data = Firebase.database.ref('/');
        data.child('users/' + Firebase.uid + '/balance').on('value', (snapshot) => {
            if (snapshot.exists()){         
                if(snapshot.child('money/owed_by_me').exists())
                    this.setState({money_owed_by_me: Number(snapshot.val().money.owed_by_me)});
                if(snapshot.child('money/owed_to_me').exists())
                    this.setState({money_owed_to_me: Number(snapshot.val().money.owed_to_me)});
                if(snapshot.child('items/owed_to_me').exists())
                    this.setState({items_owed_to_me: Number(snapshot.val().items.owed_to_me)});
                if(snapshot.child('items/owed_by_me').exists())
                    this.setState({items_owed_by_me: Number(snapshot.val().items.owed_by_me)});
            }
        });
    };
    
    checkConnections = () => {
        let data = Firebase.database.ref('/');
        data.child('connections/' + Firebase.uid).on('value', (snapshot) => {
            this.setState({usersImage: (<ImageList width={48} height={48} />)});
            if (snapshot.exists()) {
                snapshot.forEach((child) => {
                    if(child.val() !== true && child.val() !== Firebase.uid){
                        this.setState({usersImage: (<ImageListNotification width={48} height={48} />)})
                    }
                })
            }
        });
    };

    render() {
        return (
            <View style={styles.Profile.container} >
                <View style={[styles.Profile.subContainer, {flex: 2}]}>
                    <View style={styles.Profile.containerHeader}>
                        <View style={styles.Profile.containerText}>
                            <Text style={styles.Profile.text}>Money</Text>
                        </View>
                        <View style={styles.Profile.containerButton}>
                            <TouchableOpacity style={styles.Profile.button} onPress={() => this.props.navigation.navigate('Money')}>
                                <ImageList width={48} height={48} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Profile.button} onPress={() => this.props.navigation.navigate('AddMoney')}>
                                <ImagePlus width={48} height={48} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20}}>
                        <View style={{justifyContent: 'center'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.Profile.subText}>Owed BY me: </Text>
                                <Text style={styles.Global.text}>{this.state.money_owed_by_me}€</Text>

                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.Profile.subText}>Owed TO me: </Text>
                                <Text style={styles.Global.text}>{this.state.money_owed_to_me}€</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end', justifyContent: 'center'}}>
                            <Text style={{fontSize: 20}}>
                                {this.state.money_owed_by_me > this.state.money_owed_to_me
                                    ? "Owed by me"
                                    : (this.state.money_owed_by_me === this.state.money_owed_to_me ? "" : "Owed to me")}
                            </Text>
                            <Text style={{fontSize: 40, fontWeight: 'bold'}}>{Math.abs(this.state.money_owed_by_me - this.state.money_owed_to_me)}€</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.Profile.subContainer, {flex: 2}]}>
                    <View style={styles.Profile.containerHeader}>
                        <View style={styles.Profile.containerText}>
                            <Text style={styles.Profile.text}>Items</Text>
                        </View>
                        <View style={styles.Profile.containerButton}>
                            <TouchableOpacity style={styles.Profile.button} onPress={() => this.props.navigation.navigate('Items')}>
                                <ImageList width={48} height={48} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Profile.button} onPress={() => this.props.navigation.navigate('AddItems')}>
                                <ImagePlus width={48} height={48} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 10}}>
                        <View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.Profile.subText}>Owed BY me: </Text>
                                <Text style={styles.Global.text}>{this.state.items_owed_by_me}</Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.Profile.subText}>Owed TO me: </Text>
                                <Text style={styles.Global.text}>{this.state.items_owed_to_me}</Text>
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
                            <TouchableOpacity style={styles.Profile.button} onPress={() => this.props.navigation.navigate('Users')}>
                                {this.state.usersImage}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.Profile.button} onPress={() => this.props.navigation.navigate('AddUser')}>
                                <ImagePlus width={48} height={48} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
