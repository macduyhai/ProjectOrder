import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Button from '@material-ui/core/Button';

ModalViewMultiple.propTypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func,
    data: PropTypes.array,
};

ModalViewMultiple.defaultProps = {
    show: false,
    handleClose: null,
    data: null,
}

function ModalViewMultiple(props) {
    const { show, handleClose, data } = props;
    let multiple_order = JSON.parse(localStorage.getItem('multiple_order'));

    const crrData = multiple_order[data];

    const handlePrint = () => {
        delete multiple_order[data];

        localStorage.setItem('multiple_order', JSON.stringify(multiple_order))
        handleClose();
    }
    return (

        <Modal show={show} onHide={handleClose}>
            <Modal.Body>

            </Modal.Body>
            <ul style={{ listStyle: 'none', padding: 20 }}>
                {
                    crrData.map((map, i) => (
                        <li key={i} style={{marginBottom: 10}}>
                            <div><strong>trackingNumber: </strong>{map.labelDetails.trackingNumber}</div>
                            <div><strong>partnerTrackingNumber: </strong>{map.labelDetails.partnerTrackingNumber}</div>
                            <div><strong>url: </strong><a href={map.labelDetails.url} target="_blank">{map.labelDetails.url}</a></div>
                        </li>
                    ))
                }
            </ul>
              
            <Modal.Footer>
                <Button variant="contained" color="primary" onClick={handlePrint}>
                    Print
            </Button>
                <Button variant="contained" onClick={handleClose}>
                    Close
            </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalViewMultiple;