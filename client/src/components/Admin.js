import React, { useState, useEffect } from "react";
import axios from "axios";
import { useGlobalState } from "../globalState";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Button from "@material-ui/core/Button";

import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { withStyles } from "@material-ui/core/styles";
import { TextField, FormHelperText } from "@material-ui/core";

const styles = (theme) => ({
  root: {
    width: "50%",
    margin: "10px auto",
  },
  heading: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
  },
  posts: {
    display: "flex",
    flexDirection: "column",
  },
  post: {
    margin: "10px",
  },
  body: {
    fontSize: theme.typography.pxToRem(13),
  },
  author: {
    fontSize: theme.typography.pxToRem(14),
  },
  title: {
    width: "80%",
    alignSelf: "center",
  },
  textarea: {
    width: "80%",
    alignSelf: "center",
    marginTop: "20px",
  },
  error: {
    alignSelf: "center",

  },
  button: {
    width: "150px",
    fontWeight: "600",
    alignSelf: "center",
    marginTop: "10px",
  },
});

function Admin(props) {
  const { classes } = props;
  const [openTextArea, setOpenTextArea] = useState(false);

  const [error, setError] = useState("");

  const [globalState, dispatch] = useGlobalState();

  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({
    title: "",
    body: "",
  });

  const fetchPosts = async () => {
    let headers = {
      Authorization: localStorage.getItem("sessionToken"),
    };
    try {
      const response = await axios.get("http://localhost:8000/posts", {
        headers,
      });
      setPosts(response.data);
    } catch (err) {
      switch (err.response.status) {
        case 401:
          dispatch({
            type: "AUTH_TERMINATE",
          });
          break;
        default:
          setError(err.response.data);
          break;
      }
    }
  };

  const handleSubmit = async () => {

    let headers = {
      Authorization: localStorage.getItem("sessionToken"),
    };
    try {
      await axios.post("http://localhost:8000/posts", post, { headers });
      await fetchPosts();
    } catch (err) {
      switch (err.response.status) {
        case 401:
          dispatch({
            type: "AUTH_TERMINATE",
          });
          break;

        default:
          setError(err.response.data);
          break;
      }
    }
  };

  const handleChange = (e) => {
    setError("")

    const fields = { ...post };
    fields[e.target.name] = e.target.value;
    setPost(fields);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div className={classes.root}>
        <div className={classes.posts}>
          {posts.map((p) => (
            <ExpansionPanel className={classes.post}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>{p.title}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography className={classes.body}>{p.body}</Typography>
              </ExpansionPanelDetails>
              <Typography className={classes.author}>
                Author : {p.author}
              </Typography>
            </ExpansionPanel>
          ))}
          <Button
            className={classes.button}
            onClick={() => setOpenTextArea(!openTextArea)}
            variant="contained"
          >
            Create post
          </Button>
          {openTextArea && (
            <>
              <TextField
                className={classes.title}
                value={post.title}
                onChange={handleChange}
                label="Title"
                name="title"
              />
              <TextareaAutosize
                name="body"
                value={post.body}
                onChange={handleChange}
                className={classes.textarea}
                rowsMin={25}
                aria-label="textarea"
                placeholder="post"
              />
              {error && <FormHelperText className={classes.error }error>{error}</FormHelperText>}
              <Button
                className={classes.button}
                onClick={() => handleSubmit()}
                variant="contained"
                color="primary"
              >
                Submit post
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default withStyles(styles)(Admin);
