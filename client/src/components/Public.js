import React, { useState } from 'react'

function Public() {

    const [formState, setFormState] = useState({
        username: "",
        password: ""
    })
    return (
        <>
            <div>
                anyone can read this
            </div>
        </>
    )
}
export default Public