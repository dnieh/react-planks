package main

import "net/http"

func main() {
	http.Handle("/", http.FileServer(http.Dir("./")))
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css"))))
	http.ListenAndServe(":8080", nil)
}
