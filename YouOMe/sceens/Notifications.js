import React from 'react';
import {View, Text, Modal, TouchableOpacity, FlatList, ScrollView, TouchableWithoutFeedback} from 'react-native';
import * as styles from '../components/Styles';
import Firebase from '../components/Firebase';
import { snapshotToArray } from '../components/Functions';
import ImageCheck from '../images/checked_2.svg';
import ImageCancel from '../images/cancel.svg';
import ImageBin from '../images/rubbish-bin.svg';

class Confirmation extends React.Component {
    onDelete = props => {
        let option = props.transaction.from == Firebase.uid ? " to " : ' from ';
        let message = props.transaction.name + option + props.user;
        Alert.alert(
            'Alert',
            'Are you sure you want to delete: \n' + message,
            [
              {text: 'NO', onPress: () => {}},
              {text: 'YES', onPress: () => {
                let update = {};
                update['confirmations/items/'+props.keyTransaction] = null;
                Firebase.database.ref().update(update);

                let ref = Firebase.database.ref('confirmations/users/'+props.transaction.from+'/items/'+props.transaction.to);
                ref.orderByValue().equalTo(props.keyTransaction).once('child_added', (snapshot) => {
                    snapshot.ref.remove();
                }); 

                let ref2 = Firebase.database.ref('confirmations/users/'+props.transaction.to+'/items/'+props.transaction.from);
                ref2.orderByValue().equalTo(props.keyTransaction).once('child_added', (snapshot) => {
                    snapshot.ref.remove();
                }); 
              }},
            ],
            {cancelable: false},
          );

        
    };

    onAccept = async props => {
        let update = {};

        let ref = Firebase.database.ref('/transactions/items');
        let uid = props.userUid;

        let balance = { owed_by_me: 0, owed_to_me: 0};
        let balanceUser = {owed_by_me: 0, owed_to_me: 0};

        await Firebase.database.ref('/balance/' + Firebase.uid + '/items/'+uid).once('value').then((snapshot) => {
            if(snapshot.child('owed_by_me').exists()){
                balance.owed_by_me = snapshot.val().owed_by_me;
                balanceUser.owed_to_me = balance.owed_by_me;
            }
            if(snapshot.child('owed_to_me').exists()){
                balance.owed_to_me = snapshot.val().owed_to_me;
                balanceUser.owed_by_me = balance.owed_to_me;
            }
        });

        let from = Firebase.uid;
        let to = uid;
    
        if(props.transaction.from === uid){
            from = uid;
            to = Firebase.uid;
            update['balance/'+Firebase.uid+'/items/'+uid+'/owed_by_me'] = balance.owed_by_me + 1;
            update['balance/'+uid+'/items/'+Firebase.uid+'/owed_to_me'] = balanceUser.owed_to_me + 1;
        }
        else{
            update['balance/'+Firebase.uid+'/items/'+uid+'/owed_to_me'] = balance.owed_to_me + 1;
            update['balance/'+uid+'/items/'+Firebase.uid+'/owed_by_me'] = balanceUser.owed_by_me + 1;
        }
        
        let item = ref.push(
            {
                'from': props.transaction.from, 
                'to': props.transaction.to, 
                'reason': props.transaction.reason,
                'name': props.transaction.name,
                'date_incured': props.transaction.date_incured,
                'date_due': props.transaction.date_due,
                'returned': props.transaction.returned,
            }
        );

        Firebase.database.ref('/transactions/users/'+Firebase.uid+'/items/'+uid).push(item.key);
        Firebase.database.ref('/transactions/users/'+uid+'/items/'+Firebase.uid).push(item.key);

        update['confirmations/items/'+props.keyTransaction] = null;
        Firebase.database.ref().update(update);

        Firebase.database.ref('confirmations/users/'+props.transaction.from+'/items/'+props.transaction.to).orderByValue().equalTo(props.keyTransaction).once('child_added', (snapshot) => {
            snapshot.ref.remove();
        }); 

        Firebase.database.ref('confirmations/users/'+props.transaction.to+'/items/'+props.transaction.from).orderByValue().equalTo(props.keyTransaction).once('child_added', (snapshot) => {
            snapshot.ref.remove();
        }); 
    };

    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5, backgroundColor: styles.mainColorLightOrange}}>
                {this.props.transaction.request == Firebase.uid
                ? 
                    null
                :
                    <TouchableOpacity style={{flex: 0.5, backgroundColor: 'red', paddingHorizontal: 20, paddingVertical: 10}} onPress={() => this.onDelete(this.props)}>
                        <ImageCancel width={20} height={20} />
                    </TouchableOpacity>
                }
                <View style={{flex: 5, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{this.props.transaction.name}</Text>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{this.props.transaction.from == Firebase.uid ? " to " : ' from '}</Text>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{this.props.user}</Text>
                </View>
                {this.props.transaction.request == Firebase.uid
                ? 
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', paddingHorizontal: 40, paddingVertical: 10}} onPress={() => this.onDelete(this.props)}>
                        <ImageBin width={20} height={20} />
                    </TouchableOpacity>
                :
                    <TouchableOpacity style={{flex: 0.5, backgroundColor: styles.mainColorGreen, paddingHorizontal: 20, paddingVertical: 10}} onPress={() => this.onAccept(this.props)}>
                        <ImageCheck width={20} height={20} />
                    </TouchableOpacity>
                }  
            </View>
        );
    }
}


