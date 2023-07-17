import { Icon } from "@mui/material"
import DownloadIcon from '@mui/icons-material/Download'
import * as XLSX from 'xlsx'

const ExportExcel = ({rows,handleSuccess,handleFail}) => {
  const handleOnExport = rows => {
    const workbook = XLSX.utils.book_new()
    const workSheet = XLSX.utils.json_to_sheet(rows)

    XLSX.utils.book_append_sheet(workbook, workSheet, "Products")

    XLSX.writeFile(workbook, "MyExcel.xlsx")

    !workbook ? handleFail('Fail') :
    handleSuccess('Export successfully!')
  }

  return (
      <Icon
        sx={{ px: 1.5, display: 'flex' }}
        color='primary'
        onClick={() => handleOnExport(rows)}
      >
        <DownloadIcon />
      </Icon>
  )
}
export default ExportExcel