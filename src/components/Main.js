import { useState, useEffect } from "react"
import '../css/App.css';
import { auth, firebase, firestore } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import AddItem from "./AddItem";
import ListLists from "./ListLists";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"
import "../css/main.css"
import Button from "./Button";
import {AiFillEdit} from 'react-icons/ai';
import { Container, Form, Row, Col, Button as FormButton } from "react-bootstrap";
import { error, success } from "./Toast";
import ShareList from "./ShareList";
import LogOut from "./LogOut";
import ShareListModal from "./ShareListModal";

const Main = ({ emailUser }) => {
  const fakeData = [{id: 0, title: "New List", items: []}];
  const [arrayItems, setArrayItems] = useState(null);
  const [arrayUsers, setArrayUsers] = useState(null);
  const [username, setUsername] = useState(null);
  const [friends, setFriends] = useState([]);  
  const [friendsRequests, setFriendsRequests] = useState([]);
  const [collaboratorsRequests, setCollaboratorsRequests] = useState([]);
  const [arrayLists, setArrayLists] = useState(null);
  const [arrayCollaborateLists, setArrayCollaborateLists] = useState(null);
  const [listSelected, setListSelected] = useState({id: 0, title: "Welcome", items: []});
  const [newListToggle, setNewListToggle] = useState(false);
  const [editListToggle, setEditListToggle] = useState(false);
  const [shareListToggle, setShareListToggle] = useState(false);
  const [isCollaborative, setIsCollaborative] = useState(false);



  async function searchDocuments(idDocuemnt) {
    // create reference to the collection
    const docuRef = doc(firestore, `users/${idDocuemnt}`);
    // get the document
    const consulta = await getDoc(docuRef);
    // if exists
    if (consulta.exists()) {
      // get the data
      const data = consulta.data();
      // set the data
      setUsername(data.username);
      setFriends(data.friends);
      setFriendsRequests(data.friendsRequests);
      setCollaboratorsRequests(data.collaboratorsRequests);
      setArrayCollaborateLists(data.collaborateList);
      return data.lists;
    } else {
      // document does not exist
      await setDoc(docuRef, {lists: [...fakeData], friends: [], friendsRequests: [], collaboratorsRequests: [], collaborateList: [], username: null});
      const consulta = await getDoc(docuRef);
      const data = consulta.data();
      // set data
      setUsername(data.username);
      setFriends(data.friends);
      setFriendsRequests(data.friendsRequests);
      setCollaboratorsRequests(data.collaboratorsRequests);
      setArrayCollaborateLists(data.collaborateList);
      return data.lists;
    }
  }

  async function searchUsers() {
    // create reference to the collection
    const docuRef = await getDocs(collection(firestore, `users`));
    // get the document
    const newArrayUsers = [];
    docuRef.forEach((doc) => {
      if (doc.data().username) {
        newArrayUsers.push({username: doc.data().username, email: doc.id, friendsRequests: doc.data().friendsRequests});
      }
    });
    setArrayUsers(newArrayUsers);
  }

  useEffect(() => {
    async function fetchLists() {
      searchDocuments(emailUser).then(data => {
        setArrayLists(data);
      });
    }

    async function fetchUsers() {
      searchUsers();
    }

    fetchLists();
    fetchUsers();
  }, []);



  const logout = async () => {
    await signOut(auth)
    window.location.reload();
  }

  const onClearList = () => {
    var email = null

    const newArrayLists = arrayLists.map(list => {
      if (list.id === listSelected.id) {
        email = list.email;
        list.items = [];
      }
      return list;
    });

    var secondaryArrayLists = []
    if (email){
      secondaryArrayLists = arrayLists.map(list => {
        if (list.id === listSelected.id) {
          list.items = [];
        }
        return list;
      });
    }

    setArrayLists(newArrayLists);
    setArrayItems([]);

    const docuRef = doc(firestore, `users/${emailUser}`);
    updateDoc(docuRef, {lists: newArrayLists});

    const docuRef2 = doc(firestore, `users/${email}`);
    updateDoc(docuRef2, {lists: secondaryArrayLists});
    success("List cleared");

  }

  const onEditTitle = (e) => {
    e.preventDefault();
    const newTitle = e.target.editListTitle.value;

    if(listSelected.email){
      const newList = {id: listSelected.id, title: newTitle, email: listSelected.email, items: [...listSelected.items]};
      const secondaryList = {id: listSelected.id, title: newTitle, email: emailUser, items: [...listSelected.items]};
      const newArrayLists = [...arrayLists];
      newArrayLists.map(list => {
        if (list.id === listSelected.id) {
          list.title = newTitle;
        }
      });
      const docuRef = doc(firestore, `users/${emailUser}`);
      updateDoc(docuRef, {lists: newArrayLists});


      var secondaryArrayLists = [];
      searchDocuments(listSelected.email).then(data => {
        data.map(list => {
          if (list.id === listSelected.id) {
            secondaryArrayLists.push(secondaryList);
          } else {
            secondaryArrayLists.push(list);
          }
        })
        const docuRef = doc(firestore, `users/${listSelected.email}`);
        updateDoc(docuRef, {lists: secondaryArrayLists});
      });

      
      success("List edited");

      setArrayLists(newArrayLists);
      setListSelected(newList);
    }
    else{
      const newList = {id: listSelected.id, title: newTitle, items: [...listSelected.items]};
      const newArrayLists = [...arrayLists];
      newArrayLists.map(list => {
        if (list.id === listSelected.id) {
          list.title = newTitle;
        }
      });
      const docuRef = doc(firestore, `users/${listSelected.email}`);
      updateDoc(docuRef, {lists: newArrayLists});
      setArrayLists(newArrayLists);
      setListSelected(newList);
    }
    setEditListToggle(false);
  }


  return (
    <div className="App">
      <LogOut logout={logout} />
      <h1>{
        listSelected && listSelected !== 0 ? 
          editListToggle ?
            <Container className="edit-title">
              <Form onSubmit={onEditTitle}>
                  <Row>
                      <Col className="add-list-container">
                          <Form.Control className="add-input" type="text" id="editListTitle" defaultValue={listSelected.title} placeholder="Add item..." />
                          <FormButton type="submit" className="myButton">Save</FormButton>
                      </Col>
                  </Row>
              </Form>              
            </Container>
          :
          <div>
            <div className="title">
              <h1>{listSelected.title}</h1>
              {
                listSelected.id !== 0 ?
                  <div className="edit-list">
                    <AiFillEdit className="icon" onClick={() => 
                      setEditListToggle(true)
                    }/>
                    <ShareList setShareListToggle={setShareListToggle}  />
                  </div>
                :
                  null
              }
            </div>
          </div>
            
        :
          "No List Selected"
      }</h1>

      {
        arrayItems && !newListToggle ? 
          <AddItem 
            arrayItems={arrayItems} 
            arrayLists={arrayLists} 
            emailUser={emailUser} 
            setArrayItems={setArrayItems} 
            setArrayLists={setArrayLists} 
            listSelected={listSelected} 
            setListSelected={setListSelected}
            searchDocuments={searchDocuments}
             />
        :
          null
      } 
      {
        arrayLists ?
          <ListLists 
            arrayLists={arrayLists} 
            arrayItems={arrayItems} 
            emailUser={emailUser} 
            setArrayItems={setArrayItems} 
            setArrayLists={setArrayLists}
            arrayCollaborateLists={arrayCollaborateLists}
            setArrayCollaborateLists={setArrayCollaborateLists}
            listSelected={listSelected} 
            setListSelected={setListSelected} 
            newListToggle={newListToggle}
            setNewListToggle={setNewListToggle}
            searchDocuments={searchDocuments}
            isCollaborative={isCollaborative}
            setIsCollaborative={setIsCollaborative}
            />
        :
          null
      }
      {
        listSelected.id !== 0 ?
          <Button type="primary" style="button-clear-list" onPress={onClearList} textButton="Clear List"/>
        :
          null
      }
      {
        shareListToggle ?
          <ShareListModal
            emailUser={emailUser}
            username={username}
            setUsername={setUsername} 
            arrayUsers={arrayUsers}
            arrayLists={arrayLists}
            listSelected={listSelected}
            friends={friends}
            searchDocuments={searchDocuments}
            friendsRequests={friendsRequests}
            collaboratorsRequests={collaboratorsRequests}
            setFriends={setFriends}
            setFriendsRequests={setFriendsRequests}
            setCollaboratorsRequests={setCollaboratorsRequests}
            setArrayLists={setArrayLists}
            setShareListToggle={setShareListToggle}/>
        :
          null
      }
      
    </div>
  );
}

export default Main;