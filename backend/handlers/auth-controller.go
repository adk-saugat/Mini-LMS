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

	ctx.JSON(http.StatusCreated, gin.H{"message": "User registered successfully!","user": gin.H{
		"id": user.ID,
		"name": user.FirstName + " " + user.LastName,
		"email": user.Email,
		"role": user.Role,
		"createdAt": user.CreatedAt,
	}})
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

	token, err := utils.GenerateToken(user.ID, user.Email, user.Role)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldnot generate token!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Login Successful!",
		"token": token,
		"role": user.Role,
	})

}

func GetUserProfile(ctx *gin.Context){
	userId := ctx.GetInt64("userId")

	user, err := models.GetUserById(userId)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Couldnot find user!"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"user": gin.H{
		"id": user.ID,
		"name": user.FirstName + " " + user.LastName,
		"email": user.Email,
		"role": user.Role,
		"createdAt": user.CreatedAt,
	}})
}