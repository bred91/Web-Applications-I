import React from 'react';
import { Table, Image, Button } from 'react-bootstrap';
import MyRow from './MyRow';

function MyPagesTable(props) {
    return (
        <Table>
            <thead>
                <tr className='text-center'>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Creation Date</th>
                    <th>Publication Date</th>
                    <th>State</th>
                    {props.backoffice ?
                        <>
                            <th>View</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </>
                        : <th>View</th>}
                </tr>
            </thead>
            <tbody>
                {props.backoffice ?
                    props.pages.map((e) =>
                        <MyRow user={props.user} e={e} key={e.id} deletePage={props.deletePage} editPage={props.editPage} backoffice={props.backoffice} imagesList={props.imagesList} />)
                    :
                    props.pages.filter((e) => e.status === 'PUBLISHED').
                        map((e) =>
                            <MyRow e={e} key={e.id} imagesList={props.imagesList} />)
                }
            </tbody>
        </Table>
    );
}

function MyBlocksTable(props) {

    //const blocks = props.blocks;

    // handler for deleting a block (click on the recycle bin)
    const handleDeleteBlock = (block) => {
        if (block.saved === 1) {  // if block is saved, mark it as deleted
            let newBlocks = props.blocks.map((b) => {
                if (b === block) {
                    return { ...b, blockStatus: 'deleted', order: -1 };
                }

                if (b.order > block.order) {
                    return { ...b, blockStatus: 'edited', order: b.order - 1 };
                }
                else {
                    return b;
                }
            });
            props.setBlocks(newBlocks);
        }
        else {   // if block is not saved, just remove it from the array
            let newBlocks = props.blocks.filter((b) => b.order !== block.order).map((b) => {
                if (b.order > block.order) {
                    return { ...b, blockStatus: 'edited', order: b.order - 1 };
                }
                else {
                    return b;
                }
            });
            props.setBlocks(newBlocks);
        }
    }

    // handler to move up a block (click on the up arrow of the block)
    const handleMoveUp = (block) => {
        let newBlocks = props.blocks.map((b) => {
            if (b.order === block.order) {
                return { ...b, blockStatus: 'edited', order: b.order - 1 };
            }
            else if (b.order === block.order - 1) {
                return { ...b, blockStatus: 'edited', order: b.order + 1 };
            }
            else {
                return b;
            }
        });
        props.setBlocks(newBlocks);
    }

    // handlet to move down a block (click on the down arrow of the block)
    const handleMoveDown = (block) => {
        let newBlocks = props.blocks.map((b) => {
            if (b.order === block.order) {
                return { ...b, blockStatus: 'edited', order: b.order + 1 };
            }
            else if (b.order === block.order + 1) {
                return { ...b, blockStatus: 'edited', order: b.order - 1 };
            }
            else {
                return b;
            }
        });
        props.setBlocks(newBlocks);
    }

    // handler to edit a block (click on the pencil of the block)
    const handleEditBlock = (block) => {
        props.setEditBlock(block);
        props.setContentType(String(block.type));
        if (block.type === 1) {
            props.setHeader(block.content);
            props.setParagraph('');
        }
        else if (block.type === 2) {
            props.setParagraph(block.content);
            props.setHeader('');
        }
        else if (block.type === 3) {
            props.setIndex(imageList.findIndex((i) => i.id == block.content));
        }
    }

    return (
        <Table bordered hover className='content-align-center caption-top'>
            <caption className="text-center">List of Blocks</caption>
            <thead className="table-light">
                <tr>
                    <th className="text-center">Type</th>
                    <th className="text-center">Content</th>
                    {/* <th className="text-center">Order</th> */}
                    <th className="text-center mh-10">Actions</th>
                </tr>
            </thead>
            <tbody>
                {props.blocks.filter(b => b.blockStatus != 'deleted')
                    .sort((a, b) => a.order - b.order)
                    .map((block, index) => (
                        <tr key={index}>
                            <td className="text-center align-middle col-2">{block.type === 1 ? 'Header' : block.type === 2 ? 'Paragraph' : 'Image'}</td>
                            {/* <Image width={50} height={30}  src={props.imageList.filter(x => x.id == block.content)[0].path} ></Image> */}
                            <td className="text-center align-middle">{block.type === 1 ? <h6>{block.content}</h6> : block.type === 2 ? block.content : <Image width={50} height={30} src={String(props.imagesList.filter(x => x.id == block.content)[0].path)}></Image>}</td>
                            {/* <td className="text-center align-middle col-4">
                                    {block.order}
                                </td> */}
                            <td className="text-center align-middle col-4">
                                <Button variant='secondary' className='mx-2 btn-sm'
                                    onClick={() => handleEditBlock(block)}
                                ><i className='bi bi-pencil-square' /></Button>
                                <Button variant='danger' className='mx-2 btn-sm'
                                    onClick={() => handleDeleteBlock(block)}
                                ><i className='bi bi-trash icon-red' /></Button>
                                {index !== 0 ?
                                    <Button variant='primary' className='mx-1 btn-sm' onClick={() => handleMoveUp(block)}><i className="bi bi-arrow-up-square" /></Button>
                                    : <Button variant='primary invisible' className='mx-1 btn-sm'><i className="bi bi-arrow-up-square" /></Button>}
                                {index !== props.blocks.filter(b => b.blockStatus != 'deleted').length - 1 ?
                                    <Button variant='primary' className='mx-1 btn-sm' onClick={() => handleMoveDown(block)}><i className="bi bi-arrow-down-square" /></Button>
                                    : <Button variant='primary invisible' className='mx-1 btn-sm'><i className="bi bi-arrow-down-square" /></Button>}
                            </td>
                        </tr>
                    ))}
            </tbody>
        </Table>
    );
}

export { MyPagesTable, MyBlocksTable }