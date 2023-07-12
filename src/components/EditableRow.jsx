import {IconButton,TableCell,TextField} from '@mui/material'
import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual'
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import { useState } from 'react'
import { TableRows } from '@mui/icons-material'
import { BaseStorageUrl } from './environment'
import TableRow from "@mui/material/TableRow";

const EditableRow = ({
  editFormData,
  product,
  handleEditFormChange,
  handleEditFormSubmit,
  handleCancelClick,
  handleImageChange,
  disable,
  setDisable 
}) => {
  const [url, setUrl] = useState() //预览图片
  const showImg = (e) => {
    let file = e.target.files[0]
    let url = window.URL.createObjectURL(file)
    setUrl(url)
    handleImageChange(file)
  }

  const onTextChange = (e) => {
    setDisable(false)
    handleEditFormChange(e)
  }
 
  const onImgChange = () => {
    handleImageChange()
    setDisable(false)
    console.log(url)
  }

  return (
    <>
      <TableCell align='center'>
        <TextField
          type='text'
          required={true}
          name='title'
          defaultValue={editFormData.title}
          onChange={onTextChange}
        ></TextField>
      </TableCell>
      <TableCell align='center'>
        <TextField
          type='number'
          required={true}
          name='price'
          defaultValue={editFormData.price}
          onChange={onTextChange}
        ></TextField>
       
      </TableCell>
      <TableCell align='center'>
      <TextField
          type='text'
          required={true}
          name='description'
          defaultValue={editFormData.description}
          onChange={onTextChange}
        ></TextField>
      </TableCell>
      <TableCell align='center'>
        <TextField
          type='number'
          required={true}
          name='category'
          defaultValue={editFormData.category_id}
          onChange={onTextChange}
        ></TextField>
      </TableCell>
      <TableCell align='center'>
        <IconButton
          onClick={onImgChange}
          color='primary'
          aria-label='upload picture'
          component='label'
        >
          <img src={url ? url : `https://app.spiritx.co.nz/storage/${product.product_image}`}
            width='80'
            height='60'
          />
          <input
            hidden
            accept='image/*'
            type='file'
            name='product_image'
            onChange={showImg}
          />
          <PhotoSizeSelectActualIcon
            fontSize='large'
            style={{ paddingBottom: '20px' }}
          />
        </IconButton>
      </TableCell>
      <TableCell align='center'>
        <IconButton
          type='submit'
          disabled={disable} //判断提交按钮是否可以点击,ture不能点击
          onClick={handleEditFormSubmit}
        >
          <CheckOutlinedIcon
            fontSize='large'
            color={disable ? 'disabled' : 'primary'}
          />
        </IconButton>
        <IconButton
          type='button'
          onClick={handleCancelClick}
        >
          <ClearOutlinedIcon
            fontSize='large'
            color='primary'
          />
        </IconButton>
      </TableCell>
    </>
  )
}
export default EditableRow
