import 'date-fns';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
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
import Moment from 'moment';
import {
  KeyboardDatePicker,
} from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
require('moment-weekday-calc');



const useStyles = (theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    selectTime: {
        marginTop: theme.spacing(2),
    },
    formControl: {
        width: '100%'
    }
});

class ModalSend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSend: null,
            access_token: "",
            client_id: "",
            loading: false,
            openDialog: false,
            valueType: null,
            valueTime: null,
            listDataType: [],
            listItem: [],
            isLogin: true
        }
    }

    componentDidMount() {
        let access_token = localStorage.getItem("access_token");
        let client_id = localStorage.getItem("client_id");
        this.setState({
            access_token,
            client_id
        });
    }

    getListItem = () => {
        var {dataSend, listItem} = this.state;
        fetch(`${HOST2}/api/v1/orders/items?order_number=${encodeURIComponent(dataSend.orderNumber)}`, {
          method: 'GET',
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.meta.Code === 200) {
                for (let index = 0; index < data.data.length; index++) {
                    dataSend.items.push({
                        itemDescription: data.data[index].itemDescription,
                        packagedQuantity: data.data[index].packagedQuantity,
                        skuNumber: data.data[index].skuNumber,
                    })
                }
                this.setState({
                    listItem: data.data,
                    dataSend
                }, () => {
                    this.getListDataType()
                });
            }
          })
          .catch((error) => {
            console.log('error')
          });
    };

    //GetList
    getListDataType = () => {
        fetch(`${HOST2}/api/v1/typeproducts/search-type`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
        if (data.meta.Code === 200) {
            var {dataSend, listItem} = this.state;
            if (data.data.length > 0) {
                for (let index = 0; index < listItem.length; index++) {
                    for (let i = 0; i < data.data.length; i++) {
                        if (listItem[index].skuNumber === data.data[i].name) {
                            dataSend.weight = parseInt(dataSend.weight) + parseInt(data.data[i].weight * listItem[index].packagedQuantity);
                            if (dataSend.width < parseInt(data.data[i].width * listItem[index].packagedQuantity)) {
                                dataSend.width = parseInt(data.data[i].width * listItem[index].packagedQuantity)
                            }
                            if (dataSend.height < parseInt(data.data[i].height * listItem[index].packagedQuantity)) {
                                dataSend.height = parseInt(data.data[i].height * listItem[index].packagedQuantity)
                            }
                            if (dataSend.length < parseInt(data.data[i].length * listItem[index].packagedQuantity)) {
                                dataSend.length = parseInt(data.data[i].length * listItem[index].packagedQuantity)
                            }
                        }
                    }
                }
                console.log(dataSend)
            }
            this.setState({
                dataSend,
                listDataType: data.data,
            });
        }
        }).catch((error) => {
            console.log(error)
        });
    };

    getAcessToken = (dataSend, event) => {
        fetch(`${HOST2}/api/v1/authenkey`, {
          method: 'GET',
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.meta.Code === 200) {
                this.setState({
                    access_token: data.data.key
                }, () => {
                    this.updateGroup(dataSend, event)
                });
            } else {
              this.setState({
                isLogin: false
              });
            }
          })
          .catch((error) => {
            this.setState({
                isLogin: false
              });
          });
    };

    updateGroup = async (dataSend, event) => {
        event.preventDefault();
        this.setState({loading: true});
        let data = await fetch(`${HOST}/v1/label?access_token=${this.state.access_token}&client_id=${this.state.client_id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': ' application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                name: dataSend.name,
                address1: dataSend.address1,
                address2: dataSend.address2,
                city: dataSend.city,
                state: dataSend.state,
                postalCode: dataSend.postalCode,
                orderNumber: dataSend.orderNumber,
                country: dataSend.country,
                phone: dataSend.phone,
                height: dataSend.height,
                length: dataSend.length,
                weight: dataSend.weight,
                width: dataSend.width,
                is_max: dataSend.is_max,
                items: dataSend.items
            })
        }).then((response) => {
            return response.json()
        });
        if (data.meta.code === 200) {
            this.setState({
                loading: false,
                openDialog: true
            });
            this.insertLabelDetail(data.data.labelDetails)
            this.insertShipping()
            toast('Send Success!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return this.props.onHide(true,data.data.labelDetails);
        } else {
            this.setState({loading: false});
            toast('Send Error!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    //Insert Label Detail
    insertLabelDetail = (labelDetails) => {
        fetch(`${HOST2}/api/v1/labels`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            'orderNumber': this.state.dataSend.orderNumber,
            'items': this.state.dataSend.items,
            labelDetails,
        }),
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data)
        });
    };

    //Insert Shipping
    insertShipping = () => {
        if (this.state.dataSend.timeCompleted === undefined) return;
        fetch(`${HOST2}/api/v1/orders/shipping-time`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            'orderNumber': this.state.dataSend.orderNumber,
            'beginShipping': Moment(this.state.dataSend.beginShipping).format("YYYY-MM-DD 00:00:00"),
            'timeCompleted': Moment(this.state.dataSend.timeCompleted).format("YYYY-MM-DD 23:59:59")
        }),
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data)
        });
    };

    SendHandle(e) {
        var {dataSend} = this.state;
        dataSend[e.target.name] = parseInt(e.target.value);
        this.setState({ dataSend });
    }

    itemHandle(e,index) {
        var {dataSend,listDataType} = this.state;
        dataSend.weight = 0;
        dataSend.width = 0;
        dataSend.height = 0;
        dataSend.length = 0;
        dataSend.items[index][e.target.name] = e.target.value;
        for (let index = 0; index < dataSend.items.length; index++) {
            for (let i = 0; i < listDataType.length; i++) {
                if (dataSend.items[index].skuNumber === listDataType[i].name) {
                    dataSend.weight = parseInt(dataSend.weight) + parseInt(listDataType[i].weight * dataSend.items[index].packagedQuantity);
                    if (dataSend.width < parseInt(listDataType[i].width * dataSend.items[index].packagedQuantity)) {
                        dataSend.width = parseInt(listDataType[i].width * dataSend.items[index].packagedQuantity)
                    }
                    if (dataSend.height < parseInt(listDataType[i].height * dataSend.items[index].packagedQuantity)) {
                        dataSend.height = parseInt(listDataType[i].height * dataSend.items[index].packagedQuantity)
                    }
                    if (dataSend.length < parseInt(listDataType[i].length * dataSend.items[index].packagedQuantity)) {
                        dataSend.length = parseInt(listDataType[i].length * dataSend.items[index].packagedQuantity)
                    }
                }
            }
        }
        this.setState({ dataSend });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.show === true) {
            //dataSend

            var data = {...nextProps.data}
            if (data.beginShipping === undefined || data.timeCompleted === undefined) {
                data.beginShipping = Moment(new Date()).format("YYYY-MM-DD 00:00:00")
                let dayAdd = 10
                let fromDay = new Date();
                let toDay = new Date(Moment(fromDay, "DD-MM-YYYY").add(dayAdd, 'days'));
                let lenghtWeeken = Moment(fromDay).isoWeekdayCalc(toDay,[6]);
                data.timeCompleted = new Date(Moment(fromDay, "DD-MM-YYYY").add(parseInt(dayAdd - 1) + parseInt(lenghtWeeken*2), 'days'));
            }

            this.setState({
                dataSend: data,
                valueTime: 10
            }, () => {
                this.getListItem()
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

    handleDateChangeShipping = (date) => {
        let {dataSend} = this.state;
        dataSend.beginShipping = date
        this.setState({
            dataSend
        });
    };

    handleDateChangeCompleted = (date) => {
        let {dataSend} = this.state;
        dataSend.timeCompleted = date
        this.setState({
            dataSend
        });
    };

    handleChangeType = (event) => {
        var {dataSend} = this.state;
        if (event.target.value === null) {
            dataSend.width = "";
            dataSend.height = "";
            dataSend.weight = "";
            dataSend.length = "";
        } else {
            dataSend.width = event.target.value.width;
            dataSend.height = event.target.value.height;
            dataSend.weight = event.target.value.weight;
            dataSend.length = event.target.value.length;
        }
        this.setState({
            dataSend,
            valueType: event.target.value
        });
    };

    handleChangeTime = (event) => {
        var {dataSend} = this.state;
        if (event.target.value !== null) {
            let fromDay = new Date(dataSend.beginShipping);
            let toDay = new Date(Moment(fromDay, "DD-MM-YYYY").add(event.target.value, 'days'));
            let lenghtWeeken = Moment(fromDay).isoWeekdayCalc(toDay,[6]);
            dataSend.timeCompleted = new Date(Moment(fromDay, "DD-MM-YYYY").add(parseInt(event.target.value - 1) + parseInt(lenghtWeeken*2), 'days'));
        } else {
            dataSend.timeCompleted = null
        }
        this.setState({
            dataSend,
            valueTime: event.target.value
        });
      };

    render() {
        const { classes } = this.props;
        let {dataSend,listDataType} = this.state;
        let click_handle = (event) => {
            if (dataSend.width > 600 || dataSend.length > 600 || dataSend.height > 600) {
                toast('Send Error! Please Check Item!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }
            this.getAcessToken(dataSend, event);
        }
        var dataTime = []
        for (let index = 5; index <= 20; index++) {
            dataTime.push({
                'day': `${index} Days`,
                'value': index
            })
        }
        if (!this.state.isLogin) {
            return <Redirect to={'/login'} />
        }
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton className="p-4">
                    <Modal.Title id="contained-modal-title-vcenter" className="h5">
                        Order Number: <b>{dataSend !== null && dataSend.orderNumber}</b>
                        {/* <span className="pl-5 pr-2" style={{'fontSize': '0.8em'}}>Select Type Product:</span> */}
                    </Modal.Title>
                    {/* <div>
                    <FormControl className={classes.formControl}>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.valueType}
                        displayEmpty
                        onChange={this.handleChangeType}
                        className={classes.selectEmpty}
                        inputProps={{ 'aria-label': 'Without label' }}
                        >
                        <MenuItem value={null}><em>Select</em></MenuItem>
                        {
                            listDataType.map((value,index) => {
                                return(
                                    <MenuItem key={index} value={value}>{value.name}</MenuItem>
                                )
                            })
                        }
                        </Select>
                    </FormControl>
                    </div> */}
                </Modal.Header>
                <Modal.Body>
                    <form id="formAddGroup">
                        <div className="col-xl-12 p-0">
                            <div className="row m-0 pb-3">
                                <div className="form-group m-form__group col-md-6 pl-md-0">
                                    <label htmlFor="Name">Width ( {`< `} 600mm)<span className="text-danger"> *</span></label>
                                    <input type="number" className="form-control m-input" id="Width" name='width' value={dataSend !== null && dataSend.width} onKeyDown={(event) => this.handleEnter(event)} readOnly onChange={e => this.SendHandle(e)}  />
                                </div>
                                <div className="form-group m-form__group col-md-6 pr-md-0">
                                    <label htmlFor="Name">Height ( {`< `} 600mm)<span className="text-danger"> *</span></label>
                                    <input type="number" className="form-control m-input" id="Height" name='height' value={dataSend !== null && dataSend.height} onKeyDown={(event) => this.handleEnter(event)} readOnly onChange={e => this.SendHandle(e)}  />
                                </div>
                                <div className="form-group m-form__group col-md-6 pl-md-0">
                                    <label htmlFor="Name">Weight (gram)<span className="text-danger"> *</span></label>
                                    <input type="number" className="form-control m-input" id="Weight" name='weight' value={dataSend !== null && dataSend.weight} onKeyDown={(event) => this.handleEnter(event)} readOnly onChange={e => this.SendHandle(e)} />
                                </div>
                                <div className="form-group m-form__group col-md-6 pr-md-0">
                                    <label htmlFor="Name">Length ( {`< `}600mm)<span className="text-danger"> *</span></label>
                                    <input type="number" className="form-control m-input" id="Length" name='length' value={dataSend !== null && dataSend.length} onKeyDown={(event) => this.handleEnter(event)} readOnly onChange={e => this.SendHandle(e)}  />
                                </div>
                                <div className="form-group m-form__group col-md-4 pl-md-0">
                                    <label htmlFor="Name">Begin Shipping</label>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="dd-MM-yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="Date picker"
                                        value={dataSend !== null && dataSend.beginShipping}
                                        onChange={this.handleDateChangeShipping}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        className="form-control m-input mt-0"    
                                        />
                                </div>
                                <div className="form-group m-form__group col-md-2 pl-md-0">
                                    <label htmlFor="Name">Select Time</label>
                                    <div>
                                        <FormControl className={classes.formControl}>
                                            <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={this.state.valueTime}
                                            displayEmpty
                                            onChange={this.handleChangeTime}
                                            className={classes.selectTime}
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            >
                                            <MenuItem value={null}><em>Select</em></MenuItem>
                                            {
                                                dataTime.map((value,index) => {
                                                    return(
                                                        <MenuItem key={index} value={value.value}>{value.day}</MenuItem>
                                                    )
                                                })
                                            }
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                                <div className="form-group m-form__group col-md-6 pr-md-0">
                                    <label htmlFor="Name">Time Completed</label>
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="dd-MM-yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="Date picker"
                                        value={dataSend === null ? null : dataSend.timeCompleted === undefined ? null : dataSend.timeCompleted }
                                        onChange={this.handleDateChangeCompleted}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        className="form-control m-input mt-0"    
                                        />
                                </div>
                            </div>
                            <Divider />
                            <div className="row m-0 pt-4">
                                <Table bordered hover>
                                    <thead>
                                    <tr>
                                        <th>SKU Number<span className="text-danger"> *</span></th>
                                        <th>Quantity<span className="text-danger"> *</span></th>
                                        <th>Description<span className="text-danger"> *</span>  </th>
                                        {/* <th>
                                            <IconButton
                                                aria-label="add"
                                                color="primary"
                                                size="small"
                                                onClick={() => {
                                                    dataSend.items.push({
                                                        "itemDescription": "",
                                                        "packagedQuantity": "",
                                                        "skuNumber": ""
                                                    })
                                                    this.setState({
                                                        dataSend
                                                    });
                                                }}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </th> */}
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            dataSend !== null && dataSend.items.map((val, index) => {
                                                return(
                                                    <tr key={index}>
                                                        <td><input type="text" className="form-control m-input" id="skuNumber" name='skuNumber' value={val.skuNumber} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.itemHandle(e,index)} readOnly /></td>
                                                        <td><input type="number" className="form-control m-input" id="Quantity" name='packagedQuantity' value={val.packagedQuantity} onKeyDown={(event) => this.handleEnter(event)} min='1' onChange={e => this.itemHandle(e,index)} /></td>
                                                        <td><input type="text" className="form-control m-input" id="Description" name='itemDescription' value={val.itemDescription} onKeyDown={(event) => this.handleEnter(event)} onChange={e => this.itemHandle(e,index)} /></td>
                                                        {/* <td width={50}>
                                                            {
                                                                dataSend.items.length > 1
                                                                &&
                                                                <IconButton
                                                                    aria-label="delete"
                                                                    color="secondary"
                                                                    size="small"
                                                                    onClick={(v) => {
                                                                        console.log(index)
                                                                        dataSend.items.splice(index, 1)
                                                                        this.setState({
                                                                            dataSend
                                                                        });
                                                                    }}
                                                                >
                                                                    <CloseIcon />
                                                                </IconButton>
                                                            }
                                                        </td> */}
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                                <Backdrop className={classes.backdrop} open={this.state.loading}>
                                    <CircularProgress color="inherit" />
                                </Backdrop>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="contained"  onClick={this.props.onHide} className="mr-2">Close</Button>
                    <Button variant="contained" color="primary"   onClick={click_handle}>Send</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ModalSend.propTypes = {
    data: PropTypes.object,
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool,
}



export default withStyles(useStyles)(ModalSend);