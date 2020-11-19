import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';

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
        swal("Done", "You clicked the button!", "success");
    }
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Body>
                <ul style={{ listStyle: 'none', padding: 20 }}>
                    {
                        crrData.order_number.map((map, i) => (
                            <li key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid #ccc' }}>
                                <div><strong>numberOrder: </strong>{map.name}</div>
                                <div><strong>trackingNumber: </strong>{map.data.labelDetails.trackingNumber}</div>
                                <div><strong>partnerTrackingNumber: </strong>{map.data.labelDetails.partnerTrackingNumber}</div>
                                <div><strong>url: </strong><a href={map.data.labelDetails.url} target="_blank">{map.data.labelDetails.url}</a></div>
                            </li>
                        ))
                    }
                </ul>
            </Modal.Body>
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