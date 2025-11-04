package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CheckInstructor(ctx *gin.Context){
	userRole := ctx.GetString("userRole")

	if userRole != "instructor"{
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Should be a instructor to access!", "role": userRole})
		return
	}

	ctx.Next()
}