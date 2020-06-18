package models

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Post struct {
	Title  string  `json:"title"`
	Body   string  `json:"body"`
	Author *string `json:"author,omitempty"`
}
