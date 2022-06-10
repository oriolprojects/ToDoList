import { useState, useEffect } from "react"
import '../css/App.css';
import { auth, firestore } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import AddItem from "./AddItem";
import ListLists from "./ListLists";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import "../css/main.css"
import Button from "./Button";
import {AiFillEdit} from 'react-icons/ai';
import { Container, Form, Row, Col, Button as FormButton } from "react-bootstrap";
import { toast } from "react-toastify";


const Main = ({ emailUser }) => {
  const fakeData = [{id: 0, title: "New List", items: []}];
  const [arrayItems, setArrayItems] = useState(null);
  const [arrayLists, setArrayLists] = useState(null);
  const [listSelected, setListSelected] = useState({id: 0, title: "Welcome", items: []});
  const [newListToggle, setNewListToggle] = useState(false);
  const [editListToggle, setEditListToggle] = useState(false);


  async function searchDocuments(idDocuemnt) {
    // create reference to the collection
    const docuRef = doc(firestore, `users/${idDocuemnt}`);
    // get the document
    const consulta = await getDoc(docuRef);
    // if exists
    if (consulta.exists()) {
      // get the data
      const data = consulta.data();
      return data.lists;
    } else {
      // document does not exist
      await setDoc(docuRef, {lists: [...fakeData]});
      const consulta = await getDoc(docuRef);
      const data = consulta.data();
      return data.lists;
    }
  }

  useEffect(() => {
    async function fetchLists() {
      searchDocuments(emailUser).then(data => {
        setArrayLists(data);
      });
    }

    fetchLists();
  }, []);



  const logout = async () => {
    await signOut(auth)
    window.location.reload();
  }

  const onClearList = () => {
    const newArrayLists = arrayLists.map(list => {
      if (list.id === listSelected.id) {
        list.items = [];
      }
      return list;
    });

    setArrayLists(newArrayLists);
    setArrayItems([]);

    const docuRef = doc(firestore, `users/${emailUser}`);
    updateDoc(docuRef, {lists: newArrayLists});

    toast.success("List cleared", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored"
    });

  }

  const onEditTitle = (e) => {
    e.preventDefault();
    const newTitle = e.target.editListTitle.value;
    const newList = {id: listSelected.id, title: newTitle, items: [...listSelected.items]};
    const newArrayLists = [...arrayLists];
    newArrayLists.map(list => {
      if (list.id === listSelected.id) {
        list.title = newTitle;
      }
    }
    );
    // update the document on the database
    const docuRef = doc(firestore, `users/${emailUser}`);
    updateDoc(docuRef, {lists: newArrayLists});
    // update the state
    setArrayLists(newArrayLists);
    setListSelected(newList);
    setEditListToggle(false);

  }


  return (
    <div className="App">
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
                  <AiFillEdit className="icon" onClick={() => 
                    setEditListToggle(true)
                  }/>
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
            setListSelected={setListSelected} />
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
            listSelected={listSelected} 
            setListSelected={setListSelected} 
            newListToggle={newListToggle}
            setNewListToggle={setNewListToggle}
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
    </div>
  );
}

export default Main;