import React from 'react';
import {Text, View, TouchableOpacity, Image, ScrollView, RefreshControl} from 'react-native';
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import AddUser from "./AddUser";
import ImageList from '../images/list.svg';
import ImagePlus from '../images/plus.svg';
import ImageListNotification from '../images/list_notification2.svg';

import ImageReturn from '../images/return.svg';
import MyImageList from '../images/my_list.svg';
import MyImagePlus from '../images/my_plus.svg';

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
        Firebase.database.ref('balance/'+Firebase.uid+'/items').on('value', (snapshot) => {
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
        });

        Firebase.database.ref('balance/'+Firebase.uid+'/money').on('value', (snapshot) => {
            if(snapshot.exists()){
                let owed_by_me = 0;
                let owed_to_me = 0;
                snapshot.forEach((childSnapshot) => {
                    if(childSnapshot.val() > 0)
                        owed_by_me += Math.abs(Number(childSnapshot.val()));
                    else
                        owed_to_me += Math.abs(Number(childSnapshot.val()));
                });
                this.setState({money_owed_by_me: owed_by_me});
                this.setState({money_owed_to_me: owed_to_me});
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
            <View style={{flex: 1}}>
                <View style={[{flex: 4, backgroundColor: styles.mainColorBlue}]}>
                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>Money</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'white', fontSize: 15, margin: -5}}>I Owe</Text>
                            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{this.state.money_owed_by_me}€</Text>
                        </View>
                        <View style={{flex: 1}}></View>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'white', fontSize: 15, margin: -5}}>Owe Me</Text>
                            <Text style={{color: 'white', fontSize: 20, fontWeight: 'bold'}}>{this.state.money_owed_to_me}€</Text>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'white', fontSize: 18, margin: -5}}>
                                {this.state.money_owed_by_me > this.state.money_owed_to_me
                                    ? "Owed by me"
                                    : (this.state.money_owed_by_me === this.state.money_owed_to_me ? "" : "Owed to me")}
                            </Text>
                            <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold', marginBottom: 10}}>{Math.abs(this.state.money_owed_by_me - this.state.money_owed_to_me)}€</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'stretch', flex: 1}}>
                        <TouchableOpacity style={{elevation: 10, flex: 1, backgroundColor: styles.mainColorLihtGreen, marginHorizontal: 10}} onPress={() =>{}} underlayColor="white">
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <ImageReturn width={35} height={35} color={'black'}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{elevation: 10, flex: 1, backgroundColor: styles.mainColorLihtGreen, marginHorizontal: 10}} onPress={() => this.props.navigation.navigate('AddMoney')} underlayColor="white">
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <MyImagePlus width={35} height={35} color={'black'}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{elevation: 10, flex: 1, backgroundColor: styles.mainColorLihtGreen, marginHorizontal: 10}} onPress={() => this.props.navigation.navigate('Money')} underlayColor="white">
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <MyImageList width={35} height={35}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex: 3, backgroundColor: styles.mainColorGrey}}>
                    <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
                        <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>Items</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
                            <Text style={{color: 'white', fontSize: 15, margin: -5}}>I Owe</Text>
                            <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold', marginBottom: 10}}>{this.state.items_owed_by_me}</Text>
                        </View>
                        <View style={{flex: 1}}></View>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'white', fontSize: 15, margin: -5}}>Owe Me</Text>
                            <Text style={{color: 'white', fontSize: 25, fontWeight: 'bold', marginBottom: 10}}>{this.state.items_owed_to_me}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'stretch', flex: 1}}>
                        <TouchableOpacity style={{elevation: 10, flex: 1, backgroundColor: styles.mainColorLightGrey2, marginHorizontal: 10}} onPress={() =>{}} underlayColor="white">
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <ImageReturn width={35} height={35} color={'black'}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{elevation: 10, flex: 1, backgroundColor: styles.mainColorLightGrey2, marginHorizontal: 10}} onPress={() => this.props.navigation.navigate('AddItems')} underlayColor="white">
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <MyImagePlus width={35} height={35} color={'black'}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{elevation: 10, flex: 1, backgroundColor: styles.mainColorLightGrey2, marginHorizontal: 10}} onPress={() => this.props.navigation.navigate('Items')} underlayColor="white">
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <MyImageList width={35} height={35}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{flex: 2, backgroundColor: styles.mainColorOrange}}>
                    <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                        <View style={{flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{color: 'white', fontSize: 30, fontWeight: 'bold'}}>Users</Text>
                        </View>   
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'stretch', flex: 1}}>
                        <TouchableOpacity style={{elevation: 10, flex: 1, backgroundColor: styles.mainColorLightOrange, marginHorizontal: 10}} onPress={() => this.props.navigation.navigate('AddUser')} underlayColor="white">
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <MyImagePlus width={35} height={35} color={'black'}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{elevation: 10, flex: 1, backgroundColor: styles.mainColorLightOrange, marginHorizontal: 10}} onPress={() => this.props.navigation.navigate('Users')} underlayColor="white">
                            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <MyImageList width={35} height={35}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            {/*<View style={styles.Profile.container} >
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
            </View>*/}
            </View>
        );
    }
}
