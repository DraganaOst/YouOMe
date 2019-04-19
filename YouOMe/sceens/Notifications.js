import React from 'react';
import {View, Text, Modal, TouchableOpacity, FlatList, Alert, TouchableWithoutFeedback} from 'react-native';
import * as styles from '../components/Styles';
import Firebase from '../components/Firebase';
import { snapshotToArray } from '../components/Functions';
import ImageCheck from '../images/checked_2.svg';
import ImageCancel from '../images/cancel.svg';
import ImageBin from '../images/rubbish-bin.svg';

class NotificationDeletedConnection extends React.Component {
    constructor(){
        super();
    }

    onDeleteHistory = (props) => {
        Alert.alert(
            'Alert',
            'History will be deleted permanently. Are you sure you want to delete histroy?',
            [
                {text: 'No', onPress: () => {}},
                {text: 'Yes', onPress: () => {
                let update = {
                    ['/connections/'+Firebase.uid+'/'+props.userUid]: null,
                    ['/transactions/users/'+Firebase.uid+"/items/"+props.userUid]: null,
                    ['/transactions/users/'+Firebase.uid+"/money/"+props.userUid]: null,
                    ['/transactions/users/'+Firebase.uid+"/items_returned/"+props.userUid]: null,
                    ['/balance/'+Firebase.uid+"/items/"+props.userUid]: null,
                    ['/balance/'+Firebase.uid+"/money/"+props.userUid]: null,
                };
                Firebase.database.ref().update(update);
                }},
            ],
            {cancelable: false},
        );
    }

    onKeepHistory = (props) => {
        let update = {
            ['/connections/'+Firebase.uid+'/'+props.userUid]: "deleted",
        };
        Firebase.database.ref().update(update);
    }

    onCancelRequest = (props) => {
        Firebase.database.ref('/confirmations/users/'+Firebase.uid+"/delete_connections/"+props.userUid).once('value', (snapshot) => {
            let update = {
                ['confirmations/delete_connections/'+snapshot.val()]: null,
                ['confirmations/users/'+Firebase.uid+"/delete_connections/"+props.userUid]: null,
                ['confirmations/users/'+props.userUid+"/delete_connections/"+Firebase.uid]: null,

            };
            Firebase.database.ref().update(update);
        });
    }

    onDeleteConnection = (props) => {
        Firebase.database.ref('/confirmations/users/'+Firebase.uid+"/delete_connections/"+props.userUid).once('value', (snapshot) => {
            let update = {
                ['confirmations/delete_connections/'+snapshot.val()]: null,
                ['confirmations/users/'+Firebase.uid+"/delete_connections/"+props.userUid]: null,
                ['confirmations/users/'+props.userUid+"/delete_connections/"+Firebase.uid]: null,
                ['/connections/'+Firebase.uid+'/'+props.userUid]: 'deleted_'+props.userUid,
                ['/connections/'+props.userUid+'/'+Firebase.uid]: 'deleted_'+props.userUid
            };
            Firebase.database.ref().update(update);
        });


    }

