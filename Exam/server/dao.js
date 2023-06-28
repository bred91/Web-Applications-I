'use strict';
/* Data Access Object (DAO) module for accessing questions and answers */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('db.sqlite', (err) => {
    if (err) throw err;
});

// get all the pages
exports.getPages = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT pages.id, pages.title, users.id AS authorId, users.name || ' ' || users.surname AS name, pages.creationDate, pages.publicationDate FROM pages JOIN users ON pages.authorId = users.id ORDER BY pages.publicationDate";
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const pages = rows.map((row) => ({
                id: row.id,
                title: row.title,
                authorId: row.authorId,
                author: row.name,
                creationDate: dayjs(row.creationDate),
                publicationDate: row.publicationDate == 'null' ? null : dayjs(row.publicationDate),
                blocks: [] // Initialize blocks array for each page
            }));

            const sql = "SELECT * FROM blocks WHERE pageId = ? ORDER BY `order`";

            const blockPromises = pages.map((page) => {
                return new Promise((resolve, reject) => {
                    db.all(sql, [page.id], (err, rows) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        const blocks = rows.map((row) => ({
                            id: row.id,
                            order: row.order,
                            type: row.contentTypeId,
                            content: row.content
                        }));

                        page.blocks = blocks;
                        resolve();
                    });
                });
            });

            Promise.all(blockPromises)
                .then(() => {
                    resolve(pages);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    });
};


// create a new page
exports.createPage = (page) => {
    return new Promise((resolve, reject) => {
        const sqlPage = 'INSERT INTO pages(title, authorId, creationDate, publicationDate) VALUES(?,?,?,?)';
        const sqlUser = 'SELECT id FROM users WHERE id = ?';

        const blocks = page.blocks;

        const blockContentIds = blocks
            .filter((block) => block.type == 3)
            .map((block) => parseInt(block.content));

        // check if all the images actually exist
        const sqlImageValidation = `SELECT id FROM images WHERE id IN (${blockContentIds.map(() => '?').join(',')})`;
        db.all(sqlImageValidation, blockContentIds, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const existingImageIds = rows.map((row) => row.id);
            const missingImageIds = blockContentIds.filter((id) => !existingImageIds.includes(id));

            if (missingImageIds.length > 0) {
                reject(`Validation Error: Images with ids [${missingImageIds.join(',')}] do not exist.`);
                return;
            }

            // check if the user exists
            db.get(sqlUser, [page.authorId], (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!row) {
                    reject('Validation Error: Author does not exist');
                    return;
                }

                db.run(sqlPage, [page.title, page.authorId, page.creationDate, page.publicationDate], function (err) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const pageId = this.lastID;
                    const sqlBlock = 'INSERT INTO blocks(pageId, `order`, contentTypeId, content) VALUES(?,?,?,?)';
                    const blockPromises = blocks.map((block) => {
                        return new Promise((resolve, reject) => {
                            db.run(sqlBlock, [pageId, block.order, block.type, block.content], function (err) {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                resolve();
                            });
                        });
                    });

                    Promise.all(blockPromises)
                        .then(() => {
                            resolve(pageId);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });
            });
        });
    });
};


