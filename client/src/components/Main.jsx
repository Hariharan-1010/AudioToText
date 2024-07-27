import React from "react";
import axios from 'axios';

export default function Main() {
    const pathname  = "http://localhost:8080";
    function isValidUrl(string) {
        try {
          new URL(string);
          return true;
        } catch (err) {
          return false;
        }
      }
    async function handleClick() {
        const url_pasted  = document.getElementById('url-input-box').value;
        if(isValidUrl(url_pasted)) {
            console.log("Okay, lets work from here");
            try {
                const response = await axios.get(pathname+`/atot?url=${url_pasted}`);
                console.log(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
        else {
            console.log("Bad URL request");
        }
    }
    return (
    <div className="main">
        <div className="heading-container">
            <h1>Audio to English Converter</h1>
            <p>paste your url down in the input box</p>
        </div>
        <div className="input-container">
            <label>
                <input type="text" name="url-input-box" id="url-input-box" placeholder="paste here..."></input>
            </label>
            <button onClick={handleClick} name="submit-button" id="submit-button">Do it!</button>
        </div>
        <div className="result-displayer">
            some sort of error, that may be related to url or backend api's error/ Result file as to be decided...
        </div>
    </div>
);
}