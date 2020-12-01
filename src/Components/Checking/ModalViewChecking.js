import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from 'react-bootstrap/Table';
import { Modal } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { toast } from 'react-toastify';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import { HOST2 } from '../../Config';
import { Input } from '@material-ui/core';
import Axios from 'axios';

const useStyles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
});

class ModalViewChecking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataView: null,
      loadingNote: false,
      listItem: [],
      valueInput: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show === true) {
      //dataView
      this.setState({
          dataView: nextProps.data,
        });
    }
  }
  getData = async (data) => {
    const result = await Axios({
      method: 'GET',
      url: `${HOST2}/api/v1/orders/check?partner_tracking_number=${data}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': ' application/json;charset=UTF-8',
      },
    });
    if(result.data.meta.Code === 200){
      return result.data.data;
    }else{
      return null;
    }
  }
  handleOnChange = (e) => {
    this.setState({
      valueInput: e.target.value
    }, () => {

    })
  }

  handleEnter = async (e) => {
    if(e.key === 'Enter'){
      const data = await this.getData(e.target.value);
      this.setState({
        dataView: {
          ...data[0].Order,
          lableDetails: data[0].lableDetails,
          items: data[0].items,
        },
      },() => {
        this.props.pushData({
          ...this.state.dataView,
        })
      })
    }
  }

  render() {
    const { classes, show, onHide } = this.props;
    const { dataView } = this.state;
    return (
      <Modal
        show={show}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={onHide}
      >
        <Modal.Header closeButton className="p-4">
          <Modal.Title id="contained-modal-title-vcenter" className="h5" style={{width: '90%'}}>
            <div className='d-flex justify-content-between'>
              <span>
                Order Number: <b>{dataView !== null && dataView.orderNumber}</b>
              </span>
              <input style={{width: 300}} onKeyDown={(e) => this.handleEnter(e)} onChange={(e) => this.handleOnChange(e)} className='form-control' placeholder='Partner TrackingNumber...' value={this.state.valueInput}/>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="formAddGroup">
            <div className="col-xl-12 mt-3 pl-0 pr-0">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Address 2</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Postal Code</th>
                    <th>Phone</th>
                    <th>Branch</th>
                    <th>Seller</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{dataView !== null && dataView.address2}</td>
                    <td>{dataView !== null && dataView.city}</td>
                    <td>{dataView !== null && dataView.state}</td>
                    <td>{dataView !== null && dataView.postalCode}</td>
                    <td>{dataView !== null && dataView.phone}</td>
                    <td>{dataView !== null && dataView.branchsell}</td>
                    <td>{dataView !== null && dataView.seller}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div className="col-xl-12 pl-0 pr-0">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>SKU Number</th>
                    <th>Quantity</th>
                    <th>Description </th>
                  </tr>
                </thead>
                <tbody>
                  {(dataView !== null && dataView.items) && dataView.items.map((value, index) => {
                    return (
                      <tr>
                        <td>{value.skuNumber}</td>
                        <td>{value.packagedQuantity}</td>
                        <td>{value.itemDescription}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
            <div className="col-xl-12 pl-0 pr-0">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Tracking Number</th>
                    <th>Partner TrackingNumber</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {dataView !== null &&
                        dataView.lableDetails.trackingNumber}
                    </td>
                    <td>
                      {dataView !== null &&
                        dataView.lableDetails.partnerTrackingNumber}
                    </td>
                    <td style={{ wordBreak: 'break-all' }}>
                      <a
                        href={dataView !== null && dataView.lableDetails.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {dataView !== null && dataView.lableDetails.url}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div className="col-xl-12 pl-0 pr-0">
              <div className="pb-2">
                <div className="form-group m-form__group col-md-12 p-0">
                  <label htmlFor="Name">Note</label>
                  <textarea
                    type="text"
                    rows="4"
                    className="form-control m-input"
                    id="note"
                    name="note"
                    value={dataView !== null && dataView.note}
                  />
                </div>
              </div>
            </div>
            <div className="text-center">
              <Button
                variant="contained"
                color="primary"
                onClick={this.props.onHide}
              >
                Close
              </Button>
            </div>
          </form>
          <Backdrop className={classes.backdrop} open={this.state.loadingNote}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </Modal.Body>
      </Modal>
    );
  }
}

ModalViewChecking.propTypes = {
  data: PropTypes.object,
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool,
  pushData: PropTypes.func,
};
ModalViewChecking.defaultProps = {
  data: null,
  onHide: null,
  show: false,
  pushData: null,
}

export default withStyles(useStyles)(ModalViewChecking);
