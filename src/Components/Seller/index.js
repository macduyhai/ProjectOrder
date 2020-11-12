import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-js-pagination';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
//Modal
import Modal from './Modal';
import ModalEdit from './ModalEdit';
//importExcel
import { HOST, HOST2 } from '../../Config';
import { withStyles } from '@material-ui/core/styles';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = (theme) => ({
  button: {
    margin: theme.spacing(1),
    marginRight: 0,
    marginBottom: 0,
  },
  input: {
    marginTop: 0,
    marginRight: 10,
    marginBottom: 0,
  },
  buttonSearch: {
    marginTop: -5,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  bg_processing: {
    background: '#00FF00',
    color: '#fff',
  },
  bg_shipping: {
    background: '#FE2EF7',
    color: '#fff',
  },
  bg_hold_on: {
    background: '#F7FE2E',
  },
  bg_completed: {
    background: '#0000FF',
    color: '#fff',
  },
  formControl: {
    margin: theme.spacing(1),
    marginTop: 0,
    marginLeft: 0,
    minWidth: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
});

class Seller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      crrData: [],
      valueSearch: '',
      activePage: 1,
      totalItem: 0,
      offset: 0,
      showFirst: 0,
      showLast: 0,
      anchorEl: null,
      dataEdit: null,
      modalShow: false,
      modalEdit: false,
      loading: true,
      itemData: [
        {
          name: '',
          note: '',
        },
      ],
    };

    this.itemsPerPage = 10;
  }

  componentDidMount() {
    this.getListData();
  }

  //GetList
  getListData = () => {
    fetch(`${HOST2}/api/v1/sellers/search-seller`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.meta.Code === 200) {
          this.setState(
            {
              listData: data.data,
              loading: false,
            },
            () => {
              this.PaginationPage(this.state.activePage);
            }
          );
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  };

  PaginationPage = (activePage) => {
    var listData = [];
    this.state.listData.forEach((item) => {
      if (
        item.name
          .toLowerCase()
          .indexOf(this.state.valueSearch.toLowerCase()) !== -1
      ) {
        listData.push(item);
      }
    });
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
      modalShow: false,
      modalEdit: false,
    });
    this.getListData();
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="m-portlet m-portlet--full-height ">
        <div className="m-portlet__head">
          <div className="m-portlet__head-caption">
            <div className="m-portlet__head-title">
              <h3 className="m-portlet__head-text">Seller</h3>
            </div>
          </div>
        </div>
        <div className="m-portlet__body">
          <div className="row">
            <div className="col-md-6 pb-3">
              <Input
                placeholder="Enter name..."
                className={classes.input}
                name="search"
                value={this.state.valueSearch}
                onChange={(event) => {
                  var { valueSearch } = this.state;
                  valueSearch = event.target.value;
                  this.setState({
                    valueSearch,
                  });
                }}
                onKeyUp={(event) => {
                  if (event.key === 'Enter') {
                    this.setState(
                      {
                        loading: true,
                        activePage: 1,
                      },
                      () => {
                        this.getListData();
                      }
                    );
                  }
                }}
                inputProps={{ 'aria-label': 'description' }}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.buttonSearch}
                onClick={() => {
                  this.setState(
                    {
                      activePage: 1,
                      loading: true,
                    },
                    () => {
                      this.getListData();
                    }
                  );
                }}
              >
                Search
              </Button>
            </div>
            <div className="text-right col-md-6">
              <Button
                variant="contained"
                color="primary"
                className={classes.buttonSearch}
                onClick={() => {
                  this.setState({
                    itemData: [
                      {
                        name: '',
                        note: '',
                      },
                    ],
                    modalShow: true,
                  });
                }}
              >
                Add New
              </Button>
            </div>
            <div className="col-12">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Name</th>
                    <th>Note</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.crrData.map((value, index) => {
                    return (
                      <tr key={index}>
                        <td width={80}>{index + this.state.offset + 1}</td>
                        <td>{value.name}</td>
                        <td>{value.note}</td>
                        <td width={120} style={{ padding: '0px' }}>
                          <IconButton
                            aria-label="edit"
                            color="primary"
                            onClick={() => {
                              this.setState({
                                dataEdit: {
                                  name: value.name,
                                  note: value.note,
                                },
                                modalEdit: true,
                              });
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            color="primary"
                            onClick={() => {
                              swal({
                                title: 'Are you sure!',
                                text:
                                  'Are you sure you want to delete ' +
                                  value.name,
                                icon: 'warning',
                                buttons: true,
                              })
                                .then((name) => {
                                  if (!name) throw null;
                                  return fetch(
                                    `${HOST2}/api/v1/sellers/delete`,
                                    {
                                      method: 'POST',
                                      headers: {
                                        'Content-type':
                                          'application/json; charset=UTF-8',
                                      },
                                      body: JSON.stringify({
                                        name: value.name,
                                      }),
                                    }
                                  );
                                })
                                .then((response) => {
                                  return response.json();
                                })
                                .then((data) => {
                                  console.log(data);
                                  if (data.meta.Code === 200) {
                                    toast('Delete Success!', {
                                      position: 'top-right',
                                      autoClose: 3000,
                                      hideProgressBar: false,
                                      closeOnClick: true,
                                      pauseOnHover: true,
                                      draggable: true,
                                      progress: undefined,
                                    });
                                    this.getListData();
                                  }
                                })
                                .catch((error) => {
                                  if (error) {
                                    swal('Error', 'error', 'error');
                                  } else {
                                    swal.stopLoading();
                                    swal.close();
                                  }
                                });
                            }}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Modal
                data={this.state.itemData}
                show={this.state.modalShow}
                onHide={this.modalClose}
              />
              <ModalEdit
                data={this.state.dataEdit}
                show={this.state.modalEdit}
                onHide={this.modalClose}
              />
              <ToastContainer />
              <Backdrop className={classes.backdrop} open={this.state.loading}>
                <CircularProgress color="inherit" />
              </Backdrop>
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

export default withStyles(useStyles)(Seller);