    render() {
        return (
            <View style={{backgroundColor: styles.mainColorLightGrey2, margin: 5, elevation: 4}}>
                <Text style={{color: styles.mainColorOrange, fontWeight: 'bold', backgroundColor: styles.mainColorLightGrey2, textAlign: 'center'}}>
                    {this.props.text}
                </Text>
                <View style={{flexDirection: 'row', alignItems: 'center', padding: 1}}>
                    <Text  style={{flex: 1, color: 'white',marginHorizontal: 5, textAlign: 'center'}}>
                        {this.props.username}
                    </Text>
                </View>
                 
                {this.props.cancelRequest 
                    ?
                        <TouchableOpacity onPress={() => this.onDelete(this.props)} style={{flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: styles.mainColorLightBlue}}>
                            <Text style={{fontSize: 15, color: 'white'}}>Cancel request</Text>
                        </TouchableOpacity>
                    :
                        (this.props.text == "DELETED CONNECTION" 
                            ? 
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => this.onDeleteHistory(this.props)} style={{flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: styles.mainColorLightBlue}}>
                                        <Text style={{fontSize: 15, color: 'white'}}>Delete history</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.onKeepHistory(this.props)} style={{flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: styles.mainColorGreen, borderStyle: 'solid'}}>
                                        <Text style={{fontSize: 15, color: 'white'}}>Keep history</Text>
                                    </TouchableOpacity>       
                                </View>
                            :
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity onPress={() => this.onCancelRequest(this.props)} style={{flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: styles.mainColorLightBlue}}>
                                        <Text style={{fontSize: 15, color: 'white'}}>Cancel request</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.onDeleteConnection(this.props)} style={{flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: styles.mainColorGreen, borderStyle: 'solid'}}>
                                        <Text style={{fontSize: 15, color: 'white'}}>Delete connection</Text>
                                    </TouchableOpacity>       
                                </View>
                        )
                }
            </View>
        );
    }
}

class Notification extends React.Component {
    constructor(){
        super();
    }

    onAccept = async props => {
        if(props.path == 'items'){
            let update = {};

            let ref = Firebase.database.ref('/transactions/items');
            let uid = props.userUid;

            let balance = { owed_by_me: 0, owed_to_me: 0};
            let balanceUser = {owed_by_me: 0, owed_to_me: 0};

            await Firebase.database.ref('/balance/' + Firebase.uid + '/items/' + uid).once('value').then((snapshot) => {
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
        }
        else if(props.path == 'items_returned'){
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
        }
        else if(props.path == 'money'){
            let update = {};

            let ref = Firebase.database.ref('/transactions/money');
            let uid = props.userUid;

            let balance = 0;
            let balanceUser = 0;

            await Firebase.database.ref('balance/'+Firebase.uid+'/money/'+uid).once('value').then((snapshot) => {
                if(snapshot.exists()){
                    balance = snapshot.val();
                    balanceUser = balance * -1;
                }
            });

            let from = Firebase.uid;
            let to = uid;
        
            if(props.transaction.from === uid){
                from = uid;
                to = Firebase.uid;
                update['balance/'+Firebase.uid+'/money/'+uid] = Number(balance + props.transaction.amount).toFixed(2);
                update['balance/'+uid+'/money/'+Firebase.uid] = Number(balanceUser - props.transaction.amount).toFixed(2);
            }
            else{
                update['balance/'+Firebase.uid+'/money/'+uid] = Number(balance - props.transaction.amount).toFixed(2);
                update['balance/'+uid+'/money/'+Firebase.uid] = Number(balanceUser + props.transaction.amount).toFixed(2);
            }
            
            let item = ref.push(
                {
                    'from': props.transaction.from, 
                    'to': props.transaction.to, 
                    'reason': props.transaction.reason,
                    'amount': props.transaction.amount,
                    'date_incured': props.transaction.date_incured,
                    'date_due': props.transaction.date_due
                }
            );

            Firebase.database.ref('/transactions/users/'+Firebase.uid+'/money/'+uid).push(item.key);
            Firebase.database.ref('/transactions/users/'+uid+'/money/'+Firebase.uid).push(item.key);

            update['confirmations/money/'+props.keyTransaction] = null;
            Firebase.database.ref().update(update);

            Firebase.database.ref('confirmations/users/'+props.transaction.from+'/money/'+props.transaction.to).orderByValue().equalTo(props.keyTransaction).once('child_added', (snapshot) => {
                snapshot.ref.remove();
            }); 

            Firebase.database.ref('confirmations/users/'+props.transaction.to+'/money/'+props.transaction.from).orderByValue().equalTo(props.keyTransaction).once('child_added', (snapshot) => {
                snapshot.ref.remove();
            }); 
        }
        else if(props.path == 'users'){
            let update = {
                ['/connections/'+Firebase.uid+'/'+props.userUid]: true,
                ['/connections/'+props.userUid+'/'+Firebase.uid]: true,
            };
            Firebase.database.ref().update(update);
        }
    }

    onDelete = props => {
        Alert.alert(
            'Alert',
            'Are you sure you want to delete: \n' + '"' + props.object + " " + props.text + " " + props.username + '"',
            [
              {text: 'NO', onPress: () => {}},
              {text: 'YES', onPress: () => {
                let update = {};

                if(props.path == 'items' || props.path == 'money'){
                    update['confirmations/'+props.path+'/'+props.keyTransaction] = null;
                    Firebase.database.ref().update(update);
    
                    let ref = Firebase.database.ref('confirmations/users/'+props.userUid+'/'+props.path+'/'+Firebase.uid);
                    ref.orderByValue().equalTo(props.keyTransaction).once('child_added', (snapshot) => {
                        snapshot.ref.remove();
                    }); 
    
                    let ref2 = Firebase.database.ref('confirmations/users/'+Firebase.uid+'/'+props.path+'/'+props.userUid);
                    ref2.orderByValue().equalTo(props.keyTransaction).once('child_added', (snapshot) => {
                        snapshot.ref.remove();
                    }); 
                }
                else if(props.path == 'items_returned'){
                    let ref = Firebase.database.ref('confirmations/users/'+props.userUid+'/items_returned/'+Firebase.uid);
                    ref.orderByChild('transactionsKey').equalTo(props.keyTransaction).once('child_added', (snapshot) => {
                        snapshot.ref.remove();
                    }); 

                    let ref2 = Firebase.database.ref('confirmations/users/'+Firebase.uid+'/items_returned/'+props.userUid);
                    ref2.orderByChild('transactionsKey').equalTo(props.keyTransaction).once('child_added', (snapshot) => {
                        snapshot.ref.remove();
                    });
                }
                else if(props.path == 'users'){
                    let update = {
                        ['/connections/'+Firebase.uid+'/'+props.userUid]: null,
                        ['/connections/'+props.userUid+'/'+Firebase.uid]: null,
                    };
                    Firebase.database.ref().update(update);
                }
              }},
            ],
            {cancelable: false},
          );
    };

    render() {
        return (
            <View style={{backgroundColor: styles.mainColorLightGrey2, margin: 5, elevation: 4}}>
                <Text style={{color: 'white', fontWeight: 'bold', backgroundColor: styles.mainColorLightGrey2, textAlign: 'center'}}>
                    {this.props.text}
                </Text>
                {this.props.object != ""
                    ?
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 1}}>
                            <Text style={{flex: 1, color: 'white', marginHorizontal: 5, textAlign: 'center'}}>
                                {this.props.object}
                            </Text>
                            <Text  style={{flex: 1, color: 'white',marginHorizontal: 5, textAlign: 'center'}}>
                                {this.props.username}
                            </Text>
                        </View>
                    :
                        <View style={{flexDirection: 'row', alignItems: 'center', padding: 1}}>
                            <Text  style={{flex: 1, color: 'white',marginHorizontal: 5, textAlign: 'center'}}>
                                {this.props.username}
                            </Text>
                        </View>
                }  
                {this.props.cancelRequest 
                    ?
                        <TouchableOpacity onPress={() => this.onDelete(this.props)} style={{flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: styles.mainColorLightBlue}}>
                            <Text style={{fontSize: 15, color: 'white'}}>Cancel request</Text>
                        </TouchableOpacity>
                    :
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => this.onDelete(this.props)} style={{flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: styles.mainColorLightBlue}}>
                                <ImageCancel height={15} width={15} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.onAccept(this.props)} style={{flex: 1, padding: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: styles.mainColorGreen, borderStyle: 'solid'}}>
                                <ImageCheck height={15} width={15} />
                            </TouchableOpacity>       
                        </View>
                }
            </View>
        )
    };
}

