import { forwardRef, useEffect, useState, useMemo } from "react";
import { Snackbar, Alert } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { apiPost } from "./Services";



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function LoginPage() {

const navigate = useNavigate();

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



const handleSubmit = (event) => {
event.preventDefault();
const data = new FormData(event.currentTarget);
console.log({
email: data.get('email'),
password: data.get('password'),
})
//axios.post('https://app.spiritx.co.nz/api/login',data)
apiPost('login',data)
.then((result)=>{
console.log(result)
console.log('token', result)
  localStorage.setItem(
    'react-project-token',
    result.data.token.token
  )

  localStorage.setItem(
    'react-project-user',
    JSON.stringify(result.data.user)
  )
  
  handleSuccess('Login successfully!')

  setTimeout(() => {
    window.location.reload()
  }, 2000)

})
.catch((error)=>handleFail('Fail'))
 
}

  

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
             
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <Snackbar open={opens} autoHideDuration={3000} onClose={handleClosebar}>
          <SnackbarAlert onClose={handleClosebar} severity={severity}>
            {snackContent}
          </SnackbarAlert>
        </Snackbar>
        
      </Container>
    </ThemeProvider>
  );
}