class ConfirmationReturn extends React.Component {
    onDelete = props => {
        let option = props.from == Firebase.uid ? " returned " : ' got back ';
        let message = props.user + option + props.name;
        Alert.alert(
            'Alert',
            'Are you sure you want to delete: \n' + message,
            [
              {text: 'NO', onPress: () => {}},
              {text: 'YES', onPress: () => {
                let ref = Firebase.database.ref('confirmations/users/'+props.from+'/items_returned/'+props.to);
                ref.orderByChild('transactionsKey').equalTo(props.keyTransaction).once('child_added', (snapshot) => {
                    snapshot.ref.remove();
                }); 

                let ref2 = Firebase.database.ref('confirmations/users/'+props.to+'/items_returned/'+props.from);
                ref2.orderByChild('transactionsKey').equalTo(props.keyTransaction).once('child_added', (snapshot) => {
                    snapshot.ref.remove();
                }); 
              }},
            ],
            {cancelable: false},
          );

        
    };

    onAccept = async props => {
        let update = {};

        let balance = { owed_by_me: 0, owed_to_me: 0};
        let balanceUser = {owed_by_me: 0, owed_to_me: 0};

        let uid = this.props.from == Firebase.uid ? this.props.to : this.props.from;

        await Firebase.database.ref('/balance/' + Firebase.uid + '/items/'+uid).once('value').then((snapshot) => {
            if(snapshot.child('owed_by_me').exists()){
                balance.owed_by_me = snapshot.val().owed_by_me;
                balanceUser.owed_to_me = balance.owed_by_me;
            }
            if(snapshot.child('owed_to_me').exists()){
                balance.owed_to_me = snapshot.val().owed_to_me;
                balanceUser.owed_by_me = balance.owed_to_me;
            }
        });

        update['transactions/items/'+ this.props.keyTransaction + '/returned'] = new Date().toISOString();

        if(this.props.to === Firebase.uid){
            balance.owed_by_me -= 1;
            balanceUser.owed_to_me -=1
        }
        else{
            balance.owed_to_me -= 1;
            balanceUser.owed_by_me -= 1;
        }

        if(this.props.to === Firebase.uid){
            update['balance/'+Firebase.uid+'/items/'+uid+'/owed_by_me'] = balance.owed_by_me;
            update['balance/'+uid+'/items/'+Firebase.uid+'/owed_to_me'] = balanceUser.owed_to_me;
        }
        else{
            update['balance/'+Firebase.uid+'/items/'+uid+'/owed_to_me'] = balance.owed_to_me;
            update['balance/'+uid+'/items/'+Firebase.uid+'/owed_by_me'] = balanceUser.owed_by_me;
        }

        Firebase.database.ref().update(update);
        this.onDelete(this.props);
    };

