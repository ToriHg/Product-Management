import { forwardRef, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import Fab from "@mui/material/Fab";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ComfirmDelete from "./ComfirmDelete";

import EditableRow from "./EditableRow";
import AddRow from "./AddRow";
import ImportExcel from "./ImportExcel";
import ExportExcel from "./ExportExcel";
import { Snackbar, Alert } from "@mui/material";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  {
    id: "title",
    numeric: false,
    disablePadding: false,
    label: "Title",
  },
  {
    id: "price",
    numeric: true,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Descrioption",
  },
  {
    id: "product_image",
    numeric: false,
    disablePadding: false,
    label: "image",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Actions",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function ProductPage({ keyWord }) {
  const [rows, setRows] = useState([]);
  const [origData, setOrigData] = useState([]); //备份data
  const [searchProducts, setSearchProducts] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("title");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //Returns all producrs
  useEffect(() => {
    axios
      .get("https://app.spiritx.co.nz/api/products")
      .then((res) => {
        setRows(res.data);
        setOrigData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  //Filter 查询内容
  useEffect(() => {
    setSearchProducts(
      origData.filter((product) => {
        // console.log(product.title, typeof(product.title))
        if (
          product.title.toLowerCase().includes(keyWord) ||
          (product.description &&
            product.description.toLowerCase().includes(keyWord))
        )
          return product;
      })
    );
    setPage(0);
  }, [keyWord]);

  useEffect(
    () => console.log("searchProducts", searchProducts),
    [searchProducts]
  );

  //searchbar删空后，return row
  useEffect(() => {
    setRows(
      origData.filter((row) => {
        if (keyWord === "") {
          return row;
        }
      })
    );
  }, [keyWord]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      (searchProducts.length > 0 ? searchProducts : rows)
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [searchProducts, rows, order, orderBy, page, rowsPerPage]
  );

  // console.log("visibleRows", visibleRows);

  useEffect(() => {
    console.log("rows", rows);
  }, [rows]);

  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState(null);

  const handleClickOpen = (id) => {
    setOpen(true);
    setProductId(id);
  };
  const handleClose = () => setOpen(false);

  //删除产品
  const handleDeleteClick = (id) => {
    axios
      .delete(`https://app.spiritx.co.nz/api/product/${id}`, {
        headers: { token: localStorage.getItem("react-project-token") },
      })
      .then((res) => {
        handleClose();
        window.location.reload(false);
      })
      .catch((error) => console.log(error));
  };

  //修改产品

  const [editProductId, setEditProductId] = useState(null);
  const [disable, setDisable] = useState(true);
  const [image, setImage] = useState("");
  const [editFormData, setEditFormData] = useState({
    category_id: "",
    id: "",
    title: "",
    description: "",
    price: "",
    image: "",
  });

  const handleEditFormChange = (e) => {
    e.preventDefault();

    setEditFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditFormSubmit = (e) => {
    let formData = new FormData();

    editFormData.title && formData.append("title", editFormData.title);
    editFormData.description &&
      formData.append("description", editFormData.description);
    editFormData.price && formData.append("price", editFormData.price);
    image && formData.append("product_image", image);
    formData.append("_method", "PUT");

    axios
      .post(
        `https://app.spiritx.co.nz/api/product/${editFormData.id}`,
        formData
      )
      .then((res) => {
        const newProducts = [...rows];
        console.log("newProduct", res.data);

        const index = rows.findIndex(
          (product) => product.id === editFormData.id
        );

        newProducts[index] = res.data;
        // console.log(newProducts[index]);
        setRows(newProducts);

        setEditProductId(null); //每个id都不匹配，非编辑状态,解决异步
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancelClick = () => {
    // console.log("Cancel button clicked");
    setEditProductId(null);
  };

  const handleImageChange = (file) => {
    setImage(file);
  };

  const handleEditClick = (e, product) => {
    e.preventDefault();
    setEditProductId(product.id);

    const formValues = {
      category_id: product.category_id,
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      product_image: product.image,
    };

    setEditFormData(formValues);
  };

  //新增产品
  const [onAdd, setOnAdd] = useState(false);
  const add = () => setOnAdd(!onAdd); //(!onAdd)为ture，打开编辑状态

  //SnackBar
  const [opens, setOpens] = useState(false);
  const [snackContent, setSnackContent] = useState("");
  const [severity, setSeverity] = useState("success");

  const SnackbarAlert = forwardRef(function SnackbarAlert(props, ref) {
    return <Alert elevation={6} ref={ref} {...props} />;
  });

  const handleClosebar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpens(false);
  };

  const handleSuccess = (content) => {
    setSnackContent(content);
    setOpens(true);
    setSeverity("success");
  };

  const handleFail = (content) => {
    setSnackContent(content);
    setOpens(true);
    setSeverity("error");
  };

  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Tooltip title="Add" placement="top">
          <Button variant="text">
            <AddCircleIcon onClick={() => add()} />
          </Button>
        </Tooltip>

        <Tooltip title="Import Excel" placement="top">
          <Button variant="text">
            <ImportExcel
              rows={rows}
              setRows={setRows}
              setOrigData={setOrigData}
              handleSuccess={handleSuccess}
              handleFail={handleFail}
            />
          </Button>
        </Tooltip>

        <Tooltip title="Export Excel" placement="top">
          <Button variant="text">
            <ExportExcel
              rows={rows}
              handleSuccess={handleSuccess}
              handleFail={handleFail}
            />
          </Button>
        </Tooltip>

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              //numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {onAdd && (
                <AddRow
                  setOnAdd={setOnAdd}
                  products={rows}
                  setProducts={setRows}
                  image={image}
                  setImage={setImage}
                  handleImageChange={(e) => handleImageChange(e)}
                  handleSuccess={handleSuccess}
                  handleFail={handleFail}
                />
              )}

              {visibleRows.map((product, index) => {
                return (
                  <TableRow key={index}>
                    {editProductId == product.id ? (
                      <EditableRow
                        editFormData={editFormData}
                        product={product}
                        key={index}
                        handleEditFormChange={handleEditFormChange}
                        handleEditFormSubmit={handleEditFormSubmit}
                        handleCancelClick={handleCancelClick}
                        handleImageChange={handleImageChange}
                        disable={disable}
                        setDisable={setDisable}
                      />
                    ) : (
                      <>
                        <TableCell
                          component="th"
                          scope="row"
                          padding="normal"
                          align="center"
                        >
                          {product.title}
                        </TableCell>
                        <TableCell align="center">{product.price}</TableCell>
                        <TableCell align="center">
                          {product.description}
                        </TableCell>
                        <TableCell align="center">
                          {product.product_image ? (
                            <img
                              src={`https://app.spiritx.co.nz/storage/${product.product_image}`}
                              width="150px"
                            />
                          ) : (
                            "no image"
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Fab
                            size="small"
                            color="primary"
                            aria-label="delete"
                            onClick={() => {
                              handleClickOpen(product.id);
                            }}
                          >
                            <DeleteIcon />
                          </Fab>

                          <Fab
                            size="small"
                            color="primary"
                            aria-label="ModeEdit"
                            sx={{ ml: 2 }}
                            onClick={(e) => handleEditClick(e, product)}
                          >
                            <ModeEditIcon />
                          </Fab>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        <ComfirmDelete
          open={open}
          handleClose={handleClose}
          handleDeleteClick={handleDeleteClick}
          productId={productId}
        />
        <Snackbar open={opens} autoHideDuration={3000} onClose={handleClosebar}>
          <SnackbarAlert onClose={handleClosebar} severity={severity}>
            {snackContent}
          </SnackbarAlert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
