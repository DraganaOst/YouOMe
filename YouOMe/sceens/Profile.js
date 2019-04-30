import React from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import PopupMenu from '../components/PopupMenu';

import ImageReturn from '../images/return.svg';
import MyImageList from '../images/my_list.svg';
import MyImageListNotifications from '../images/my_list_notifications.svg';
import MyImagePlus from '../images/my_plus.svg';
import ImageMoreMenu from '../images/more-menu.svg';
import ImageNotification from '../images/bell.svg';

import Notifications from './Notifications';


export default class Profile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            money_owed_by_me: 0,
            money_owed_to_me: 0,
            items_owed_by_me: 0,
            items_owed_to_me: 0,
            usersImage: (<MyImageList width={35} height={35} />),
            moneyImage: (<MyImageList width={35} height={35} />),
            itemsImage: (<MyImageList width={35} height={35} />),
            modalVisible: false,
            modalVisibleNotifications: false,
            numberNotifications: 0
        };
    }

    componentDidMount(){
        this.loadBalance();
        this.loadNotifications();
        this.props.navigation.setParams({
            setModalVisible: this.setModalVisible,
            setModalVisibleNotifications: this.setModalVisibleNotifications,
            notificationsNumber: 0
        })
    }

    componentWillUnmount(){
        //off firebase listening
        this.data.child('confirmations/users/'+Firebase.uid).off('value', this.offRefChild);
        this.data.child('connections/' + Firebase.uid).off('value', this.offRefChild2);
        this.data2.child('/items').off('value', this.offRef2Child);
        this.data2.child('/money').off('value', this.offRef2Child2);
    }

    static navigationOptions = ({ navigation }) => ({
        title: Firebase.username,
        headerRight: (
            <View style={styles.Profile.containerHeader}>
                {navigation.getParam('notificationsNumber') + navigation.getParam('notificationsNumberUsers') > 0
                    ?
                        //if there is notifications
                        <View style={styles.Profile.containerNotification}>
                            <TouchableOpacity style={styles.Profile.buttonNotification} onPress={() => navigation.getParam('setModalVisibleNotifications')(true)}>
                                <View>
                                    <ImageNotification style={{flex: 1}} height={20} width={20}/>
                                    <View style={styles.Profile.containerNotificationNumber}>
                                        <Text style={styles.Profile.textNotificationNumber}>
                                            {navigation.getParam('notificationsNumber') + navigation.getParam('notificationsNumberUsers')}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>     
                    :
                        //no notifications
                        <TouchableOpacity style={styles.Profile.buttonNoNotification} onPress={() => alert('No notifications')}>
                            <ImageNotification height={20} width={20}/>
                        </TouchableOpacity>
                }

                {/*more menu button*/}
                <TouchableOpacity style={styles.Profile.buttonMoreMenu} onPress={() => navigation.getParam('setModalVisible')(true)}>
                    <ImageMoreMenu height={20} width={20}/>
                </TouchableOpacity>
            </View>
        )
    });

    //more menu visibility
    setModalVisible = (visible) => {
        this.setState({modalVisible: visible});
    }

    //notifications modal visibility
    setModalVisibleNotifications = (visible) => {
        this.setState({modalVisibleNotifications: visible});
    }

    loadNotifications = () => {
        this.setState({
            moneyImage: (<Image style={{height: 35, width: 35}} source={require('../images/my_list.png')}/>),
            itemsImage: (<MyImageList width={35} height={35} />),
            usersImage: (<MyImageList width={35} height={35} />)
        });

        this.data = Firebase.database.ref('/');
        this.offRefChild = this.data.child('confirmations/users/'+Firebase.uid).on('value', (snapshot) => {
            let number = 0;       
            if(snapshot.child('/money').exists())
                number += snapshot.child('/money').numChildren(); 
            if(snapshot.child('/items').exists())
                number += snapshot.child('/items').numChildren();
            if(snapshot.child('/items_returned').exists())
                number += snapshot.child('/items_returned').numChildren(); 
            if(snapshot.child('/delete_connections'))
                number += snapshot.child('/delete_connections').numChildren();
            this.props.navigation.setParams({
                notificationsNumber: number
            })
        })

        this.offRefChild2 = this.data.child('connections/' + Firebase.uid).on('value', (snapshot) => {
            let number = 0;
            this.setState({usersImage: (<MyImageList width={35} height={35} />)})
            if (snapshot.exists()) {
                snapshot.forEach((child) => {
                    if(child.val() !== true){
                        if(child.val().toString().includes('deleted_'))
                            number++;
                        else if(child.val().toString().includes('deleted')){
                            this.setState({usersImage: (<MyImageList width={35} height={35} />)})
                        }
                        else{
                            this.setState({usersImage: (<MyImageListNotifications width={35} height={35} />)})
                            number++;
                        }       
                    }
                })
            }
            this.props.navigation.setParams({
                notificationsNumberUsers: number
            })
        });
    };

    
    loadBalance = () => {
        let string = 'balance/'+Firebase.uid+'/items';
        string;

        this.data2 = Firebase.database.ref('balance/'+Firebase.uid);
        this.offRef2Child = this.data2.child('/items').on('value', (snapshot) => {
            if(snapshot.exists()){
                let owed_by_me = 0;
                let owed_to_me = 0;
                snapshot.forEach((childSnapshot) => {
                    if(childSnapshot.child('owed_by_me').exists())
                        owed_by_me += childSnapshot.val().owed_by_me;
                    if(childSnapshot.child('owed_to_me').exists())
                        owed_to_me += childSnapshot.val().owed_to_me;
                });
                this.setState({items_owed_by_me: owed_by_me});
                this.setState({items_owed_to_me: owed_to_me});
            }
            else{
                this.setState({items_owed_by_me: 0});
                this.setState({items_owed_to_me: 0});
            }
            
        });

        this.offRef2Child2 = this.data2.child('/money').on('value', (snapshot) => {
            if(snapshot.exists()){
                let owed_by_me = 0;
                let owed_to_me = 0;
                snapshot.forEach((childSnapshot) => {
                    if(childSnapshot.val() > 0)
                        owed_by_me += Math.abs(childSnapshot.val());
                    else
                        owed_to_me += Math.abs(childSnapshot.val());
                });
                this.setState({money_owed_by_me: owed_by_me});
                this.setState({money_owed_to_me: owed_to_me});
            }
            else{
                this.setState({items_owed_by_me: 0});
                this.setState({items_owed_to_me: 0});
            }
        });
    };

    render() {
        return (
            <View style={{flex: 1}}>
                {/*more menu*/}
                <View>
                    <PopupMenu modalVisible={this.state.modalVisible} setModalVisible={() => this.setModalVisible(false)} navigation={this.props.navigation} />
                </View>
                {/*notification modal*/}
                <View>
                    <Notifications modalVisibleNotifications={this.state.modalVisibleNotifications} setModalVisibleNotifications={() => this.setModalVisibleNotifications(false)}/>
                </View>
                {/*Money*/}
                <View style={[{flex: 4, backgroundColor: styles.mainColorBlue}]}>
                    <View style={styles.Profile.container}>
                        <Text style={styles.Profile.text}>Money</Text>
                    </View>
                    {/*balance*/}
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={styles.Profile.container}>
                            <Text style={styles.Profile.textBalance}>I Owe</Text>
                            <Text style={styles.Profile.textMoneyValue}>{this.state.money_owed_by_me}€</Text>
                        </View>
                        <View style={{flex: 1}}></View>
                        <View style={styles.Profile.container}>
                            <Text style={styles.Profile.textBalance}>Owe Me</Text>
                            <Text style={styles.Profile.textMoneyValue}>{this.state.money_owed_to_me}€</Text>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={styles.Profile.container}>
                            <Text style={{color: 'white', fontSize: 18, margin: -5}}>
                                {this.state.money_owed_by_me > this.state.money_owed_to_me
                                    ? "Owed by me"
                                    : (this.state.money_owed_by_me === this.state.money_owed_to_me ? "" : "Owed to me")}
                            </Text>
                            <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold', marginBottom: 10}}>{Math.abs(this.state.money_owed_by_me - this.state.money_owed_to_me).toFixed(2)}€</Text>
                        </View>
                    </View>
                    {/*buttons*/}
                    <View style={styles.Profile.containerButtons}>
                        <TouchableOpacity style={[styles.Profile.button, {backgroundColor: styles.mainColorLightBlue}]} onPress={() => this.props.navigation.navigate('AddMoney')} underlayColor="white">
                            <View style={styles.Profile.container}>
                                <MyImagePlus width={35} height={35} color={'black'}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.Profile.button, {backgroundColor: styles.mainColorLightBlue}]} onPress={() => this.props.navigation.navigate('Money')} underlayColor="white">
                            <View style={styles.Profile.container}>
                                {this.state.moneyImage}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {/*items*/}
                <View style={{flex: 3, backgroundColor: styles.mainColorGrey}}>
                    <View style={styles.Profile.container}>
                        <Text style={styles.Profile.text}>Items</Text>
                    </View>
                    {/*balance*/}
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                            <Text style={styles.Profile.textBalance}>I Owe</Text>
                            <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold', marginBottom: 10}}>{this.state.items_owed_by_me}</Text>
                        </View>
                        <View style={{flex: 1}}></View>
                        <View style={styles.Profile.container}>
                            <Text style={styles.Profile.textBalance}>Owe Me</Text>
                            <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold', marginBottom: 10}}>{this.state.items_owed_to_me}</Text>
                        </View>
                    </View>
                    {/*buttons*/}
                    <View style={styles.Profile.containerButtons}>
                        <TouchableOpacity style={[styles.Profile.button, {backgroundColor: styles.mainColorLightGrey2}]} onPress={() => this.props.navigation.navigate('ReturnItems')} underlayColor="white">
                            <View style={styles.Profile.container}>
                                <ImageReturn width={35} height={35} color={'black'}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.Profile.button, {backgroundColor: styles.mainColorLightGrey2}]} onPress={() => this.props.navigation.navigate('AddItems')} underlayColor="white">
                            <View style={styles.Profile.container}>
                                <MyImagePlus width={35} height={35} color={'black'}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.Profile.button, {backgroundColor: styles.mainColorLightGrey2}]} onPress={() => this.props.navigation.navigate('Items')} underlayColor="white">
                            <View style={styles.Profile.container}>
                                {this.state.itemsImage}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                {/*users*/}
                <View style={{flex: 2, backgroundColor: styles.mainColorOrange}}>
                    <View style={styles.Profile.container}>
                        <View style={styles.Profile.container}>
                            <Text style={styles.Profile.text}>Users</Text>
                        </View>   
                    </View>
                    {/*buttons*/}
                    <View style={styles.Profile.containerButtons}>
                        <TouchableOpacity style={[styles.Profile.button, {backgroundColor: styles.mainColorLightOrange}]} onPress={() => this.props.navigation.navigate('AddUser')} underlayColor="white">
                            <View style={styles.Profile.container}>
                                <MyImagePlus width={35} height={35} color={'black'}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.Profile.button, {backgroundColor: styles.mainColorLightOrange}]} onPress={() => this.props.navigation.navigate('Users')} underlayColor="white">
                            <View style={styles.Profile.container}>
                                {this.state.usersImage}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
