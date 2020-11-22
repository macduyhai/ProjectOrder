import { Button, Checkbox, TextField } from '@material-ui/core';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import swal from 'sweetalert';
import { HOST2 } from '../../Config';
import Axios from 'axios';
import { Autocomplete } from '@material-ui/lab';

ModalViewPrint.propTypes = {
    show: PropTypes.bool,
    handleClose: PropTypes.func,
    data: PropTypes.array,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
};

ModalViewPrint.defaultProps = {
    show: false,
    handleClose: null,
    data: null,
    start_date: '',
    end_date: '',
}

function ModalViewPrint(props) {
    const { show, handleClose, data, start_date, end_date } = props;

    const [crrData, setCrrData] = useState([]);
    const [checkAll, setCheckALl] = useState(true);

    const [checkBox, setCheckBox] = useState([]);

    const [options, setOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [valueSelect, setValueSelect] = useState([]);

    const typingTimeoutRef = useRef(null);

    const handlePrint = () => {
        const data = crrData.filter((filter, i) => checkBox.some(some => some === i)).concat(valueSelect);
        let orderNumber = []
        data.forEach(value => {
            orderNumber.push(value.orderNumber);
        });

        const dataPost = {
            orderNumber: orderNumber,
            printstatus: 1,
        }
        const status = printsOrderApi(dataPost);
        if (status === 200) {
            swal('Done', 'You clicked the button!', 'success');
            handleClose();
        } else {
            swal('Error', '', 'error');
        }
    };

    const handleChangeSelect = async (e) => {
        const value = e.target.value;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(async () => {
            if (value) {
                const data = await getListDataPrint(value);
                if(data.length > 0){
                    const option = data.map(map => ({
                        ...map,
                        title: map.orderNumber,
                    }));
                    setOptions(option);
                }
            }
        }, 1000);
    }

    const getListDataPrint = async (data) => {
        const result = await Axios({
            method: 'GET',
            url: `${HOST2}/api/v1/orders/search?order_number=${encodeURIComponent(
                data
            )}&begin_time=${encodeURIComponent(
                moment(start_date).format('YYYY-MM-DD 00:00:00')
            )}&end_time=${encodeURIComponent(
                moment(end_date).format('YYYY-MM-DD 23:59:59')
            )}&status=2`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json;charset=UTF-8',
            },
        });
        if (result.data.meta.Code === 200) {
            return result.data.data.filter(filter => filter.printstatus === 1);
        }
        return [];
    }

    const printsOrderApi = async (data) => {
        const result = await Axios({
            method: 'POST',
            url: `${HOST2}/api/v1/orders/prints`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json;charset=UTF-8',
            },
            data: JSON.stringify(data),
        });
        return result.data.meta;
    }

    const fetchDataCheckBox = (data) => {
        let a = [];
        data.forEach((value, i) => {
            a.push(i);
        })
        return a;
    };
    const handleCheckBoxAll = (e) => {
        if (!e.target.checked) {
            setCheckALl(false);
            setCheckBox([]);
        } else {
            setCheckALl(true);
            setCheckBox(fetchDataCheckBox(data));
        }
    }
    const handleCheckBox = (e, i) => {
        if (!e.target.checked) {
            setCheckBox(checkBox.filter(filter => filter !== i));
        } else {
            setCheckBox([...checkBox, i])
        }
    }

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);
    useEffect(() => {
        setCrrData(data);
        setCheckBox(fetchDataCheckBox(data));
    }, [data]);
    if (!data) return <></>;
    return (
        <Modal size='lg' show={show} onHide={handleClose}>
            <Modal.Body>
                <div style={crrData.length > 10 ? { height: 630, overflow: 'auto' } : {}}>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th style={{ width: 50 }}>
                                    <Checkbox checked={checkAll} color='primary' onChange={(e) => handleCheckBoxAll(e)}></Checkbox>
                                </th>
                                <th style={{ verticalAlign: 'middle', textAlign: 'center', width: 50 }}>STT</th>
                                <th style={{ verticalAlign: 'middle' }}>Order Number</th>
                                <th style={{ verticalAlign: 'middle' }}>Name</th>
                                <th style={{ verticalAlign: 'middle' }}>Created Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                crrData.map((map, i) => (
                                    <tr>
                                        <td>
                                            <Checkbox checked={checkBox.some(some => some === i)} onChange={(e) => handleCheckBox(e, i)}></Checkbox>
                                        </td>
                                        <td style={{ verticalAlign: 'middle', textAlign: 'center'}}>{i + 1}</td>
                                        <td style={{ verticalAlign: 'middle'}}>{map.orderNumber}</td>
                                        <td style={{ verticalAlign: 'middle'}}>{map.name}</td>
                                        <td style={{ verticalAlign: 'middle'}}>{moment(map.created_at).format('DD-MM-YYYY')}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer className='modal_view'>
                <Autocomplete
                    multiple
                    value={valueSelect}
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    style={{ width: 300 }}
                    size='small'
                    limitTags={2}
                    options={options}
                    onChange={(option, value) => setValueSelect(value)}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => (
                        <TextField {...params} onChange={(e) => handleChangeSelect(e)} variant='outlined' placeholder='Choose numberOrder...' />
                    )}
                />
                <div>
                    <Button className='mr-2' variant='contained' color='primary' onClick={handlePrint}>
                        Print
                    </Button>
                    <Button variant='contained' onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalViewPrint;