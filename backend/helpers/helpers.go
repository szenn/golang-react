package helpers

import (
	"context"
	"errors"
	"fmt"
)

// Get gets the value from context by using a keyname to find it
func Get(ctx context.Context, keyName string) (*string, error) {

	val, ok := ctx.Value(keyName).(string)
	fmt.Println(val)

	if !ok {
		return nil, errors.New("could not find " + keyName + " in context")
	}
	return &val, nil
}
