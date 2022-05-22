import { createTheme } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { color } from "@mui/system";

const CssTextField = withStyles({
  root: {
    background: '#202020',
    width:"100%",
    '& label': {
      color: '#888888'
    },
    '& label.Mui-focused': {
      color: 'white'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'white'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'white'
      },
      '&:hover fieldset': {
        borderColor: 'white'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'white'
      }
    },
  }
})(TextField);




export default CssTextField;