    render() {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 5, backgroundColor: styles.mainColorLightOrange}}>
                {this.props.request == Firebase.uid
                ? 
                    null
                :
                    <TouchableOpacity style={{flex: 0.5, backgroundColor: 'red', paddingHorizontal: 20, paddingVertical: 10}} onPress={() => this.onDelete(this.props)}>
                        <ImageCancel width={20} height={20} />
                    </TouchableOpacity>
                }
                <View style={{flex: 5, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{this.props.user}</Text>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{this.props.from == Firebase.uid ? " returned " : ' got back '}</Text>
                    <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{this.props.name}</Text>
                </View>
                {this.props.request == Firebase.uid
                ? 
                    <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', paddingHorizontal: 40, paddingVertical: 10}} onPress={() => this.onDelete(this.props)}>
                        <ImageBin width={20} height={20} />
                    </TouchableOpacity>
                :
                    <TouchableOpacity style={{flex: 0.5, backgroundColor: styles.mainColorGreen, paddingHorizontal: 20, paddingVertical: 10}} onPress={() => this.onAccept(this.props)}>
                        <ImageCheck width={20} height={20} />
                    </TouchableOpacity>
                }  
            </View>
        );
    }
}

export default class Notifications extends React.Component {
    constructor(){
        super();
        this.state = {
            option: 'money',
            moneyAdd: [],
            itemsAdd: [],
            itemsReturn: [],
            users: [],
        }
    }

    componentDidMount(){
        this.loadConfirmations();
    }

    componentWillUnmount(){
        this.data.child('/items').off('value',this.offRefChild);
        this.data.child('items_returned').off('value', this.offRefChild2);
    }

    loadConfirmations = () => {
        //items
        const navigator = this.props.navigation;
        this.data = Firebase.database.ref('confirmations/users/' + Firebase.uid);
        this.offRefChild = this.data.child('/items').on('value', (snapshot) => {
            if(snapshot.exists()){
                this.setState({itemsAdd: []});
                snapshotToArray(snapshot).reverse().forEach(async (childSnapshot) => {
                    let username = "";
                    let userUid = childSnapshot.key;
                    await Firebase.database.ref('users/'+userUid).once('value').then((userSnapshot) => {username = userSnapshot.val().username});

                    childSnapshot.forEach((subChildSnapshot) => {
                        Firebase.database.ref('confirmations/items/'+subChildSnapshot.val()).once('value').then((confirmation) => {
                            let object = ({
                                key: confirmation.key,
                                keyTransaction: confirmation.key,
                                username: username,
                                userUid: userUid,
                                transaction: confirmation.val()
                            });
                            this.setState((previousState) => ({itemsAdd: [...previousState.itemsAdd, object]}));
                        })
                    });
                    
                });
            }
            else{
                this.setState({itemsAdd: []});
            }
        });

        this.offRefChild2 = this.data.child('/items_returned').on('value', (snapshot) => {
            if(snapshot.exists()){
                this.setState({itemsReturn: []});
                snapshotToArray(snapshot).reverse().forEach(async (childSnapshot) => {
                    let username = "";
                    let userUid = childSnapshot.key;
                    await Firebase.database.ref('users/'+userUid).once('value').then((userSnapshot) => {username = userSnapshot.val().username});

                    childSnapshot.forEach((subChildSnapshot) => {
                        let itemName = "";
                        let from = "";
                        let to = "";
                        let request = subChildSnapshot.val().request;
                        Firebase.database.ref('transactions/items/'+subChildSnapshot.val().transactionsKey).once('value').then((transactionSnapshot) => {
                            itemName = transactionSnapshot.val().name;
                            from = transactionSnapshot.val().from;
                            to = transactionSnapshot.val().to;

                            let object = ({
                                key: subChildSnapshot.val().transactionsKey,
                                keyTransaction: subChildSnapshot.val().transactionsKey,
                                username: username,
                                userUid: userUid,
                                name: itemName,
                                request: request,
                                from: from,
                                to: to
                            });
                            this.setState((previousState) => ({itemsReturn: [...previousState.itemsReturn, object]}));
                        });
                    });
                    
                });
            }
            else{
                this.setState({itemsReturn: []});
            }
        });
    };

