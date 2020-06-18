import React, { useState } from "react";

import { useHistory } from "react-router-dom";
import { useGlobalState } from "../globalState";
import { withStyles } from "@material-ui/core/styles";

import axios from "axios";
import { TextField, Paper, Button, FormHelperText } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    height: "100%",
  },
  formContainer: {
    margin: "400px auto",

    // position: "absolute",
    top: "50%",
    padding: "40px",
    width: theme.spacing(50),
    height: theme.spacing(50),
    height: "auto"
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    marginTop: "20px",
    fontWeight: "600"
  }
});

function Login(props) {
  const { classes } = props;

  let history = useHistory();

  const [globalState, dispatch] = useGlobalState();

  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const authenticate = async (e) => {
    e.preventDefault();
    let headers = {
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/authenticate",
        formState,
        { headers }
      );

      dispatch({
        type: "AUTH_SUCCESS",
        payload: response.data.token,
      });
      localStorage.setItem("sessionToken", response.data.token);

      history.push("/admin");
    } catch (err) {
      setError(err.response.data);
    }
  };
  const handleChange = (e) => {
    setError("")
    const fields = { ...formState };
    fields[e.target.name] = e.target.value;
    setFormState(fields);
  };

  return (
    <>
      <div className={classes.root}>
        <div>
          <Paper className={classes.formContainer}>

          <form onSubmit={authenticate} className={classes.form}>
            <TextField
              label="Username"
              name="username"
              type="text"
              value={formState.username}
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formState.password}
              onChange={handleChange}
            />
              {error && <FormHelperText error>{error}</FormHelperText>}
            <Button className={classes.button}variant="contained" color="primary" type="submit">Login</Button>
          </form>
          </Paper>
        </div>
      </div>
    </>
  );
}
export default withStyles(styles)(Login);
