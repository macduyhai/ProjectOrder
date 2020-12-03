import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import { withStyles } from "@material-ui/core/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Axios from "axios";
import Moment from "moment";
import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import Pagination from "react-js-pagination";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { HOST2 } from "../../Config";
import ModalViewChecking from "./ModalViewChecking";




const useStyles = (theme) => ({
  button: {
    margin: theme.spacing(1),
    marginRight: 0,
    marginBottom: 0,
  },
  buttonSearch: {
    marginTop: -5,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  bg_processing: {
    background: "#c4c5d6",
    color: "#111",
  },
  bg_shipping: {
    background: "#ffb822",
    color: "#fff",
  },
  bg_delay: {
    background: "#f4516c",
    color: "#fff",
  },
  bg_completed: {
    background: "#00c5dc",
    color: "#fff",
  },
  formControl: {
    margin: theme.spacing(1),
    marginTop: 0,
    marginLeft: 0,
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class todoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      crrData: [],
      valueSearch: "",
      activePage: 1,
      totalItem: 0,
      offset: 0,
      showFirst: 0,
      showLast: 0,
      access_token: "",
      client_id: "",
      modalScan: false,
    };

    this.itemsPerPage = 15;
  }

  async componentDidMount() {
    let access_token = localStorage.getItem("access_token");
    let client_id = localStorage.getItem("client_id");
    this.setState({
        access_token,
        client_id,
    });
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
      const array_data = result.data.data;
      if(array_data.length === 0){
        return  swal({
          title: 'Error',
          text: 'Please check partner track number',
          icon: 'error',
          buttons: false,
        })
      }
      const data_push = {
        ...array_data[0].Order,
        items: array_data[0].items,
        lableDetails: array_data[0].lableDetails,
      }
      if(this.state.listData.every(every => every.orderNumber !== data_push.orderNumber)){
        this.setState({
          listData: this.state.listData.concat(data_push)
        }, () => {
          this.PaginationPage(this.state.activePage)
        })
      }
    }else{
      swal({
        title: 'Error',
        text: 'Please check partner track number',
        icon: 'error',
        buttons: false,
      })
    }
  }

  pushDataToList = (data) => {
    if(this.state.listData.every(every => every.orderNumber !== data.orderNumber)){
      this.setState({
        listData: this.state.listData.concat(data)
      }, () => {
        this.PaginationPage(this.state.activePage)
      })
    }
  }

  PaginationPage = (activePage) => {
    var listData = [...this.state.listData];

    const offset = (activePage - 1) * this.itemsPerPage;
    const crrData = listData.slice(offset, offset + this.itemsPerPage);
    this.setState({
      crrData,
      offset,
      showFirst: offset + 1,
      showLast: crrData.length + offset,
      totalItem: listData.length,
    });
  };
  handlePageChange = (pageNumber) => {
    this.setState(
      {
        activePage: pageNumber,
      },
      () => {
        this.PaginationPage(this.state.activePage);
      }
    );
  };

  modalClose = () => {
    this.setState({
      modalScan: false,
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="m-portlet m-portlet--full-height ">
        <div className="m-portlet__head">
          <div className="m-portlet__head-caption">
            <div className="m-portlet__head-title">
              <h3 className="m-portlet__head-text">Checking</h3>
            </div>
          </div>
        </div>
        <div className="m-portlet__body">
          <div className="row">
            <div className="pb-3 col-md-12 d-flex justify-content-between">
              <div className='d-inline-block'>
                <Input
                  className='mr-2'
                  placeholder="Enter Partner TrackNumber..."
                  name="search"
                  style={{width: 300}}
                  value={this.state.valueSearch}
                  onChange={(event) => {
                    var { valueSearch } = this.state;
                    valueSearch = event.target.value;
                    this.setState({
                      valueSearch,
                    });
                  }}
                  onKeyUp={(event) => {
                    if (event.key === "Enter") {
                      this.setState(
                        {
                          activePage: 1,
                        },
                        () => {
                          this.PaginationPage(this.state.activePage);
                        }
                      );
                    }
                  }}
                  inputProps={{ "aria-label": "description" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.buttonSearch}
                  onClick={() => {
                    const data = this.state.valueSearch;
                    this.getData(data);
                  }}
                >
                  Add
              </Button>
                <div className='d-inline-block ml-5' style={{ fontSize: 18 }}>
                  Total Order: <b>{this.state.listData.length}</b>
              </div>

              </div>
              <Button
                  variant="contained"
                  color="secondary"
                  className={classes.buttonSearch}
                  onClick={() => {
                    this.setState({
                      modalScan: true,
                    })
                  }}
                >
                  Scan
              </Button>
            </div>
            <div className="col-12">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Order Number</th>
                    <th>Name</th>
                    <th>Address 1</th>
                    <th>Country</th>
                    <th>Shipping Time</th>
                    <th>Created Time</th>
                    <th>Status</th>
                    <th style={{width: 80}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.crrData.map((value, index) => {
                    var Status = "";
                    if (value.status === 0) {
                      Status = (
                        <Chip
                          label="Waitting"
                          className={classes.bg_processing}
                        />
                      );
                    } else if (value.status === 2) {
                      Status = (
                        <Chip
                          label="Shipping"
                          className={classes.bg_shipping}
                        />
                      );
                    } else if (value.status === 3) {
                      Status = (
                        <Chip
                          label="Completed"
                          className={classes.bg_completed}
                        />
                      );
                    } else if (value.status === 1) {
                      Status = (
                        <Chip label="Delay" className={classes.bg_delay} />
                      );
                    }
                    return (
                      <tr key={index}>
                        <td>{index + this.state.offset + 1}</td>
                        <td>{value.orderNumber}</td>
                        <td>{value.name}</td>
                        <td>{value.address1}</td>
                        <td>{value.country}</td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {value.beginShipping !== undefined &&
                            Moment(value.beginShipping).format("DD-MM-YYYY")}
                          {value.timeCompleted !== undefined &&
                            " -> " +
                              Moment(value.timeCompleted).format("DD-MM-YYYY")}
                        </td>
                        <td>{Moment(value.created_at).format("DD-MM-YYYY")}</td>
                        <td>{Status}</td>
                        <td width={80} style={{ padding: "0px" }}>
                          <Button onClick={() => {
                            this.setState({
                              itemViewData: value
                            },() => {
                              this.setState({
                                modalScan: true,
                              })
                            })
                          }}>
                            <IconButton
                              aria-label="view"
                              color="primary"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              {
                this.state.modalScan &&
                <ModalViewChecking
                  data={this.state.itemViewData}
                  show={this.state.modalScan}
                  onHide={this.modalClose}
                  pushData={this.pushDataToList}
                />
              }
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={this.itemsPerPage}
                totalItemsCount={this.state.totalItem}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(todoList);
