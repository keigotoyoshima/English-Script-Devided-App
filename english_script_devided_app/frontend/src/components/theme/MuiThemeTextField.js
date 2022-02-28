import { createTheme } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const CssTextField = withStyles({
  root: {
    // フォーカス時のlabel-color
    '& label.Mui-focused': {
      color: 'black',
      padding: '1ch',
    },
    // '& .MuiInput-underline:after': {
    //   borderBottomColor: 'red',
    // },
    '& .MuiOutlinedInput-root': {
      // '& fieldset': {
      //   borderColor: 'red',
      // },
      // '&:hover fieldset': {
      //   borderColor: 'red',
      // },

      // フォーカス時のoutline-color
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
    },
  },
})(TextField);




export default CssTextField;