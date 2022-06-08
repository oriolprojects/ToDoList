import React, { useState } from "react";
import { Container, Stack } from "react-bootstrap";
import '../css/ListItems.css';
import Item from "./Item";
import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";

const ListItems = ({ arrayItems, emailUser, setArrayItems }) => {

    const onDelete = (id) => {
        // crete new array of items without the one to delete
        const newArrayItems = arrayItems.filter(item => item.id !== id);
        // update the document on the database
        const docuRef = doc(firestore, `users/${emailUser}`);
        updateDoc(docuRef, {items: newArrayItems});
        // update the state        
        setArrayItems(newArrayItems);
    }

    const onToggle = (id) => {
        const newArrayItems = arrayItems.map(item => {
            if (item.id === id) {
                item.done = !item.done;
            }
            return item;
        }
        );
        const docuRef = doc(firestore, `users/${emailUser}`);
        updateDoc(docuRef, {items: newArrayItems});
        // update the state        
        setArrayItems(newArrayItems);
    }

    const onEdit = (id, text) => {
        const newArrayItems = arrayItems.map(item => {
            if (item.id === id) {
                item.text = text;
            }
            return item;
        }
        );
        const docuRef = doc(firestore, `users/${emailUser}`);
        updateDoc(docuRef, {items: newArrayItems});
        // update the state        
        setArrayItems(newArrayItems);
    }



    return (
        <Container className="container-listItems">
            <Stack>
                {
                    arrayItems.length === 0 ?
                        <p className="no-items">No items yet...</p>
                    :
                        arrayItems.map((item, index) => {
                            return (
                                <div key={index}>
                                    <Item item={item} onDelete={onDelete} onEdit={onEdit} onToggle={onToggle}/>
                                </div>
                            )
                        })
                }
            </Stack>


        </Container>
    )
}

export default ListItems;