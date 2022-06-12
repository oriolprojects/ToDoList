import React, { useState } from "react";
import { Container, Stack, Row, Col, Button, Form } from "react-bootstrap";
import '../css/ListItems.css';
import Item from "./Item";
import { updateDoc, doc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import Select from 'react-select'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { error, success } from "./Toast";



const ListLists = ({ arrayLists, arrayItems, emailUser, setArrayItems, setArrayLists, listSelected, setListSelected, newListToggle, setNewListToggle, isCollaborative, setIsCollaborative, searchDocuments }) => {

    var options = arrayLists.map(list => {
        return {
            value: list.id,
            label: list.title,
            isCollaborative: list.email? true : false
        }}
    );

    const onDeleteItem = (id) => {
        // crete new array of items without the one to delete
        const newList = [];
        const secondaryList = [];
        var email = null

        arrayLists.map(list => {
            if (list.id === listSelected.id) {
                if (isCollaborative){
                    email = list.email
                    const currentList = {id: list.id, title: list.title, email: list.email, items: list.items.filter(item => item.id !== id)};
                    newList.push(currentList); 
                } else{
                    const currentList = {id: list.id, title: list.title, items: list.items.filter(item => item.id !== id)};
                    newList.push(currentList);
                }
            } else{
                newList.push(list);
            }
        });

        // update the document on the database
        const docuRef = doc(firestore, `users/${emailUser}`);
        updateDoc(docuRef, {lists: newList});

        if(isCollaborative) {
            searchDocuments(email).then(data => {
                data.map(list => {
                    if (list.id === listSelected.id) {
                        const currentList = {id: list.id, title: list.title, email: list.email, items: list.items.filter(item => item.id !== id)}
                        secondaryList.push(currentList);
                    } else{
                        secondaryList.push(list);
                    }
                });

                const docuRef = doc(firestore, `users/${email}`);
                updateDoc(docuRef, {lists: secondaryList});
            })
        }


        // update the state
        setArrayItems(arrayItems => arrayItems.filter(item => item.id !== id));
        setArrayLists(newList);
    }

    const onToggle = (id) => {
        const newList = [];
        const secondaryList = [];

        var email = null
        arrayLists.map(list => {
            if (list.id === listSelected.id) {
                if (isCollaborative) {
                    const currentList = {id: list.id, title: list.title, email: list.email, items: list.items.map(item => {
                        email = list.email
                        if (item.id === id) {
                            return {id: item.id, text: item.text, done: item.done ? false : true}
                        } else {
                            return item
                        }
                    }
                    )};
                    
                    setArrayItems(currentList.items);
                    newList.push(currentList);
                } else{
                    const currentList = {id: list.id, title: list.title, items: list.items.map(item => {
                        if (item.id === id) {
                            return {id: item.id, text: item.text, done: item.done ? false : true}
                        } else {
                            return item
                        }
                    }
                    )};
                    
                    setArrayItems(currentList.items);
                    newList.push(currentList);
                }
                
            } else{
                newList.push(list);
            }
        });
        
        const docuRef = doc(firestore, `users/${emailUser}`);
        updateDoc(docuRef, {lists: newList});

        if(isCollaborative) {

            searchDocuments(email).then(data => {
                data.map(list => {
                    if (list.id === listSelected.id) {
                        const currentList = {id: list.id, title: list.title, email: list.email, items: list.items.map(item => {
                            if (item.id === id) {
                                return {id: item.id, text: item.text, done: item.done ? false : true}
                            } else {
                                return item
                            }
                        }
                        )};
                        secondaryList.push(currentList);
                    } else{
                        secondaryList.push(list);
                    }
                });

                const docuRef = doc(firestore, `users/${email}`);
                updateDoc(docuRef, {lists: secondaryList});
            })
        }

        // update the state
        setArrayLists(newList);
    }


    const onToggleList = (id) => {
        arrayLists.map(list => {
            if (list.id === id) {
                setListSelected(list)
                setArrayItems(list.items);
            }
        });
        

        if (id === 0) {
            setNewListToggle(true);
        } else {
            setNewListToggle(false);
        }
    }

    const handleSelectChange = (e) => {
        onToggleList(e.value);
        setIsCollaborative(e.isCollaborative);
    }

    var defaultValue = {
        value: 0,
        label: "Select a list...",
        isCollaborative: false
    }

    return (
        <Container className="container-listitems">
            <Stack>
                <Select className="select-list-input" options={options} onChange={handleSelectChange} placeholder="Select a list..."  defaultValue={defaultValue}/>
                {
                    newListToggle ?
                        <div className="add-list-form">
                            <Container className="add-list-form">
                                <Form onSubmit={(e) => {
                                            e.preventDefault();
                                            const newList = {
                                                id: + new Date(),
                                                title: document.querySelector(".input-addlist").value,
                                                items: []
                                            }
                                            const docuRef = doc(firestore, `users/${emailUser}`);
                                            updateDoc(docuRef, {lists: [...arrayLists, newList]});
                                            setArrayLists([...arrayLists, newList]);
                                            success("List added successfully");
                                        }}>
                                    <Row>
                                        <Col className="add-list-container">
                                            <Form.Control className="input-addlist add-input" type="text" id="addItem" placeholder="Add list..." />
                                            <Button type="submit" className="myButton">Add list</Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Container>
                            <Container className="list-lists" >
                                <h2>Lists</h2>
                                <ul>
                                    {
                                        arrayLists.map(list => {
                                            if ((list.id !== 0) && (!list.email)) {
                                                return (
                                                    <div className="every-list" key={list.id} onClick={() => onToggleList(list.id)}>{list.title}</div>
                                                )
                                            }
                                        })
                                    }
                                </ul>
                                <h2>Collaborative Lists</h2>
                                <ul>
                                    {
                                        arrayLists.map(list => {
                                            if ((list.id !== 0) && (list.email)) {
                                                return (
                                                    <div className="every-list" key={list.id} onClick={() => onToggleList(list.id)}>{list.title}</div>
                                                )
                                            }
                                        })
                                    }
                                </ul>
                            </Container>
                            <ToastContainer />
                        </div>
                    :
                        null
                }
                {
                    arrayItems ?
                        arrayItems.map(item => {
                            return (
                                <Item key={item.id} item={item} onDelete={onDeleteItem} onToggle={onToggle} />
                            )
                        })
                    :
                        null
                }
            </Stack>
        </Container>
    )
}

export default ListLists;