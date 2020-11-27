import { Checkbox } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import FilterNoneIcon from "@material-ui/icons/FilterNone";
import PrintIcon from '@material-ui/icons/Print';
import SendIcon from "@material-ui/icons/Send";
import TimerOffIcon from "@material-ui/icons/TimerOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { KeyboardDatePicker } from "@material-ui/pickers";
import Axios from "axios";
import Moment from "moment";
import React, { Component } from "react";
import Table from "react-bootstrap/Table";
import { CopyToClipboard } from "react-copy-to-clipboard";
//importExcel
import Files from "react-files";
import Pagination from "react-js-pagination";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import Swal from "sweetalert2";
import XLSX from "xlsx";
import { HOST, HOST2 } from "../../Config";
import ModalEditShipping from "./EditShipping";
import { make_cols } from "./MakeColumms";
//Modal
import ModalSend from "./ModalSend";
import ModalViewData from "./ModalViewData";
import ModalViewPrint from "./ModalViewPrint";





const useStyles = (theme) => ({
  button: {
    margin: theme.spacing(1),
    marginRight: 0,
    marginBottom: 0,
  },
  input: {
    marginTop: 15,
    marginRight: 10,
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
      crrValInput: {
        name: "",
        job: "",
      },
      valueSearch: "",
      activePage: 1,
      totalItem: 0,
      offset: 0,
      showFirst: 0,
      showLast: 0,
      anchorEl: null,
      itemData: null,
      itemViewData: null,
      itemViewDataShipping: null,
      modalSend: false,
      modalViewData: false,
      modalViewShipping: false,
      openDialog: false,
      loadingImport: true,
      copied: false,
      dataLabelDetail: null,
      startDate: Moment(new Date().getTime() - new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate() * 86400000).format('YYYY-MM-DD'),
      endDate: new Date(),
      status: "",
      listCheckBox: [],
      access_token: "",
      client_id: "",
      showPrint: false,
      dataPrint: [],
    };

    this.itemsPerPage = 10;
  }

  componentDidMount() {
    this.getListData();
    let access_token = localStorage.getItem("access_token");
    let client_id = localStorage.getItem("client_id");
    this.setState({
        access_token,
        client_id
    });
  }

  //GetList
  getListData = () => {
    fetch(
      `${HOST2}/api/v1/orders/search?order_number=${encodeURIComponent(
        this.state.valueSearch
      )}&begin_time=${encodeURIComponent(
        Moment(this.state.startDate).format("YYYY-MM-DD 00:00:00")
      )}&end_time=${encodeURIComponent(
        Moment(this.state.endDate).format("YYYY-MM-DD 23:59:59")
      )}&status=${encodeURIComponent(
        this.state.status !== "" ? parseInt(this.state.status) : ""
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.meta.Code === 200) {
          this.setState(
            {
              listData: data.data.map((map, i) => ({
                ...map,
                id: i,
              })).sort(),
              loadingImport: false,
            },
            () => {
              this.PaginationPage(this.state.activePage);
            }
          );
        }
      })
      .catch((error) => {
        this.setState({
          loadingImport: false,
        });
      });
  };

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

  //onChange File
  onChangeFiles = (files) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, {
        type: rABS ? "binary" : "array",
        bookVBA: true,
      });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws);
      /* Update state */
      this.setState({ listData: data, cols: make_cols(ws["!ref"]) }, () => {
        let { listData } = this.state;
        console.log(listData)
        if (listData.length === 0) return;
        listData[0].items = [
          {
            orderNumber: listData[0].orderNumber,
            itemDescription: listData[0].note,
            packagedQuantity: listData[0].quantity,
            skuNumber: listData[0].skuNumber,
          },
        ];
        let idOder = listData[0].orderNumber;
        let idOderNext;
        for (let index = 0; index < listData.length; index++) {
          listData[index].postalCode = listData[index].postalCode + "";
          //chcekOrder
          if (idOder !== listData[index].orderNumber) {
            idOder = listData[index].orderNumber;
            listData[index].items = [
              {
                orderNumber: listData[index].orderNumber,
                itemDescription: listData[index].note,
                packagedQuantity: listData[index].quantity,
                skuNumber: listData[index].skuNumber,
              },
            ];
          }
          let NextOrder = listData[index + 1];
          if (NextOrder !== undefined) {
            idOderNext = NextOrder.orderNumber;
          }
          if (NextOrder !== undefined && idOder === idOderNext) {
            listData[index].items.push({
              orderNumber: NextOrder.orderNumber,
              itemDescription: NextOrder.note,
              packagedQuantity: NextOrder.quantity,
              skuNumber: NextOrder.skuNumber,
            });
            listData.splice(index + 1, 1);
            index--;
          }
        }
        this.setState(
          {
            listData,
          },
          () => {
            this.insertData(this.state.listData);
          }
        );
      });
    };

    if (rABS) {
      reader.readAsBinaryString(files[0]);
    } else {
      reader.readAsArrayBuffer(files[0]);
    }
  };

  //Download
  downloadFormImport = () => {
    var url = window.location.href;
    var urlImport = url.replace(this.props.location.pathname, "/");
    window.location.href = urlImport + "_Import_Template.xlsx";
  };

  //Insert
  insertData = (dataInsert) => {
    var dataPush = []
    for (let index = 0; index < dataInsert.length; index++) {
      dataPush.push({
        orderNumber: dataInsert[index].orderNumber !== undefined ? dataInsert[index].orderNumber : '',
        name: dataInsert[index].name !== undefined ? dataInsert[index].name : '',
        item: dataInsert[index].item !== undefined ? dataInsert[index].item : '',
        quantity: dataInsert[index].quantity !== undefined ? dataInsert[index].quantity : '',
        address1: dataInsert[index].address1 !== undefined ? dataInsert[index].address1 : '',
        address2: dataInsert[index].address2 !== undefined ? dataInsert[index].address2 : '',
        city: dataInsert[index].city !== undefined ? dataInsert[index].city : '',
        state: dataInsert[index].state !== undefined ? dataInsert[index].state : '',
        postalCode: dataInsert[index].postalCode !== undefined ? dataInsert[index].postalCode : '',
        country: dataInsert[index].country !== undefined ? dataInsert[index].country : '',
        phone: dataInsert[index].phone !== undefined ? dataInsert[index].phone + '' : '',
        branchsell: dataInsert[index].branchsell !== undefined ? dataInsert[index].branchsell : '',
        typeproduct: dataInsert[index].typeproduct !== undefined ? dataInsert[index].typeproduct : '',
        seller: dataInsert[index].seller !== undefined ? dataInsert[index].seller : '',
        note: dataInsert[index].note !== undefined ? dataInsert[index].note : '',
        printstatus: 0
      })
    }
    this.setState({ loadingImport: true });
    fetch(`${HOST2}/api/v1/orders`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        orders: dataPush,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.meta.Code === 200) {
          this.setState({ loadingImport: false });
          toast("Import Success!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.getListData();
          this.insertLabelDetail(this.state.listData);
        } else {
          toast("Import False!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.setState({ loadingImport: false });
        }
      })
      .catch((error) => {
        if (error) {
          toast("Import False!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          this.setState({ loadingImport: false });
        }
      });
  };

  //Insert Label Detail
  insertLabelDetail = (dataInsert) => {
    var mergeItem = [];
    for (let index = 0; index < dataInsert.length; index++) {
      mergeItem = mergeItem.concat(dataInsert[index].items);
    }
    fetch(`${HOST2}/api/v1/labels`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        orderNumber: "",
        items: mergeItem,
        labelDetails: {},
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  };

  onFilesError = (error, file) => {
    alert("error code " + error.code + ": " + error.message);
  };

  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
      openDialog: false,
    });
  };

  modalClose = (status, data) => {
    if (status === true) {
      this.setState({
        modalSend: false,
        openDialog: true,
        dataLabelDetail: data,
      });
      this.getListData();
    }
    this.setState({
      modalSend: false,
      modalViewData: false,
    });
  };

  closeModalViewPrint = () => {
    this.setState({
      showPrint: false,
      dataPrint: [],
    })
  }

  modalCloseShipping = () => {
    this.setState({
      modalViewShipping: false,
    });
    this.getListData();
  };

  handleChangStartDate = (date) => {
    this.setState({
      startDate: Moment(date).format("YYYY-MM-DD 00:00:00"),
    });
  };

  handleChangEndDate = (date) => {
    this.setState({
      endDate: Moment(date).format("YYYY-MM-DD 23:59:59"),
    });
  };

  handleChangeStatus = (event) => {
    this.setState({
      status: event.target.value,
    });
  };

  apiSearchType = async () => {
    const result = await Axios({
      method: "GET",
      url: `${HOST2}/api/v1/typeproducts/search-type`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.data.meta.Code === 200) {
      return result.data.data;
    }
    return null;
  };

  getItemsOrder = async (number_order) => {
    const result = await Axios({
      method: "GET",
      url: `${HOST2}/api/v1/orders/items?order_number=${encodeURIComponent(
        number_order
      )}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.data.meta.Code === 200) {
      return result.data.data.map(map => ({
          itemDescription: map.itemDescription,
          packagedQuantity: map.packagedQuantity,
          skuNumber: map.skuNumber,
      }));
    }
    return null;
  };

  sendItems = async (data) => {
    const result = await Axios({
      method: 'POST',
      url: `${HOST}/v1/label?access_token=${this.state.access_token}&client_id=${this.state.client_id}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': ' application/json;charset=UTF-8',
      },
      data: JSON.stringify(data),
    }).catch((error) => {
      return error.response;
    });
    return result;
  }

  //Insert Label Multi
  insertLabelDetailMulti = async (data) => {
    const result = await Axios({
      method: 'POST',
      url: `${HOST2}/api/v1/labels`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': ' application/json;charset=UTF-8',
      },
      data: JSON.stringify(data),
    });
   
    return result.data.meta;
  };

  //Insert Shipping
  insertShipping = async (data) => {
    const result = await Axios({
      method: 'POST',
      url: `${HOST2}/api/v1/orders/shipping-time`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': ' application/json;charset=UTF-8',
      },
      data: JSON.stringify(data),
    });
   
    return result.data.meta;
  };

  
  sendMultipleOrder = async () => {
    if (this.state.listCheckBox.length === 0) {
      swal("Warning", "You do not have any orders", "warning");
    } else {
      const data = this.state.listData.filter((filter) =>
      this.state.listCheckBox.some((some) => some === filter.id)
    );
      let item_length = 0;
      await Swal.fire({
        title: 'IS SENDING THE ORDER',
        html: '<b></b>',
        timerProgressBar: true,
        confirmButtonText: 'Done',
        customClass: 'custom_alert_order',
        willOpen: async () => {
          Swal.showLoading()
         
          const list_type = await this.apiSearchType();

          let error = 0;
          let success = 0;
          let data_order = [];
          let key_order = '';
          let multiple_order = JSON.parse(localStorage.getItem('multiple_order'));

          if (!multiple_order) {
            localStorage.setItem('multiple_order',{});
            multiple_order = {};
          }

          for (let [i, items] of data.entries()) {
            const items_order = await this.getItemsOrder(items.orderNumber);
            if(items_order !== null){
              
              items.items = items_order;
              items.weight = 0;
              items.height = 0;
              items.width = 0;
              items.length = 0;
              items.is_max = 0;
    
              for (let x = 0; x < list_type.length; x++) {
                for (let y = 0; y < items_order.length; y++) {
                  if(list_type[x].name === items_order[y].skuNumber){
                    items.weight = parseInt(items.weight) + parseInt(list_type[x].weight * items_order[y].packagedQuantity);
    
                    if (items.width < parseInt(list_type[x].width * items_order[y].packagedQuantity)) {
                      items.width = parseInt(list_type[x].width * items_order[y].packagedQuantity)
                    }
                    if (items.height < parseInt(list_type[x].height * items_order[y].packagedQuantity)) {
                      items.height = parseInt(list_type[x].height * items_order[y].packagedQuantity)
                    }
                    if (items.length < parseInt(list_type[x].length * items_order[y].packagedQuantity)) {
                      items.length = parseInt(list_type[x].length * items_order[y].packagedQuantity)
                    }
                  }
                }
              }
              const content = Swal.getContent()
              if (content) {
                const b = content.querySelector('b')
                b.textContent = `Send: ${item_length}/${data.length}, Success: ${success} , Error: ${error}`;
              }
              try {
                const is_send = await this.sendItems(items);
                if (is_send.data.meta.code === 200) {
                  const item = items_order.map(map => ({
                    itemDescription: map.itemDescription,
                    packagedQuantity: map.packagedQuantity,
                    skuNumber: map.skuNumber,
                  }));
                  const beginShipping = Moment(new Date()).format("YYYY-MM-DD 00:00:00")
                  const dayAdd = 10
                  const fromDay = new Date();
                  const toDay = new Date(Moment(fromDay, "DD-MM-YYYY").add(dayAdd, 'days'));
                  const lengthWeekend = Moment(fromDay).isoWeekdayCalc(toDay, [6]);
                  const timeCompleted = Moment(new Date(Moment(fromDay, "DD-MM-YYYY").add(parseInt(dayAdd - 1) + parseInt(lengthWeekend * 2), 'days'))).format('YYYY-MM-DD 23:59:59');


                  const data_label = {
                    labelDetails: is_send.data.data.labelDetails,
                    items: item,
                    orderNumber: items.orderNumber,
                  }
                  const data_shipping = {
                    orderNumber: items.orderNumber,
                    beginShipping: beginShipping,
                    timeCompleted: timeCompleted,
                  }
                  this.insertLabelDetailMulti(data_label);
                  this.insertShipping(data_shipping);
                  success++;
                  data_order.push({
                    data: is_send.data.data,
                    name: items.orderNumber,
                  });
                  key_order = items.orderNumber;
                } else {
                  error++;
                }
              } catch (error) {

              }
              if (content) {
                item_length++;
                const b = content.querySelector('b')
                b.textContent = `Send: ${item_length}/${data.length}, Success: ${success} , Error: ${error}`;
              }
            }
          }
          Swal.hideLoading();
          const key_value_order = {
            [key_order]: {
              order_number: data_order,
              create_date: new Date(),
            },
          }
          const data_mul = Object.assign(multiple_order, key_value_order);
          localStorage.setItem('multiple_order', JSON.stringify(data_mul))
          this.setState({
            listCheckBox: [],
            keyMultiple: key_order,
          })
        },
        willClose: () => {
         
        }
      }).then((result) => {
        // if(result.isConfirmed){
        //   this.setState({
        //     showMultiple: true,
        //   })
        // }
        
      })
      this.getListData();
    }
  };

  getListDataPrint = async () => {
    const result = await Axios({
      method: 'GET',
      url: `${HOST2}/api/v1/orders/search?order_number=${encodeURIComponent(
        ''
      )}&begin_time=${encodeURIComponent(
        Moment(this.state.startDate).format("YYYY-MM-DD 00:00:00")
      )}&end_time=${encodeURIComponent(
        Moment(this.state.endDate).format("YYYY-MM-DD 23:59:59")
      )}&status=2`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': ' application/json;charset=UTF-8',
      },
    });
    if(result.data.meta.Code === 200){
      return result.data.data.filter(filter => filter.printstatus === 0);
    }
    return [];
  }

  printListOrder = async () => {
    const data = await this.getListDataPrint();
    this.setState({
      dataPrint: data,
      showPrint: true,
    })
  }
  render() {
    const { classes } = this.props;
    let { openDialog, dataLabelDetail } = this.state;
    return (
      <div className="m-portlet m-portlet--full-height ">
        <div className="m-portlet__head">
          <div className="m-portlet__head-caption">
            <div className="m-portlet__head-title">
              <h3 className="m-portlet__head-text">Order Management</h3>
            </div>
          </div>
        </div>
        <div className="m-portlet__body">
          <div className="row">
            <div className="col-md-2 pb-3">
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd-MM-yyyy"
                margin="normal"
                label="Start Date"
                value={this.state.startDate}
                onChange={this.handleChangStartDate}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className="form-control m-input mt-0"
              />
            </div>
            <div className="col-md-2 pb-3">
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd-MM-yyyy"
                margin="normal"
                label="End Date"
                value={this.state.endDate}
                onChange={this.handleChangEndDate}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
                className="form-control m-input mt-0"
              />
            </div>
            <div className="col-md-1">
              <FormControl className={classes.formControl}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={this.state.status}
                  displayEmpty
                  onChange={this.handleChangeStatus}
                  className={classes.selectEmpty}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="">
                    <em>All</em>
                  </MenuItem>
                  <MenuItem value={0}>Waitting</MenuItem>
                  <MenuItem value={2}>Shipping</MenuItem>
                  <MenuItem value={1}>Delay</MenuItem>
                  <MenuItem value={3}>Completed</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="pb-3 col-md-2">
              <Input
                placeholder="Enter name or order..."
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
                  this.setState(
                    {
                      activePage: 1,
                      loadingImport: true,
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
            <div className="text-right col-md-5">
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<PrintIcon />}
                onClick={() => this.printListOrder()}
              >
              Print
              </Button>
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<SendIcon />}
                onClick={() => this.sendMultipleOrder()}
              >
              Send Multiple Order
              </Button>
              <Button
                variant="contained"
                color="default"
                className={classes.button}
                startIcon={<CloudDownloadIcon />}
                onClick={this.downloadFormImport}
              >
                Export Template
              </Button>
              <div style={{ display: "inline-block" }}>
                <Files
                  className="files-dropzone"
                  onChange={this.onChangeFiles}
                  onError={this.onFilesError}
                  accepts={[".xlsx"]}
                  multiple={false}
                  // maxFiles={3}
                  minFileSize={0}
                  clickable
                >
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    startIcon={<CloudUploadIcon />}
                  >
                    Import Excel
                  </Button>
                </Files>
              </div>
            </div>
            <div className="col-12">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th></th>
                    <th>STT</th>
                    <th>Order Number</th>
                    <th>Name</th>
                    <th>Address 1</th>
                    <th>Country</th>
                    <th>Shipping Time</th>
                    <th>Created Time</th>
                    <th>Status</th>
                    <th>Action</th>
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
                        <td style={{ width: 50 }}>
                          {value.status === 0 && (
                            <Checkbox
                              onChange={(e) => {
                                if (e.target.checked === true) {
                                  this.setState({
                                    listCheckBox: [
                                      ...this.state.listCheckBox,
                                      value.id,
                                    ],
                                  });
                                } else {
                                  this.setState({
                                    listCheckBox: this.state.listCheckBox.filter(
                                      (filter) => filter !== value.id
                                    ),
                                  });
                                }
                              }}
                              checked={this.state.listCheckBox.some(some => some === value.id)}
                              inputProps={{ "aria-label": "Checkbox A" }}
                            />
                          )}
                        </td>
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
                        <td width={220} style={{ padding: "0px" }}>
                          <IconButton
                            aria-label="view"
                            color="primary"
                            onClick={() => {
                              this.setState({
                                itemViewData: value,
                                modalViewData: true,
                              });
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          {value.status === 3 ? (
                            <IconButton
                              aria-label="delay"
                              color="primary"
                              onClick={() => {
                                swal({
                                  title: "Are you sure!",
                                  text:
                                    "Are you sure you want to delay " +
                                    value.orderNumber,
                                  icon: "warning",
                                  buttons: true,
                                })
                                  .then((name) => {
                                    if (!name) throw null;
                                    return fetch(
                                      `${HOST2}/api/v1/orders/delay`,
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({
                                          orderNumber: value.orderNumber,
                                        }),
                                      }
                                    );
                                  })
                                  .then((response) => {
                                    return response.json();
                                  })
                                  .then((data) => {
                                    if (data.meta.Code === 200) {
                                      toast("Delay Success!", {
                                        position: "top-right",
                                        autoClose: 2000,
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
                                      swal("Error", "error", "error");
                                    } else {
                                      swal.stopLoading();
                                      swal.close();
                                    }
                                  });
                              }}
                            >
                              <TimerOffIcon />
                            </IconButton>
                          ) : (
                            ""
                          )}
                          {value.lableDetails.partnerTrackingNumber === "" &&
                            value.status !== 3 && (
                              <IconButton
                                aria-label="send"
                                color="primary"
                                onClick={(v) => {
                                  value.weight = 0;
                                  value.height = 0;
                                  value.width = 0;
                                  value.length = 0;
                                  value.is_max = 0;
                                  value.items = [];
                                  this.setState({
                                    itemData: value,
                                    modalSend: true,
                                  });
                                }}
                              >
                                <SendIcon />
                              </IconButton>
                            )}
                          {value.status === 2 ||
                          value.status === 1 ||
                          (value.lableDetails.partnerTrackingNumber !== "" &&
                            value.status !== 3) ? (
                            <IconButton
                              aria-label="edit"
                              color="primary"
                              onClick={() => {
                                this.setState({
                                  itemViewDataShipping: value,
                                  modalViewShipping: true,
                                });
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          ) : (
                            ""
                          )}
                          {value.status !== 0 && (
                            <CopyToClipboard
                              text={value.lableDetails.partnerTrackingNumber}
                              onCopy={() =>
                                this.setState({ copied: true }, () => {
                                  toast("Copy Success!", {
                                    position: "top-right",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                  });
                                })
                              }
                            >
                              <IconButton aria-label="copy" color="primary">
                                <FilterNoneIcon />
                              </IconButton>
                            </CopyToClipboard>
                          )}
                          {value.status !== 3 && (
                            <IconButton
                              aria-label="delete"
                              color="primary"
                              onClick={() => {
                                swal({
                                  title: "Are you sure!",
                                  text:
                                    "Are you sure you want to delete " +
                                    value.orderNumber,
                                  icon: "warning",
                                  buttons: true,
                                })
                                  .then((name) => {
                                    if (!name) throw null;
                                    return fetch(
                                      `${HOST2}/api/v1/orders?order_number=${encodeURIComponent(
                                        value.orderNumber
                                      )}`,
                                      {
                                        method: "DELETE",
                                        headers: {
                                          "Content-type":
                                            "application/json; charset=UTF-8",
                                        },
                                      }
                                    );
                                  })
                                  .then((response) => {
                                    return response.json();
                                  })
                                  .then((data) => {
                                    if (data.meta.Code === 200) {
                                      toast("Delete Success!", {
                                        position: "top-right",
                                        autoClose: 2000,
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
                                      swal("Error", "error", "error");
                                    } else {
                                      swal.stopLoading();
                                      swal.close();
                                    }
                                  });
                              }}
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <ModalSend
                data={this.state.itemData}
                show={this.state.modalSend}
                onHide={this.modalClose}
              />
              <ModalViewData
                data={this.state.itemViewData}
                show={this.state.modalViewData}
                onHide={this.modalClose}
              />
              <ModalEditShipping
                data={this.state.itemViewDataShipping}
                show={this.state.modalViewShipping}
                onHide={this.modalCloseShipping}
              />
              <ToastContainer />
              <Dialog
                open={openDialog}
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Details"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <div>
                      <span>Tracking Number: </span>
                      <span>
                        <b>
                          {dataLabelDetail !== null &&
                            dataLabelDetail.trackingNumber}
                        </b>{" "}
                      </span>
                    </div>
                    <div>
                      <span>Partner TrackingNumber: </span>
                      <span>
                        <b>
                          {dataLabelDetail !== null &&
                            dataLabelDetail.partnerTrackingNumber}
                        </b>{" "}
                      </span>
                    </div>
                    <div>
                      <span>URL: </span>
                      <a
                        href={dataLabelDetail !== null && dataLabelDetail.url}
                        target="_blank"
                      >
                        {dataLabelDetail !== null && dataLabelDetail.url}
                      </a>
                    </div>
                  </DialogContentText>
                </DialogContent>
              </Dialog>
              <Backdrop
                className={classes.backdrop}
                open={this.state.loadingImport}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
              <Pagination
                activePage={this.state.activePage}
                itemsCountPerPage={this.itemsPerPage}
                totalItemsCount={this.state.totalItem}
                pageRangeDisplayed={5}
                onChange={this.handlePageChange}
              />
              {
                this.state.showPrint &&
                <ModalViewPrint data={this.state.dataPrint} show={this.state.showPrint} start_date={this.state.startDate} end_date={this.state.endDate} handleClose={this.closeModalViewPrint} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(todoList);
