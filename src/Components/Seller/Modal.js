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
class ModalBranchSell extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataBranchSell: [],
            loading: false,
        }
    }

    addSeller = async (dataBranchSell, event) => {
        event.preventDefault();
        this.setState({loading: true});
        let data = await fetch(`${HOST2}/api/v1/sellers`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                'sellers': dataBranchSell
            })
        }).then((response) => {
            return response.json()
        }).then((data) => {
            if (data.meta.Code === 200) {
                this.setState({loading: false,});
                toast('Add Success!', {
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
                toast('Add Error!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }).catch((error) => {
            this.setState({loading: false});
            toast('Add Error!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
    }

    HandleChange(e,index) {
        var {dataBranchSell} = this.state;
        dataBranchSell[index][e.target.name] = e.target.value.toLowerCase().trim();
        this.setState({ dataBranchSell });
    }

    HandleChangeNote(e,index) {
        var {dataBranchSell} = this.state;
        dataBranchSell[index][e.target.name] = e.target.value;
        this.setState({ dataBranchSell });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show === true) {
            //dataBranchSell
            var data = [...nextProps.data]
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
            this.addSeller(dataBranchSell, event);
        }
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter" className="h5">
                        Add Branch Sell
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="formAddGroup">
                        <Table bordered hover>
                            <thead>
                            <tr>
                                <th>Name<span className="text-danger"> *</span></th>
                                <th>Note<span className="text-danger"></span></th>
                                <th>
                                    <IconButton
                                        aria-label="add"
                                        color="primary"
                                        size="small"
                                        onClick={() => {
                                            dataBranchSell.push({
                                                "name": "",
                                                "note": ""
                                            })
                                            this.setState({
                                                dataBranchSell
                                            });
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    dataBranchSell.map((val, index) => {
                                        return(
                                            <tr key={index}>
                                                <td><input type="text" className="form-control m-input" id="name" name='name' value={val.name} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.HandleChange(e,index)}  /></td>
                                                <td><input type="text" className="form-control m-input" id="note" name='note' value={val.note} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.HandleChangeNote(e,index)}  /></td>
                                                <td width={50}>
                                                    {
                                                        dataBranchSell.length > 1
                                                        &&
                                                        <IconButton
                                                            aria-label="delete"
                                                            color="secondary"
                                                            size="small"
                                                            onClick={(v) => {
                                                                dataBranchSell.splice(index, 1)
                                                                this.setState({
                                                                    dataBranchSell
                                                                });
                                                            }}
                                                        >
                                                            <CloseIcon />
                                                        </IconButton>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
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

ModalBranchSell.propTypes = {
    data: PropTypes.object,
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
}



export default withStyles(useStyles)(ModalBranchSell);