// update a page
exports.updatePage = (page) => {
    return new Promise((resolve, reject) => {
        const sqlSearchPage = 'SELECT * FROM pages WHERE id = ?';
        const sqlUpdatePage = 'UPDATE pages SET title = ?, authorId = ?, creationDate = ?, publicationDate = ? WHERE id = ?';
        const sqlUpdateBlock = 'UPDATE blocks SET `order` = ?, contentTypeId = ?, content = ? WHERE id = ?';
        const sqlInsertBlock = 'INSERT INTO blocks(pageId, `order`, contentTypeId, content) VALUES(?,?,?,?)';
        const sqlDeleteBlock = 'DELETE FROM blocks WHERE id = ?';

        const blocks = page.blocks;

        const blockContentIds = blocks
            .filter((block) => block.type == 3)
            .map((block) => parseInt(block.content));

        // check if all the images actually exist
        const sqlImageValidation = `SELECT id FROM images WHERE id IN (${blockContentIds.map(() => '?').join(',')})`;
        db.all(sqlImageValidation, blockContentIds, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const existingImageIds = rows.map((row) => row.id);
            const missingImageIds = blockContentIds.filter((id) => !existingImageIds.includes(id));

            if (missingImageIds.length > 0) {
                reject(`Validation Error: Images with ids [${missingImageIds.join(',')}] do not exist.`);
                return;
            }
            
            // Step 1: Check if the page and necessary blocks exist
            db.get(sqlSearchPage, [page.id], (err, row) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    reject(new Error('Page not found'));
                } else {
                    const blocksToUpdate = page.blocks.filter(block => block.operation === 'update');
                    const blocksToDelete = page.blocks.filter(block => block.operation === 'delete');
                    const blocksToInsert = page.blocks.filter(block => block.operation === 'insert');

                    const blockIdsToUpdate = blocksToUpdate.map(block => block.id);
                    const blockIdsToDelete = blocksToDelete.map(block => block.id);

                    // Check if all the blocks to update or delete exist
                    const blockIdsToCheck = [...blockIdsToUpdate, ...blockIdsToDelete];
                    const placeholders = blockIdsToCheck.map(() => '?').join(', ');
                    const checkBlocksQuery = `SELECT id FROM blocks WHERE id IN (${placeholders})`;
                    db.all(checkBlocksQuery, blockIdsToCheck, (err, rows) => {
                        if (err) {
                            reject(err);
                        } else if (rows.length !== blockIdsToCheck.length) {
                            reject(new Error('Some blocks do not exist'));
                        } else {
                            // Step 2: Update the page and perform insertions, updates, and deletions
                            db.run(
                                sqlUpdatePage,
                                [page.title, page.authorId, page.creationDate, page.publicationDate, page.id],
                                function (err) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        // Perform updates
                                        const updatePromises = blocksToUpdate.map(block => {
                                            return new Promise((resolve, reject) => {
                                                db.run(sqlUpdateBlock, [block.order, block.type, block.content, block.id], function (err) {
                                                    if (err) {
                                                        reject(err);
                                                    } else {
                                                        resolve();
                                                    }
                                                });
                                            });
                                        });

                                        // Perform deletions
                                        const deletePromises = blocksToDelete.map(block => {
                                            return new Promise((resolve, reject) => {
                                                db.run(sqlDeleteBlock, [block.id], function (err) {
                                                    if (err) {
                                                        reject(err);
                                                    } else {
                                                        resolve();
                                                    }
                                                });
                                            });
                                        });

                                        // Perform insertions
                                        const insertPromises = blocksToInsert.map(block => {
                                            return new Promise((resolve, reject) => {
                                                db.run(sqlInsertBlock, [page.id, block.order, block.type, block.content], function (err) {
                                                    if (err) {
                                                        reject(err);
                                                    } else {
                                                        resolve();
                                                    }
                                                });
                                            });
                                        });

                                        // Wait for all operations to complete
                                        Promise.all([...updatePromises, ...deletePromises, ...insertPromises])
                                            .then(() => {
                                                resolve(page.id);
                                            })
                                            .catch(reject);
                                    }
                                }
                            );
                        }
                    });
                }
            });
        });
    });
};

// get a page by id
exports.getPageById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM pages WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            if (!row) {
                reject('Page not found');
                return;
            }

            const page = {
                id: row.id,
                title: row.title,
                authorId: row.authorId,
                creationDate: row.creationDate,
                publicationDate: row.publicationDate
            };

            resolve(page);
        });
    });
};



// delete a page
exports.deletePage = (pageId) => {
    const blockDelete = new Promise((resolve, reject) => {
        const sql = 'DELETE FROM blocks WHERE pageId = ?';
        db.run(sql, [pageId], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(null);
        });
    });

    const pageDelete = new Promise((resolve, reject) => {
        const sql = 'DELETE FROM pages WHERE id = ?';
        db.run(sql, [pageId], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(null);
        });
    });

    return Promise.all([blockDelete, pageDelete]).then((values) => {
        return values;
    });
}


// get the content for dropdowns
exports.getContent = () => {
    const promiseContentTypes = new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM contentTypes';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const contentTypes = rows.map((row) => ({
                id: row.id,
                name: row.name
            }));
            contentTypes.unshift({ id: 0, name: 'Content Type' });
            resolve(contentTypes);
        });
    });

    const promiseImages = new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM images';
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const images = rows.map((row) => ({
                id: row.id,
                name: row.name,
                path: row.ref
            }));
            resolve(images);
        });
    });

    return Promise.all([promiseContentTypes, promiseImages]).then((values) => {
        const contentTypes = values[0];
        const images = values[1];
        const content = { contentTypes: contentTypes, images: images };
        return content;
    }
    );
}

// get the users
exports.getUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id, email, name || ' ' || surname AS name FROM 'users'";
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const users = rows.map((row) => ({
                id: row.id,
                email: row.email,
                name: row.name
            }));
            resolve(users);
        });
    });
}


// get site name
exports.getSiteName = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT value FROM config WHERE key = "siteName"';
        db.get(sql, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined) {
                resolve({ error: 'Site name not found' });
            } else {
                resolve(row.value);
            }
        });
    });
}

// change site Name 
exports.changeSiteName = (siteName) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE config SET value = ? WHERE key = "siteName"';
        db.run(sql, [siteName], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(siteName);
        });
    });
}