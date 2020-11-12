import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import Moment from 'moment';
import { HOST2 } from '../../Config';
import { toast } from 'react-toastify';
import {
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles  } from '@material-ui/core/styles';

const useStyles = (theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    bg_completed: {
        background: '#00c5dc',
        color: "#fff",
    },
});
class ModalEditShipping extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataEdit: null,
            loading: false
        }
    }

    updateShipping = (dataEdit, event) => {
        event.preventDefault();
        this.setState({loading: true});
        fetch(`${HOST2}/api/v1/orders/shipping-time`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                'orderNumber': dataEdit.orderNumber,
                'beginShipping': Moment(dataEdit.beginShipping).format("YYYY-MM-DD 00:00:00"),
                'timeCompleted': Moment(dataEdit.timeCompleted).format("YYYY-MM-DD 23:59:59")
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.meta.Code === 200) {
                    this.setState({loading: false,});
                    toast('Edit Success!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    return this.props.onHide();
                } else {
                    this.setState({loading: false});
                    toast('Edit Error!', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
    }

    updateComplated = (dataEdit, event) => {
        event.preventDefault();
        this.setState({loading: true});
        fetch(`${HOST2}/api/v1/orders/make-done`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                'orderNumber': dataEdit.orderNumber,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.meta.Code === 200) {
                    this.setState({loading: false,});
                    toast('Check Done Success!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    return this.props.onHide();
                } else {
                    this.setState({loading: false});
                    toast('Check Done Error!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
    }

    handleDateChangeShipping = (date) => {
        let {dataEdit} = this.state;
        dataEdit.beginShipping = date
        this.setState({
            dataEdit
        });
    };

    handleDateChangeCompleted = (date) => {
        let {dataEdit} = this.state;
        dataEdit.timeCompleted = date
        this.setState({
            dataEdit
        });
    };


    componentWillReceiveProps(nextProps) {
        if (nextProps.show === true) {
            //dataEdit
            var data = {...nextProps.data}
            if (data.beginShipping === undefined || data.timeCompleted === undefined) {
                data.beginShipping = Moment(new Date()).format("YYYY-MM-DD 00:00:00")
                data.timeCompleted = Moment(new Date()).format("YYYY-MM-DD 23:59:59")
            }
            this.setState({
                dataEdit: data
            });
        }
    }

    render() {
        const { classes } = this.props;
        let {dataEdit} = this.state;
        let click_handle = (event) => {
            this.updateShipping(dataEdit, event);
        }
        let click_complated = (event) => {
            this.updateComplated(dataEdit, event);
        }
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton  className="p-4">
                    <Modal.Title id="contained-modal-title-vcenter" className="h5">
                        Order Number: <b>{dataEdit !== null && dataEdit.orderNumber}</b>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="formAddGroup">
                        <div className="col-xl-12 p-0">
                            <div className="row m-0 pb-3">
                                <div className="form-group m-form__group col-md-6 pl-md-0">
                                    <label htmlFor="Name">Begin Shipping<span className="text-danger"> *</span></label>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="dd-MM-yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="Date picker"
                                        value={dataEdit !== null && dataEdit.beginShipping}
                                        onChange={this.handleDateChangeShipping}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        className="form-control m-input mt-0"
                                        />
                                </div>
                                <div className="form-group m-form__group col-md-6 pr-md-0">
                                    <label htmlFor="Name">Time Completed<span className="text-danger"> *</span></label>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="dd-MM-yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="Date picker"
                                        value={dataEdit !== null && dataEdit.timeCompleted}
                                        onChange={this.handleDateChangeCompleted}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        className="form-control m-input mt-0"
                                    />
                                </div>
                            </div>

                            <Backdrop className={classes.backdrop} open={this.state.loading}>
                                <CircularProgress color="inherit" />
                            </Backdrop>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained"  onClick={this.props.onHide} className="mr-2">Close</Button>
                    <Button variant="contained" className={classes.bg_completed}  onClick={click_complated}>Complated</Button>
                    <Button variant="contained" color="primary"   onClick={click_handle}>Update</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ModalEditShipping.propTypes = {
    data: PropTypes.object,
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
}



export default withStyles(useStyles)(ModalEditShipping);