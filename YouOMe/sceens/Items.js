import React from 'react';
import {Text, View, TouchableOpacity, Alert} from 'react-native';
import Firebase from "../components/Firebase";
import * as styles from "../components/Styles";
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import ImageCheck from '../images/checked_2.svg';
import ImageCancel from '../images/cancel.svg';
import ImageBin from '../images/rubbish-bin.svg';
import { snapshotToArray } from '../components/Functions';

class TransactionUser extends React.Component {
    render() {
        return (
            <TouchableOpacity style={styles.Money.button} onPress={() => this.props.navigator.navigate('HistoryItems', {username: this.props.username, uid: this.props.uid})}>
                <View style={styles.Money.container}>
                    <Text style={styles.Money.textUser}>{this.props.username}</Text>
                    <View style={styles.Items.containerBalance}>
                        <View >
                            <Text style={styles.Money.balanceText}>I Owe</Text>
                            <Text style={styles.Money.balanceText}>Owes</Text>
                        </View>
                        <View>
                            <Text style={styles.Money.balance}>{this.props.balanceIOwe}</Text>
                            <Text style={styles.Money.balance}>{this.props.balanceOwes}</Text>
                        </View>
                    </View>     
                </View>
            </TouchableOpacity>
        );
    }
}

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

export default class Items extends React.Component {
    constructor(){
        super();
        this.state = {
            array: [],
            confirmation: [],
            confirmationReturned: [],
            confirmationVisible: false,
            confirmationReturnedVisible: false,
        }
    }

    componentDidMount(){
        this.loadTransactions();
        this.loadConfirmations();
    }

    componentWillUnmount(){
        this.data.off('value', this.offRef);
        this.data2.child('/items').off('value',this.offRefChild);
        this.data2.child('items_returned').off('value', this.offRefChild2);
    }

    loadConfirmations = () => {
        const navigator = this.props.navigation;
        this.data2 = Firebase.database.ref('confirmations/users/' + Firebase.uid);
        this.offRefChild = this.data2.child('/items').on('value', (snapshot) => {
            if(snapshot.exists()){
                this.setState({confirmation: []});
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
                            this.setState((previousState) => ({confirmation: [...previousState.confirmation, object]}));
                        })
                    });
                    
                });
            }
            else{
                this.setState({confirmation: []});
            }
        });

        this.offRefChild2 = this.data2.child('/items_returned').on('value', (snapshot) => {
            if(snapshot.exists()){
                this.setState({confirmationReturned: []});
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
                            this.setState((previousState) => ({confirmationReturned: [...previousState.confirmationReturned, object]}));
                        });
                    });
                    
                });
            }
            else{
                this.setState({confirmationReturned: []});
            }
        });
    };

    loadTransactions = () => {
        const navigator = this.props.navigation;
        this.data = Firebase.database.ref('balance/'+Firebase.uid+'/items');
        this.offRef = this.data.on('value', (snapshot) => {
            if(snapshot.exists()){
                this.setState({'array': []});
                snapshot.forEach(async (childSnapshot) => {
                    let username = "";
                    let userUid = childSnapshot.key;
                    await Firebase.database.ref('users/'+userUid).once('value').then((userSnapshot) => {username = userSnapshot.val().username});
                    
                    let owed_by_me = 0;
                    let owed_to_me = 0;
                    if(childSnapshot.child('owed_by_me').exists())
                        owed_by_me = childSnapshot.val().owed_by_me;
                    if(childSnapshot.child('owed_to_me').exists())
                        owed_to_me = childSnapshot.val().owed_to_me;

                    let code = (
                        <TransactionUser key={userUid} uid={userUid} username={username} balanceIOwe={owed_by_me} balanceOwes={owed_to_me} navigator={navigator}/>
                    );
    
                    this.setState((previousState) => ({'array': [...previousState.array, code]}));
                });
            }
        });
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <ScrollView style={{backgroundColor: "#E5E5E5"}}>
                    {this.state.array}
                </ScrollView>
                {this.state.confirmation.length > 0 || this.state.confirmationReturned.length > 0
                ?
                    <View style={{backgroundColor: styles.mainColorOrange, maxHeight: '50%'}}>
                        <TouchableOpacity onPress={() => this.setState({confirmationVisible: !this.state.confirmationVisible})}>
                            <Text style={{color: 'white', fontSize: 20, paddingHorizontal: 20, paddingVertical: 5, fontWeight: 'bold'}}>Need confirmation</Text>
                        </TouchableOpacity>
                        {this.state.confirmation.length > 0 && this.state.confirmationVisible ? <Text style={{paddingHorizontal: 20, color: 'white'}}>Add Items</Text> : null}
                        {this.state.confirmationVisible 
                        ?
                            <FlatList 
                                style={{backgroundColor: styles.mainColorOrange, maxHeight: '50%'}}
                                data={this.state.confirmation}  
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
                        {this.state.confirmationReturned.length > 0 && this.state.confirmationVisible ? <Text style={{paddingHorizontal: 20, color: 'white'}}>Return Items</Text> : null}
                        {this.state.confirmationVisible 
                        ?
                            <FlatList 
                                style={{backgroundColor: styles.mainColorOrange, maxHeight: '50%'}}
                                data={this.state.confirmationReturned}  
                                renderItem={({item}) => (
                                    <ConfirmationReturn
                                        key={item.key}
                                        keyTransaction={item.keyTransaction}
                                        user={item.username}
                                        userUid={item.userUid}
                                        name={item.name}
                                        request={item.request}
                                        from={item.from}
                                        to={item.to}
                                    />
                                )}         
                            />
                        : 
                            null
                        }
                    </View>
                :
                    null
                }               
            </View>
        );
    }
}