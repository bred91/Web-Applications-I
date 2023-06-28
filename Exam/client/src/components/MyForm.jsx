import React, { useEffect, useState } from 'react';
import '../MyCSS.css';
import { Carousel, Button, Container, Row, Col, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import API from '../API';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MyBlocksTable } from './MyTable';

function MyForm(props) {
    const navigate = useNavigate();
    const { pageId } = useParams();

    const objToEdit = pageId && props.pages && props.pages.find((p) => p.id === parseInt(pageId));
    const isAdmin = props.user && props.user.isAdmin;

    const [author, setAuthor] = useState(isAdmin ?
        objToEdit ? objToEdit.authorId : props.user.id : props.user.name + ' ' + props.user.surname);   // author                                      // author
    const [creationDate, setCreationDate] = useState(objToEdit ?
        objToEdit.creationDate.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'));                    // creation date
    const [title, setTitle] = useState(objToEdit ? objToEdit.title : '');                               // title
    const [publicationDate, setpublicationDate] = useState(objToEdit && objToEdit.publicationDate ?
        objToEdit.publicationDate.format('YYYY-MM-DD') : '');                                           // publication date
    const [contentType, setContentType] = useState('0');                                                // content type dropdown
    const [header, setHeader] = useState('');                                                           // header
    const [paragraph, setParagraph] = useState('');                                                     // paragraph
    const [index, setIndex] = useState(0);                                                              // carousel index (images)
    const [blocks, setBlocks] = useState(objToEdit ? objToEdit.blocks : []);                            // blocks array
    const [userList, setUserList] = useState([]);                                                       // user list
    const [editBlock, setEditBlock] = useState(null);

    const imageList = props.imagesList;

    // useEffect to retrieve the user list (if the user logged is an Admin)
    useEffect(() => {
        if (isAdmin) {
            API.getUsers()
                .then((users) => {
                    setUserList(users);
                })
                .catch((err) => {
                    toast.error(err.errorObj ? err.errorObj.message : err.message);
                });
        }
    }, []);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const handleAuthor = (event) => {
        setAuthor(event.target.value);
    }

    const handleTitle = (event) => {
        setTitle(event.target.value);
    }

    const handleDate = (event) => {
        setpublicationDate(event.target.value);
    }

    const handleSelectType = (event) => {
        setContentType(event.target.value);
    }

    const handleHeader = (event) => {
        setHeader(event.target.value);
    }

    const handleParagraph = (event) => {
        setParagraph(event.target.value);
    }

    const handleDropdownAuthor = (event) => {
        setAuthor(event.target.value);
    }

    // handler to reset the content type form
    const handleResetContentType = () => {
        setEditBlock(null);
        setContentType('0');
        setHeader('');
        setParagraph('');
    }

    // hanfler to add a block
    const handleAddBlock = () => {
        let errors = validationBlock();

        if (errors !== "") {
            toast.error(errors);
            return;
        }

        setBlocks([...blocks, {
            id: Math.max(...blocks.map((f) => f.id)) + 1,
            saved: 0,
            order: blocks.length == 0 ? 0 : Math.max(...blocks.map((f) => f.order)) + 1,
            type: parseInt(contentType),
            content: contentType === '1' ? header : contentType === '2' ? paragraph : imageList[index].id
        }]);

        setContentType('0');
        setHeader('');
        setParagraph('');
    }

    // handler to edit a block
    const handleSaveEditBlock = () => {
        let errors = validationBlock();

        if (errors !== "") {
            toast.error(errors);
            return;
        }

        let newBlocks = blocks.map((b) => {
            if (b.order === editBlock.order) {
                return {
                    ...b,
                    blockStatus: b.saved === 1 ? 'edited' : null,
                    type: parseInt(contentType),
                    content: contentType === '1' ? header : contentType === '2' ? paragraph : imageList[index].id
                };
            }
            else {
                return b;
            }
        });
        setBlocks(newBlocks);
        setEditBlock(null);
        setContentType('0');
        setHeader('');
        setParagraph('');
    }

    // block validation function
    function validationBlock() {
        let error = "";

        switch (contentType) {
            case '1':
                if (header === '')
                    error += "Header cannot be empty\n";
                break;
            case '2':
                if (paragraph === '')
                    error += "Paragraph cannot be empty\n";
                break;
            case '3':
                if (index < 0 || index > 3)
                    error += "Image cannot be empty\n";
                break;
            default:
                error += "You need to select a content type\n";
                break;
        }

        return error;
    }

    // page validation function
    function validationPage() {
        let errors = "";
        if (title === '')
            errors += "Title cannot be empty\n";
        // if(publicationDate === '')
        //     errors += "publication Date cannot be empty\n";

        const actualBlocks = blocks.filter((block) => block.blockStatus !== 'deleted');

        if (actualBlocks.length < 2 ||
            !(actualBlocks.map((block) => block.type).includes(1) &&
                (actualBlocks.map((block) => block.type).includes(2)
                    || actualBlocks.map((block) => block.type).includes(3))))
            errors += "You need to add at least one header and one paragraph or image\n";

        return errors;
    }

    // handler to create/save a page
    const handleSubmit = (event) => {
        event.preventDefault();

        let errors = validationPage();
        if (errors !== "") {
            toast.error(
                <div><ul>{errors.split("\n")
                    .filter((x) => x !== "")
                    .map((x, index) => { return (<li key={index}>{x}</li>) })}</ul></div>
                , {
                    position: "bottom-center",
                    autoClose: false,
                    allowHtml: true
                });
            return;
        }

        if (objToEdit) {      // update a Page
            const pageToEdit = {
                id: objToEdit.id,
                title: title,
                authorId: props.user.isAdmin ? author : props.user.id,
                creationDate: dayjs(creationDate),
                publicationDate: publicationDate ? dayjs(publicationDate) : null,
                blocks: blocks.map((block) => {
                    return {
                        id: block.id,
                        type: parseInt(block.type),
                        order: block.order,
                        content: String(block.content),
                        operation: block.saved ? // if it's saved, it's an update or a delete
                            block.blockStatus && block.blockStatus === 'edited' ? 'update'
                                : block.blockStatus && block.blockStatus === 'deleted' ? 'delete'
                                    : 'nothing'
                            : 'insert'                          // if it's not saved, it's a new block
                    }
                })
            }

            const pageToEdit_temp = Object.assign({}, pageToEdit, { pageStatus: 'updated' })
            props.setPages(props.pages.map((page) => page.id === pageToEdit.id ? pageToEdit_temp : page));

            API.updatePage(pageToEdit)
                .then(() => {
                    props.setDirty(true);
                    toast.success("Page updated successfully");
                    navigate('/backoffice');
                }
                )
                .catch(() => {
                    toast.error("Error updating page");
                });
        }
        else {           // create a Pafe
            const newPage = {
                title: title,
                authorId: props.user.isAdmin ? author : props.user.id,
                creationDate: dayjs(creationDate),
                publicationDate: publicationDate ? dayjs(publicationDate) : null,
                blocks: blocks.map((block) => {
                    return {
                        type: parseInt(block.type),
                        order: block.order,
                        content: String(block.content)
                    }
                })
            }

            const newPage_temp = Object.assign({}, newPage,
                {
                    id: Math.max(...props.pages.map((f) => f.id)) + 1,
                    pageStatus: 'added'
                })
            props.setPages([...props.pages, newPage_temp]);

            API.createPage(newPage)
                .then(() => {
                    props.setDirty(true);
                    toast.success("Page created successfully");
                    navigate('/backoffice');
                })
                .catch(() => toast.error('Error creating page', { autoClose: 2000 })
                );
        }
    }

    // jandler to delete a Page
    const deletePageHandler = () => {
        props.deletePage(objToEdit.id);
        navigate('/backoffice');
    }

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col xs={5} className="left">
                        <Row className="mb-3">
                            <Form.Group as={Col}>
                                <Form.Label>Author</Form.Label>
                                {isAdmin ?
                                    <select className="form-select" onChange={handleDropdownAuthor} value={author}>
                                        {userList.map((u) => {
                                            return <option key={u.id} value={u.id}>{u.name}</option>
                                        })
                                        }
                                    </select>
                                    : <Form.Control type="text" disabled value={author} onChange={handleAuthor} />}
                            </Form.Group>
                            <Form.Group as={Col} controlId="creationDate">
                                <Form.Label>Creation Date</Form.Label>
                                <Form.Control type="date" disabled value={creationDate} />
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="title">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" placeholder='Title' value={title} onChange={handleTitle} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="publicationDate">
                                <Form.Label>Publication Date</Form.Label>
                                <Form.Control type="date" value={publicationDate} onChange={handleDate} />
                            </Form.Group>
                        </Row>
                        <hr />
                        <Row>
                            <Form.Label column lg={6}>
                                Please, select a Content Type
                            </Form.Label>
                            <Col>
                                <select className="form-select mb-4" onChange={handleSelectType} value={contentType}>
                                    {props.contentTypesList.map((type) => {
                                        return (
                                            <option key={type.id} value={type.id}>{type.name}</option>
                                        )
                                    }
                                    )}
                                </select>
                            </Col>
                        </Row>
                        <Row>
                            {contentType === "1" ?
                                <Form.Group className="mb-3" controlId="header">
                                    <Form.Control as="textarea" name="header" rows={1} placeholder='Please, write an header' value={header} onChange={handleHeader} />
                                </Form.Group>
                                : contentType === "2" ?
                                    <Form.Group className="mb-3" controlId="paragraph">
                                        <Form.Control as="textarea" name="paragraph" rows={3} placeholder='Please, write a paragraph' value={paragraph} onChange={handleParagraph} />
                                    </Form.Group>
                                    : contentType === "3" ?
                                        <Form.Group className="mb-3" as={Col} controlId="image">
                                            <Carousel interval={null} activeIndex={index} onSelect={handleSelect}>
                                                {
                                                    imageList.map((image) => {
                                                        return (
                                                            <Carousel.Item key={image.id}>
                                                                <img
                                                                    className="d-block w-100 v-60"
                                                                    src={image.path}
                                                                    alt={image.name}
                                                                />
                                                                <Carousel.Caption>
                                                                    <h3 className='bg-dark bg-opacity-10'>{image.name}</h3>
                                                                </Carousel.Caption>
                                                            </Carousel.Item>
                                                        )
                                                    })
                                                }
                                            </Carousel>
                                        </Form.Group>
                                        : null}
                        </Row>
                        {contentType !== '0' ?
                            <Row className="container">
                                <Col className="d-flex justify-content-center">
                                    <div>
                                        {editBlock ? <>
                                            <Button variant="primary" className="mx-2 btn-sm" onClick={handleSaveEditBlock}>
                                                Edit
                                            </Button>
                                            <Button variant="warning" className="mx-2 btn-sm" onClick={handleResetContentType}>
                                                Cancel
                                            </Button></>
                                            : <>
                                                <Button variant="primary" className="mx-2 btn-sm" onClick={handleAddBlock}>
                                                    Add
                                                </Button>
                                                <Button variant="warning" className="mx-2 btn-sm" onClick={handleResetContentType}>
                                                    Reset
                                                </Button>
                                            </>
                                        }
                                    </div>
                                </Col>
                            </Row>
                            : null}
                    </Col>
                    <Col xs={7} className="right">
                        <Row>
                            <Col className="d-flex justify-content-center mb-1 mt-3 ">
                                {
                                    objToEdit ? <>
                                        <Button variant="success" className="mx-2" type='submit' >
                                            Save
                                        </Button>
                                        <Button variant="danger" className="mx-2" onClick={deletePageHandler}>
                                            Delete
                                        </Button></>
                                        : <>
                                            <Button variant="success" className="mx-2" type='submit' >
                                                Create
                                            </Button>
                                            <Link to="/backoffice"><Button variant="warning" className="mx-2">
                                                Cancel
                                            </Button></Link></>
                                }
                            </Col>
                        </Row>
                        <hr />
                        <MyBlocksTable blocks={blocks} imagesList={imageList} setBlocks={setBlocks} setHeader={setHeader}
                            setParagraph={setParagraph} setEditBlock={setEditBlock} setContentType={setContentType}></MyBlocksTable>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}


export default MyForm;