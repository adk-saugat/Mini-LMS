package handlers

import (
	"net/http"

	"github.com/adk-saugat/mini-lms/models"
	"github.com/gin-gonic/gin"
)

func RegisterUser(ctx *gin.Context){
	var user models.User
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Couldnot parse request data!"})
		return
	}

	err = user.Register()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldnot register user!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "User registered successfully!", "user": user})
}