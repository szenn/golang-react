package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"test/helpers"
	"test/models"
	"time"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type DatabaseConnection struct {
	DB *mongo.Database
}
type Token struct {
	Token string `json:"token"`
}

func (c *DatabaseConnection) CreatePost(w http.ResponseWriter, r *http.Request) {

	var post models.Post

	err := json.NewDecoder(r.Body).Decode(&post)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if len(post.Body) == 0 {
		http.Error(w, "The post must at least contain one letter", http.StatusBadRequest)
		return
	}

	var result models.Post

	postCollection := c.DB.Collection("posts")

	err = postCollection.FindOne(r.Context(), bson.M{"title": post.Title}).Decode(&result)

	if post.Title == result.Title {
		http.Error(w, "There is already a post with that title", http.StatusConflict)
		return
	}

	username, err := helpers.Get(r.Context(), "username")

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	post.Author = username

	_, err = postCollection.InsertOne(r.Context(), post)

	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode("post created")
}

func (c *DatabaseConnection) GetPosts(w http.ResponseWriter, r *http.Request) {

	postCollection := c.DB.Collection("posts")

	cursor, err := postCollection.Find(r.Context(), bson.M{})

	if err != nil {
		log.Fatal(err)
	}

	var posts []bson.M

	if err = cursor.All(r.Context(), &posts); err != nil {
		log.Fatal(err)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)

}

var jwtKey = []byte("placeholder")

func (c *DatabaseConnection) Authenticate(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Content-Type", "application/json")

	var user models.User

	err := json.NewDecoder(r.Body).Decode(&user)

	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(user)
	if len(user.Username) == 0 || len(user.Password) == 0 {
		http.Error(w, "Username and password is required", http.StatusBadRequest)
		return
	}

	userCollection := c.DB.Collection("users")

	var result models.User

	err = userCollection.FindOne(r.Context(), bson.M{"username": user.Username}).Decode(&result)

	if err != nil || result.Password != user.Password {
		http.Error(w, "Invalid credentials", http.StatusForbidden)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user": result.Username,
		"exp":  time.Now().Add(time.Minute * 30).Unix(),
	})

	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		// TODO log error stdout
		fmt.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Authorization", tokenString)

	json.NewEncoder(w).Encode(Token{Token: tokenString})

}
