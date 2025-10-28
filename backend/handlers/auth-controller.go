package handlers

import (
	"fmt"
	"net/http"

	"github.com/adk-saugat/mini-lms/models"
	"github.com/adk-saugat/mini-lms/utils"
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

	// Clear password before sending response
	user.Password = ""

	ctx.JSON(http.StatusCreated, gin.H{"message": "User registered successfully!", "user": user})
}

func LoginUser(ctx *gin.Context){
	var user models.User
	err := ctx.ShouldBindJSON(&user)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Couldnot parse request data!"})
		return
	}

	err = user.ValidateCredential()
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": fmt.Sprintf("%v", err)})
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldnot generate token!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Login Successful!",
		"token": token,
	})

}