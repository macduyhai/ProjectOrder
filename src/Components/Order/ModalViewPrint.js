import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import { Button, IconButton } from '@material-ui/core';
import VisibilityIcon from "@material-ui/icons/Visibility";
import ModalViewMultiple from './ModalViewMultiple';

ModalViewPrint.propTypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func,
};

ModalViewPrint.defaultProps = {
    show: false,
    handleClose: null,
}

function ModalViewPrint(props) {
    const { show, handleClose } = props;

    const [showModal, setShowModal] = useState(false);
    const [crrData, setCrrData] = useState(null);

    let multiple_order = JSON.parse(localStorage.getItem('multiple_order'));
    const data = Object.entries(multiple_order ? multiple_order : {});

    const handleShowModal = (data) => {
        setShowModal(true);
        setCrrData(data);
    }
    const handleCloseModal = () => {
        setShowModal(false);
        setCrrData(null);
    }
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Body>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Order Number</th>
                                <th>Sended Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data.map((map, i) => (
                                    <tr>
                                        <td>{i + 1}</td>
                                        <td>{map[0]}</td>
                                        <td>{moment(map[1].create_date).format('HH:mm:ss DD-MM-YYYY')}</td>
                                        <td>
                                            <IconButton
                                                aria-label="view"
                                                color="primary"
                                                onClick={() => handleShowModal(map[0])}
                                            > <VisibilityIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained" onClick={handleClose}>
                        Close
            </Button>
                </Modal.Footer>
            </Modal>
            {
                showModal &&
                <ModalViewMultiple show={showModal} handleClose={handleCloseModal} data={crrData} />
            }
        </>
    );
}

export default ModalViewPrint;