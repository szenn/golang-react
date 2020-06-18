package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"test/controllers"
	"time"

	"github.com/dgrijalva/jwt-go"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var jwtKey = []byte("placeholder")

func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		tokenString := r.Header.Get("Authorization")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

			// Don't forget to validate the alg is what you expect:

			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
			}

			return jwtKey, nil
		})

		if err != nil {

			// Using custom string for more secure error message
			fmt.Println(err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)

			return
		}

		var user string

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {

			user = claims["user"].(string)

		}
		ctx := context.WithValue(r.Context(), "username", user)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func main() {

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://127.0.0.1:27017"))

	err = client.Ping(context.TODO(), nil)

	if err != nil {

		log.Panic(err)
	}

	fmt.Println("Connected to MongoDB!")

	db := client.Database("pensionera")

	c := &controllers.DatabaseConnection{DB: db}

	router := mux.NewRouter()
	headers := handlers.AllowedHeaders([]string{"Access-Control-Allow-Headers", "Accept", "Content-Type", "Content-Length", "Accept-Encoding", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT"})
	origins := handlers.AllowedOrigins([]string{"*"})

	router.HandleFunc("/authenticate", c.Authenticate).Methods("POST")
	router.HandleFunc("/posts", authMiddleware(c.GetPosts)).Methods("GET")
	router.HandleFunc("/posts", authMiddleware(c.CreatePost)).Methods("POST")

	http.ListenAndServe(":8000", handlers.CORS(headers, methods, origins)(router))

}
