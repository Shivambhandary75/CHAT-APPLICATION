package utils

import (
	"context"
	"io"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

// UploadFile uploads a file to Cloudinary with the correct resource type:
//   - "video/*"          → "video"
//   - "application/pdf" → "raw"  (served with Content-Type: application/pdf)
//   - everything else   → "image"
//
// Returns (secureURL, resourceType, error).
func UploadFile(cloudinaryURL string, file io.Reader, folder string, mimeType string) (string, string, error) {
	cld, err := cloudinary.NewFromURL(cloudinaryURL)
	if err != nil {
		return "", "", err
	}

	resourceType := "image"
	switch {
	case strings.HasPrefix(mimeType, "video/"):
		resourceType = "video"
	case mimeType == "application/pdf":
		resourceType = "raw"
	}

	resp, err := cld.Upload.Upload(context.Background(), file, uploader.UploadParams{
		Folder:       folder,
		ResourceType: resourceType,
	})
	if err != nil {
		return "", "", err
	}

	return resp.SecureURL, resourceType, nil
}
