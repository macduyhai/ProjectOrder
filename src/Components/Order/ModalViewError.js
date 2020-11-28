import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { Button } from '@material-ui/core';

ModalViewError.propTypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func,
    data: PropTypes.array,
};

ModalViewError.defaultProps = {
    show: false,
    handleClose: null,
    data: null,
}

function ModalViewError(props) {
    const {show, handleClose, data} = props;
    return (
        <Modal size='lg' show={show} onHide={handleClose}>
            <Modal.Body>
                <div style={data.length > 10 ? { height: 630, overflow: 'auto' } : {}}>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th style={{ verticalAlign: 'middle', textAlign: 'center', width: 50 }}>STT</th>
                                <th style={{ verticalAlign: 'middle' }}>Order Number</th>
                                <th style={{ verticalAlign: 'middle' }}>Name</th>
                                <th style={{ verticalAlign: 'middle' }}>Error Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data && 
                                data.map((map, i) => (
                                    <tr>
                                        <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>{i + 1}</td>
                                        <td style={{ verticalAlign: 'middle' }}>{map.orderNumber}</td>
                                        <td style={{ verticalAlign: 'middle' }}>{map.name}</td>
                                        <td style={{ verticalAlign: 'middle' }}>{map.message}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div>
                    <Button variant='contained' color='primary' onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalViewError;