import React from "react";
import { useState } from "react";
import axios from 'axios';




export default function Main() {
    
    const [result, setResult] = useState("");
    const [resultObj, setResultObj] = useState({});
    const [isCaption, setIsCaption] = useState(false);
    const pathname  = "https://youtubetotexttocaptionapi.onrender.com";
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
                setResult(response.data.data.text);
                setResultObj(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
        else {
            console.log("Bad URL request");
        }
    }async function generateCaption() {
        try {
            if(!resultObj) return;
            const Objdata = {
                id: resultObj.name,
                words: resultObj.words,
            }
            const response = await axios.post(pathname+`/caption`, Objdata);
            setIsCaption(true);
        } catch (error) {
            console.log(error);
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
            {result ? result : ".........................................................................................................."}
        </div>
        {result && <div className="genarateCaptionContainer">
            <button onClick={generateCaption} name="generate-caption-button" id="generate-caption-button">generate CAPTION</button>
        </div>}
    </div>
);
}