export default class Notifications extends React.Component {
    constructor(){
        super();
        this.state = {
            option: 'money',
            subOption: 'requests',
            moneyRequests: [],
            moneyMyRequests: [],
            itemsMyRequests: [],
            itemsRequests: [],
            usersRequests: [],
            usersMyRequests: [],
            connectionsRequests: [],
            connectionsMyRequests: [],
            connectionsDeleteRequests: [],
            connectionsDeleteMyRequests: []
        }
    }

    componentDidMount(){
        this.loadNotifications();
    }

    componentWillUnmount(){
        this.data.child('/money').off('value', this.offRefMoney);
        this.data.child('/items').off('value', this.offRefItems);
        this.data.child('/items_returned').off('value', this.offRefItemsReturned);
        this.dataUsers.off('value', this.offRefUsers);
    }

    loadNotifications = () => {
        const navigator = this.props.navigation;
        this.data = Firebase.database.ref('confirmations/users/'+Firebase.uid);

        this.offRefItems = this.data.child('/items').on('value', (snapshot) => {
            this.setState({itemsMyRequests: []});
            this.setState({itemsRequests: []});
            snapshot.forEach(async (child) => {
                let username = "";
                let userUid = child.key;
                await Firebase.database.ref('users/'+userUid).once('value').then((userSnapshot) => {username = userSnapshot.val().username});

                child.forEach((subChild) => {
                    Firebase.database.ref('confirmations/items/'+subChild.val()).once('value', (confirmation) => {
                        let object = ({
                            key: subChild.key,
                            keyTransaction: confirmation.key,
                            username: username,
                            userUid: userUid,
                            object: confirmation.val().name,
                            cancelRequest: false,
                            text: confirmation.val().from == Firebase.uid ? 'TO' : 'FROM',
                            date: new Date(confirmation.val().date_incured),
                            path: 'items',
                            transaction: confirmation.val()
                        });

                        if(confirmation.val().request == Firebase.uid){
                            object.cancelRequest = true;
                            this.setState((previousState) => ({itemsMyRequests: [...previousState.itemsMyRequests, object]}));
                        }
                        else
                            this.setState((previousState) => ({itemsRequests: [...previousState.itemsRequests, object]}));
                    })
                });
            });
        });
            
        this.offRefMoney = this.data.child('/money').on('value', (snapshot) => {
            this.setState({moneyMyRequests: []});
            this.setState({moneyRequests: []});
            snapshot.forEach(async (child) => {
                let username = "";
                let userUid = child.key;
                await Firebase.database.ref('users/'+userUid).once('value').then((userSnapshot) => {username = userSnapshot.val().username});
                child.forEach((subChild) => {
                    Firebase.database.ref('confirmations/money/'+subChild.val()).once('value', (confirmation) => {
                        let object = ({
                            key: subChild.key,
                            keyTransaction: confirmation.key,
                            username: username,
                            userUid: userUid,
                            object: confirmation.val().amount + "€",
                            cancelRequest: false,
                            text: confirmation.val().from == Firebase.uid ? 'TO' : 'FROM',
                            date: new Date(confirmation.val().date_incured),
                            path: 'money',
                            transaction: confirmation.val()
                        });

                        if(confirmation.val().request == Firebase.uid){
                            object.cancelRequest = true;
                            this.setState((previousState) => ({moneyMyRequests: [...previousState.moneyMyRequests, object]}));
                        }
                        else
                            this.setState((previousState) => ({moneyRequests: [...previousState.moneyRequests, object]}));
                    })
                });
            });
        });
    
        this.offRefItemsReturned = this.data.child('/items_returned').on('value', (snapshot) => {
            this.setState({itemsMyRequests: []});
            this.setState({itemsRequests: []});
            snapshot.forEach(async (child) => {
                let username = "";
                let userUid = child.key;
                await Firebase.database.ref('users/'+userUid).once('value').then((userSnapshot) => {username = userSnapshot.val().username});
                child.forEach((subChild) => {
                    Firebase.database.ref('transactions/items/'+subChild.val().transactionsKey).once('value', (transaction) => {
                        let object = ({
                            key: subChild.key,
                            keyTransaction: transaction.key,
                            username: username,
                            userUid: userUid,
                            object: transaction.val().name,
                            cancelRequest: false,
                            text: transaction.val().from == Firebase.uid ? 'RETURNED FROM' : 'RETURNED TO',
                            date: new Date(subChild.val().date),
                            path: 'items_returned',
                            transaction: ""
                        });

                        if(subChild.val().request == Firebase.uid){
                            object.cancelRequest = true;
                            this.setState((previousState) => ({itemsMyRequests: [...previousState.itemsMyRequests, object]}));
                        }
                        else
                            this.setState((previousState) => ({itemsRequests: [...previousState.itemsRequests, object]}));
                    })
                });
            });
        });

        this.offRefDelete = this.data.child('/delete_connections').on('value', (snapshot) =>{
            this.setState({connectionsDeleteMyRequests: []});
            this.setState({connectionsDeleteRequests: []});
            snapshot.forEach((child) => {
                Firebase.database.ref('/confirmations/delete_connections/'+child.val()).once('value', async (confirmation) => {
                    let username = "";
                    let userUid = confirmation.val().request == Firebase.uid ? confirmation.val().to : confirmation.val().request;
                    await Firebase.database.ref('users/'+userUid).once('value').then((userSnapshot) => {username = userSnapshot.val().username});
                    let object = {
                        key: child.val(),
                        userUid: userUid,
                        username: username,
                        text: "DELETING CONNECTION\nTRANSACTIONS AREN'T FINISHED!",
                        cancelRequest: false
                    };
                    if(confirmation.val().request == Firebase.uid){
                        object.cancelRequest = true;
                        this.setState((previousState) => ({connectionsDeleteMyRequests: [...previousState.connectionsDeleteMyRequests, object]}));
                    }
                    else
                        this.setState((previousState) => ({connectionsDeleteRequests: [...previousState.connectionsDeleteRequests, object]}));
                });
            });
        });

        Firebase.database.ref('/').once('value').then(
            (snapshot) => {
                if (snapshot.child('connections/' + Firebase.uid).exists())
                {
                    this.dataUsers = Firebase.database.ref('/connections/' + Firebase.uid);
                    this.offRefUsers = this.dataUsers.on('value', (snapshot) => {
                        this.setState({usersRequests: []});
                        this.setState({usersMyRequests: []});
                        this.setState({connectionsRequests: []});
                        snapshot.forEach((child) => {
                            let ref = Firebase.database.ref('/users/' + child.key).once('value').then(
                                (snapshotUser) => {
                                    let object = ({
                                        key: child.key,
                                        keyTransaction: child.key,
                                        username: snapshotUser.val().username,
                                        userUid: snapshotUser.key,
                                        object: "",
                                        cancelRequest: false,
                                        text: "NEW CONNECTION",
                                        date: new Date(),
                                        path: 'users',
                                        transaction: ""
                                    });
                                    if(child.val().toString().includes('deleted_')){
                                        let object2 = {
                                            key: child.key,
                                            userUid: child.key,
                                            username: snapshotUser.val().username,
                                            text: "DELETED CONNECTION",
                                            cancelRequest: false
                                        };
                                        this.setState((previousState) => ({connectionsRequests: [...previousState.connectionsRequests, object2]}));
                                    }
                                    else if(child.val() !== Firebase.uid && child.val() !== true){
                                        this.setState((previousState) => ({usersRequests: [...previousState.usersRequests, object]}));
                                    }
                                    else if(child.val() === Firebase.uid){
                                        object.cancelRequest = true;
                                        this.setState((previousState) => ({usersMyRequests: [...previousState.usersMyRequests, object]}));
                                    }
                                }
                            );
                        });
                    });
                }
            }
        );
    }

