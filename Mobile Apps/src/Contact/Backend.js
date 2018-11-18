import firebase from 'firebase';

class Backend {
  uid = '';
  messagesRef = null;
  // initialize Firebase Backend
  constructor() {
  }

  // retrieve the messages from the Backend
  loadMessages(callback, roomid) {
    this.messagesRef = firebase.database().ref('Chats/'+ roomid);
    this.roomid = roomid
    var id = []

    while (roomid){
      if (roomid.length<28){
        id.push(roomid)
        break;
      }else{
        id.push(roomid.substr(0,28))
        roomid = roomid.substr(28)
      }
    }
    console.log("userid:"+id[0])
    console.log("authid:"+id[1])

    this.userid = id[0]
    this.authid = id[1]

    this.userChatRef = firebase.database().ref('users/'+ id[0] +'/Chat');
    this.authorityChatRef  = firebase.database().ref('users/'+ id[1] +'/Chat');

    this.messagesRef.off();
    const onReceive = (data) => {
      const message = data.val();
      callback({
        _id: data.key,
        text: message.text,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.user._id,
          name: message.user.name,
        },
      });
    };
    this.messagesRef.limitToLast(20).on('child_added', onReceive);
  }
  // send the message to the Backend

  sendMessage(message) {

    for (let i = 0; i < message.length; i++) {
      this.messagesRef.push({
        text: message[i].text,
        user: message[i].user,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      });
    }

    var time = new Date().getTime()

    this.userChatRef.update({
      [this.roomid] : time
    })
    this.authorityChatRef.update({
      [this.roomid] : time
    })
  }

  // close the connection to the Backend
  closeChat() {
    if (this.messagesRef) {
      this.messagesRef.off();
    }
  }
}

export default new Backend();
