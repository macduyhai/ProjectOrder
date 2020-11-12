import 'date-fns';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import Divider from '@material-ui/core/Divider';
import Table from 'react-bootstrap/Table';
import { toast } from 'react-toastify';

import { HOST, HOST2 } from '../../Config';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles  } from '@material-ui/core/styles';


const useStyles = (theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
});
class ModalEditBranchSell extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataBranchSell:  null,
            loading: false,
        }
    }

    editBranchSell = async (dataBranchSell, event) => {
        event.preventDefault();
        this.setState({loading: true});
        await fetch(`${HOST2}/api/v1/branchsells`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json;charset=UTF-8',
            },
            body: JSON.stringify(dataBranchSell)
        }).then((response) => {
            return response.json()
        }).then((data) => {
            if (data.meta.Code === 200) {
                this.setState({loading: false,});
                toast('Edit Success!', {
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
                toast('Edit Error!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }).catch((error) => {
            this.setState({loading: false});
            toast('Edit Error!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
        
    }

    HandleChangeName(e) {
        var {dataBranchSell} = this.state;
        dataBranchSell[e.target.name] = e.target.value.toLowerCase().trim();
        this.setState({ dataBranchSell });
    }

    HandleChangeNote(e) {
        var {dataBranchSell} = this.state;
        dataBranchSell[e.target.name] = e.target.value;
        this.setState({ dataBranchSell });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show === true) {
            //dataBranchSell
            var data = {...nextProps.data}
            this.setState({
                dataBranchSell: data,
            });
        }
    }

    handleEnter = (event) => {
        if (event.keyCode === 13) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    }

    render() {
        const { classes } = this.props;
        let {dataBranchSell} = this.state;
        let click_handle = (event) => {
            this.editBranchSell(dataBranchSell, event);
        }
        return (
            <Modal
                {...this.props}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="h5">
                        Edit Branch Sell
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="formAddGroup">
                        <div className="row m-0 pb-3">
                            <div className="form-group m-form__group col-md-12 p-0">
                                <label htmlFor="Name">Name</label>
                                <input type="text" className="form-control m-input" id="name" name='name' value={dataBranchSell  !== null && dataBranchSell.name} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.HandleChangeName(e)}  disabled/>
                            </div>
                            <div className="form-group m-form__group col-md-12 p-0">
                                <label htmlFor="Note">Note<span className="text-danger"></span></label>
                                <textarea rows="4" className="form-control m-input" id="note" name='note' value={dataBranchSell  !== null && dataBranchSell.note} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.HandleChangeNote(e)}  />
                            </div>
                        </div>
                        <Backdrop className={classes.backdrop} open={this.state.loading}>
                            <CircularProgress color="inherit" />
                        </Backdrop>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained"  onClick={this.props.onHide} className="mr-2">Close</Button>
                    <Button variant="contained" color="primary"   onClick={click_handle}>Save</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ModalEditBranchSell.propTypes = {
    data: PropTypes.object,
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
}



export default withStyles(useStyles)(ModalEditBranchSell);