import { Icon } from "@mui/material"
import UploadIcon from '@mui/icons-material/Upload'
import * as XLSX from 'xlsx'

const ImportExcel = ({ rows, setRows, setOrigData,handleSuccess,handleFail }) => {

  const handleImportExcel = (e) => {
    const importFile = e.target.files[0]

    const fileReader = new FileReader()

    fileReader.readAsArrayBuffer(importFile)
    fileReader.onload = (e) => {
      const bufferArray = e.target.result
      const workbook = XLSX.read(bufferArray,{type:'buffer'})

      const workSheetName = workbook.SheetNames[0]
      const workSheet = workbook.Sheets[workSheetName]

      const data = XLSX.utils.sheet_to_json(workSheet,{header:1})

      const onImportSuccess = () => {
        handleSuccess('Import successfully!')
        setRows([...SliceRows,...rows])
        setOrigData([...SliceRows,...rows])
      }
     
      const SliceRows = data.slice(1).map((r) =>
        r.reduce((acc, x, i) => {
          acc[data[0][i]] = x
          return acc
        }, {})
      )
      console.log(SliceRows)
//判断 SliceRow长度识别 是否导入有效文档
      SliceRows.length > 0 ?
        onImportSuccess()
      :
        handleFail('Fail')
    } 
  }
  
  return (
    <Icon
      component='label'
      color='primary'
      sx={{
        display: 'flex',
      }}
    >
      <input
        hidden
        type='file'
        onChange={(e) => {
           handleImportExcel(e)
        }}
      />
      <UploadIcon /> 
    </Icon>
  )
}
export default ImportExcel