    render() {
      return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.modalVisibleNotifications}
        >
            <View style={{flex: 1}}>
                    <TouchableWithoutFeedback onPress={this.props.setModalVisibleNotifications}>
                        <View style={{height: 55, backgroundColor: 'transparent'}}></View>
                    </TouchableWithoutFeedback>
                    <View style={{flex: 1, backgroundColor: styles.mainColorLightGrey, borderTopColor: styles.mainColorGreen2, borderTopWidth: 10}}>
                        {/*<View style={styles.AddMoneyItem.containerButton}>
                            <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({option: 'money'}))} underlayColor="white">
                                <View style={[styles.AddMoneyItem.button, {backgroundColor: styles.mainColorOrange, opacity: this.state.option === "money" ? 1 : 0.5}]}>
                                    <View style={{position: 'absolute', right: 10, top: 10}}>
                                        <Text style={{backgroundColor: 'red', borderRadius: 6, textAlign: 'center', minWidth: 12, height: 12, color: 'white', fontSize: 9}}>
                                            {this.state.moneyRequests.length + this.state.moneyMyRequests.length}
                                        </Text>
                                    </View>
                                    <Text style={styles.AddMoneyItem.buttonText}>
                                        Money
                                    </Text>
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
                        </View>*/}
                        <View style={styles.AddMoneyItem.containerButton}>
                            <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({subOption: 'requests'}))} underlayColor="white">
                                <View style={[styles.AddMoneyItem.button, {backgroundColor: styles.mainColorGrey, opacity: this.state.subOption === "requests" ? 1 : 0.5}]}>
                                    <Text style={styles.AddMoneyItem.buttonText}>Requests</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{flex: 1}} onPress={() => (this.setState({subOption: "cancel_requests"}))} underlayColor="white">
                                <View style={[styles.AddMoneyItem.button, {backgroundColor: styles.mainColorGrey, opacity: this.state.subOption === "cancel_requests" ? 1 : 0.5}]}>
                                    <Text style={styles.AddMoneyItem.buttonText}>Cancel requests</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {(this.state.subOption == 'requests' && [].concat(this.state.connectionsRequests, this.state.connectionsDeleteRequests).length > 0) 
                        || (this.state.subOption != 'requests' && [].concat(this.state.connectionsMyRequests, this.state.connectionsDeleteMyRequests).length > 0)
                            ?
                                <FlatList 
                                    style={{backgroundColor: styles.mainColorGrey}}
                                    data={
                                            this.state.subOption == 'requests' 
                                                ? [].concat(this.state.connectionsRequests, this.state.connectionsDeleteRequests)
                                                : [].concat(this.state.connectionsMyRequests, this.state.connectionsDeleteMyRequests)
                                        }  
                                    renderItem={({item}) => (
                                        <NotificationDeletedConnection
                                            key={item.userUid}
                                            username={item.username}
                                            userUid={item.userUid}
                                            cancelRequest={item.cancelRequest}
                                            text={item.text}
                                        />
                                    )}         
                                />
                            :
                                null
                        }
                        
                        <FlatList 
                            style={{backgroundColor: styles.mainColorGrey}}
                            data={
                                    this.state.subOption == 'requests' 
                                        ? [].concat(this.state.moneyRequests, this.state.usersRequests, this.state.itemsRequests).sort((a,b) => a.date < b.date ? 1 : -1)
                                        : [].concat(this.state.moneyMyRequests, this.state.usersMyRequests, this.state.itemsMyRequests).sort((a,b) => a.date < b.date ? 1 : -1)
                                }  
                            renderItem={({item}) => (
                                <Notification
                                    key={item.key}
                                    path={item.path}
                                    keyTransaction={item.keyTransaction}
                                    cancelRequest={item.cancelRequest}
                                    username={item.username}
                                    userUid={item.userUid}
                                    object={item.object}
                                    cancelRequest={item.cancelRequest}
                                    text={item.text}
                                    date={item.date}
                                    transaction={item.transaction}
                                />
                            )}         
                        />
                    </View>
            </View>       
        </Modal>
      )
    };
}