package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateCourse(ctx *gin.Context){
	ctx.JSON(http.StatusOK, gin.H{"message": "Course created successfully!"})
}