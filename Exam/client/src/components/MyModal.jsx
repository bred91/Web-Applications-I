import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';


function MyViewModal(props) {
  const page = props.page;
  const blocks = page.blocks;
  const imageslist = props.imageslist;

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Container className="text-center">
          <Modal.Title id="modal-page-title">
            {page.title}
          </Modal.Title>
        </Container>

      </Modal.Header>
      <Modal.Body>
        <Container className="text-center">
          {blocks.map((b, index) => {
            switch (b.type) {
              case 1:
                return <h5 key={"view" + index}>{b.content}</h5>
              case 2:
                return <p key={"view" + index}>{b.content}</p>
              case 3:
                return <Image className='d-block mx-auto mb-3' key={"view" + index} width={200} height={120} src={String(imageslist.filter(x => x.id == b.content)[0].path)} alt={b.content} />
              default:
                return null;
            }
          })}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Container className="text-center">
          <label>Author: <b>{page.author}</b></label><br />
          <label>Creation Date: <b>{page.creationDate.format('YYYY/MM/DD')}</b></label><br />
          <label>Publication Date: <b>{page.publicationDate == null ? '' : page.publicationDate.format('YYYY/MM/DD')}</b></label><br />
          <label>Status: <b>{page.status}</b></label><br />
        </Container>
      </Modal.Footer>
      <Modal.Footer>

        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}


export default MyViewModal;

