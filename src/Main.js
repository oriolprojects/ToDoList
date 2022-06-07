import { useState, useEffect } from "react"
import './css/App.css';
import { auth, firestore } from './firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import AddItem from "./components/AddItem";
import ListItems from "./components/ListItems";
import { doc, getDoc, setDoc } from "firebase/firestore"
import "./css/main.css"

const Main = ({ emailUser }) => {
  console.log(emailUser);
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
      <button onClick={logout} className="logout-button">Logout</button>
    </div>
  );
}

export default Main;