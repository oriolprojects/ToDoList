import { useState, useEffect } from "react"
import './css/App.css';
import { auth, firestore } from './firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import AddItem from "./components/AddItem";
import ListItems from "./components/ListItems";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import "./css/main.css"
import Button from "./components/Button";

const Main = ({ emailUser }) => {
  const fakeData = [];
  const [arrayItems, setArrayItems] = useState(null);

  async function searchDocuments(idDocuemnt) {
    // create reference to the collection
    const docuRef = doc(firestore, `users/${idDocuemnt}`);
    // get the document
    const consulta = await getDoc(docuRef);
    // if exists
    if (consulta.exists()) {
      // get the data
      const data = consulta.data();
      return data.items;
    } else {
      // document does not exist
      await setDoc(docuRef, {items: [...fakeData]});
      const consulta = await getDoc(docuRef);
      const data = consulta.data();
      return data.items;
    }
  }

  useEffect(() => {
    async function fetchItems() {
      searchDocuments(emailUser).then(data => {
        setArrayItems(data);
      });
    }

    fetchItems();
  }, []);



  const logout = async () => {
    await signOut(auth)
    window.location.reload();
  }

  const onClearList = () => {
    // update the document on the database
    const docuRef = doc(firestore, `users/${emailUser}`);
    updateDoc(docuRef, {items: [...fakeData]});
    // update the state        
    setArrayItems(fakeData);
}


  return (
    <div className="App">
      <h1>Welcome</h1>
      <AddItem arrayItems={arrayItems} emailUser={emailUser} setArrayItems={setArrayItems}/>
      {
        arrayItems ?
          <ListItems arrayItems={arrayItems} emailUser={emailUser} setArrayItems={setArrayItems} />
        :
          null
      }
      <Button type="primary" onPress={onClearList} textButton="Clear List"/>
    </div>
  );
}

export default Main;