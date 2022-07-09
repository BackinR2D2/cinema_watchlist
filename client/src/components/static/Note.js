import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import {useRef, useState} from 'react';
import url from '../../helpers/url';

import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Note ({mediaTitle, mediaId}) {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [noteBody, setNoteBody] = useState('');

    const currentNoteBody = useRef(null);
    const navigate = useNavigate();
    const toast = useToast();

    const handleOnClose = async () => {
        try {
            if(noteBody !== '' && noteBody !== currentNoteBody.current) {
                const response = await axios.post(`${url}/user/watchlist`, {
                    noteBody: noteBody,
                    mediaId
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('auth')
                    }
                });
                if(response.status === 201) {
                    toast({
                        title: 'Note saved',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                        position: 'top-right',
                    });
                }
            }
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to update the note',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
                localStorage.removeItem('auth');
                navigate('/login');
            } else {
                toast({
                    title: 'Error',
                    description: 'Some error occured, try again later.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        }
        onClose();
    }

    const getNoteBody = async () => {
        try {
            const response = await axios.post(`${url}/user/notebody`, {
                mediaId   
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('auth')
                }
            });
            return response.data.noteBody[0].notebody;
        } catch (error) {
            if(error.response.status === 403) {
                toast({
                    title: 'Please login to get the note',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
                localStorage.removeItem('auth');
                navigate('/login');
            } else {
                toast({
                    title: 'Error',
                    description: 'Some error occured, try again later.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        }
    }


    const handleOnOpen = async () => {
        currentNoteBody.current = await getNoteBody();
        onOpen();
    }

    return (
        <>
        <Button onClick={handleOnOpen}>Notes</Button>

        <Modal isOpen={isOpen} onClose={handleOnClose} size={'xl'}>
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Notes - {mediaTitle}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <div className="editor">
                    <CKEditor
                        editor={ ClassicEditor }
                        config={{
                            toolbar: {
                                items: [
                                  'bold',
                                  'italic',
                                  '|',
                                  'numberedList',
                                  'bulletedList',
                                  '|',
                                  'blockQuote',
                                  'mediaEmbed',
                                  'insertTable',
                                  '|',
                                  'undo',
                                  'redo'
                                ]
                              },
                              language: 'en',
                              table: {
                                contentToolbar: [
                                  'tableColumn',
                                  'tableRow',
                                  'mergeTableCells'
                                ]
                              },
                        }}
                        data={currentNoteBody.current}
                        onChange={ ( _, editor ) => {
                            const data = editor.getData();
                            setNoteBody(data);
                        } }
                    />
                </div>
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='green' mr={3} onClick={handleOnClose}>
                        Save
                </Button>
            </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}

export default Note;