    render() {
      return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.modalVisibleNotifications}
        >
            <TouchableOpacity onPressIn={this.props.setModalVisibleNotifications} style={{flex: 1}}>
                <TouchableWithoutFeedback>
                    <View style={{flex: 1, marginTop: 55, backgroundColor: styles.mainColorLightGrey, borderTopColor: styles.mainColorGreen2, borderTopWidth: 10}}>
                        <View style={styles.AddMoneyItem.containerButton}>
                            <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: 'money'}))} underlayColor="white">
                                <View style={[styles.AddMoneyItem.button, {backgroundColor: styles.mainColorOrange, opacity: this.state.option === "money" ? 1 : 0.5}]}>
                                    <Text style={styles.AddMoneyItem.buttonText}>Money</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: "items"}))} underlayColor="white">
                                <View style={[styles.AddMoneyItem.button, {backgroundColor: styles.mainColorOrange, opacity: this.state.option === "items" ? 1 : 0.5}]}>
                                    <Text style={styles.AddMoneyItem.buttonText}>Items</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: "users"}))} underlayColor="white">
                                <View style={[styles.AddMoneyItem.button, {backgroundColor: styles.mainColorOrange, opacity: this.state.option === "users" ? 1 : 0.5}]}>
                                    <Text style={styles.AddMoneyItem.buttonText}>Users</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {/*<View style={{flex: 1}}>
                            <View style={{flex: 1, backgroundColor: styles.mainColorGrey, flexDirection: 'row'}}>
                                <View style={{width: 50, backgroundColor: styles.mainColorLightGrey2, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18, transform: [{ rotate: '-90deg'}]}}>Add</Text>
                                </View>
                                <View>
                                    <Text>Content</Text>
                                </View>
                            </View>
                            <View style={{flex: 1, backgroundColor: styles.mainColorGrey, flexDirection: 'row', borderTopColor: styles.mainColorLightGrey2, borderTopWidth: 3}}>
                                <View style={{width: 50, backgroundColor: styles.mainColorLightGrey2, justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{width: 110, color: 'white', fontWeight: 'bold', fontSize: 18, transform: [{ rotate: '-90deg'}]}}>My requests</Text>
                                </View>
                                <View>
                                    <Text>Content</Text>
                                </View>
                            </View>
                        </View>*/}
                        <View style={{flex: 1, backgroundColor: styles.mainColorGrey}}>
                            <View style={{flex: 1}}>
                                <View style={{backgroundColor: styles.mainColorLightGrey2}}>
                                    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                                        <Text style={{flex: 1, color: 'white', marginHorizontal: 10, textAlign: 'center'}}>
                                            Item
                                        </Text>
                                        <Text style={{flex: 1, color: 'white', fontWeight: 'bold', marginHorizontal: 10, textAlign: 'center'}}>
                                            FROM
                                        </Text>
                                        <Text  style={{flex: 1, color: 'white',marginHorizontal: 10, textAlign: 'center'}}>
                                            User
                                        </Text>
                                    </View>
                                    <View style={{flexDirection: 'row'}}>
                                        <TouchableOpacity style={{elevation: 4, flex: 1, backgroundColor: '#BC1A1A', marginHorizontal: 10}} onPress={() => {}} underlayColor="white">
                                            <Text style={{textAlign: 'center', color: 'white', padding: 5, fontWeight: 'bold'}}>Deny</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{elevation: 4, flex: 1, backgroundColor: styles.mainColorGreen, marginHorizontal: 10}} onPress={() => {}} underlayColor="white">
                                            <Text style={{textAlign: 'center', color: 'white', padding: 5, fontWeight: 'bold'}}>Accept</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{flex: 1, borderTopColor: styles.mainColorLightGrey2, borderTopWidth: 3}}>

                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                
                {this.state.itemsAdd.length < 0  
                    ?
                        <FlatList 
                            style={{backgroundColor: styles.mainColorOrange, maxHeight: '50%'}}
                            data={this.state.itemsAdd}  
                            renderItem={({item}) => (
                                <Confirmation
                                    key={item.key}
                                    transaction={item.transaction}
                                    user={item.username}
                                    userUid={item.userUid}
                                    keyTransaction={item.keyTransaction}
                                />
                            )}         
                        />
                    : 
                        null
                }
            </TouchableOpacity>       
        </Modal>
      )
    };
}